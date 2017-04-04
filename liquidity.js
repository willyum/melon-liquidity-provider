const Web3 = require('web3');
const _= require('underscore');

const contractAddress = '0x7c7B4904e37C71845FDC1c75D20FF6ee3c80eCB4';
const abiArray = [{"constant":false,"inputs":[{"name":"sell_how_much","type":"uint256"},{"name":"sell_which_token","type":"address"},{"name":"buy_how_much","type":"uint256"},{"name":"buy_which_token","type":"address"}],"name":"make","outputs":[{"name":"id","type":"uint256"}],"payable":false,"type":"function"},{"constant":false,"inputs":[{"name":"id","type":"uint256"}],"name":"cancel","outputs":[{"name":"","type":"bool"}],"payable":false,"type":"function"},{"constant":true,"inputs":[],"name":"lastOfferId","outputs":[{"name":"","type":"uint256"}],"payable":false,"type":"function"},{"constant":true,"inputs":[],"name":"getLastOrderId","outputs":[{"name":"","type":"uint256"}],"payable":false,"type":"function"},{"constant":true,"inputs":[{"name":"id","type":"uint256"}],"name":"isActive","outputs":[{"name":"active","type":"bool"}],"payable":false,"type":"function"},{"constant":false,"inputs":[{"name":"id","type":"uint256"},{"name":"quantity","type":"uint256"}],"name":"take","outputs":[{"name":"","type":"bool"}],"payable":false,"type":"function"},{"constant":true,"inputs":[{"name":"","type":"uint256"}],"name":"orders","outputs":[{"name":"sell_how_much","type":"uint256"},{"name":"sell_which_token","type":"address"},{"name":"buy_how_much","type":"uint256"},{"name":"buy_which_token","type":"address"},{"name":"owner","type":"address"},{"name":"active","type":"bool"}],"payable":false,"type":"function"},{"constant":true,"inputs":[{"name":"id","type":"uint256"}],"name":"getOwner","outputs":[{"name":"owner","type":"address"}],"payable":false,"type":"function"},{"constant":true,"inputs":[{"name":"id","type":"uint256"}],"name":"getOrder","outputs":[{"name":"","type":"uint256"},{"name":"","type":"address"},{"name":"","type":"uint256"},{"name":"","type":"address"}],"payable":false,"type":"function"},{"anonymous":false,"inputs":[{"indexed":false,"name":"id","type":"uint256"}],"name":"OrderUpdate","type":"event"},{"anonymous":false,"inputs":[{"indexed":false,"name":"sell_how_much","type":"uint256"},{"indexed":true,"name":"sell_which_token","type":"address"},{"indexed":false,"name":"buy_how_much","type":"uint256"},{"indexed":true,"name":"buy_which_token","type":"address"}],"name":"Trade","type":"event"}];

var web3 = new Web3(new Web3.providers.HttpProvider("http://localhost:8545"));
var contract = web3.eth.contract(abiArray).at(contractAddress);
var ethAdd = '0x7506c7BfED179254265d443856eF9bda19221cD7';
var mlnAdd = '0x4DffEA52b0B4b48c71385ae25de41CE6AD0Dd5a7';

var liveAskIDs = [];
var liveBidIDs = [];

function batchCancel(list){
    if list.length != 0 {
        var results = _.map(list, contract.cancel);
        list = _.reject(list, function(orderId, index){return results[index]});
    }
    return list;
}

var request = require('request');
request('https://api.kraken.com/0/public/Ticker?pair=MLNETH', function (error, response, body) {
    if (!error && response.statusCode == 200) {
        var data = JSON.parse(body);
        console.log(data['result']);
        var ask = data['result']['XMLNXETH']['a'];
        var bid = data['result']['XMLNXETH']['b'];

        var sellMLN = web3.toWei(ask[1], 'ether');
        var buyETH = web3.toWei(ask[0], 'ether')*ask[1];
        var sellETH = web3.toWei(bid[0], 'ether')*bid[1];
        var buyMLN = web3.toWei(bid[1], 'ether');

        console.log(ask);
        console.log([sellMLN, mlnAdd, buyETH, ethAdd]);
        console.log(bid);
        console.log([sellETH, ethAdd, buyMLN, mlnAdd]);

        liveAskIDs = batchCancel(liveAskIDs);
        liveBidIDs = batchCancel(liveBidIDs);

        contract.make(sellMLN, mlnAdd, buyETH, ethAdd);
        // liveAskIDs.push(getLastOrderId());
        
        contract.make(sellETH, ethAdd, buyMLN, mlnAdd);
        // liveAskIDs.push(getLastOrderId());
    }
});