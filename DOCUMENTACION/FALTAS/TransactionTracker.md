st results = await handleRetryWithBackoff(async () => {
// TODO: Implementar llamadas a APIs externas (Etherscan, Blockchair, etc.)
// Por ahora simulamos la respuesta
if (detectedType === 'hash') {
return [{
hash: searchInput,
blockNumber: 18500000,
from: '0x742d35cc6567c6532576e3bd0c5b5b33f4f3c42b',
to: '0x742d35cc6567c6532576e3bd0c5b5b33f4f3c42b',
