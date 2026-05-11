require("dotenv").config();
const express = require("express");
const app = express();

app.use(express.static("public"));

// 📊 API ANALYSE IA
app.get("/api/signal", (req, res) => {

    const rsi = Math.floor(Math.random() * 100);
    const momentum = Math.random();

    let signal = "WAIT";
    let emoji = "🟡";

    if (rsi < 30 && momentum > 0.5) {
        signal = "CALL";
        emoji = "🟢📈";
    }

    if (rsi > 70 && momentum < 0.5) {
        signal = "PUT";
        emoji = "🔴📉";
    }

    res.json({
        rsi,
        signal,
        emoji,
        momentum: momentum > 0.5 ? "HAUSSIER" : "BAISSIER"
    });
});

app.listen(process.env.PORT || 3000, () => {
    console.log("🚀 Mini App running");
});
