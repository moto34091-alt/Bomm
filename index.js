require("dotenv").config();

const express = require("express");
const TelegramBot = require("node-telegram-bot-api");
const path = require("path");

const app = express();

// ===============================
// 🤖 TELEGRAM BOT
// ===============================
const bot = new TelegramBot(process.env.BOT_TOKEN, {
    polling: true
});

// ===============================
// 📁 FRONTEND STATIC
// ===============================
app.use(express.static("public"));

// ===============================
// 📊 LIVE DATA
// ===============================
let data = {
    market: "EUR/USD",
    timeframe: "1m",
    rsi: 0,
    momentum: "NEUTRE",
    signal: "WAIT",
    confidence: 0
};

// ===============================
// 📈 RSI FUNCTION
// ===============================
function calculateRSI(closes, period = 14) {

    let gains = 0;
    let losses = 0;

    for (let i = 1; i < period; i++) {

        const diff = closes[i] - closes[i - 1];

        if (diff > 0) gains += diff;
        else losses += Math.abs(diff);
    }

    const rs = gains / (losses || 1);

    return 100 - (100 / (1 + rs));
}

// ===============================
// 🟢 MENU BOT
// ===============================
function menu(chatId) {

    bot.sendMessage(chatId, "🤖 OTC BOT READY", {
        reply_markup: {
            keyboard: [
                ["📊 Signal OTC"],
                ["📈 Dashboard"]
            ],
            resize_keyboard: true
        }
    });
}

// ===============================
// 🚀 START
// ===============================
bot.onText(/\/start/, (msg) => {
    menu(msg.chat.id);
});

// ===============================
// 📊 SIGNAL MENU
// ===============================
bot.onText(/📊 Signal OTC/, (msg) => {

    bot.sendMessage(msg.chat.id, "💎 Choisir marché", {
        reply_markup: {
            keyboard: [
                ["EUR/USD"],
                ["GBP/USD"],
                ["BTC/USD"]
            ],
            resize_keyboard: true
        }
    });
});

// ===============================
// 💎 MARKET SELECT
// ===============================
bot.onText(/EUR\/USD|GBP\/USD|BTC\/USD/, (msg) => {

    data.market = msg.text;

    bot.sendMessage(msg.chat.id, "⏱ Choisir timeframe", {
        reply_markup: {
            keyboard: [
                ["5s", "15s"],
                ["1m", "5m"],
                ["15m"]
            ],
            resize_keyboard: true
        }
    });
});

// ===============================
// ⏱ ANALYSE COMPLETE
// ===============================
bot.onText(/5s|15s|1m|5m|15m/, (msg) => {

    const chatId = msg.chat.id;

    data.timeframe = msg.text;

    // 🔥 SIMULATION PRIX
    const closes = [];

    for (let i = 0; i < 15; i++) {
        closes.push(100 + Math.random() * 10);
    }

    const rsi = calculateRSI(closes);

    let signal = "WAIT";
    let momentum = "NEUTRE";

    if (rsi < 30) {
        signal = "CALL";
        momentum = "HAUSSIER";
    }

    if (rsi > 70) {
        signal = "PUT";
        momentum = "BAISSIER";
    }

    const confidence = Math.floor(Math.random() * 20) + 80;

    data = {
        market: data.market,
        timeframe: data.timeframe,
        rsi: rsi.toFixed(2),
        momentum,
        signal,
        confidence
    };

    bot.sendMessage(chatId, `
📊 SIGNAL FINAL

💎 Market: ${data.market}
⏱ Timeframe: ${data.timeframe}

📈 RSI: ${rsi.toFixed(2)}
⚡ Momentum: ${momentum}

🔥 SIGNAL: ${signal}
🧠 Confidence: ${confidence}%
    `);
});

// ===============================
// 📈 DASHBOARD WEB ROUTE
// ===============================
app.get("/", (req, res) => {

    res.send(`
<!DOCTYPE html>
<html>
<head>
<meta name="viewport" content="width=device-width, initial-scale=1">
<title>OTC Dashboard</title>
<style>
body { font-family: Arial; background:#0f172a; color:white; text-align:center; padding:20px; }
.box { background:#1e293b; margin:10px; padding:15px; border-radius:10px; }
.buy { color:#22c55e; font-size:22px; font-weight:bold; }
.sell { color:#ef4444; font-size:22px; font-weight:bold; }
</style>
</head>

<body>

<h2>📊 OTC LIVE DASHBOARD</h2>

<div class="box">💎 Market: ${data.market}</div>
<div class="box">⏱ Timeframe: ${data.timeframe}</div>
<div class="box">📈 RSI: ${data.rsi}</div>
<div class="box">⚡ Momentum: ${data.momentum}</div>
<div class="box">🧠 Confidence: ${data.confidence}%</div>

<div class="box ${data.signal === "PUT" ? "sell" : "buy"}">
📊 SIGNAL: ${data.signal}
</div>

</body>
</html>
    `);
});

// ===============================
// 🚀 SERVER START
// ===============================
const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
    console.log("🚀 BOT + DASHBOARD ONLINE");
});
