const express = require("express");
const app = express();

let latestData = {
    market: "EUR/USD OTC",
    timeframe: "1m",
    rsi: 0,
    momentum: "WAIT",
    signal: "WAIT",
    confidence: 0
};

// ===============================
// 📡 UPDATE DATA (appelé par bot)
// ===============================
function updateDashboard(data) {
    latestData = {
        ...latestData,
        ...data
    };
}

module.exports = { app, updateDashboard, latestData };
