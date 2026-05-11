require("dotenv").config();

const express = require("express");
const path = require("path");
const TelegramBot = require("node-telegram-bot-api");

const app = express();

// ============================
// 🌐 WEB SERVER FIX
// ============================

// 🔥 Sert les fichiers HTML (public/)
app.use(express.static("public"));

// 🔥 Route principale (CORRIGE Cannot GET /)
app.get("/", (req, res) => {
    res.sendFile(path.join(__dirname, "public", "index.html"));
});

// ============================
// 🤖 TELEGRAM BOT
// ============================
const bot = new TelegramBot(process.env.BOT_TOKEN, {
    polling: true
});

// ============================
// 📊 IA SIMPLE SIGNAL
// ============================
function analyze() {

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

    return { rsi, signal, emoji, trend };
}

// ============================
// 🚀 START BUTTON WEB APP
// ============================
bot.onText(/\/start/, (msg) => {

    bot.sendMessage(msg.chat.id, "🚀 OUVRIR DASHBOARD", {
        reply_markup: {
            inline_keyboard: [
                [
                    {
                        text: "📊 OPEN DASHBOARD",
                        web_app: {
                            url: "https://bomm-ttt.up.railway.app"
                        }
                    }
                ]
            ]
        }
    });
});

// ============================
// 📊 API SIGNAL
// ============================
app.get("/api/signal", (req, res) => {
    res.json(analyze());
});

// ============================
// 🚀 START SERVER
// ============================
const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
    console.log("🚀 SERVER OK");
});
