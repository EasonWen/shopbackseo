const request = require("request");
const cheerio = require("cheerio");

const path = require('path');
const fs = require('fs');

let query = {
	url: 'input.html',//'http://www.google.com',
	title:{
		qty:0,
		filter: /<title>/,
		msg:'   This HTML without <title> tag'
	},
	description:{
		qty:0,
		filter: /<meta name="descriptions"/,//description
		msg:'   This HTML without <meta name="descriptions" tag'
	},
	keywords:{
		qty:0,
		filter: /<meta name="keywoeds"/,//keywords
		msg:'   This HTML without <meta name="keywoeds" tag'
	},
	img:{
		qty:0,
		filter: /<img *[^alt]*?>/,
		msg:'   There are {{qty}} <img> tag without alt attribute'
	},
	a:{
		qty:0,
		filter: /<a *[^rel]*?>/,
		msg:'   There are {{qty}} <a> tag without rel attribute'
	},
	strong:{
		qty:15,
		filter: /<strong>/,
		msg:'   There HTML have more than {{qty}} <strong> tag'
	},
	h1:{
		qty:1,
		filter: /<h1>/,
		msg:'   There HTML have more than {{qty}} <h1> tag'
	}
};

const argv = process.argv.splice(2);
argv.forEach(function (v, i) {
	let p = v.split('=');
	if(typeof query[p[0]] !='undefined'){
		if(typeof query[p[0]].qty !='undefined'){
			try{
				query[p[0]].qty = parseInt(p[1]);
			}catch(ex){}
		}else{
			query[p[0]] = p[1];
		}
	}
});

if(query.url.indexOf('http')!=-1){
	 parseUrl ();
}else{
	parseFile ();
}
function parseFile () {
	const filepath = path.join(__dirname, query.url);
	fs.access(filepath, function (err) {
		if (err) {
			console.log(err);
		} else {
			fs.readFile(filepath, 'utf8', function (err, data) {
                if (err) {
					console.log(err);
                } else {
					parseData(data);
				}
			});
		}
	});
}
function parseUrl () {
	request({
		url: query.url,
		method: 'GET'
	}, function(err, r, data) {
		if (err) {
			console.log(err);
		} else {
			parseData(data);
		}
	});
}

function parseData(data){
	const html = data.toString();
	//
	let res_text = [' console output:'];
	for(let v in query){
		let res = filterTag(html,[query[v].filter]);
		if(res.length>0){
			switch(v){
				case 'title':
				case 'description':
				case 'keywords':
					if(res[0].qty == query[v].qty){
						res_text.push(query[v].msg.replace('{{qty}}', res[0].qty));
					}
					break;
				case 'img':
				case 'a':
				case 'strong':
				case 'h1':
					if(res[0].qty > query[v].qty){
						res_text.push(query[v].msg.replace('{{qty}}', res[0].qty));
					}
					break;
			}
		}
	}
	console.log(res_text.join('\r\n'));
}
function filterTag(string, tags){
	var str = string.replace(/\r?\n/g,'');
	let result = [];
	tags.forEach((v, i) => {
		var e = new RegExp(v, 'gi');
		let res = str.match(e);
		let obj = {
			tag: v,
			qty: res!=null?res.length:0,
			res:res
		};
		result.push(obj);
	});
	return result;
}