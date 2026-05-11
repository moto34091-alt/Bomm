require("dotenv").config();

const TelegramBot = require("node-telegram-bot-api");

const { calculateRSI } = require("./rsi");
const { app, updateDashboard } = require("./dashboard");

const bot = new TelegramBot(process.env.BOT_TOKEN, {
    polling: true
});

// ===============================
// DATA USER
// ===============================
let userData = {};

// ===============================
// MENU
// ===============================
function menu(chatId) {
    bot.sendMessage(chatId, "🤖 OTC BOT", {
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
// START
// ===============================
bot.onText(/\/start/, (msg) => {
    menu(msg.chat.id);
});

// ===============================
// MARKET
// ===============================
bot.onText(/📊 Signal OTC/, (msg) => {

    const chatId = msg.chat.id;

    bot.sendMessage(chatId, "💎 Choisir marché", {
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
// CHOIX MARKET
// ===============================
bot.onText(/EUR\/USD|GBP\/USD|BTC\/USD/, (msg) => {

    const chatId = msg.chat.id;

    userData[chatId] = {
        market: msg.text
    };

    bot.sendMessage(chatId, "⏱ Choisir timeframe", {
        reply_markup: {
            keyboard: [
                ["1m", "5m"],
                ["15m"]
            ],
            resize_keyboard: true
        }
    });
});

// ===============================
// TIME + ANALYSE
// ===============================
bot.onText(/1m|5m|15m/, (msg) => {

    const chatId = msg.chat.id;

    userData[chatId].timeframe = msg.text;

    // 🔥 SIMULATION PRIX
    const closes = [];

    for (let i = 0; i < 15; i++) {
        closes.push(100 + Math.random() * 10);
    }

    const rsi = calculateRSI(closes);

    let signal = "WAIT";
    let momentum = "NEUTRAL";

    if (rsi < 30) {
        signal = "CALL";
        momentum = "HAUSSIER";
    }

    if (rsi > 70) {
        signal = "PUT";
        momentum = "BAISSIER";
    }

    const confidence = Math.floor(Math.random() * 20) + 80;

    // 📊 UPDATE DASHBOARD
    updateDashboard({
        market: userData[chatId].market,
        timeframe: userData[chatId].timeframe,
        rsi: rsi.toFixed(2),
        signal,
        momentum,
        confidence
    });

    bot.sendMessage(chatId, `
📊 SIGNAL FINAL

💎 Market: ${userData[chatId].market}
⏱ Time: ${userData[chatId].timeframe}

📈 RSI: ${rsi.toFixed(2)}
⚡ Momentum: ${momentum}

🔥 SIGNAL: ${signal}
🧠 Confidence: ${confidence}%
`);
});

// ===============================
// DASHBOARD
// ===============================
bot.onText(/📈 Dashboard/, (msg) => {
    bot.sendMessage(msg.chat.id,
        "📊 Ouvre ton dashboard :\n\n👉 Railway link après deploy"
    );
});

// ===============================
// SERVER DASHBOARD
// ===============================
app.listen(process.env.PORT || 3000, () => {
    console.log("🚀 Bot + Dashboard ON");
});
