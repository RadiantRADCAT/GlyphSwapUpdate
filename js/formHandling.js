document.getElementById('amount').oninput = updateEstimatedAmount;

document.getElementById('swapForm').onsubmit = async function(e) {
    e.preventDefault();

    const amount = parseFloat(document.getElementById('amount').value);
    const walletAddress = document.getElementById('walletAddress').value;

    if (!validateSwapAmount(amount)) {
        const availableLiquidity = LIQUIDITY_POOL[currentToToken.symbol] || 0;
        alert(`Swap amount exceeds 50% of available liquidity (${(availableLiquidity * 0.5).toFixed(6)} ${currentToToken.symbol}) or minimum output amount must be at least 1 ${currentToToken.symbol}`);
        return;
    }

    const estimatedAmount = calculateSwapAmount(currentFromToken, currentToToken, amount);

    const data = {
        action: 'swap',
        tokenFrom: currentFromToken.symbol,
        tokenTo: currentToToken.symbol,
        amount: amount,
        receivingAmount: estimatedAmount,
        walletAddress: walletAddress,
        timestamp: new Date().toISOString()
    };

    const success = await sendToGoogleSheets(data);
    if (success) {
        // Update liquidity pool
        LIQUIDITY_POOL[currentFromToken.symbol] = (LIQUIDITY_POOL[currentFromToken.symbol] || 0) + amount;
        LIQUIDITY_POOL[currentToToken.symbol] = (LIQUIDITY_POOL[currentToToken.symbol] || 0) - estimatedAmount;

        updateLiquidityInfo();
        showSwapResult(amount, estimatedAmount, walletAddress);
    } else {
        alert('There was an error processing your request. Please try again.');
    }
};

async function verifyTransaction() {
    const transactionId = document.getElementById('transactionId').value;
    if (!transactionId) {
        alert('Please enter your transaction ID');
        return;
    }

    const data = {
        action: 'verify',
        transactionId: transactionId,
        walletAddress: document.getElementById('walletAddress').value,
        tokenFrom: currentFromToken.symbol,
        tokenTo: currentToToken.symbol,
        amount: document.getElementById('amount').value,
        timestamp: new Date().toISOString()
    };

    const success = await sendToGoogleSheets(data);
    if (success) {
        showVerificationMessage(true);
    } else {
        showVerificationMessage(false);
    }
}
