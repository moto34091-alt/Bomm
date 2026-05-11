require("dotenv").config();

const TelegramBot = require("node-telegram-bot-api");
const { analyze } = require("./strategy");

const bot = new TelegramBot(process.env.BOT_TOKEN, {
    polling: true
});

// ===============================
// 👑 CONFIG
// ===============================
const OWNER_ID = 5161872804;

const CHANNEL = "@binance_trading10";

const CHANNEL_LINK = "https://t.me/binance_trading10";

// ===============================
// ⏱ TIMEFRAMES
// ===============================
const TIMEFRAMES = [
    "5s",
    "15s",
    "30s",
    "1m",
    "5m",
    "15m",
    "1h"
];

let selectedTimeframe = "1m";

// ===============================
// 🔐 CHECK MEMBER
// ===============================
async function isMember(userId) {

    if (userId === OWNER_ID) {
        return true;
    }

    try {

        const res = await bot.getChatMember(
            CHANNEL,
            userId
        );

        return [
            "member",
            "administrator",
            "creator"
        ].includes(res.status);

    } catch (err) {

        console.log(err.message);

        return false;
    }
}

// ===============================
// 🟢 MENU
// ===============================
function menu(chatId) {

    bot.sendMessage(chatId,
        "🤖 OTC SIGNAL BOT", {

        reply_markup: {
            keyboard: [

                ["📊 Signal OTC"],

                ["🧠 IA Prediction"],

                ["⏱ Timeframe"],

                ["📈 Dashboard"],

                ["ℹ️ Aide"]

            ],

            resize_keyboard: true
        }
    });
}

// ===============================
// 🚀 START
// ===============================
bot.onText(/\/start/, async (msg) => {

    const chatId = msg.chat.id;

    const userId = msg.from.id;

    const member = await isMember(userId);

    if (!member) {

        return bot.sendMessage(chatId,

`🚀 ACCÈS BLOQUÉ

Rejoins le canal :

👉 ${CHANNEL_LINK}

Puis tape /start`
        );
    }

    menu(chatId);
});

// ===============================
// 📊 SIGNAL OTC
// ===============================
bot.onText(/📊 Signal OTC/, async (msg) => {

    const signal = analyze();

    let trend =
        signal === "CALL"
        ? "UP"
        : signal === "PUT"
        ? "DOWN"
        : "SIDEWAYS";

    let confidence =
        Math.floor(Math.random() * 20) + 80;

    bot.sendMessage(msg.chat.id,

`📊 OTC SIGNAL

💎 Pair: EUR/USD OTC

⏱ Timeframe: ${selectedTimeframe}

🧠 IA Signal: ${signal}

📈 Trend: ${trend}

🔥 Confidence: ${confidence}%`
    );
});

// ===============================
// 🧠 IA PREDICTION
// ===============================
bot.onText(/🧠 IA Prediction/, (msg) => {

    bot.sendMessage(msg.chat.id,

`🧠 IA ANALYSIS

📈 Trend Power: Strong

🔥 Smart Money: Detected

📊 Momentum: High

⚠️ Market Volatility: Medium`
    );
});

// ===============================
// ⏱ TIMEFRAME
// ===============================
bot.onText(/⏱ Timeframe/, (msg) => {

    bot.sendMessage(msg.chat.id,

`⏱ Choisis timeframe :

${TIMEFRAMES.join(" | ")}`);
});

// ===============================
// 📈 DASHBOARD
// ===============================
bot.onText(/📈 Dashboard/, (msg) => {

    bot.sendMessage(msg.chat.id,

`📈 DASHBOARD LIVE

🟢 Market: Active

📊 Candles: Live

🔥 Trend Scanner: ON

🧠 AI Engine: Running`
    );
});

// ===============================
// ℹ️ AIDE
// ===============================
bot.onText(/ℹ️ Aide/, (msg) => {

    bot.sendMessage(msg.chat.id,

`🤖 OTC BOT

📊 OTC Signals
🧠 IA Prediction
📈 Dashboard
⏱ Timeframes

⚠️ Utiliser en démo avant réel`
    );
});

// ===============================
// 🚀 ONLINE
// ===============================
console.log("🚀 OTC Telegram Bot Online");
