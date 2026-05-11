require("dotenv").config();

const express = require("express");
const ccxt = require("ccxt");
const TelegramBot = require("node-telegram-bot-api");
const path = require("path");

const app = express();
app.use(express.static("public"));

// ============================
// 💰 BINANCE (RÉEL)
// ============================
const binance = new ccxt.binance({
    apiKey: process.env.BINANCE_API_KEY,
    secret: process.env.BINANCE_SECRET,
    enableRateLimit: true,
});

// ============================
// 🤖 TELEGRAM BOT
// ============================
const bot = new TelegramBot(process.env.BOT_TOKEN, {
    polling: true
});

// ============================
// 📊 ETAT UTILISATEUR (FLOW)
// ============================
let userState = {};

// ============================
// 📈 RSI SIMPLE RÉEL
// ============================
async function getRSI(symbol = "BTC/USDT") {

    const candles = await binance.fetchOHLCV(symbol, "1m", undefined, 20);

    let gains = 0;
    let losses = 0;

    for (let i = 1; i < candles.length; i++) {
        const diff = candles[i][4] - candles[i - 1][4];

        if (diff > 0) gains += diff;
        else losses += Math.abs(diff);
    }

    const rs = gains / (losses || 1);
    const rsi = 100 - (100 / (1 + rs));

    return rsi;
}

// ============================
// 🚀 START FLOW
// ============================
bot.onText(/\/start/, (msg) => {

    const chatId = msg.chat.id;

    userState[chatId] = {};

    bot.sendMessage(chatId, "💎 Choisis un marché :", {
        reply_markup: {
            keyboard: [
                ["BTC/USDT"],
                ["ETH/USDT"],
                ["BNB/USDT"]
            ],
            resize_keyboard: true
        }
    });
});

// ============================
// 💎 STEP 1 - MARKET
// ============================
bot.onText(/BTC\/USDT|ETH\/USDT|BNB\/USDT/, (msg) => {

    const chatId = msg.chat.id;

    userState[chatId].symbol = msg.text;

    bot.sendMessage(chatId, "⏱ Choisis timeframe :", {
        reply_markup: {
            keyboard: [
                ["1m"],
                ["5m"],
                ["15m"]
            ],
            resize_keyboard: true
        }
    });
});

// ============================
// ⏱ STEP 2 - TIME
// ============================
bot.onText(/1m|5m|15m/, async (msg) => {

    const chatId = msg.chat.id;

    userState[chatId].timeframe = msg.text;

    bot.sendMessage(chatId, "📊 Analyse en cours... ⏳");

    // =========================
    // 🔥 RÉEL BINANCE ANALYSE
    // =========================
    const symbol = userState[chatId].symbol || "BTC/USDT";

    const rsi = await getRSI(symbol);

    let signal = "WAIT";
    let emoji = "🟡";

    if (rsi < 30) {
        signal = "BUY";
        emoji = "🟢📈";
    }

    if (rsi > 70) {
        signal = "SELL";
        emoji = "🔴📉";
    }

    // =========================
    // 📤 RESULT FINAL (1 ÉCRAN)
    // =========================
    bot.sendMessage(chatId, `
📊 RESULTAT FINAL

💎 Market: ${symbol}
⏱ Timeframe: ${userState[chatId].timeframe}

📈 RSI (réel): ${rsi.toFixed(2)}

🔥 SIGNAL: ${emoji} ${signal}
    `, {
        reply_markup: {
            remove_keyboard: true
        }
    });

    // reset flow
    userState[chatId] = {};
});

// ============================
// 🌐 DASHBOARD API (OPTION)
// ============================
app.get("/api/rsi/:symbol", async (req, res) => {

    const rsi = await getRSI(req.params.symbol);
    res.json({ rsi });
});

// ============================
// 🚀 START SERVER
// ============================
app.listen(process.env.PORT || 3000, () => {
    console.log("🚀 REAL TRADING BOT RUNNING");
});
