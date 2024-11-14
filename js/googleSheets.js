async function submitSwapToGoogleSheets(data) {
    try {
        await fetch(GOOGLE_SCRIPT_URL, {
            method: 'POST',
            mode: 'no-cors',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(data)
        });
        // Update local liquidity pool data
        liquidityPool[data.tokenFrom] = (liquidityPool[data.tokenFrom] || 0) + data.amount;
        liquidityPool[data.tokenTo] = (liquidityPool[data.tokenTo] || 0) - data.receivingAmount;
        updateAvailableLiquidity();
    } catch (error) {
        console.error('Error initiating swap:', error);
        alert('There was an error initiating the swap. Please try again.');
    }
}

async function verifyTransactionWithGoogleSheets(data) {
    try {
        await fetch(GOOGLE_SCRIPT_URL, {
            method: 'POST',
            mode: 'no-cors',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(data)
        });
        alert('Transaction verified successfully!');
    } catch (error) {
        console.error('Error verifying transaction:', error);
        alert('There was an error verifying the transaction. Please try again or contact support.');
    }
}
