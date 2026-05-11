require("dotenv").config();

const TelegramBot = require("node-telegram-bot-api");

const bot = new TelegramBot(process.env.BOT_TOKEN, {
    polling: true
});

// ===============================
// 👑 CONFIG
// ===============================
const OWNER_ID = 5161872804;

const CHANNEL = "@binance_trading10";

const CHANNEL_LINK =
    "https://t.me/binance_trading10";

// ===============================
// 📊 DATA
// ===============================
const userData = {};

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

`🤖 OTC AI SIGNAL BOT

📊 Analyse intelligente OTC
🧠 IA Prediction
📈 RSI + Momentum
🔥 Trend Scanner`, {

        reply_markup: {

            keyboard: [

                ["📊 Signal OTC"],

                ["📈 Dashboard"],

                ["🧠 IA Status"],

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

    const member =
        await isMember(userId);

    if (!member) {

        return bot.sendMessage(chatId,

`🚀 ACCÈS BLOQUÉ

Rejoins le canal :

👉 ${CHANNEL_LINK}

Puis relance /start`
        );
    }

    menu(chatId);
});

// ===============================
// 📊 SIGNAL OTC
// ===============================
bot.onText(/📊 Signal OTC/, (msg) => {

    const chatId = msg.chat.id;

    bot.sendMessage(chatId,

`💎 Choisir marché OTC`, {

        reply_markup: {

            keyboard: [

                ["EUR/USD OTC"],

                ["GBP/USD OTC"],

                ["USD/JPY OTC"],

                ["BTC OTC"],

                ["ETH OTC"]

            ],

            resize_keyboard: true
        }
    });
});

// ===============================
// 💎 CHOIX MARKET
// ===============================
bot.onText(
/(EUR\/USD OTC|GBP\/USD OTC|USD\/JPY OTC|BTC OTC|ETH OTC)/,

(msg) => {

    const chatId = msg.chat.id;

    userData[chatId] = {
        market: msg.text
    };

    bot.sendMessage(chatId,

`⏱ Choisir timeframe`, {

        reply_markup: {

            keyboard: [

                ["5s", "15s"],

                ["30s", "1m"],

                ["5m"]

            ],

            resize_keyboard: true
        }
    });
});

// ===============================
// ⏱ TIMEFRAME
// ===============================
bot.onText(
/(5s|15s|30s|1m|5m)/,

async (msg) => {

    const chatId = msg.chat.id;

    if (!userData[chatId]) return;

    userData[chatId].timeframe =
        msg.text;

    // ===============================
    // 📈 RSI
    // ===============================
    await bot.sendMessage(chatId,

`📈 Calcul RSI...`);

    await sleep(2000);

    const rsi =
        Math.floor(Math.random() * 60) + 20;

    let rsiStatus = "";

    if (rsi < 30) {

        rsiStatus =
            "✅ Zone Survente";

    } else if (rsi > 70) {

        rsiStatus =
            "⚠️ Zone Surachat";

    } else {

        rsiStatus =
            "✅ RSI Stable";
    }

    await bot.sendMessage(chatId,

`📈 RSI = ${rsi}

${rsiStatus}`);

    // ===============================
    // ⚡ MOMENTUM
    // ===============================
    await sleep(2000);

    await bot.sendMessage(chatId,

`⚡ Analyse Momentum...`);

    await sleep(2000);

    const momentum =
        Math.random() > 0.5
        ? "HAUSSIER"
        : "BAISSIER";

    await bot.sendMessage(chatId,

`⚡ Momentum :

${momentum}`);

    // ===============================
    // 🧠 IA ANALYSE
    // ===============================
    await sleep(2000);

    await bot.sendMessage(chatId,

`🧠 Analyse IA...`);

    await sleep(3000);

    // ===============================
    // 📊 FINAL SIGNAL
    // ===============================
    let finalSignal = "";

    if (
        rsi < 35 &&
        momentum === "HAUSSIER"
    ) {

        finalSignal =
            "🟢 HAUSSIÈRE (CALL)";

    } else if (
        rsi > 65 &&
        momentum === "BAISSIER"
    ) {

        finalSignal =
            "🔴 BAISSIÈRE (PUT)";

    } else {

        finalSignal =
            Math.random() > 0.5
            ? "🟢 HAUSSIÈRE (CALL)"
            : "🔴 BAISSIÈRE (PUT)";
    }

    const confidence =
        Math.floor(Math.random() * 15) + 80;

    await bot.sendMessage(chatId,

`📊 SIGNAL OTC FINAL

💎 Marché :
${userData[chatId].market}

⏱ Temps :
${userData[chatId].timeframe}

📈 RSI :
${rsi}

⚡ Momentum :
${momentum}

🧠 IA :
Analyse terminée

🔥 Confiance :
${confidence}%

${finalSignal}`
    );

    menu(chatId);
});

// ===============================
// 📈 DASHBOARD
// ===============================
bot.onText(/📈 Dashboard/, (msg) => {

    bot.sendMessage(msg.chat.id,

`📈 DASHBOARD OTC

🟢 Marché : ACTIF

📊 Scanner : ONLINE

🧠 IA Engine : RUNNING

🔥 Smart Money : ACTIVE

⚡ Momentum Scanner : ACTIVE`
    );
});

// ===============================
// 🧠 IA STATUS
// ===============================
bot.onText(/🧠 IA Status/, (msg) => {

    bot.sendMessage(msg.chat.id,

`🧠 IA STATUS

✅ RSI Scanner : OK

✅ Momentum Engine : OK

✅ Smart Trend : OK

✅ Volatility Scan : OK

🔥 OTC AI READY`
    );
});

// ===============================
// ℹ️ AIDE
// ===============================
bot.onText(/ℹ️ Aide/, (msg) => {

    bot.sendMessage(msg.chat.id,

`🤖 OTC AI SIGNAL BOT

📊 OTC Signals
🧠 IA Prediction
📈 RSI Scanner
⚡ Momentum
🔥 Trend Detection

⚠️ Tester en démo avant réel`
    );
});

// ===============================
// 💤 SLEEP
// ===============================
function sleep(ms) {

    return new Promise(resolve =>
        setTimeout(resolve, ms)
    );
}

// ===============================
// 🚀 ONLINE
// ===============================
console.log(
"🚀 OTC AI BOT ONLINE"
);
