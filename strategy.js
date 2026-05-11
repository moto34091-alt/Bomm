function analyze() {

    const signals = ["CALL", "PUT", "WAIT"];

    const random = Math.floor(Math.random() * signals.length);

    return signals[random];
}

module.exports = { analyze };
