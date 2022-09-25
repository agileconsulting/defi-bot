require('dotenv').config()
require('console.table')
const express = require('express')
const path = require('path')
//const player = require('play-sound')(opts = {})
const http = require('http')
const cors = require('cors')
const Web3 = require('web3')
const axios = require('axios')
const moment = require('moment-timezone')
const numeral = require('numeral')
const _ = require('lodash')
// Questo script ha tutte le coppie disponibili 
//e tutte le maggiori prudenze aumentando anche se profitto > 0.001
//per evitare di fare operazioni con un margine dubbio
// non sono presi in considerazione ordine con maker o taker fee
// o parzialmente evasi. Vengono presi uno alla volta

// SERVER CONFIG
const PORT = process.env.PORT || 5000
const app = express();
const server = http.createServer(app).listen(PORT, () => console.log(`Listening on ${ PORT }`))
app.use(express.static(path.join(__dirname, 'public')))
app.use(cors({credentials: true, origin: '*'}))

// WEB3 CONFIG
const web3 = new Web3(process.env.RPC_URL)
web3.eth.accounts.wallet.add(process.env.PRIVATE_KEY)

// SMART CONTRACTS
const ONE_SPLIT_ABI = [{"inputs":[{"internalType":"contract IOneSplit","name":"impl","type":"address"}],"payable":false,"stateMutability":"nonpayable","type":"constructor"},{"anonymous":false,"inputs":[{"indexed":true,"internalType":"address","name":"newImpl","type":"address"}],"name":"ImplementationUpdated","type":"event"},{"anonymous":false,"inputs":[{"indexed":true,"internalType":"address","name":"previousOwner","type":"address"},{"indexed":true,"internalType":"address","name":"newOwner","type":"address"}],"name":"OwnershipTransferred","type":"event"},{"payable":true,"stateMutability":"payable","type":"fallback"},{"constant":true,"inputs":[],"name":"FLAG_DISABLE_AAVE","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":true,"inputs":[],"name":"FLAG_DISABLE_BANCOR","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":true,"inputs":[],"name":"FLAG_DISABLE_BDAI","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":true,"inputs":[],"name":"FLAG_DISABLE_CHAI","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":true,"inputs":[],"name":"FLAG_DISABLE_COMPOUND","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":true,"inputs":[],"name":"FLAG_DISABLE_CURVE_BINANCE","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":true,"inputs":[],"name":"FLAG_DISABLE_CURVE_COMPOUND","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":true,"inputs":[],"name":"FLAG_DISABLE_CURVE_SYNTHETIX","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":true,"inputs":[],"name":"FLAG_DISABLE_CURVE_USDT","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":true,"inputs":[],"name":"FLAG_DISABLE_CURVE_Y","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":true,"inputs":[],"name":"FLAG_DISABLE_FULCRUM","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":true,"inputs":[],"name":"FLAG_DISABLE_IEARN","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":true,"inputs":[],"name":"FLAG_DISABLE_KYBER","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":true,"inputs":[],"name":"FLAG_DISABLE_OASIS","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":true,"inputs":[],"name":"FLAG_DISABLE_SMART_TOKEN","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":true,"inputs":[],"name":"FLAG_DISABLE_UNISWAP","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":true,"inputs":[],"name":"FLAG_DISABLE_WETH","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":true,"inputs":[],"name":"FLAG_ENABLE_KYBER_BANCOR_RESERVE","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":true,"inputs":[],"name":"FLAG_ENABLE_KYBER_OASIS_RESERVE","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":true,"inputs":[],"name":"FLAG_ENABLE_KYBER_UNISWAP_RESERVE","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":true,"inputs":[],"name":"FLAG_ENABLE_MULTI_PATH_DAI","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":true,"inputs":[],"name":"FLAG_ENABLE_MULTI_PATH_ETH","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":true,"inputs":[],"name":"FLAG_ENABLE_MULTI_PATH_USDC","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":true,"inputs":[],"name":"FLAG_ENABLE_UNISWAP_COMPOUND","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":false,"inputs":[{"internalType":"contract IERC20","name":"asset","type":"address"},{"internalType":"uint256","name":"amount","type":"uint256"}],"name":"claimAsset","outputs":[],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":true,"inputs":[{"internalType":"contract IERC20","name":"fromToken","type":"address"},{"internalType":"contract IERC20","name":"toToken","type":"address"},{"internalType":"uint256","name":"amount","type":"uint256"},{"internalType":"uint256","name":"parts","type":"uint256"},{"internalType":"uint256","name":"featureFlags","type":"uint256"}],"name":"getExpectedReturn","outputs":[{"internalType":"uint256","name":"returnAmount","type":"uint256"},{"internalType":"uint256[]","name":"distribution","type":"uint256[]"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":true,"inputs":[],"name":"isOwner","outputs":[{"internalType":"bool","name":"","type":"bool"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":true,"inputs":[],"name":"oneSplitImpl","outputs":[{"internalType":"contract IOneSplit","name":"","type":"address"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":true,"inputs":[],"name":"owner","outputs":[{"internalType":"address","name":"","type":"address"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":false,"inputs":[],"name":"renounceOwnership","outputs":[],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":false,"inputs":[{"internalType":"contract IOneSplit","name":"impl","type":"address"}],"name":"setNewImpl","outputs":[],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":false,"inputs":[{"internalType":"contract IERC20","name":"fromToken","type":"address"},{"internalType":"contract IERC20","name":"toToken","type":"address"},{"internalType":"uint256","name":"amount","type":"uint256"},{"internalType":"uint256","name":"minReturn","type":"uint256"},{"internalType":"uint256[]","name":"distribution","type":"uint256[]"},{"internalType":"uint256","name":"featureFlags","type":"uint256"}],"name":"swap","outputs":[],"payable":true,"stateMutability":"payable","type":"function"},{"constant":false,"inputs":[{"internalType":"address","name":"newOwner","type":"address"}],"name":"transferOwnership","outputs":[],"payable":false,"stateMutability":"nonpayable","type":"function"}]
const ONE_SPLIT_ADDRESS = "0xC586BeF4a0992C495Cf22e1aeEE4E446CECDee0E"
const oneSplitContract = new web3.eth.Contract(ONE_SPLIT_ABI, ONE_SPLIT_ADDRESS);

const ERC_20_ABI = [{"constant":true,"inputs":[],"name":"name","outputs":[{"name":"","type":"string"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":false,"inputs":[{"name":"_spender","type":"address"},{"name":"_value","type":"uint256"}],"name":"approve","outputs":[{"name":"","type":"bool"}],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":true,"inputs":[],"name":"totalSupply","outputs":[{"name":"","type":"uint256"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":false,"inputs":[{"name":"_from","type":"address"},{"name":"_to","type":"address"},{"name":"_value","type":"uint256"}],"name":"transferFrom","outputs":[{"name":"","type":"bool"}],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":true,"inputs":[],"name":"decimals","outputs":[{"name":"","type":"uint8"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":true,"inputs":[{"name":"_owner","type":"address"}],"name":"balanceOf","outputs":[{"name":"balance","type":"uint256"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":true,"inputs":[],"name":"symbol","outputs":[{"name":"","type":"string"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":false,"inputs":[{"name":"_to","type":"address"},{"name":"_value","type":"uint256"}],"name":"transfer","outputs":[{"name":"","type":"bool"}],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":true,"inputs":[{"name":"_owner","type":"address"},{"name":"_spender","type":"address"}],"name":"allowance","outputs":[{"name":"","type":"uint256"}],"payable":false,"stateMutability":"view","type":"function"},{"payable":true,"stateMutability":"payable","type":"fallback"},{"anonymous":false,"inputs":[{"indexed":true,"name":"owner","type":"address"},{"indexed":true,"name":"spender","type":"address"},{"indexed":false,"name":"value","type":"uint256"}],"name":"Approval","type":"event"},{"anonymous":false,"inputs":[{"indexed":true,"name":"from","type":"address"},{"indexed":true,"name":"to","type":"address"},{"indexed":false,"name":"value","type":"uint256"}],"name":"Transfer","type":"event"}]

const ZRX_EXCHANGE_ADDRESS = '0x61935CbDd02287B511119DDb11Aeb42F1593b7Ef'
const ZRX_EXCHANGE_ABI = [{"inputs":[{"internalType":"uint256","name":"chainId","type":"uint256"}],"payable":false,"stateMutability":"nonpayable","type":"constructor"},{"anonymous":false,"inputs":[{"indexed":false,"internalType":"bytes4","name":"id","type":"bytes4"},{"indexed":false,"internalType":"address","name":"assetProxy","type":"address"}],"name":"AssetProxyRegistered","type":"event"},{"anonymous":false,"inputs":[{"indexed":true,"internalType":"address","name":"makerAddress","type":"address"},{"indexed":true,"internalType":"address","name":"feeRecipientAddress","type":"address"},{"indexed":false,"internalType":"bytes","name":"makerAssetData","type":"bytes"},{"indexed":false,"internalType":"bytes","name":"takerAssetData","type":"bytes"},{"indexed":false,"internalType":"address","name":"senderAddress","type":"address"},{"indexed":true,"internalType":"bytes32","name":"orderHash","type":"bytes32"}],"name":"Cancel","type":"event"},{"anonymous":false,"inputs":[{"indexed":true,"internalType":"address","name":"makerAddress","type":"address"},{"indexed":true,"internalType":"address","name":"orderSenderAddress","type":"address"},{"indexed":false,"internalType":"uint256","name":"orderEpoch","type":"uint256"}],"name":"CancelUpTo","type":"event"},{"anonymous":false,"inputs":[{"indexed":true,"internalType":"address","name":"makerAddress","type":"address"},{"indexed":true,"internalType":"address","name":"feeRecipientAddress","type":"address"},{"indexed":false,"internalType":"bytes","name":"makerAssetData","type":"bytes"},{"indexed":false,"internalType":"bytes","name":"takerAssetData","type":"bytes"},{"indexed":false,"internalType":"bytes","name":"makerFeeAssetData","type":"bytes"},{"indexed":false,"internalType":"bytes","name":"takerFeeAssetData","type":"bytes"},{"indexed":true,"internalType":"bytes32","name":"orderHash","type":"bytes32"},{"indexed":false,"internalType":"address","name":"takerAddress","type":"address"},{"indexed":false,"internalType":"address","name":"senderAddress","type":"address"},{"indexed":false,"internalType":"uint256","name":"makerAssetFilledAmount","type":"uint256"},{"indexed":false,"internalType":"uint256","name":"takerAssetFilledAmount","type":"uint256"},{"indexed":false,"internalType":"uint256","name":"makerFeePaid","type":"uint256"},{"indexed":false,"internalType":"uint256","name":"takerFeePaid","type":"uint256"},{"indexed":false,"internalType":"uint256","name":"protocolFeePaid","type":"uint256"}],"name":"Fill","type":"event"},{"anonymous":false,"inputs":[{"indexed":true,"internalType":"address","name":"previousOwner","type":"address"},{"indexed":true,"internalType":"address","name":"newOwner","type":"address"}],"name":"OwnershipTransferred","type":"event"},{"anonymous":false,"inputs":[{"indexed":false,"internalType":"address","name":"oldProtocolFeeCollector","type":"address"},{"indexed":false,"internalType":"address","name":"updatedProtocolFeeCollector","type":"address"}],"name":"ProtocolFeeCollectorAddress","type":"event"},{"anonymous":false,"inputs":[{"indexed":false,"internalType":"uint256","name":"oldProtocolFeeMultiplier","type":"uint256"},{"indexed":false,"internalType":"uint256","name":"updatedProtocolFeeMultiplier","type":"uint256"}],"name":"ProtocolFeeMultiplier","type":"event"},{"anonymous":false,"inputs":[{"indexed":true,"internalType":"address","name":"signerAddress","type":"address"},{"indexed":true,"internalType":"address","name":"validatorAddress","type":"address"},{"indexed":false,"internalType":"bool","name":"isApproved","type":"bool"}],"name":"SignatureValidatorApproval","type":"event"},{"anonymous":false,"inputs":[{"indexed":true,"internalType":"bytes32","name":"transactionHash","type":"bytes32"}],"name":"TransactionExecution","type":"event"},{"constant":true,"inputs":[],"name":"EIP1271_MAGIC_VALUE","outputs":[{"internalType":"bytes4","name":"","type":"bytes4"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":true,"inputs":[],"name":"EIP712_EXCHANGE_DOMAIN_HASH","outputs":[{"internalType":"bytes32","name":"","type":"bytes32"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":true,"inputs":[{"internalType":"address","name":"","type":"address"},{"internalType":"address","name":"","type":"address"}],"name":"allowedValidators","outputs":[{"internalType":"bool","name":"","type":"bool"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":false,"inputs":[{"components":[{"internalType":"address","name":"makerAddress","type":"address"},{"internalType":"address","name":"takerAddress","type":"address"},{"internalType":"address","name":"feeRecipientAddress","type":"address"},{"internalType":"address","name":"senderAddress","type":"address"},{"internalType":"uint256","name":"makerAssetAmount","type":"uint256"},{"internalType":"uint256","name":"takerAssetAmount","type":"uint256"},{"internalType":"uint256","name":"makerFee","type":"uint256"},{"internalType":"uint256","name":"takerFee","type":"uint256"},{"internalType":"uint256","name":"expirationTimeSeconds","type":"uint256"},{"internalType":"uint256","name":"salt","type":"uint256"},{"internalType":"bytes","name":"makerAssetData","type":"bytes"},{"internalType":"bytes","name":"takerAssetData","type":"bytes"},{"internalType":"bytes","name":"makerFeeAssetData","type":"bytes"},{"internalType":"bytes","name":"takerFeeAssetData","type":"bytes"}],"internalType":"struct LibOrder.Order[]","name":"orders","type":"tuple[]"}],"name":"batchCancelOrders","outputs":[],"payable":true,"stateMutability":"payable","type":"function"},{"constant":false,"inputs":[{"components":[{"internalType":"uint256","name":"salt","type":"uint256"},{"internalType":"uint256","name":"expirationTimeSeconds","type":"uint256"},{"internalType":"uint256","name":"gasPrice","type":"uint256"},{"internalType":"address","name":"signerAddress","type":"address"},{"internalType":"bytes","name":"data","type":"bytes"}],"internalType":"struct LibZeroExTransaction.ZeroExTransaction[]","name":"transactions","type":"tuple[]"},{"internalType":"bytes[]","name":"signatures","type":"bytes[]"}],"name":"batchExecuteTransactions","outputs":[{"internalType":"bytes[]","name":"","type":"bytes[]"}],"payable":true,"stateMutability":"payable","type":"function"},{"constant":false,"inputs":[{"components":[{"internalType":"address","name":"makerAddress","type":"address"},{"internalType":"address","name":"takerAddress","type":"address"},{"internalType":"address","name":"feeRecipientAddress","type":"address"},{"internalType":"address","name":"senderAddress","type":"address"},{"internalType":"uint256","name":"makerAssetAmount","type":"uint256"},{"internalType":"uint256","name":"takerAssetAmount","type":"uint256"},{"internalType":"uint256","name":"makerFee","type":"uint256"},{"internalType":"uint256","name":"takerFee","type":"uint256"},{"internalType":"uint256","name":"expirationTimeSeconds","type":"uint256"},{"internalType":"uint256","name":"salt","type":"uint256"},{"internalType":"bytes","name":"makerAssetData","type":"bytes"},{"internalType":"bytes","name":"takerAssetData","type":"bytes"},{"internalType":"bytes","name":"makerFeeAssetData","type":"bytes"},{"internalType":"bytes","name":"takerFeeAssetData","type":"bytes"}],"internalType":"struct LibOrder.Order[]","name":"orders","type":"tuple[]"},{"internalType":"uint256[]","name":"takerAssetFillAmounts","type":"uint256[]"},{"internalType":"bytes[]","name":"signatures","type":"bytes[]"}],"name":"batchFillOrKillOrders","outputs":[{"components":[{"internalType":"uint256","name":"makerAssetFilledAmount","type":"uint256"},{"internalType":"uint256","name":"takerAssetFilledAmount","type":"uint256"},{"internalType":"uint256","name":"makerFeePaid","type":"uint256"},{"internalType":"uint256","name":"takerFeePaid","type":"uint256"},{"internalType":"uint256","name":"protocolFeePaid","type":"uint256"}],"internalType":"struct LibFillResults.FillResults[]","name":"fillResults","type":"tuple[]"}],"payable":true,"stateMutability":"payable","type":"function"},{"constant":false,"inputs":[{"components":[{"internalType":"address","name":"makerAddress","type":"address"},{"internalType":"address","name":"takerAddress","type":"address"},{"internalType":"address","name":"feeRecipientAddress","type":"address"},{"internalType":"address","name":"senderAddress","type":"address"},{"internalType":"uint256","name":"makerAssetAmount","type":"uint256"},{"internalType":"uint256","name":"takerAssetAmount","type":"uint256"},{"internalType":"uint256","name":"makerFee","type":"uint256"},{"internalType":"uint256","name":"takerFee","type":"uint256"},{"internalType":"uint256","name":"expirationTimeSeconds","type":"uint256"},{"internalType":"uint256","name":"salt","type":"uint256"},{"internalType":"bytes","name":"makerAssetData","type":"bytes"},{"internalType":"bytes","name":"takerAssetData","type":"bytes"},{"internalType":"bytes","name":"makerFeeAssetData","type":"bytes"},{"internalType":"bytes","name":"takerFeeAssetData","type":"bytes"}],"internalType":"struct LibOrder.Order[]","name":"orders","type":"tuple[]"},{"internalType":"uint256[]","name":"takerAssetFillAmounts","type":"uint256[]"},{"internalType":"bytes[]","name":"signatures","type":"bytes[]"}],"name":"batchFillOrders","outputs":[{"components":[{"internalType":"uint256","name":"makerAssetFilledAmount","type":"uint256"},{"internalType":"uint256","name":"takerAssetFilledAmount","type":"uint256"},{"internalType":"uint256","name":"makerFeePaid","type":"uint256"},{"internalType":"uint256","name":"takerFeePaid","type":"uint256"},{"internalType":"uint256","name":"protocolFeePaid","type":"uint256"}],"internalType":"struct LibFillResults.FillResults[]","name":"fillResults","type":"tuple[]"}],"payable":true,"stateMutability":"payable","type":"function"},{"constant":false,"inputs":[{"components":[{"internalType":"address","name":"makerAddress","type":"address"},{"internalType":"address","name":"takerAddress","type":"address"},{"internalType":"address","name":"feeRecipientAddress","type":"address"},{"internalType":"address","name":"senderAddress","type":"address"},{"internalType":"uint256","name":"makerAssetAmount","type":"uint256"},{"internalType":"uint256","name":"takerAssetAmount","type":"uint256"},{"internalType":"uint256","name":"makerFee","type":"uint256"},{"internalType":"uint256","name":"takerFee","type":"uint256"},{"internalType":"uint256","name":"expirationTimeSeconds","type":"uint256"},{"internalType":"uint256","name":"salt","type":"uint256"},{"internalType":"bytes","name":"makerAssetData","type":"bytes"},{"internalType":"bytes","name":"takerAssetData","type":"bytes"},{"internalType":"bytes","name":"makerFeeAssetData","type":"bytes"},{"internalType":"bytes","name":"takerFeeAssetData","type":"bytes"}],"internalType":"struct LibOrder.Order[]","name":"orders","type":"tuple[]"},{"internalType":"uint256[]","name":"takerAssetFillAmounts","type":"uint256[]"},{"internalType":"bytes[]","name":"signatures","type":"bytes[]"}],"name":"batchFillOrdersNoThrow","outputs":[{"components":[{"internalType":"uint256","name":"makerAssetFilledAmount","type":"uint256"},{"internalType":"uint256","name":"takerAssetFilledAmount","type":"uint256"},{"internalType":"uint256","name":"makerFeePaid","type":"uint256"},{"internalType":"uint256","name":"takerFeePaid","type":"uint256"},{"internalType":"uint256","name":"protocolFeePaid","type":"uint256"}],"internalType":"struct LibFillResults.FillResults[]","name":"fillResults","type":"tuple[]"}],"payable":true,"stateMutability":"payable","type":"function"},{"constant":false,"inputs":[{"components":[{"internalType":"address","name":"makerAddress","type":"address"},{"internalType":"address","name":"takerAddress","type":"address"},{"internalType":"address","name":"feeRecipientAddress","type":"address"},{"internalType":"address","name":"senderAddress","type":"address"},{"internalType":"uint256","name":"makerAssetAmount","type":"uint256"},{"internalType":"uint256","name":"takerAssetAmount","type":"uint256"},{"internalType":"uint256","name":"makerFee","type":"uint256"},{"internalType":"uint256","name":"takerFee","type":"uint256"},{"internalType":"uint256","name":"expirationTimeSeconds","type":"uint256"},{"internalType":"uint256","name":"salt","type":"uint256"},{"internalType":"bytes","name":"makerAssetData","type":"bytes"},{"internalType":"bytes","name":"takerAssetData","type":"bytes"},{"internalType":"bytes","name":"makerFeeAssetData","type":"bytes"},{"internalType":"bytes","name":"takerFeeAssetData","type":"bytes"}],"internalType":"struct LibOrder.Order[]","name":"leftOrders","type":"tuple[]"},{"components":[{"internalType":"address","name":"makerAddress","type":"address"},{"internalType":"address","name":"takerAddress","type":"address"},{"internalType":"address","name":"feeRecipientAddress","type":"address"},{"internalType":"address","name":"senderAddress","type":"address"},{"internalType":"uint256","name":"makerAssetAmount","type":"uint256"},{"internalType":"uint256","name":"takerAssetAmount","type":"uint256"},{"internalType":"uint256","name":"makerFee","type":"uint256"},{"internalType":"uint256","name":"takerFee","type":"uint256"},{"internalType":"uint256","name":"expirationTimeSeconds","type":"uint256"},{"internalType":"uint256","name":"salt","type":"uint256"},{"internalType":"bytes","name":"makerAssetData","type":"bytes"},{"internalType":"bytes","name":"takerAssetData","type":"bytes"},{"internalType":"bytes","name":"makerFeeAssetData","type":"bytes"},{"internalType":"bytes","name":"takerFeeAssetData","type":"bytes"}],"internalType":"struct LibOrder.Order[]","name":"rightOrders","type":"tuple[]"},{"internalType":"bytes[]","name":"leftSignatures","type":"bytes[]"},{"internalType":"bytes[]","name":"rightSignatures","type":"bytes[]"}],"name":"batchMatchOrders","outputs":[{"components":[{"components":[{"internalType":"uint256","name":"makerAssetFilledAmount","type":"uint256"},{"internalType":"uint256","name":"takerAssetFilledAmount","type":"uint256"},{"internalType":"uint256","name":"makerFeePaid","type":"uint256"},{"internalType":"uint256","name":"takerFeePaid","type":"uint256"},{"internalType":"uint256","name":"protocolFeePaid","type":"uint256"}],"internalType":"struct LibFillResults.FillResults[]","name":"left","type":"tuple[]"},{"components":[{"internalType":"uint256","name":"makerAssetFilledAmount","type":"uint256"},{"internalType":"uint256","name":"takerAssetFilledAmount","type":"uint256"},{"internalType":"uint256","name":"makerFeePaid","type":"uint256"},{"internalType":"uint256","name":"takerFeePaid","type":"uint256"},{"internalType":"uint256","name":"protocolFeePaid","type":"uint256"}],"internalType":"struct LibFillResults.FillResults[]","name":"right","type":"tuple[]"},{"internalType":"uint256","name":"profitInLeftMakerAsset","type":"uint256"},{"internalType":"uint256","name":"profitInRightMakerAsset","type":"uint256"}],"internalType":"struct LibFillResults.BatchMatchedFillResults","name":"batchMatchedFillResults","type":"tuple"}],"payable":true,"stateMutability":"payable","type":"function"},{"constant":false,"inputs":[{"components":[{"internalType":"address","name":"makerAddress","type":"address"},{"internalType":"address","name":"takerAddress","type":"address"},{"internalType":"address","name":"feeRecipientAddress","type":"address"},{"internalType":"address","name":"senderAddress","type":"address"},{"internalType":"uint256","name":"makerAssetAmount","type":"uint256"},{"internalType":"uint256","name":"takerAssetAmount","type":"uint256"},{"internalType":"uint256","name":"makerFee","type":"uint256"},{"internalType":"uint256","name":"takerFee","type":"uint256"},{"internalType":"uint256","name":"expirationTimeSeconds","type":"uint256"},{"internalType":"uint256","name":"salt","type":"uint256"},{"internalType":"bytes","name":"makerAssetData","type":"bytes"},{"internalType":"bytes","name":"takerAssetData","type":"bytes"},{"internalType":"bytes","name":"makerFeeAssetData","type":"bytes"},{"internalType":"bytes","name":"takerFeeAssetData","type":"bytes"}],"internalType":"struct LibOrder.Order[]","name":"leftOrders","type":"tuple[]"},{"components":[{"internalType":"address","name":"makerAddress","type":"address"},{"internalType":"address","name":"takerAddress","type":"address"},{"internalType":"address","name":"feeRecipientAddress","type":"address"},{"internalType":"address","name":"senderAddress","type":"address"},{"internalType":"uint256","name":"makerAssetAmount","type":"uint256"},{"internalType":"uint256","name":"takerAssetAmount","type":"uint256"},{"internalType":"uint256","name":"makerFee","type":"uint256"},{"internalType":"uint256","name":"takerFee","type":"uint256"},{"internalType":"uint256","name":"expirationTimeSeconds","type":"uint256"},{"internalType":"uint256","name":"salt","type":"uint256"},{"internalType":"bytes","name":"makerAssetData","type":"bytes"},{"internalType":"bytes","name":"takerAssetData","type":"bytes"},{"internalType":"bytes","name":"makerFeeAssetData","type":"bytes"},{"internalType":"bytes","name":"takerFeeAssetData","type":"bytes"}],"internalType":"struct LibOrder.Order[]","name":"rightOrders","type":"tuple[]"},{"internalType":"bytes[]","name":"leftSignatures","type":"bytes[]"},{"internalType":"bytes[]","name":"rightSignatures","type":"bytes[]"}],"name":"batchMatchOrdersWithMaximalFill","outputs":[{"components":[{"components":[{"internalType":"uint256","name":"makerAssetFilledAmount","type":"uint256"},{"internalType":"uint256","name":"takerAssetFilledAmount","type":"uint256"},{"internalType":"uint256","name":"makerFeePaid","type":"uint256"},{"internalType":"uint256","name":"takerFeePaid","type":"uint256"},{"internalType":"uint256","name":"protocolFeePaid","type":"uint256"}],"internalType":"struct LibFillResults.FillResults[]","name":"left","type":"tuple[]"},{"components":[{"internalType":"uint256","name":"makerAssetFilledAmount","type":"uint256"},{"internalType":"uint256","name":"takerAssetFilledAmount","type":"uint256"},{"internalType":"uint256","name":"makerFeePaid","type":"uint256"},{"internalType":"uint256","name":"takerFeePaid","type":"uint256"},{"internalType":"uint256","name":"protocolFeePaid","type":"uint256"}],"internalType":"struct LibFillResults.FillResults[]","name":"right","type":"tuple[]"},{"internalType":"uint256","name":"profitInLeftMakerAsset","type":"uint256"},{"internalType":"uint256","name":"profitInRightMakerAsset","type":"uint256"}],"internalType":"struct LibFillResults.BatchMatchedFillResults","name":"batchMatchedFillResults","type":"tuple"}],"payable":true,"stateMutability":"payable","type":"function"},{"constant":false,"inputs":[{"components":[{"internalType":"address","name":"makerAddress","type":"address"},{"internalType":"address","name":"takerAddress","type":"address"},{"internalType":"address","name":"feeRecipientAddress","type":"address"},{"internalType":"address","name":"senderAddress","type":"address"},{"internalType":"uint256","name":"makerAssetAmount","type":"uint256"},{"internalType":"uint256","name":"takerAssetAmount","type":"uint256"},{"internalType":"uint256","name":"makerFee","type":"uint256"},{"internalType":"uint256","name":"takerFee","type":"uint256"},{"internalType":"uint256","name":"expirationTimeSeconds","type":"uint256"},{"internalType":"uint256","name":"salt","type":"uint256"},{"internalType":"bytes","name":"makerAssetData","type":"bytes"},{"internalType":"bytes","name":"takerAssetData","type":"bytes"},{"internalType":"bytes","name":"makerFeeAssetData","type":"bytes"},{"internalType":"bytes","name":"takerFeeAssetData","type":"bytes"}],"internalType":"struct LibOrder.Order","name":"order","type":"tuple"}],"name":"cancelOrder","outputs":[],"payable":true,"stateMutability":"payable","type":"function"},{"constant":false,"inputs":[{"internalType":"uint256","name":"targetOrderEpoch","type":"uint256"}],"name":"cancelOrdersUpTo","outputs":[],"payable":true,"stateMutability":"payable","type":"function"},{"constant":true,"inputs":[{"internalType":"bytes32","name":"","type":"bytes32"}],"name":"cancelled","outputs":[{"internalType":"bool","name":"","type":"bool"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":true,"inputs":[],"name":"currentContextAddress","outputs":[{"internalType":"address","name":"","type":"address"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":false,"inputs":[],"name":"detachProtocolFeeCollector","outputs":[],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":false,"inputs":[{"components":[{"internalType":"uint256","name":"salt","type":"uint256"},{"internalType":"uint256","name":"expirationTimeSeconds","type":"uint256"},{"internalType":"uint256","name":"gasPrice","type":"uint256"},{"internalType":"address","name":"signerAddress","type":"address"},{"internalType":"bytes","name":"data","type":"bytes"}],"internalType":"struct LibZeroExTransaction.ZeroExTransaction","name":"transaction","type":"tuple"},{"internalType":"bytes","name":"signature","type":"bytes"}],"name":"executeTransaction","outputs":[{"internalType":"bytes","name":"","type":"bytes"}],"payable":true,"stateMutability":"payable","type":"function"},{"constant":false,"inputs":[{"components":[{"internalType":"address","name":"makerAddress","type":"address"},{"internalType":"address","name":"takerAddress","type":"address"},{"internalType":"address","name":"feeRecipientAddress","type":"address"},{"internalType":"address","name":"senderAddress","type":"address"},{"internalType":"uint256","name":"makerAssetAmount","type":"uint256"},{"internalType":"uint256","name":"takerAssetAmount","type":"uint256"},{"internalType":"uint256","name":"makerFee","type":"uint256"},{"internalType":"uint256","name":"takerFee","type":"uint256"},{"internalType":"uint256","name":"expirationTimeSeconds","type":"uint256"},{"internalType":"uint256","name":"salt","type":"uint256"},{"internalType":"bytes","name":"makerAssetData","type":"bytes"},{"internalType":"bytes","name":"takerAssetData","type":"bytes"},{"internalType":"bytes","name":"makerFeeAssetData","type":"bytes"},{"internalType":"bytes","name":"takerFeeAssetData","type":"bytes"}],"internalType":"struct LibOrder.Order","name":"order","type":"tuple"},{"internalType":"uint256","name":"takerAssetFillAmount","type":"uint256"},{"internalType":"bytes","name":"signature","type":"bytes"}],"name":"fillOrKillOrder","outputs":[{"components":[{"internalType":"uint256","name":"makerAssetFilledAmount","type":"uint256"},{"internalType":"uint256","name":"takerAssetFilledAmount","type":"uint256"},{"internalType":"uint256","name":"makerFeePaid","type":"uint256"},{"internalType":"uint256","name":"takerFeePaid","type":"uint256"},{"internalType":"uint256","name":"protocolFeePaid","type":"uint256"}],"internalType":"struct LibFillResults.FillResults","name":"fillResults","type":"tuple"}],"payable":true,"stateMutability":"payable","type":"function"},{"constant":false,"inputs":[{"components":[{"internalType":"address","name":"makerAddress","type":"address"},{"internalType":"address","name":"takerAddress","type":"address"},{"internalType":"address","name":"feeRecipientAddress","type":"address"},{"internalType":"address","name":"senderAddress","type":"address"},{"internalType":"uint256","name":"makerAssetAmount","type":"uint256"},{"internalType":"uint256","name":"takerAssetAmount","type":"uint256"},{"internalType":"uint256","name":"makerFee","type":"uint256"},{"internalType":"uint256","name":"takerFee","type":"uint256"},{"internalType":"uint256","name":"expirationTimeSeconds","type":"uint256"},{"internalType":"uint256","name":"salt","type":"uint256"},{"internalType":"bytes","name":"makerAssetData","type":"bytes"},{"internalType":"bytes","name":"takerAssetData","type":"bytes"},{"internalType":"bytes","name":"makerFeeAssetData","type":"bytes"},{"internalType":"bytes","name":"takerFeeAssetData","type":"bytes"}],"internalType":"struct LibOrder.Order","name":"order","type":"tuple"},{"internalType":"uint256","name":"takerAssetFillAmount","type":"uint256"},{"internalType":"bytes","name":"signature","type":"bytes"}],"name":"fillOrder","outputs":[{"components":[{"internalType":"uint256","name":"makerAssetFilledAmount","type":"uint256"},{"internalType":"uint256","name":"takerAssetFilledAmount","type":"uint256"},{"internalType":"uint256","name":"makerFeePaid","type":"uint256"},{"internalType":"uint256","name":"takerFeePaid","type":"uint256"},{"internalType":"uint256","name":"protocolFeePaid","type":"uint256"}],"internalType":"struct LibFillResults.FillResults","name":"fillResults","type":"tuple"}],"payable":true,"stateMutability":"payable","type":"function"},{"constant":true,"inputs":[{"internalType":"bytes32","name":"","type":"bytes32"}],"name":"filled","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":true,"inputs":[{"internalType":"bytes4","name":"assetProxyId","type":"bytes4"}],"name":"getAssetProxy","outputs":[{"internalType":"address","name":"","type":"address"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":true,"inputs":[{"components":[{"internalType":"address","name":"makerAddress","type":"address"},{"internalType":"address","name":"takerAddress","type":"address"},{"internalType":"address","name":"feeRecipientAddress","type":"address"},{"internalType":"address","name":"senderAddress","type":"address"},{"internalType":"uint256","name":"makerAssetAmount","type":"uint256"},{"internalType":"uint256","name":"takerAssetAmount","type":"uint256"},{"internalType":"uint256","name":"makerFee","type":"uint256"},{"internalType":"uint256","name":"takerFee","type":"uint256"},{"internalType":"uint256","name":"expirationTimeSeconds","type":"uint256"},{"internalType":"uint256","name":"salt","type":"uint256"},{"internalType":"bytes","name":"makerAssetData","type":"bytes"},{"internalType":"bytes","name":"takerAssetData","type":"bytes"},{"internalType":"bytes","name":"makerFeeAssetData","type":"bytes"},{"internalType":"bytes","name":"takerFeeAssetData","type":"bytes"}],"internalType":"struct LibOrder.Order","name":"order","type":"tuple"}],"name":"getOrderInfo","outputs":[{"components":[{"internalType":"uint8","name":"orderStatus","type":"uint8"},{"internalType":"bytes32","name":"orderHash","type":"bytes32"},{"internalType":"uint256","name":"orderTakerAssetFilledAmount","type":"uint256"}],"internalType":"struct LibOrder.OrderInfo","name":"orderInfo","type":"tuple"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":true,"inputs":[{"internalType":"bytes32","name":"hash","type":"bytes32"},{"internalType":"address","name":"signerAddress","type":"address"},{"internalType":"bytes","name":"signature","type":"bytes"}],"name":"isValidHashSignature","outputs":[{"internalType":"bool","name":"isValid","type":"bool"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":true,"inputs":[{"components":[{"internalType":"address","name":"makerAddress","type":"address"},{"internalType":"address","name":"takerAddress","type":"address"},{"internalType":"address","name":"feeRecipientAddress","type":"address"},{"internalType":"address","name":"senderAddress","type":"address"},{"internalType":"uint256","name":"makerAssetAmount","type":"uint256"},{"internalType":"uint256","name":"takerAssetAmount","type":"uint256"},{"internalType":"uint256","name":"makerFee","type":"uint256"},{"internalType":"uint256","name":"takerFee","type":"uint256"},{"internalType":"uint256","name":"expirationTimeSeconds","type":"uint256"},{"internalType":"uint256","name":"salt","type":"uint256"},{"internalType":"bytes","name":"makerAssetData","type":"bytes"},{"internalType":"bytes","name":"takerAssetData","type":"bytes"},{"internalType":"bytes","name":"makerFeeAssetData","type":"bytes"},{"internalType":"bytes","name":"takerFeeAssetData","type":"bytes"}],"internalType":"struct LibOrder.Order","name":"order","type":"tuple"},{"internalType":"bytes","name":"signature","type":"bytes"}],"name":"isValidOrderSignature","outputs":[{"internalType":"bool","name":"isValid","type":"bool"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":true,"inputs":[{"components":[{"internalType":"uint256","name":"salt","type":"uint256"},{"internalType":"uint256","name":"expirationTimeSeconds","type":"uint256"},{"internalType":"uint256","name":"gasPrice","type":"uint256"},{"internalType":"address","name":"signerAddress","type":"address"},{"internalType":"bytes","name":"data","type":"bytes"}],"internalType":"struct LibZeroExTransaction.ZeroExTransaction","name":"transaction","type":"tuple"},{"internalType":"bytes","name":"signature","type":"bytes"}],"name":"isValidTransactionSignature","outputs":[{"internalType":"bool","name":"isValid","type":"bool"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":false,"inputs":[{"components":[{"internalType":"address","name":"makerAddress","type":"address"},{"internalType":"address","name":"takerAddress","type":"address"},{"internalType":"address","name":"feeRecipientAddress","type":"address"},{"internalType":"address","name":"senderAddress","type":"address"},{"internalType":"uint256","name":"makerAssetAmount","type":"uint256"},{"internalType":"uint256","name":"takerAssetAmount","type":"uint256"},{"internalType":"uint256","name":"makerFee","type":"uint256"},{"internalType":"uint256","name":"takerFee","type":"uint256"},{"internalType":"uint256","name":"expirationTimeSeconds","type":"uint256"},{"internalType":"uint256","name":"salt","type":"uint256"},{"internalType":"bytes","name":"makerAssetData","type":"bytes"},{"internalType":"bytes","name":"takerAssetData","type":"bytes"},{"internalType":"bytes","name":"makerFeeAssetData","type":"bytes"},{"internalType":"bytes","name":"takerFeeAssetData","type":"bytes"}],"internalType":"struct LibOrder.Order[]","name":"orders","type":"tuple[]"},{"internalType":"uint256","name":"makerAssetFillAmount","type":"uint256"},{"internalType":"bytes[]","name":"signatures","type":"bytes[]"}],"name":"marketBuyOrdersFillOrKill","outputs":[{"components":[{"internalType":"uint256","name":"makerAssetFilledAmount","type":"uint256"},{"internalType":"uint256","name":"takerAssetFilledAmount","type":"uint256"},{"internalType":"uint256","name":"makerFeePaid","type":"uint256"},{"internalType":"uint256","name":"takerFeePaid","type":"uint256"},{"internalType":"uint256","name":"protocolFeePaid","type":"uint256"}],"internalType":"struct LibFillResults.FillResults","name":"fillResults","type":"tuple"}],"payable":true,"stateMutability":"payable","type":"function"},{"constant":false,"inputs":[{"components":[{"internalType":"address","name":"makerAddress","type":"address"},{"internalType":"address","name":"takerAddress","type":"address"},{"internalType":"address","name":"feeRecipientAddress","type":"address"},{"internalType":"address","name":"senderAddress","type":"address"},{"internalType":"uint256","name":"makerAssetAmount","type":"uint256"},{"internalType":"uint256","name":"takerAssetAmount","type":"uint256"},{"internalType":"uint256","name":"makerFee","type":"uint256"},{"internalType":"uint256","name":"takerFee","type":"uint256"},{"internalType":"uint256","name":"expirationTimeSeconds","type":"uint256"},{"internalType":"uint256","name":"salt","type":"uint256"},{"internalType":"bytes","name":"makerAssetData","type":"bytes"},{"internalType":"bytes","name":"takerAssetData","type":"bytes"},{"internalType":"bytes","name":"makerFeeAssetData","type":"bytes"},{"internalType":"bytes","name":"takerFeeAssetData","type":"bytes"}],"internalType":"struct LibOrder.Order[]","name":"orders","type":"tuple[]"},{"internalType":"uint256","name":"makerAssetFillAmount","type":"uint256"},{"internalType":"bytes[]","name":"signatures","type":"bytes[]"}],"name":"marketBuyOrdersNoThrow","outputs":[{"components":[{"internalType":"uint256","name":"makerAssetFilledAmount","type":"uint256"},{"internalType":"uint256","name":"takerAssetFilledAmount","type":"uint256"},{"internalType":"uint256","name":"makerFeePaid","type":"uint256"},{"internalType":"uint256","name":"takerFeePaid","type":"uint256"},{"internalType":"uint256","name":"protocolFeePaid","type":"uint256"}],"internalType":"struct LibFillResults.FillResults","name":"fillResults","type":"tuple"}],"payable":true,"stateMutability":"payable","type":"function"},{"constant":false,"inputs":[{"components":[{"internalType":"address","name":"makerAddress","type":"address"},{"internalType":"address","name":"takerAddress","type":"address"},{"internalType":"address","name":"feeRecipientAddress","type":"address"},{"internalType":"address","name":"senderAddress","type":"address"},{"internalType":"uint256","name":"makerAssetAmount","type":"uint256"},{"internalType":"uint256","name":"takerAssetAmount","type":"uint256"},{"internalType":"uint256","name":"makerFee","type":"uint256"},{"internalType":"uint256","name":"takerFee","type":"uint256"},{"internalType":"uint256","name":"expirationTimeSeconds","type":"uint256"},{"internalType":"uint256","name":"salt","type":"uint256"},{"internalType":"bytes","name":"makerAssetData","type":"bytes"},{"internalType":"bytes","name":"takerAssetData","type":"bytes"},{"internalType":"bytes","name":"makerFeeAssetData","type":"bytes"},{"internalType":"bytes","name":"takerFeeAssetData","type":"bytes"}],"internalType":"struct LibOrder.Order[]","name":"orders","type":"tuple[]"},{"internalType":"uint256","name":"takerAssetFillAmount","type":"uint256"},{"internalType":"bytes[]","name":"signatures","type":"bytes[]"}],"name":"marketSellOrdersFillOrKill","outputs":[{"components":[{"internalType":"uint256","name":"makerAssetFilledAmount","type":"uint256"},{"internalType":"uint256","name":"takerAssetFilledAmount","type":"uint256"},{"internalType":"uint256","name":"makerFeePaid","type":"uint256"},{"internalType":"uint256","name":"takerFeePaid","type":"uint256"},{"internalType":"uint256","name":"protocolFeePaid","type":"uint256"}],"internalType":"struct LibFillResults.FillResults","name":"fillResults","type":"tuple"}],"payable":true,"stateMutability":"payable","type":"function"},{"constant":false,"inputs":[{"components":[{"internalType":"address","name":"makerAddress","type":"address"},{"internalType":"address","name":"takerAddress","type":"address"},{"internalType":"address","name":"feeRecipientAddress","type":"address"},{"internalType":"address","name":"senderAddress","type":"address"},{"internalType":"uint256","name":"makerAssetAmount","type":"uint256"},{"internalType":"uint256","name":"takerAssetAmount","type":"uint256"},{"internalType":"uint256","name":"makerFee","type":"uint256"},{"internalType":"uint256","name":"takerFee","type":"uint256"},{"internalType":"uint256","name":"expirationTimeSeconds","type":"uint256"},{"internalType":"uint256","name":"salt","type":"uint256"},{"internalType":"bytes","name":"makerAssetData","type":"bytes"},{"internalType":"bytes","name":"takerAssetData","type":"bytes"},{"internalType":"bytes","name":"makerFeeAssetData","type":"bytes"},{"internalType":"bytes","name":"takerFeeAssetData","type":"bytes"}],"internalType":"struct LibOrder.Order[]","name":"orders","type":"tuple[]"},{"internalType":"uint256","name":"takerAssetFillAmount","type":"uint256"},{"internalType":"bytes[]","name":"signatures","type":"bytes[]"}],"name":"marketSellOrdersNoThrow","outputs":[{"components":[{"internalType":"uint256","name":"makerAssetFilledAmount","type":"uint256"},{"internalType":"uint256","name":"takerAssetFilledAmount","type":"uint256"},{"internalType":"uint256","name":"makerFeePaid","type":"uint256"},{"internalType":"uint256","name":"takerFeePaid","type":"uint256"},{"internalType":"uint256","name":"protocolFeePaid","type":"uint256"}],"internalType":"struct LibFillResults.FillResults","name":"fillResults","type":"tuple"}],"payable":true,"stateMutability":"payable","type":"function"},{"constant":false,"inputs":[{"components":[{"internalType":"address","name":"makerAddress","type":"address"},{"internalType":"address","name":"takerAddress","type":"address"},{"internalType":"address","name":"feeRecipientAddress","type":"address"},{"internalType":"address","name":"senderAddress","type":"address"},{"internalType":"uint256","name":"makerAssetAmount","type":"uint256"},{"internalType":"uint256","name":"takerAssetAmount","type":"uint256"},{"internalType":"uint256","name":"makerFee","type":"uint256"},{"internalType":"uint256","name":"takerFee","type":"uint256"},{"internalType":"uint256","name":"expirationTimeSeconds","type":"uint256"},{"internalType":"uint256","name":"salt","type":"uint256"},{"internalType":"bytes","name":"makerAssetData","type":"bytes"},{"internalType":"bytes","name":"takerAssetData","type":"bytes"},{"internalType":"bytes","name":"makerFeeAssetData","type":"bytes"},{"internalType":"bytes","name":"takerFeeAssetData","type":"bytes"}],"internalType":"struct LibOrder.Order","name":"leftOrder","type":"tuple"},{"components":[{"internalType":"address","name":"makerAddress","type":"address"},{"internalType":"address","name":"takerAddress","type":"address"},{"internalType":"address","name":"feeRecipientAddress","type":"address"},{"internalType":"address","name":"senderAddress","type":"address"},{"internalType":"uint256","name":"makerAssetAmount","type":"uint256"},{"internalType":"uint256","name":"takerAssetAmount","type":"uint256"},{"internalType":"uint256","name":"makerFee","type":"uint256"},{"internalType":"uint256","name":"takerFee","type":"uint256"},{"internalType":"uint256","name":"expirationTimeSeconds","type":"uint256"},{"internalType":"uint256","name":"salt","type":"uint256"},{"internalType":"bytes","name":"makerAssetData","type":"bytes"},{"internalType":"bytes","name":"takerAssetData","type":"bytes"},{"internalType":"bytes","name":"makerFeeAssetData","type":"bytes"},{"internalType":"bytes","name":"takerFeeAssetData","type":"bytes"}],"internalType":"struct LibOrder.Order","name":"rightOrder","type":"tuple"},{"internalType":"bytes","name":"leftSignature","type":"bytes"},{"internalType":"bytes","name":"rightSignature","type":"bytes"}],"name":"matchOrders","outputs":[{"components":[{"components":[{"internalType":"uint256","name":"makerAssetFilledAmount","type":"uint256"},{"internalType":"uint256","name":"takerAssetFilledAmount","type":"uint256"},{"internalType":"uint256","name":"makerFeePaid","type":"uint256"},{"internalType":"uint256","name":"takerFeePaid","type":"uint256"},{"internalType":"uint256","name":"protocolFeePaid","type":"uint256"}],"internalType":"struct LibFillResults.FillResults","name":"left","type":"tuple"},{"components":[{"internalType":"uint256","name":"makerAssetFilledAmount","type":"uint256"},{"internalType":"uint256","name":"takerAssetFilledAmount","type":"uint256"},{"internalType":"uint256","name":"makerFeePaid","type":"uint256"},{"internalType":"uint256","name":"takerFeePaid","type":"uint256"},{"internalType":"uint256","name":"protocolFeePaid","type":"uint256"}],"internalType":"struct LibFillResults.FillResults","name":"right","type":"tuple"},{"internalType":"uint256","name":"profitInLeftMakerAsset","type":"uint256"},{"internalType":"uint256","name":"profitInRightMakerAsset","type":"uint256"}],"internalType":"struct LibFillResults.MatchedFillResults","name":"matchedFillResults","type":"tuple"}],"payable":true,"stateMutability":"payable","type":"function"},{"constant":false,"inputs":[{"components":[{"internalType":"address","name":"makerAddress","type":"address"},{"internalType":"address","name":"takerAddress","type":"address"},{"internalType":"address","name":"feeRecipientAddress","type":"address"},{"internalType":"address","name":"senderAddress","type":"address"},{"internalType":"uint256","name":"makerAssetAmount","type":"uint256"},{"internalType":"uint256","name":"takerAssetAmount","type":"uint256"},{"internalType":"uint256","name":"makerFee","type":"uint256"},{"internalType":"uint256","name":"takerFee","type":"uint256"},{"internalType":"uint256","name":"expirationTimeSeconds","type":"uint256"},{"internalType":"uint256","name":"salt","type":"uint256"},{"internalType":"bytes","name":"makerAssetData","type":"bytes"},{"internalType":"bytes","name":"takerAssetData","type":"bytes"},{"internalType":"bytes","name":"makerFeeAssetData","type":"bytes"},{"internalType":"bytes","name":"takerFeeAssetData","type":"bytes"}],"internalType":"struct LibOrder.Order","name":"leftOrder","type":"tuple"},{"components":[{"internalType":"address","name":"makerAddress","type":"address"},{"internalType":"address","name":"takerAddress","type":"address"},{"internalType":"address","name":"feeRecipientAddress","type":"address"},{"internalType":"address","name":"senderAddress","type":"address"},{"internalType":"uint256","name":"makerAssetAmount","type":"uint256"},{"internalType":"uint256","name":"takerAssetAmount","type":"uint256"},{"internalType":"uint256","name":"makerFee","type":"uint256"},{"internalType":"uint256","name":"takerFee","type":"uint256"},{"internalType":"uint256","name":"expirationTimeSeconds","type":"uint256"},{"internalType":"uint256","name":"salt","type":"uint256"},{"internalType":"bytes","name":"makerAssetData","type":"bytes"},{"internalType":"bytes","name":"takerAssetData","type":"bytes"},{"internalType":"bytes","name":"makerFeeAssetData","type":"bytes"},{"internalType":"bytes","name":"takerFeeAssetData","type":"bytes"}],"internalType":"struct LibOrder.Order","name":"rightOrder","type":"tuple"},{"internalType":"bytes","name":"leftSignature","type":"bytes"},{"internalType":"bytes","name":"rightSignature","type":"bytes"}],"name":"matchOrdersWithMaximalFill","outputs":[{"components":[{"components":[{"internalType":"uint256","name":"makerAssetFilledAmount","type":"uint256"},{"internalType":"uint256","name":"takerAssetFilledAmount","type":"uint256"},{"internalType":"uint256","name":"makerFeePaid","type":"uint256"},{"internalType":"uint256","name":"takerFeePaid","type":"uint256"},{"internalType":"uint256","name":"protocolFeePaid","type":"uint256"}],"internalType":"struct LibFillResults.FillResults","name":"left","type":"tuple"},{"components":[{"internalType":"uint256","name":"makerAssetFilledAmount","type":"uint256"},{"internalType":"uint256","name":"takerAssetFilledAmount","type":"uint256"},{"internalType":"uint256","name":"makerFeePaid","type":"uint256"},{"internalType":"uint256","name":"takerFeePaid","type":"uint256"},{"internalType":"uint256","name":"protocolFeePaid","type":"uint256"}],"internalType":"struct LibFillResults.FillResults","name":"right","type":"tuple"},{"internalType":"uint256","name":"profitInLeftMakerAsset","type":"uint256"},{"internalType":"uint256","name":"profitInRightMakerAsset","type":"uint256"}],"internalType":"struct LibFillResults.MatchedFillResults","name":"matchedFillResults","type":"tuple"}],"payable":true,"stateMutability":"payable","type":"function"},{"constant":true,"inputs":[{"internalType":"address","name":"","type":"address"},{"internalType":"address","name":"","type":"address"}],"name":"orderEpoch","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":true,"inputs":[],"name":"owner","outputs":[{"internalType":"address","name":"","type":"address"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":false,"inputs":[{"internalType":"bytes32","name":"hash","type":"bytes32"}],"name":"preSign","outputs":[],"payable":true,"stateMutability":"payable","type":"function"},{"constant":true,"inputs":[{"internalType":"bytes32","name":"","type":"bytes32"},{"internalType":"address","name":"","type":"address"}],"name":"preSigned","outputs":[{"internalType":"bool","name":"","type":"bool"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":true,"inputs":[],"name":"protocolFeeCollector","outputs":[{"internalType":"address","name":"","type":"address"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":true,"inputs":[],"name":"protocolFeeMultiplier","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":false,"inputs":[{"internalType":"address","name":"assetProxy","type":"address"}],"name":"registerAssetProxy","outputs":[],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":false,"inputs":[{"internalType":"address","name":"updatedProtocolFeeCollector","type":"address"}],"name":"setProtocolFeeCollectorAddress","outputs":[],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":false,"inputs":[{"internalType":"uint256","name":"updatedProtocolFeeMultiplier","type":"uint256"}],"name":"setProtocolFeeMultiplier","outputs":[],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":false,"inputs":[{"internalType":"address","name":"validatorAddress","type":"address"},{"internalType":"bool","name":"approval","type":"bool"}],"name":"setSignatureValidatorApproval","outputs":[],"payable":true,"stateMutability":"payable","type":"function"},{"constant":false,"inputs":[{"internalType":"bytes[]","name":"assetData","type":"bytes[]"},{"internalType":"address[]","name":"fromAddresses","type":"address[]"},{"internalType":"address[]","name":"toAddresses","type":"address[]"},{"internalType":"uint256[]","name":"amounts","type":"uint256[]"}],"name":"simulateDispatchTransferFromCalls","outputs":[],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":true,"inputs":[{"internalType":"bytes32","name":"","type":"bytes32"}],"name":"transactionsExecuted","outputs":[{"internalType":"bool","name":"","type":"bool"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":false,"inputs":[{"internalType":"address","name":"newOwner","type":"address"}],"name":"transferOwnership","outputs":[],"payable":false,"stateMutability":"nonpayable","type":"function"}]
const zrxExchangeContract = new web3.eth.Contract(ZRX_EXCHANGE_ABI, ZRX_EXCHANGE_ADDRESS)

const TRADER_ABI = [{"constant":false,"inputs":[],"name":"getWeth","outputs":[],"payable":true,"stateMutability":"payable","type":"function"},{"constant":false,"inputs":[{"name":"_from","type":"address"},{"name":"_to","type":"address"},{"name":"_amount","type":"uint256"},{"name":"_minReturn","type":"uint256"},{"name":"_distribution","type":"uint256[]"}],"name":"oneSplitSwap","outputs":[],"payable":true,"stateMutability":"payable","type":"function"},{"constant":true,"inputs":[],"name":"SAI","outputs":[{"name":"","type":"address"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":true,"inputs":[{"name":"","type":"address"}],"name":"currencies","outputs":[{"name":"","type":"uint256"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":false,"inputs":[],"name":"withdrawEther","outputs":[],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":false,"inputs":[{"name":"_fromToken","type":"address"},{"name":"_toToken","type":"address"},{"name":"_fromAmount","type":"uint256"},{"name":"_0xData","type":"bytes"},{"name":"_1SplitMinReturn","type":"uint256"},{"name":"_1SplitDistribution","type":"uint256[]"}],"name":"trade","outputs":[],"payable":true,"stateMutability":"payable","type":"function"},{"constant":false,"inputs":[{"name":"_tokenAddress","type":"address"}],"name":"withdrawToken","outputs":[],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":true,"inputs":[],"name":"USDC","outputs":[{"name":"","type":"address"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":false,"inputs":[{"name":"","type":"address"},{"components":[{"name":"owner","type":"address"},{"name":"number","type":"uint256"}],"name":"","type":"tuple"},{"name":"data","type":"bytes"}],"name":"callFunction","outputs":[],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":true,"inputs":[],"name":"WETH","outputs":[{"name":"","type":"address"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":true,"inputs":[{"name":"token","type":"address"}],"name":"tokenToMarketId","outputs":[{"name":"","type":"uint256"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":false,"inputs":[{"name":"_from","type":"address"},{"name":"_amount","type":"uint256"},{"name":"_calldataHexString","type":"bytes"}],"name":"zrxSwap","outputs":[],"payable":true,"stateMutability":"payable","type":"function"},{"constant":true,"inputs":[],"name":"loan","outputs":[{"name":"","type":"uint256"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":false,"inputs":[{"name":"flashToken","type":"address"},{"name":"flashAmount","type":"uint256"},{"name":"arbToken","type":"address"},{"name":"zrxData","type":"bytes"},{"name":"oneSplitMinReturn","type":"uint256"},{"name":"oneSplitDistribution","type":"uint256[]"}],"name":"getFlashloan","outputs":[],"payable":true,"stateMutability":"payable","type":"function"},{"constant":false,"inputs":[{"name":"_amount","type":"uint256"}],"name":"approveWeth","outputs":[],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":false,"inputs":[{"name":"_fromToken","type":"address"},{"name":"_toToken","type":"address"},{"name":"_fromAmount","type":"uint256"},{"name":"_0xData","type":"bytes"},{"name":"_1SplitMinReturn","type":"uint256"},{"name":"_1SplitDistribution","type":"uint256[]"}],"name":"arb","outputs":[],"payable":true,"stateMutability":"payable","type":"function"},{"constant":true,"inputs":[],"name":"DAI","outputs":[{"name":"","type":"address"}],"payable":false,"stateMutability":"view","type":"function"},{"inputs":[],"payable":true,"stateMutability":"payable","type":"constructor"},{"payable":true,"stateMutability":"payable","type":"fallback"}]
const TRADER_ADDRESS = process.env.CONTRACT_ADDRESS

const traderContract = new web3.eth.Contract(TRADER_ABI, TRADER_ADDRESS);
const FILL_ORDER_ABI = {"constant":false,"inputs":[{"components":[{"internalType":"address","name":"makerAddress","type":"address"},{"internalType":"address","name":"takerAddress","type":"address"},{"internalType":"address","name":"feeRecipientAddress","type":"address"},{"internalType":"address","name":"senderAddress","type":"address"},{"internalType":"uint256","name":"makerAssetAmount","type":"uint256"},{"internalType":"uint256","name":"takerAssetAmount","type":"uint256"},{"internalType":"uint256","name":"makerFee","type":"uint256"},{"internalType":"uint256","name":"takerFee","type":"uint256"},{"internalType":"uint256","name":"expirationTimeSeconds","type":"uint256"},{"internalType":"uint256","name":"salt","type":"uint256"},{"internalType":"bytes","name":"makerAssetData","type":"bytes"},{"internalType":"bytes","name":"takerAssetData","type":"bytes"},{"internalType":"bytes","name":"makerFeeAssetData","type":"bytes"},{"internalType":"bytes","name":"takerFeeAssetData","type":"bytes"}],"internalType":"struct LibOrder.Order","name":"order","type":"tuple"},{"internalType":"uint256","name":"takerAssetFillAmount","type":"uint256"},{"internalType":"bytes","name":"signature","type":"bytes"}],"name":"fillOrder","outputs":[{"components":[{"internalType":"uint256","name":"makerAssetFilledAmount","type":"uint256"},{"internalType":"uint256","name":"takerAssetFilledAmount","type":"uint256"},{"internalType":"uint256","name":"makerFeePaid","type":"uint256"},{"internalType":"uint256","name":"takerFeePaid","type":"uint256"},{"internalType":"uint256","name":"protocolFeePaid","type":"uint256"}],"internalType":"struct LibFillResults.FillResults","name":"fillResults","type":"tuple"}],"payable":true,"stateMutability":"payable","type":"function"}


// ESCHANGE NAMES
const ZERO_X = '0x'
const ONE_SPLIT = '1Split'


// ASSET SYMBOLSSSET

const DAI = 'DAI'
const REP = 'REP'
const ETH = 'ETH'
const WETH = 'WETH'
const ZRX = 'ZRX'
const USDC = 'USDC'
const BAT = 'BAT'
const MKR = 'MKR'
const WBTC = 'WBTC'
const SNX = 'SNX'
const SUSD = 'SUSD'
const KNC = 'KNC'
const BNT = 'BNT'
const GNO = 'GNO'
const LINK = 'LINK'
const REN = 'REN'
const GNT = 'GNT'
const OMG = 'OMG'
const ANT = 'ANT'
const SAI = 'SAI'
const CVL = 'CVL'
const DTH = 'DTH'
const FOAM = 'FOAM'
const AST = 'AST'
const AION = 'AION'
const GEN = 'GEN'
const STORJ = 'STORJ'
const MANA = 'MANA'
const ENTRP = 'ENTRP'
const MLN = 'MLN'
const LOOM = 'LOOM'
const CELR = 'CELR'
const RLC = 'RLC'
const ICN = 'ICN'
const DGD = 'DGD'
const ZIL = 'ZIL'
const cBAT = 'cBAT'
const cDAI = 'cDAI'
const cSAI = 'cSAI'
const cETH = 'cETH'
const cREP = 'cREP'
const cUSDC = 'cUSDC'
const cZRX = 'cZRX'
const SNT = 'SNT'
const SPANK = 'SPANK'
const BOOTY = 'BOOTY'
const UBT = 'UBT'
const ICX = 'ICX'
const NMR = 'NMR'
const GUSD = 'GUSD'
const FUN = 'FUN'
const PAX = 'PAX'
const TUSD = 'TUSD'
const LPT = 'LPT'
const ENJ = 'ENJ'
const POWR = 'POWR'
const REQ = 'REQ'
const DNT = 'DNT'
const MATIC = 'MATIC'
const LRC = 'LRC'
const RDN = 'RDN'
const USDT = 'USDT'
const GST2 = 'GST2'
const COMP = 'COMP'
const UMA = 'UMA'
const BZRX = 'BZRX'
const renBTC = 'renBTC'
const BAL = 'BAL'
const LEND = 'LEND'
const AAVE = 'AAVE'
const YFI = 'YFI'
const AMPL = 'AMPL'
const KEEP = 'KEEP'
const mUSD = 'mUSD'
const bUSD = 'bUSD'
const CRV = 'CRV'
const SUSHI = 'SUSHI'
const swUSD = 'swUSD'
const SWRV = 'SWRV'
const sBTC = 'sBTC'
const UNI = 'UNI'
const yUSD = 'yUSD'
const ybCRV = 'ybCRV'
const yUSDC = 'yUSDC'
const yDAI = 'yDAI'
const yUSDT = 'yUSDT'
const yTUSD = 'yTUSD'
const AKRO = 'AKRO'
const AUDIO = 'AUDIO'
const BAND = 'BAND'
const BASED = 'BASED'
const BUSD = 'BUSD'
const CREAM = 'CREAM'
const DONUT = 'DONUT'
const MTA = 'MTA'
const PAXG = 'PAXG'
const PICKLE = 'PICKLE'
const RENZEC = 'RENZEC'
const SETH = 'SETH'
const STAKE = 'STAKE'
const TBTC = 'TBTC'
 // ASSET ADDRESSES 
// aggiungere da qui https://api.0x.org/swap/v1/tokens 
//Adress della cripto e aggiungerlo all'array 
const ASSET_ADDRESSES = {
DAI:'0x6b175474e89094c44da98b954eedeac495271d0f',
REP:'0x1985365e9f78359a9B6AD760e32412f4a445E862',
ETH:'0xeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeee',
WETH:'0xc02aaa39b223fe8d0a0e5c4f27ead9083c756cc2',
ZRX:'0xe41d2489571d322189246dafa5ebde1f4699f498',
USDC:'0xa0b86991c6218b36c1d19d4a2e9eb0ce3606eb48',
BAT:'0x0d8775f648430679a709e98d2b0cb6250d2887ef',
MKR:'0x9f8f72aa9304c8b593d555f12ef6589cc3a579a2',
WBTC:'0x2260fac5e5542a773aa44fbcfedf7c193bc2c599',
SNX:'0xc011a73ee8576fb46f5e1c5751ca3b9fe0af2a6f',
SUSD:'0x57ab1ec28d129707052df4df418d58a2d46d5f51',
KNC:'0xdd974d5c2e2928dea5f71b9825b8b646686bd200',
BNT:'0x1f573d6fb3f13d689ff844b4ce37794d79a7ff1c',
GNO:'0x6810e776880c02933d47db1b9fc05908e5386b96',
LINK:'0x514910771af9ca656af840dff83e8264ecf986ca',
REN:'0x408e41876cccdc0f92210600ef50372656052a38',
GNT:'0xa74476443119a942de498590fe1f2454d7d4ac0d',
OMG:'0xd26114cd6ee289accf82350c8d8487fedb8a0c07',
ANT:'0x960b236a07cf122663c4303350609a66a7b288c0',
SAI:'0x89d24a6b4ccb1b6faa2625fe562bdd9a23260359',
CVL:'0x01fa555c97d7958fa6f771f3bbd5ccd508f81e22',
DTH:'0x5adc961d6ac3f7062d2ea45fefb8d8167d44b190',
FOAM:'0x4946fcea7c692606e8908002e55a582af44ac121',
AST:'0x27054b13b1b798b345b591a4d22e6562d47ea75a',
AION:'0x4ceda7906a5ed2179785cd3a40a69ee8bc99c466',
GEN:'0x543ff227f64aa17ea132bf9886cab5db55dcaddf',
STORJ:'0xb64ef51c888972c908cfacf59b47c1afbc0ab8ac',
MANA:'0x0f5d2fb29fb7d3cfee444a200298f468908cc942',
ENTRP:'0x5bc7e5f0ab8b2e10d2d0a3f21739fce62459aef3',
MLN:'0xbeb9ef514a379b997e0798fdcc901ee474b6d9a1',
LOOM:'0xa4e8c3ec456107ea67d3075bf9e3df3a75823db0',
CELR:'0x4f9254c83eb525f9fcf346490bbb3ed28a81c667',
RLC:'0x607f4c5bb672230e8672085532f7e901544a7375',
ICN:'0x888666ca69e0f178ded6d75b5726cee99a87d698',
DGD:'0xe0b7927c4af23765cb51314a0e0521a9645f0e2a',
ZIL:'0x05f4a42e251f2d52b8ed15e9fedaacfcef1fad27',
cBAT:'0x6c8c6b02e7b2be14d4fa6022dfd6d75921d90e4e',
cDAI:'0x5d3a536e4d6dbd6114cc1ead35777bab948e3643',
cSAI:'0xf5dce57282a584d2746faf1593d3121fcac444dc',
cETH:'0x4ddc2d193948926d02f9b1fe9e1daa0718270ed5',
cREP:'0x158079ee67fce2f58472a96584a73c7ab9ac95c1',
cUSDC:'0x39aa39c021dfbae8fac545936693ac917d5e7563',
cZRX:'0xb3319f5d18bc0d84dd1b4825dcde5d5f7266d407',
SNT:'0x744d70fdbe2ba4cf95131626614a1763df805b9e',
SPANK:'0x42d6622dece394b54999fbd73d108123806f6a18',
BOOTY:'0x6b01c3170ae1efebee1a3159172cb3f7a5ecf9e5',
UBT:'0x8400d94a5cb0fa0d041a3788e395285d61c9ee5e',
ICX:'0xb5a5f22694352c15b00323844ad545abb2b11028',
NMR:'0x1776e1f26f98b1a5df9cd347953a26dd3cb46671',
GUSD:'0x056fd409e1d7a124bd7017459dfea2f387b6d5cd',
FUN:'0x419d0d8bdd9af5e606ae2232ed285aff190e711b',
PAX:'0x8e870d67f660d95d5be530380d0ec0bd388289e1',
TUSD:'0x0000000000085d4780b73119b644ae5ecd22b376',
LPT:'0x58b6a8a3302369daec383334672404ee733ab239',
ENJ:'0xf629cbd94d3791c9250152bd8dfbdf380e2a3b9c',
POWR:'0x595832f8fc6bf59c85c527fec3740a1b7a361269',
REQ:'0x8f8221afbb33998d8584a2b05749ba73c37a938a',
DNT:'0x0abdace70d3790235af448c88547603b945604ea',
MATIC:'0x7d1afa7b718fb893db30a3abc0cfc608aacfebb0',
LRC:'0xbbbbca6a901c926f240b89eacb641d8aec7aeafd',
RDN:'0x255aa6df07540cb5d3d297f0d0d4d84cb52bc8e6',
USDT:'0xdac17f958d2ee523a2206206994597c13d831ec7',
GST2:'0x0000000000b3f879cb30fe243b4dfee438691c04',
COMP:'0xc00e94cb662c3520282e6f5717214004a7f26888',
UMA:'0x04fa0d235c4abf4bcf4787af4cf447de572ef828',
BZRX:'0x56d811088235f11c8920698a204a5010a788f4b3',
renBTC:'0xeb4c2781e4eba804ce9a9803c67d0893436bb27d',
BAL:'0xba100000625a3754423978a60c9317c58a424e3d',
LEND:'0x80fb784b7ed66730e8b1dbd9820afd29931aab03',
AAVE:'0x7fc66500c84a76ad7e9c93437bfc5ac33e2ddae9',
YFI:'0x0bc529c00c6401aef6d220be8c6ea1667f6ad93e',
AMPL:'0xd46ba6d942050d489dbd938a2c909a5d5039a161',
KEEP:'0x85eee30c52b0b379b046fb0f85f4f3dc3009afec',
mUSD:'0xe2f2a5c287993345a840db3b0845fbc70f5935a5',
CRV:'0xd533a949740bb3306d119cc777fa900ba034cd52',
SUSHI:'0x6b3595068778dd592e39a122f4f5a5cf09c90fe2',
swUSD:'0x77C6E4a580c0dCE4E5c7a17d0bc077188a83A059',
SWRV:'0xB8BAa0e4287890a5F79863aB62b7F175ceCbD433',
sBTC:'0xfe18be6b3bd88a2d2a7f928d00292e7a9963cfc6',
UNI:'0x1f9840a85d5af5bf1d1762f925bdaddc4201f984',
yUSD:'0x5dbcf33d8c2e976c6b560249878e6f1491bca25c',
ybCRV:'0x2994529c0652d127b7842094103715ec5299bbed',
yUSDC:'0x597ad1e0c13bfe8025993d9e79c69e1c0233522e',
yDAI:'0xacd43e627e64355f1861cec6d3a6688b31a6f952',
yUSDT:'0x2f08119c6f07c006695e079aafc638b8789faf18',
yTUSD:'0x37d19d1c4e1fa9dc47bd1ea12f742a0887eda74a',
AKRO:'0x8ab7404063ec4dbcfd4598215992dc3f8ec853d7',
AUDIO:'0x18aaa7115705e8be94bffebde57af9bfc265b998',
BAND:'0xba11d00c5f74255f56a5e366f4f77f5a186d7f55',
BASED:'0x68a118ef45063051eac49c7e647ce5ace48a68a5',
BUSD:'0x4fabb145d64652a948d72533023f6e7a623c7c53',
CREAM:'0x2ba592f78db6436527729929aaf6c908497cb200',
DONUT:'0xc0f9bd5fa5698b6505f643900ffa515ea5df54a9',
MTA:'0xa3bed4e1c75d00fa6f4e5e6922db7261b5e9acd2',
mUSD:'0xe2f2a5c287993345a840db3b0845fbc70f5935a5',
PAXG:'0x45804880de22913dafe09f4980848ece6ecbaf78',
PICKLE:'0x429881672b9ae42b8eba0e26cd9c73711b891ca5',
RENZEC:'0x1c5db575e2ff833e46a2e9864c22f4b22e0b37c2',
REP:'0x221657776846890989a759ba2973e427dff5c9bb',
SETH:'0x5e74c9036fb86bd7ecdcb084a0673efc32ea31cb',
STAKE:'0x0ae055097c6d159879521c384f1d2123d1f195e6',
TBTC:'0x8daebade922df735c38c80c7ebd708af50815faa'
}
function strtodec(amount,dec){
	stringf = "";
    for(var i=0;i<dec;i++){
        stringf = stringf+"0";
    }
    return amount+stringf;
}

// DISPLAY LOGIC
//tokensWithDecimalPlaces = (amount, symbol) => {
//  amount = amount.toString()
//  switch (symbol) {
//    case DAI: // 18 decimals
 //     return web3.utils.fromWei(amount, 'Ether')
  //  default:
   //   return web3.utils.fromWei(amount, 'Ether')
 // }
//}
// Sostituita per gestire tutte i token con diverse 
// cifre decimali. La funzione strtodec aggiunge 0 per 
//arrivare alle cifre decimali previste
tokensWithDecimalPlaces = (amount, symbol) => {
amount = amount.toString()
switch (symbol) {
case DAI:
return web3.utils.fromWei(amount, 'Ether')
case REP:
return web3.utils.fromWei(amount, 'Ether')
case ETH:
return web3.utils.fromWei(amount, 'Ether')
case WETH:
return web3.utils.fromWei(amount, 'Ether')
case ZRX:
return web3.utils.fromWei(amount, 'Ether')
case USDC:
return web3.utils.fromWei(amount, 'picoEther')
case BAT:
return web3.utils.fromWei(amount, 'Ether')
case MKR:
return web3.utils.fromWei(amount, 'Ether')
case WBTC:
return web3.utils.fromWei(strtode(amount,1), 'gwei')
case SNX:
return web3.utils.fromWei(amount, 'Ether')
case SUSD:
return web3.utils.fromWei(amount, 'Ether')
case KNC:
return web3.utils.fromWei(amount, 'Ether')
case BNT:
return web3.utils.fromWei(amount, 'Ether')
case GNO:
return web3.utils.fromWei(amount, 'Ether')
case LINK:
return web3.utils.fromWei(amount, 'Ether')
case REN:
return web3.utils.fromWei(amount, 'Ether')
case GNT:
return web3.utils.fromWei(amount, 'Ether')
case OMG:
return web3.utils.fromWei(amount, 'Ether')
case ANT:
return web3.utils.fromWei(amount, 'Ether')
case SAI:
return web3.utils.fromWei(amount, 'Ether')
case CVL:
return web3.utils.fromWei(amount, 'Ether')
case DTH:
return web3.utils.fromWei(amount, 'Ether')
case FOAM:
return web3.utils.fromWei(amount, 'Ether')
case AST:
return web3.utils.fromWei(strtode(amount,5), 'gwei')
case AION:
return web3.utils.fromWei(strtode(amount,1), 'gwei')
case GEN:
return web3.utils.fromWei(amount, 'Ether')
case STORJ:
return web3.utils.fromWei(strtode(amount,1), 'gwei')
case MANA:
return web3.utils.fromWei(amount, 'Ether')
case ENTRP:
return web3.utils.fromWei(amount, 'Ether')
case MLN:
return web3.utils.fromWei(amount, 'Ether')
case LOOM:
return web3.utils.fromWei(amount, 'Ether')
case CELR:
return web3.utils.fromWei(amount, 'Ether')
case RLC:
return web3.utils.fromWei(amount, 'gwei')
case ICN:
return web3.utils.fromWei(amount, 'Ether')
case DGD:
return web3.utils.fromWei(amount, 'gwei')
case ZIL:
return web3.utils.fromWei(amount, 'szabo')
case cBAT:
return web3.utils.fromWei(strtode(amount,1), 'gwei')
case cDAI:
return web3.utils.fromWei(strtode(amount,1), 'gwei')
case cSAI:
return web3.utils.fromWei(strtode(amount,1), 'gwei')
case cETH:
return web3.utils.fromWei(strtode(amount,1), 'gwei')
case cREP:
return web3.utils.fromWei(strtode(amount,1), 'gwei')
case cUSDC:
return web3.utils.fromWei(strtode(amount,1), 'gwei')
case cZRX:
return web3.utils.fromWei(strtode(amount,1), 'gwei')
case SNT:
return web3.utils.fromWei(amount, 'Ether')
case SPANK:
return web3.utils.fromWei(amount, 'Ether')
case BOOTY:
return web3.utils.fromWei(amount, 'Ether')
case UBT:
return web3.utils.fromWei(strtode(amount,1), 'gwei')
case ICX:
return web3.utils.fromWei(amount, 'Ether')
case NMR:
return web3.utils.fromWei(amount, 'Ether')
case GUSD:
return web3.utils.fromWei(strtode(amount,7), 'gwei')
case FUN:
return web3.utils.fromWei(strtode(amount,1), 'gwei')
case PAX:
return web3.utils.fromWei(amount, 'Ether')
case TUSD:
return web3.utils.fromWei(amount, 'Ether')
case LPT:
return web3.utils.fromWei(amount, 'Ether')
case ENJ:
return web3.utils.fromWei(amount, 'Ether')
case POWR:
return web3.utils.fromWei(amount, 'picoEther')
case REQ:
return web3.utils.fromWei(amount, 'Ether')
case DNT:
return web3.utils.fromWei(amount, 'Ether')
case MATIC:
return web3.utils.fromWei(amount, 'Ether')
case LRC:
return web3.utils.fromWei(amount, 'Ether')
case RDN:
return web3.utils.fromWei(amount, 'Ether')
case USDT:
return web3.utils.fromWei(amount, 'picoEther')
case GST2:
return web3.utils.fromWei(strtode(amount,7), 'gwei')
case COMP:
return web3.utils.fromWei(amount, 'Ether')
case UMA:
return web3.utils.fromWei(amount, 'Ether')
case BZRX:
return web3.utils.fromWei(amount, 'Ether')
case renBTC:
return web3.utils.fromWei(strtode(amount,1), 'gwei')
case BAL:
return web3.utils.fromWei(amount, 'Ether')
case LEND:
return web3.utils.fromWei(amount, 'Ether')
case AAVE:
return web3.utils.fromWei(amount, 'Ether')
case YFI:
return web3.utils.fromWei(amount, 'Ether')
case AMPL:
return web3.utils.fromWei(amount, 'gwei')
case KEEP:
return web3.utils.fromWei(amount, 'Ether')
case mUSD:
return web3.utils.fromWei(amount, 'Ether')
case bUSD:
return web3.utils.fromWei(amount, 'Ether')
case CRV:
return web3.utils.fromWei(amount, 'Ether')
case SUSHI:
return web3.utils.fromWei(amount, 'Ether')
case swUSD:
return web3.utils.fromWei(amount, 'Ether')
case SWRV:
return web3.utils.fromWei(amount, 'Ether')
case sBTC:
return web3.utils.fromWei(amount, 'Ether')
case UNI:
return web3.utils.fromWei(amount, 'Ether')
case yUSD:
return web3.utils.fromWei(amount, 'Ether')
case ybCRV:
return web3.utils.fromWei(amount, 'Ether')
case yUSDC:
return web3.utils.fromWei(amount, 'Ether')
case yDAI:
return web3.utils.fromWei(amount, 'Ether')
case yUSDT:
return web3.utils.fromWei(amount, 'Ether')
case yTUSD:
return web3.utils.fromWei(amount, 'Ether')
case AKRO:
return web3.utils.fromWei(amount, 'Ether')
case AUDIO:
return web3.utils.fromWei(amount, 'Ether')
case BAND:
return web3.utils.fromWei(amount, 'Ether')
case BASED:
return web3.utils.fromWei(amount, 'Ether')
case BUSD:
return web3.utils.fromWei(amount, 'Ether')
case CREAM:
return web3.utils.fromWei(amount, 'Ether')
case DONUT:
return web3.utils.fromWei(amount, 'Ether')
case MTA:
return web3.utils.fromWei(amount, 'Ether')
case mUSD:
return web3.utils.fromWei(amount, 'Ether')
case PAXG:
return web3.utils.fromWei(amount, 'Ether')
case PICKLE:
return web3.utils.fromWei(amount, 'Ether')
case RENZEC:
return web3.utils.fromWei(strtode(amount,1), 'gwei')
case REP:
return web3.utils.fromWei(amount, 'Ether')
case SETH:
return web3.utils.fromWei(amount, 'Ether')
case STAKE:
return web3.utils.fromWei(amount, 'Ether')
case TBTC:
return web3.utils.fromWei(amount, 'Ether')
default: // 18 decimals
return web3.utils.toWei(tokenAmount, 'Ether')
}
}
const TOKEN_DISPLAY_DECIMALS = 2 // Show 2 decimal places
const displayTokens = (amount, symbol) => {
  let tokens
  tokens = tokensWithDecimalPlaces(amount, symbol)

  return(tokens)
}


// UTILITIES
const now = () => (moment().tz('America/Chicago').format())



// FORMATTERS
const toTokens = (tokenAmount, symbol) => {
  switch (symbol) {
    case DAI: // 18 decimals
      return web3.utils.toWei(tokenAmount, 'Ether')
    case WETH: // 18 decimals
      return web3.utils.toWei(tokenAmount, 'Ether')
    case USDC: // 6 decimals
      return web3.utils.fromWei(web3.utils.toWei(tokenAmount), 'Szabo')
    case TUSD: // 6 decimals
      return web3.utils.fromWei(web3.utils.toWei(tokenAmount), 'Szabo')
    default: // 18 decimals
      return web3.utils.toWei(tokenAmount, 'Ether')
  }
}


// TRADING FUNCTIONS
const ONE_SPLIT_PARTS = 10
const ONE_SPLIT_FLAGS = 0
async function fetchOneSplitData(args) {
  const { fromToken, toToken, amount } = args
  const data = await oneSplitContract.methods.getExpectedReturn(fromToken, toToken, amount, ONE_SPLIT_PARTS, ONE_SPLIT_FLAGS).call()
  return(data)
}

// CHECK TO SEE IF ORDER CAN BE ARBITRAGED
const checkedOrders = []
let profitableArbFound = false
async function checkArb(args) {
  const { zrxOrder, assetOrder } = args

 //  console.log('symbol',assetOrder[0],assetOrder[1], assetOrder[2])
  // Track order
  const tempOrderID = JSON.stringify(zrxOrder)
  
  // Skip if order checked
  if(checkedOrders.includes(tempOrderID)) {
   //  console.log('Order already checked')
    return // Don't log
  }

  // Add to checked orders
  checkedOrders.push(tempOrderID)

  // Skip if Maker Fee
  if(zrxOrder.makerFee.toString() !== '0') {
  //  console.log('Order has maker fee')
    return
  }

  // Skip if Taker Fee
  if(zrxOrder.takerFee.toString() !== '0') {
   // console.log('Order has taker fee')
    return
  }

  // This becomes the input amount
  // Build order tuple
  const orderTuple = [
    zrxOrder.makerAddress,
    zrxOrder.takerAddress,
    zrxOrder.feeRecipientAddress,
    zrxOrder.senderAddress,
    zrxOrder.makerAssetAmount,
    zrxOrder.takerAssetAmount,
    zrxOrder.makerFee,
    zrxOrder.takerFee,
    zrxOrder.expirationTimeSeconds,
    zrxOrder.salt,
    zrxOrder.makerAssetData,
    zrxOrder.takerAssetData,
    zrxOrder.makerFeeAssetData,
    zrxOrder.takerFeeAssetData
  ]
   // In pratica l'ordine dice  
   // Scambio makeramount di assetOrder[1]  in cambio di takerAmount di  assetOrder[2]
   // avro in cambio eseguendo l'ordine makerAmount. Vedo se qualcuno con quel maker r
   // Quindi io in pancia ho asseTOrede2 presi in prestito, accetto lo scambio ti do takerAmount
   // ed avro' in cambio makerAmout. Se qualcuno mi da con i miei makerAmout + dei takerAmout ho vinto
  // ovviamente  devo togliere le fee 

     //console.log('Asset Order 0'+assetOrder[0])
     //console.log('Asset Order 1'+ assetOrder[1])


//    console.log('zrxOrder.makerAddress,		'+zrxOrder.makerAddress)
 //   console.log('zrxOrder.takerAddress,         '+zrxOrder.takerAddress)
//   console.log('zrxOrder.feeRecipientAddress,  '+zrxOrder.feeRecipientAddress)
  //  console.log('zrxOrder.senderAddress,        '+zrxOrder.senderAddress)
   // console.log('zrxOrder.makerAssetAmount,     '+zrxOrder.makerAssetAmount)
   // console.log('zrxOrder.takerAssetAmount,     '+zrxOrder.takerAssetAmount)
   // console.log('zrxOrder.makerFee,             '+zrxOrder.makerFee)
    //console.log('zrxOrder.takerFee,             '+zrxOrder.takerFee)
  //  console.log('zrxOrder.makerAssetData,       '+zrxOrder.makerAssetData)
  //  console.log('zrxOrder.takerAssetData,       '+zrxOrder.takerAssetData)
  //  console.log('zrxOrder.makerFeeAssetData,    '+zrxOrder.makerFeeAssetData)
 //   console.log('zrxOrder.takerFeeAssetData     '+zrxOrder.takerFeeAssetData)
 //   console.log('Maker form '+ tokensWithDecimalPlaces(zrxOrder.makerAssetAmount,assetOrder[0])) 
//    console.log('Taker form '+ tokensWithDecimalPlaces(zrxOrder.takerAssetAmount,assetOrder[1])) 


   // Fetch order status
  const orderInfo = await zrxExchangeContract.methods.getOrderInfo(orderTuple).call()

  // Skip order if it's been partially filled
  if(orderInfo.orderTakerAssetFilledAmount.toString() !== '0') {
    console.log('Order partially filled')
    return
  }

  // Fetch 1Split Data
  const oneSplitData = await fetchOneSplitData({
    fromToken: ASSET_ADDRESSES[assetOrder[1]],
    toToken: ASSET_ADDRESSES[assetOrder[2]],
    amount: zrxOrder.makerAssetAmount,
  })
  // inputAmount è il denaro che ho dovuto dare per fare lo scambio e output e' quello che otterrei con il
 // secondo scambiO 
  const inputAssetAmount_mio =tokensWithDecimalPlaces(zrxOrder.takerAssetAmount,assetOrder[2])
  const inputAssetAmount =zrxOrder.takerAssetAmount
  const outputAssetAmount =tokensWithDecimalPlaces(oneSplitData.returnAmount,assetOrder[2])


  // Calculate estimated gas cost
  let estimatedGasFee = process.env.ESTIMATED_GAS.toString() * web3.utils.toWei(process.env.GAS_PRICE.toString(), 'Gwei')
  estimatedGasFee = web3.utils.fromWei(estimatedGasFee.toString(), 'Ether')

  // Calculate net profit
  let netProfit = outputAssetAmount - inputAssetAmount_mio - estimatedGasFee
  netProfit = Math.floor(netProfit) // Round down
  

   // Determine if profitable
    const profitable = netProfit.toString() > '0'
  //let  profitable = (parseFloat(displayTokens(netProfit.toString(), assetOrder[0])) > parseFloat('0.01'))
  
// If profitable, then stop looking and trade!
  if(profitable) {
    // Skip if another profitable arb has already been found
    if(profitableArbFound) {
      return
    }

   console.log(assetOrder[0]+' '+assetOrder[1]+' '+assetOrder[2])
   console.log('input='+inputAssetAmount_mio)
   console.log('output='+outputAssetAmount)
   console.log('fee='+estimatedGasFee)
   console.log('profitto='+netProfit)
    // Tell the app that a profitable arb has been found
    profitableArbFound = true
   //console.log(assetOrder[0]+','+ assetOrder[1]+','+ assetOrder[2]+ ',' +displayTokens(netProfit.toString(), assetOrder[0]).padEnd(22, ' ')+','+ displayTokens(zrxOrder.takerFee,asseOrder[0])+','+displayTokens(zrxOrder.makerFee,assetOrder[0])+','+displayTokens(orderInfo.orderTakerAssetFilledAmount,assetOrder[0]))
 
    // Log the arb
   // console.table([{
   //   'Asset Order': assetOrder.join(', '),
   //   'Exchange Order': 'ZRX, 1Split',
   //   'Asset1':   assetOrder[1],
   //   'Asset2':   assetOrder[2],
   //   'Input':  displayTokens(inputAssetAmount, assetOrder[0]).padEnd(22, ' '),
   //   'Output': displayTokens(outputAssetAmount, assetOrder[0]).padEnd(22, ' '),
    //  'Profit': displayTokens(netProfit.toString(), assetOrder[0]).padEnd(22, ' '),
   // }])

    // Play alert tone
//    playSound()

    // Call arb contract
    await trade(assetOrder[0], ASSET_ADDRESSES[assetOrder[0]], ASSET_ADDRESSES[assetOrder[1]], zrxOrder, inputAssetAmount, oneSplitData)

    profitableArbFound = false
  }
}


// TRADE EXECUTION
async function trade(flashTokenSymbol, flashTokenAddress, arbTokenAddress, orderJson, fillAmount, oneSplitData) {
  const FLASH_AMOUNT = toTokens('10000', flashTokenSymbol) // 10,000 WETH
  const FROM_TOKEN = flashTokenAddress // WETH
  const FROM_AMOUNT = fillAmount // '1000000'
  const TO_TOKEN = arbTokenAddress

  const ONE_SPLIT_SLIPPAGE = '0.995'

  const orderTuple = [
    orderJson.makerAddress,
    orderJson.takerAddress,
    orderJson.feeRecipientAddress ,
    orderJson.senderAddress ,
    orderJson.makerAssetAmount ,
    orderJson.takerAssetAmount ,
    orderJson.makerFee ,
    orderJson.takerFee ,
    orderJson.expirationTimeSeconds ,
    orderJson.salt ,
    orderJson.makerAssetData ,
    orderJson.takerAssetData ,
    orderJson.makerFeeAssetData ,
    orderJson.takerFeeAssetData
  ]

  // Format ZRX function call data
  const takerAssetFillAmount = FROM_AMOUNT
  const signature = orderJson.signature
  console.log('takerAssetFillAmount='+takerAssetFillAmount)
 //const input = new BigNumber(takerAssetFillAmount) 
  const data = web3.eth.abi.encodeFunctionCall(FILL_ORDER_ABI, [orderTuple, takerAssetFillAmount, signature])

  console.log('Passedì')
  const minReturn = oneSplitData.returnAmount
  const distribution = oneSplitData.distribution

  // Calculate slippage
  const minReturnWtihSplippage = minReturnWithSlippage = (new web3.utils.BN(minReturn)).mul(new web3.utils.BN('995')).div(new web3.utils.BN('1000')).toString()

  console.log('Perform Trade')
  // Perform Trade
//receipt = await traderContract.methods.getFlashloan(
//    flashTokenAddress, // address flashToken,
//    FLASH_AMOUNT, // uint256 flashAmount,
//    arbTokenAddress, // address arbToken,
//    data, // bytes calldata zrxData,
//    minReturnWtihSplippage.toString(), // uint256 oneSplitMinReturn,
//    distribution, // uint256[] calldata oneSplitDistribution
//  ).send({
//    from: process.env.ADDRESS,
//    gas: process.env.GAS_LIMIT,
//    gasPrice: web3.utils.toWei(process.env.GAS_PRICE, 'Gwei')
//  })
//
console.log( 'flashTokenAddress '+  flashTokenAddress)
console.log(  'FLASH_AMOUNT'+  FLASH_AMOUNT)
console.log(  'arbTokenAddress '+ arbTokenAddress)
console.log(  'data '+ data)
console.log(  'minReturnWtihSplippage '+ minReturnWtihSplippage.toString())
console.log(  'distribution '+  distribution)
console.log(  process.env.ADDRESS)
console.log(  process.env.GAS_LIMIT)
console.log(  web3.utils.toWei(process.env.GAS_PRICE, 'Gwei'))
console.log( 'flashTokenAddress '+  flashTokenAddress)

  //console.log(receipt)
}

// FETCH ORDERBOOK
// https://0x.org/docs/api#get-srav3orderbook
// Bids will be sorted in descending order by price
async function checkOrderBook(baseAssetSymbol, quoteAssetSymbol) {
  const baseAssetAddress = ASSET_ADDRESSES[baseAssetSymbol].substring(2,42)
  const quoteAssetAddress = ASSET_ADDRESSES[quoteAssetSymbol].substring(2,42)
  const zrxResponse = await axios.get(`https://api.0x.org/sra/v3/orderbook?baseAssetData=0xf47261b0000000000000000000000000${baseAssetAddress}&quoteAssetData=0xf47261b0000000000000000000000000${quoteAssetAddress}&perPage=1000`)
  const zrxData = zrxResponse.data
  const bids = zrxData.bids.records
  bids.map((o) => {
    checkArb({ zrxOrder: o.order, assetOrder: [baseAssetSymbol, quoteAssetSymbol, baseAssetSymbol] }) // E.G. WETH, DAI, WETH
  })
}

// CHECK MARKETS
let checkingMarkets = false
async function checkMarkets() {
  if(checkingMarkets) {
    return
  }

  // Stop checking markets if already found
  if(profitableArbFound) {
    clearInterval(marketChecker)
  }

  //console.log(`Fetching market data @ ${now()} ...\n`)
  checkingMarkets = true
  try {
console.log('START') 
await checkOrderBook(WETH, DAI)
 await checkOrderBook(WETH, REP)
 await checkOrderBook(WETH, ETH)
 await checkOrderBook(WETH, WETH)
 await checkOrderBook(WETH, ZRX)
 await checkOrderBook(WETH, USDC)
 await checkOrderBook(WETH, BAT)
 await checkOrderBook(WETH, MKR)
 await checkOrderBook(WETH, WBTC)
 await checkOrderBook(WETH, SNX)
 await checkOrderBook(WETH, SUSD)
 await checkOrderBook(WETH, KNC)
 await checkOrderBook(WETH, BNT)
 await checkOrderBook(WETH, GNO)
 await checkOrderBook(WETH, LINK)
 await checkOrderBook(WETH, REN)
 await checkOrderBook(WETH, GNT)
 await checkOrderBook(WETH, OMG)
 await checkOrderBook(WETH, ANT)
 await checkOrderBook(WETH, SAI)
 await checkOrderBook(WETH, CVL)
 await checkOrderBook(WETH, DTH)
 await checkOrderBook(WETH, FOAM)
 await checkOrderBook(WETH, AST)
 await checkOrderBook(WETH, AION)
 await checkOrderBook(WETH, GEN)
 await checkOrderBook(WETH, STORJ)
 await checkOrderBook(WETH, MANA)
 await checkOrderBook(WETH, ENTRP)
 await checkOrderBook(WETH, MLN)
 await checkOrderBook(WETH, LOOM)
 await checkOrderBook(WETH, CELR)
 await checkOrderBook(WETH, RLC)
 await checkOrderBook(WETH, ICN)
 await checkOrderBook(WETH, DGD)
 await checkOrderBook(WETH, ZIL)
 await checkOrderBook(WETH, cBAT)
 await checkOrderBook(WETH, cDAI)
 await checkOrderBook(WETH, cSAI)
 await checkOrderBook(WETH, cETH)
 await checkOrderBook(WETH, cREP)
 await checkOrderBook(WETH, cUSDC)
 await checkOrderBook(WETH, cZRX)
 await checkOrderBook(WETH, SNT)
 await checkOrderBook(WETH, SPANK)
 await checkOrderBook(WETH, BOOTY)
 await checkOrderBook(WETH, UBT)
 await checkOrderBook(WETH, ICX)
 await checkOrderBook(WETH, NMR)
 await checkOrderBook(WETH, GUSD)
 await checkOrderBook(WETH, FUN)
 await checkOrderBook(WETH, PAX)
 await checkOrderBook(WETH, TUSD)
 await checkOrderBook(WETH, LPT)
 await checkOrderBook(WETH, ENJ)
 await checkOrderBook(WETH, POWR)
 await checkOrderBook(WETH, REQ)
 await checkOrderBook(WETH, DNT)
 await checkOrderBook(WETH, MATIC)
 await checkOrderBook(WETH, LRC)
 await checkOrderBook(WETH, RDN)
 await checkOrderBook(WETH, USDT)
 await checkOrderBook(WETH, GST2)
 await checkOrderBook(WETH, COMP)
 await checkOrderBook(WETH, UMA)
 await checkOrderBook(WETH, BZRX)
 await checkOrderBook(WETH, renBTC)
 await checkOrderBook(WETH, BAL)
 await checkOrderBook(WETH, LEND)
 await checkOrderBook(WETH, AAVE)
 await checkOrderBook(WETH, YFI)
 await checkOrderBook(WETH, AMPL)
 await checkOrderBook(WETH, KEEP)
 await checkOrderBook(WETH, CRV)
 await checkOrderBook(WETH, SUSHI)
 await checkOrderBook(WETH, sBTC)
 await checkOrderBook(WETH, UNI)
 await checkOrderBook(WETH, yUSD)
 await checkOrderBook(WETH, ybCRV)
 await checkOrderBook(WETH, yUSDC)
 await checkOrderBook(WETH, yDAI)
 await checkOrderBook(WETH, yUSDT)
 await checkOrderBook(WETH, yTUSD)
 await checkOrderBook(WETH, AKRO)
 await checkOrderBook(WETH, AUDIO)
 await checkOrderBook(WETH, BAND)
 await checkOrderBook(WETH, BASED)
 await checkOrderBook(WETH, BUSD)
 await checkOrderBook(WETH, CREAM)
 await checkOrderBook(WETH, DONUT)
 await checkOrderBook(WETH, MTA)
 await checkOrderBook(WETH, mUSD)
 await checkOrderBook(WETH, PAXG)
 await checkOrderBook(WETH, PICKLE)
 await checkOrderBook(WETH, RENZEC)
 await checkOrderBook(WETH, REP)
 await checkOrderBook(WETH, SETH)
 await checkOrderBook(WETH, STAKE)
 await checkOrderBook(WETH, TBTC)
 await checkOrderBook(WETH, DAI)
 await checkOrderBook(SAI , DAI)
 await checkOrderBook(SAI , REP)
 await checkOrderBook(SAI , ETH)
 await checkOrderBook(SAI , SAI )
 await checkOrderBook(SAI , ZRX)
 await checkOrderBook(SAI , USDC)
 await checkOrderBook(SAI , BAT)
 await checkOrderBook(SAI , MKR)
 await checkOrderBook(SAI , WBTC)
 await checkOrderBook(SAI , SNX)
 await checkOrderBook(SAI , SUSD)
 await checkOrderBook(SAI , KNC)
 await checkOrderBook(SAI , BNT)
 await checkOrderBook(SAI , GNO)
 await checkOrderBook(SAI , LINK)
 await checkOrderBook(SAI , REN)
 await checkOrderBook(SAI , GNT)
 await checkOrderBook(SAI , OMG)
 await checkOrderBook(SAI , ANT)
 await checkOrderBook(SAI , SAI)
 await checkOrderBook(SAI , CVL)
 await checkOrderBook(SAI , DTH)
 await checkOrderBook(SAI , FOAM)
 await checkOrderBook(SAI , AST)
 await checkOrderBook(SAI , AION)
 await checkOrderBook(SAI , GEN)
 await checkOrderBook(SAI , STORJ)
 await checkOrderBook(SAI , MANA)
 await checkOrderBook(SAI , ENTRP)
 await checkOrderBook(SAI , MLN)
 await checkOrderBook(SAI , LOOM)
 await checkOrderBook(SAI , CELR)
 await checkOrderBook(SAI , RLC)
 await checkOrderBook(SAI , ICN)
 await checkOrderBook(SAI , DGD)
 await checkOrderBook(SAI , ZIL)
 await checkOrderBook(SAI , cBAT)
 await checkOrderBook(SAI , cDAI)
 await checkOrderBook(SAI , cSAI)
 await checkOrderBook(SAI , cETH)
 await checkOrderBook(SAI , cREP)
 await checkOrderBook(SAI , cUSDC)
 await checkOrderBook(SAI , cZRX)
 await checkOrderBook(SAI , SNT)
 await checkOrderBook(SAI , SPANK)
 await checkOrderBook(SAI , BOOTY)
 await checkOrderBook(SAI , UBT)
 await checkOrderBook(SAI , ICX)
 await checkOrderBook(SAI , NMR)
 await checkOrderBook(SAI , GUSD)
 await checkOrderBook(SAI , FUN)
 await checkOrderBook(SAI , PAX)
 await checkOrderBook(SAI , TUSD)
 await checkOrderBook(SAI , LPT)
 await checkOrderBook(SAI , ENJ)
 await checkOrderBook(SAI , POWR)
 await checkOrderBook(SAI , REQ)
 await checkOrderBook(SAI , DNT)
 await checkOrderBook(SAI , MATIC)
 await checkOrderBook(SAI , LRC)
 await checkOrderBook(SAI , RDN)
 await checkOrderBook(SAI , USDT)
 await checkOrderBook(SAI , GST2)
 await checkOrderBook(SAI , COMP)
 await checkOrderBook(SAI , UMA)
 await checkOrderBook(SAI , BZRX)
 await checkOrderBook(SAI , renBTC)
 await checkOrderBook(SAI , BAL)
 await checkOrderBook(SAI , LEND)
 await checkOrderBook(SAI , AAVE)
 await checkOrderBook(SAI , YFI)
 await checkOrderBook(SAI , AMPL)
 await checkOrderBook(SAI , KEEP)
 await checkOrderBook(SAI , CRV)
 await checkOrderBook(SAI , SUSHI)
 await checkOrderBook(SAI , sBTC)
 await checkOrderBook(SAI , UNI)
 await checkOrderBook(SAI , yUSD)
 await checkOrderBook(SAI , ybCRV)
 await checkOrderBook(SAI , yUSDC)
 await checkOrderBook(SAI , yDAI)
 await checkOrderBook(SAI , yUSDT)
 await checkOrderBook(SAI , yTUSD)
 await checkOrderBook(SAI , AKRO)
 await checkOrderBook(SAI , AUDIO)
 await checkOrderBook(SAI , BAND)
 await checkOrderBook(SAI , BASED)
 await checkOrderBook(SAI , BUSD)
 await checkOrderBook(SAI , CREAM)
 await checkOrderBook(SAI , DONUT)
 await checkOrderBook(SAI , MTA)
 await checkOrderBook(SAI , mUSD)
 await checkOrderBook(SAI , PAXG)
 await checkOrderBook(SAI , PICKLE)
 await checkOrderBook(SAI , RENZEC)
 await checkOrderBook(SAI , REP)
 await checkOrderBook(SAI , SETH)
 await checkOrderBook(SAI , STAKE)
 await checkOrderBook(SAI , TBTC)
 await checkOrderBook(SAI , DAI)
  await checkOrderBook(USDC , DAI)
 await checkOrderBook(USDC , REP)
 await checkOrderBook(USDC , ETH)
 await checkOrderBook(USDC , USDC )
 await checkOrderBook(USDC , ZRX)
 await checkOrderBook(USDC , USDC)
 await checkOrderBook(USDC , BAT)
 await checkOrderBook(USDC , MKR)
 await checkOrderBook(USDC , WBTC)
 await checkOrderBook(USDC , SNX)
 await checkOrderBook(USDC , SUSD)
 await checkOrderBook(USDC , KNC)
 await checkOrderBook(USDC , BNT)
 await checkOrderBook(USDC , GNO)
 await checkOrderBook(USDC , LINK)
 await checkOrderBook(USDC , REN)
 await checkOrderBook(USDC , GNT)
 await checkOrderBook(USDC , OMG)
 await checkOrderBook(USDC , ANT)
 await checkOrderBook(USDC , USDC)
 await checkOrderBook(USDC , CVL)
 await checkOrderBook(USDC , DTH)
 await checkOrderBook(USDC , FOAM)
 await checkOrderBook(USDC , AST)
 await checkOrderBook(USDC , AION)
 await checkOrderBook(USDC , GEN)
 await checkOrderBook(USDC , STORJ)
 await checkOrderBook(USDC , MANA)
 await checkOrderBook(USDC , ENTRP)
 await checkOrderBook(USDC , MLN)
 await checkOrderBook(USDC , LOOM)
 await checkOrderBook(USDC , CELR)
 await checkOrderBook(USDC , RLC)
 await checkOrderBook(USDC , ICN)
 await checkOrderBook(USDC , DGD)
 await checkOrderBook(USDC , ZIL)
 await checkOrderBook(USDC , cBAT)
 await checkOrderBook(USDC , cDAI)
 await checkOrderBook(USDC , cUSDC)
 await checkOrderBook(USDC , cETH)
 await checkOrderBook(USDC , cREP)
 await checkOrderBook(USDC , cUSDC)
 await checkOrderBook(USDC , cZRX)
 await checkOrderBook(USDC , SNT)
 await checkOrderBook(USDC , SPANK)
 await checkOrderBook(USDC , BOOTY)
 await checkOrderBook(USDC , UBT)
 await checkOrderBook(USDC , ICX)
 await checkOrderBook(USDC , NMR)
 await checkOrderBook(USDC , GUSD)
 await checkOrderBook(USDC , FUN)
 await checkOrderBook(USDC , PAX)
 await checkOrderBook(USDC , TUSD)
 await checkOrderBook(USDC , LPT)
 await checkOrderBook(USDC , ENJ)
 await checkOrderBook(USDC , POWR)
 await checkOrderBook(USDC , REQ)
 await checkOrderBook(USDC , DNT)
 await checkOrderBook(USDC , MATIC)
 await checkOrderBook(USDC , LRC)
 await checkOrderBook(USDC , RDN)
 await checkOrderBook(USDC , USDT)
 await checkOrderBook(USDC , GST2)
 await checkOrderBook(USDC , COMP)
 await checkOrderBook(USDC , UMA)
 await checkOrderBook(USDC , BZRX)
 await checkOrderBook(USDC , renBTC)
 await checkOrderBook(USDC , BAL)
 await checkOrderBook(USDC , LEND)
 await checkOrderBook(USDC , AAVE)
 await checkOrderBook(USDC , YFI)
 await checkOrderBook(USDC , AMPL)
 await checkOrderBook(USDC , KEEP)
 await checkOrderBook(USDC , CRV)
 await checkOrderBook(USDC , SUSHI)
 await checkOrderBook(USDC , sBTC)
 await checkOrderBook(USDC , UNI)
 await checkOrderBook(USDC , yUSD)
 await checkOrderBook(USDC , ybCRV)
 await checkOrderBook(USDC , yUSDC)
 await checkOrderBook(USDC , yDAI)
 await checkOrderBook(USDC , yUSDT)
 await checkOrderBook(USDC , yTUSD)
 await checkOrderBook(USDC , AKRO)
 await checkOrderBook(USDC , AUDIO)
 await checkOrderBook(USDC , BAND)
 await checkOrderBook(USDC , BASED)
 await checkOrderBook(USDC , BUSD)
 await checkOrderBook(USDC , CREAM)
 await checkOrderBook(USDC , DONUT)
 await checkOrderBook(USDC , MTA)
 await checkOrderBook(USDC , mUSD)
 await checkOrderBook(USDC , PAXG)
 await checkOrderBook(USDC , PICKLE)
 await checkOrderBook(USDC , RENZEC)
 await checkOrderBook(USDC , REP)
 await checkOrderBook(USDC , SETH)
 await checkOrderBook(USDC , STAKE)
 await checkOrderBook(USDC , TBTC)
 await checkOrderBook(USDC , DAI)
 console.log('END')
  } catch (error) {
    console.error(error)
    checkingMarkets = false
    return
  }

  checkingMarkets = false
}

// RUN APP

// Check markets every n seconds
const POLLING_INTERVAL = process.env.POLLING_INTERVAL || 10000 // 3 seconds
const marketChecker = setInterval(async () => { await checkMarkets() }, POLLING_INTERVAL)
