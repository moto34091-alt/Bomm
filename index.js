require("dotenv").config();

const TelegramBot = require("node-telegram-bot-api");
const express = require("express");

const app = express();

// ============================
// 🤖 TELEGRAM BOT
// ============================
const bot = new TelegramBot(process.env.BOT_TOKEN, {
    polling: true
});

// ============================
// 📊 SIMPLE IA RSI
// ============================
function analyzeMarket() {

    const rsi = Math.floor(Math.random() * 100);
    const momentum = Math.random();

    let signal = "WAIT";
    let emoji = "🟡⏸";
    let trend = "NEUTRE";

    if (rsi < 30 && momentum > 0.5) {
        signal = "CALL";
        emoji = "🟢📈";
        trend = "HAUSSIER";
    }

    if (rsi > 70 && momentum < 0.5) {
        signal = "PUT";
        emoji = "🔴📉";
        trend = "BAISSIER";
    }

    return {
        rsi,
        signal,
        emoji,
        trend,
        confidence: Math.floor(momentum * 100)
    };
}

// ============================
// 🚀 MENU /START + WEB APP
// ============================
bot.onText(/\/start/, (msg) => {

    bot.sendMessage(msg.chat.id,
        "🚀 BIENVENUE DANS AI TRADING BOT",
        {
            reply_markup: {
                inline_keyboard: [
                    [
                        {
                            text: "📊 OUVRIR DASHBOARD",
                            web_app: {
                                url: "https://bomm-ttt.up.railway.app"
                            }
                        }
                    ]
                ]
            }
        }
    );
});

// ============================
// 📊 COMMANDE SIGNAL RAPIDE
// ============================
bot.onText(/signal/, (msg) => {

    const data = analyzeMarket();

    bot.sendMessage(msg.chat.id, `
📊 SIGNAL IA

📈 RSI: ${data.rsi}
⚡ Trend: ${data.trend}

🔥 SIGNAL: ${data.emoji} ${data.signal}
🧠 Confidence: ${data.confidence}%
    `);
});

// ============================
// 🌐 EXPRESS (option dashboard API)
// ============================
app.get("/api/signal", (req, res) => {
    res.json(analyzeMarket());
});

// ============================
// 🚀 START SERVER
// ============================
const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
    console.log("🚀 Bot + Dashboard ONLINE");
});
