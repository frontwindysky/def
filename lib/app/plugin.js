var fs = require("fs");
var path = require("path");
var exec = require("child_process").exec;

var _=require("underscore");

var pluginPath = './../../plugin/';
var config = require("./config");

var configPath = config.get("root") + path.sep + '.config';
var pluginConfigFile = configPath + path.sep + 'plugin';

exports = module.exports = {
	list : [],
	install : function(plugin){
				this.list[plugin.name] = {"status":"installing"};
				var _self = this;		
				exec("npm install -g " + plugin.name, function(err,stdout,stderr){
				//exec("npm install -g tbdef", function(err,stdout,stderr){
					console.log("err:\n"+ typeof(err) + "\n" + err);
					console.log("stdout:\n" + typeof(stdout) + "\n" + stdout);
					console.log("stderr:\n"+ typeof(stderr) + "\n" + stderr);
					if(stdout.indexOf('Error') > -1){
						console.log("hasError" + stdout);
					}
					if(err !== null){
						_self.list[plugin.name].status = "failed";
					}else{
						_self.list[plugin.name].status = "ok";
					}
				});

			},
	getStatus : function(plugin){
				//return this.list[plugin.name].status;
			},
	update : function(plugin){
			 	
			 },
	verify : function(plugin){
				return plugin.name &&
					plugin.description &&
					plugin.start;
			},
	getInstalled : function(){
				var pluginlist = JSON.parse(fs.readdirSync(pluginPath));
				var plugins = [];
					for(plugin in pluginlist){
						var p = require(pluginPath + pluginlist[plugin]);
						if(this.verify(p)){
							plugins.push(p);
						}
					}
					return plugins;
			},	
	get : function(plugin){
				
			},
	start : function(plugin){
			
			},
	setting : function(plugin){
			  
			},
	bind : function(){
			
			}
}
