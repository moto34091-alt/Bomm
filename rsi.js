function calculateRSI(closes, period = 14) {

    let gains = 0;
    let losses = 0;

    for (let i = 1; i < period; i++) {

        const diff = closes[i] - closes[i - 1];

        if (diff > 0) gains += diff;
        else losses += Math.abs(diff);
    }

    const rs = gains / (losses || 1);

    return 100 - (100 / (1 + rs));
}

module.exports = { calculateRSI };
