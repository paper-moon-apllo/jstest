const request = require('request');
const cheerio = require('cheerio')

var options = {
	url:'https://jlp.yahooapis.jp/KouseiService/V1/kousei',
	headers: {
		'User-Agent': 'Yahoo AppID:dj00aiZpPXlKd3BpUFp1cjFHMiZzPWNvbnN1bWVyc2VjcmV0Jng9MDU-'
	},
	form: {
		sentence : '遙か彼方に小形飛行機が見える。',
		output: 'xml',
	}
};

var callback = function(err, res, body) {
	if (!err && res.statusCode === 200) {
//		console.log(body);
		doXML2HTML(body);
	} else {
		console.log('aaa');
	}
};

request.post(options, callback);


function doXML2HTML(xml){
	console.log('RESULT');

	var $ = cheerio.load(xml, { xmlMode: true });
	$('Result').map(function(i, el){
		return $(this).text();
	}).each(function(i, el){
		console.log(el);
	});
}
