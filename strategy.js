const { getCandles } =
require("./market");

const { calculateRSI } =
require("./rsi");

async function analyzeMarket(
    symbol,
    timeframe
) {

    const candles =
        await getCandles(
            symbol,
            timeframe
        );

    const closes =
        candles.map(c => c[4]);

    const rsi =
        calculateRSI(closes);

    let signal = "WAIT";

    if (rsi < 30) {
        signal = "CALL";
    }

    if (rsi > 70) {
        signal = "PUT";
    }

    return {
        rsi,
        signal
    };
}

module.exports = {
    analyzeMarket
};
