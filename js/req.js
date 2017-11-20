// 標準
const request = require('request');

// インストール
const cheerio = require('cheerio')
const fs      = require("fs");

var inputString = '遙か彼方に小形飛行機が見える。';
var APL_ID = 'dj00aiZpPXlKd3BpUFp1cjFHMiZzPWNvbnN1bWVyc2VjcmV0Jng9MDU-';


var options = {
	url:'https://jlp.yahooapis.jp/KouseiService/V1/kousei',
	headers: {
		'User-Agent': 'Yahoo AppID:' + APL_ID
	},
	form: {
		sentence : inputString,
		output: 'xml',
	}
};

var callback = function(err, res, body) {
	var result = "NO RESULT";
	if (err) {
		result = 'HTTP failed:' + err;
	} else {
		if (res.statusCode === 200) {
			result = doXML2HTML(body);
		} else {
			result = 'HTTP failed:status=' + res.statusCode;
		}
	}
	
	fs.writeFileSync('out.html', result);
};

request.post(options, callback);


function doXML2HTML(xml){
// <ResultSet xmlns="urn:yahoo:jp:jlp:KouseiService" xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance" xsi:schemaLocation="urn:yahoo:jp:jlp:KouseiService https://jlp.yahooapis.jp/KouseiService/V1/kousei.xsd">
//   <Result>
//     <StartPos>0</StartPos>
//     <Length>2</Length>
//     <Surface>遙か</Surface>
//     <ShitekiWord>●か</ShitekiWord>
//     <ShitekiInfo>表外漢字あり</ShitekiInfo>
//   </Result>
//   <Result>
//     <StartPos>2</StartPos>
//     <Length>2</Length>
//     <Surface>彼方</Surface>
//     <ShitekiWord>彼方（かなた）</ShitekiWord>
//     <ShitekiInfo>用字</ShitekiInfo>
//   </Result>
//   <Result>
//     <StartPos>5</StartPos>
//     <Length>5</Length>
//     <Surface>小形飛行機</Surface>
//     <ShitekiWord>小型飛行機</ShitekiWord>
//     <ShitekiInfo>誤変換</ShitekiInfo>
//   </Result>
// </ResultSet>
	const $ = cheerio.load(xml, { xmlMode: true });
	if($('Result').length == 0){
		return "OK";
	}

	const out = cheerio.load('<table></table>');
	out('table').css({
		'border' : '0px',
		'border-spacing' : '0px',
		'border-collapse' : 'collapse',
	}).append(
		'<thead>' + 
		makeTr({
			'StartPos'		: '開始',
			'Length'		: '文字数',
			'Surface'		: '表記',
			'ShitekiWord'	: '候補',
			'ShitekiInfo'	: '詳細',
		})
		.replace(/<td>/g, '<th>')
		.replace(/<\/td>/g, '</th>') +
		'</thead>'
	);

	$('Result').map(function(i, el){
		return {
			'StartPos'		: $(this).children('StartPos').text(),
			'Length'		: $(this).children('Length').text(),
			'Surface'		: $(this).children('Surface').text(),
			'ShitekiWord'	: $(this).children('ShitekiWord').text(),
			'ShitekiInfo'	: $(this).children('ShitekiInfo').text(),
		};
	}).each(function(i, el){
		out('table').append(makeTr(el));
	});
	

	out('td, th').css({'border' : '1px solid'});
	
	return out.html();
}

function makeTr(lineObj){
	return "<tr>" +
		"<td>" + lineObj.StartPos + "</td>" +
		"<td>" + lineObj.Length + "</td>" +
		"<td>" + lineObj.Surface + "</td>" +
		"<td>" + lineObj.ShitekiWord + "</td>" +
		"<td>" + lineObj.ShitekiInfo + "</td>" +
		"</tr>";
}
