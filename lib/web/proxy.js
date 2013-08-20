var express = require("express");
var fs = require("fs");
var app = express();
//app.enable("trust proxy");


app.use(function(req,res,next){
	console.log(req.protocol);
	if(req.host.indexOf("tbcdn.cn")!==-1){
		res.redirect(req.protocol + "://" + req.host +":8060" + req.url);
	}else{
		res.redirest(req.protocol + "://" + req.host +":8050" + req.url)
	}
});

//app.listen(443);



var https = require("https");
var servers = https.createServer({
	key : fs.readFileSync('./ca/yuchun_nopass.key'),
	cert : fs.readFileSync('./ca/yuchun_nopass.crt')
},function(req,res){
  res.writeHead(200);
  res.end("hello world\n");	
});
//servers.listen(443);


var http = require("http");
var server = http.createServer(function(req,res){
		if(req.host.indexOf("tbcdn.cn")!==-1){
			http.request({
				hostname : "localhost",
				port : 8060,
				path : req.url,
				method : "get"
			},function(proxyres){
				proxyres.on("data",function(data){
					res.write(data)
				})
			}).end();			
		}
});
//server.listen(80);
