function handleSubmit(event) {
    event.preventDefault();
    const fromToken = TOKENS[document.getElementById('fromToken').value];
    const toToken = TOKENS[document.getElementById('toToken').value];
    const amount = parseFloat(document.getElementById('amount').value);
    const walletAddress = document.getElementById('walletAddress').value;
    const estimatedAmount = calculateSwapAmount(fromToken, toToken, amount);

    const data = {
        action: 'swap',
        tokenFrom: fromToken.symbol,
        tokenTo: toToken.symbol,
        amount: amount,
        receivingAmount: estimatedAmount,
        walletAddress: walletAddress,
        timestamp: new Date().toISOString()
    };

    submitSwapToGoogleSheets(data);
    showSwapResult(fromToken, toToken, amount, estimatedAmount);
}

function showSwapResult(fromToken, toToken, amount, estimatedAmount) {
    const swapForm = document.getElementById('swapForm');
    const swapResult = document.getElementById('swapResult');
    swapForm.classList.add('hidden');
    swapResult.classList.remove('hidden');

    swapResult.innerHTML = `
        <h2 class="text-xl font-bold">Swap Initiated</h2>
        <p>You are swapping ${amount} ${fromToken.symbol} for approximately ${estimatedAmount.toFixed(6)} ${toToken.symbol}.</p>
        <p>Please send ${amount} ${fromToken.symbol} to the following address:</p>
        <div class="bg-gray-100 p-2 rounded flex items-center justify-between">
            <span class="text-sm break-all">${SWAP_WALLET}</span>
            <button onclick="copyToClipboard('${SWAP_WALLET}')" class="bg-gray-200 p-1 rounded">Copy</button>
        </div>
        <div class="flex justify-center my-4">
            <img src="https://api.qrserver.com/v1/create-qr-code/?size=150x150&data=${SWAP_WALLET}" alt="QR Code" width="150" height="150">
        </div>
        <p>After sending, please enter your transaction ID to verify the swap:</p>
        <input id="transactionId" type="text" placeholder="Enter transaction ID" class="w-full p-2 border rounded mb-2">
        <button onclick="verifyTransaction()" class="w-full bg-yellow-400 hover:bg-yellow-500 p-2 rounded">Verify Transaction</button>
        <button onclick="backToSwap()" class="w-full bg-gray-200 hover:bg-gray-300 p-2 rounded mt-2">Back to Swap</button>
        <a href="${DISCORD_URL}" target="_blank" rel="noopener noreferrer" class="block text-center text-blue-500 hover:underline mt-4">
            Need help? Join our Discord
        </a>
    `;
}

function copyToClipboard(text) {
    navigator.clipboard.writeText(text).then(() => {
        alert('Copied to clipboard!');
    });
}

function backToSwap() {
    document.getElementById('swapForm').classList.remove('hidden');
    document.getElementById('swapResult').classList.add('hidden');
}

function verifyTransaction() {
    const transactionId = document.getElementById('transactionId').value;
    if (!transactionId) {
        alert('Please enter your transaction ID');
        return;
    }

    const data = {
        action: 'verify',
        transactionId: transactionId,
        walletAddress: document.getElementById('walletAddress').value,
        tokenFrom: document.getElementById('fromToken').value,
        tokenTo: document.getElementById('toToken').value,
        amount: document.getElementById('amount').value,
        timestamp: new Date().toISOString()
    };

    verifyTransactionWithGoogleSheets(data);
}
