require("dotenv").config();
const express = require("express");

const app = express();
app.use(express.static("public"));

// ======================
// 📊 SIMULATION IA CORE
// ======================
function analyzeMarket() {

    const rsi = Math.floor(Math.random() * 100);
    const momentumScore = Math.random();

    let momentum = "NEUTRE";
    let signal = "WAIT";
    let emoji = "🟡";

    // 📊 LOGIQUE IA SIMPLE
    if (rsi < 30 && momentumScore > 0.6) {
        signal = "CALL";
        momentum = "HAUSSIER";
        emoji = "🟢📈";
    }

    if (rsi > 70 && momentumScore < 0.4) {
        signal = "PUT";
        momentum = "BAISSIER";
        emoji = "🔴📉";
    }

    return {
        rsi,
        momentum,
        signal,
        emoji,
        confidence: Math.floor(momentumScore * 100)
    };
}

// ======================
// API ANALYSE
// ======================
app.get("/api/analyze", (req, res) => {
    res.json(analyzeMarket());
});

// ======================
// SERVER
// ======================
app.listen(process.env.PORT || 3000, () => {
    console.log("🚀 server running");
});
