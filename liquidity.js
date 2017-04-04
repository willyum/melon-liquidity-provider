var request = require('request');
request('https://api.kraken.com/0/public/Ticker?pair=MLNETH', function (error, response, body) {
    if (!error && response.statusCode == 200) {
        var data = JSON.parse(body);
        console.log(data['result']);
    }
});