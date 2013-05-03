var exec = require("child_process").exec;
var express = require("express");

var app = express();


module.exports = {
	"init" : function(){
		app.set("views", __dirname + "/view/screen");
		app.set("view engine", "jade");
				
		//静态资源
		app.use("/static",express.static(__dirname + "/view/static"));
		
		app.get("/",require("./router/index"));

		//基础页面
		app.get(/^\/(\w+)(?:\/(\w+))?(?:\/(\w+))?/,function(req,res){
			require("./router/"+req.params[0])(req,res);
		});
	},
	"start" : function(){
		
		this.init();
		
		//多尝试几个端口，防止某些端口被占用
		var portList = [8001,8002,8003,8005,8006,8007,8008,8009];
		var i = 0;
		var port = false;
		while(!port && portList[i]){
			try{
				app.listen(portList[i]);
				port = true;
				
				exec("start http://localhost:"+portList[i]+"/",function(err,stdout,stderr){
					console.log('web start');
				});
			}catch(e){
				i++;
			}
		}
		
	}
};