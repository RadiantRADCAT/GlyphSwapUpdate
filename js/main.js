// Fetch liquidity pool data on page load
window.addEventListener('load', fetchLiquidityPool);

setupTokenSelect('fromToken', 'fromTokenDropdown', false);
setupTokenSelect('toToken', 'toTokenDropdown', true);
updateMinimumAmount();
updateLiquidityInfo();
