const ccxt = require("ccxt");

const exchange = new ccxt.binance({

    apiKey: process.env.BINANCE_KEY,

    secret: process.env.BINANCE_SECRET,

    enableRateLimit: true
});

async function getCandles(
    symbol = "BTC/USDT",
    timeframe = "1m"
) {

    const candles =
        await exchange.fetchOHLCV(
            symbol,
            timeframe,
            undefined,
            100
        );

    return candles;
}

async function getBalance() {

    const balance =
        await exchange.fetchBalance();

    return balance.total.USDT || 0;
}

module.exports = {
    getCandles,
    getBalance
};
