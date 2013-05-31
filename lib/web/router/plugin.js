
var task = require("./../../app/task");
var plugin = require("./../../app/plugin");

var exec = require("child_process").exec;


var Plugin = {
	"install" : function(req,res){
		var _plugin = plugin.get(req.query.name);
		_plugin.install();
		
		var thisfun = function(req,res){
			if(_plugin.status !== "ok"){
				setTimeout(function(){thisfun(req,res)},1000);	
			}else{
				res.jsonp({pluginName:_plugin.name,status:"success"});
			}		
		}
		thisfun(req,res);
	},
	state : function(req,res){
		var _plugin = plugin.get(req.query.name);
		res.jsonp(_plugin);
	}
}

module.exports = function(req,res){
	var subapp = req.params[1] || "index";
	Plugin[subapp](req,res);
}
