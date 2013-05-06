var fs = require("fs");
var path = require("path");
var exec = require("child_process").exec;

var _=require("underscore");

var pluginPath = './../../plugin/';
var config = require("./config");

var configPath = config.get("root") + path.sep + '.config';
var pluginConfigFile = configPath + path.sep + 'plugin';

exports = module.exports = {
	install : function(plugin){
				//exec("npm install -g " + plugin.name, function(err,stdout,stderr){
				var CP = exec("npm install -g tbdef", function(err,stdout,stderr){
					console.log("err"+ err);
					console.log("stdout" + stdout);
					console.log("stderr"+ stderr);
					if(stdout.indexOf('Error') > -1){
						console.log("hasError" + stdout);
					}
				});
				CP.on('exit',function(err){
					console.log('end');
				});

			},
	isRealPlugin : function(plugin){
				return plugin.name &&
					plugin.description &&
					plugin.start;
			},
	getAvoids : function(){
				var pluginlist = fs.readdirSync(pluginPath);
				var plugins = [];
					for(plugin in pluginlist){
						var p = require(pluginPath + pluginlist[plugin]);
						if(this.isRealPlugin(p)){
							plugins.push(p);
						}
					}
					return plugins;
			},	
	getPlug : function(plugin){
				
			},
	start : function(plugin){
			
			},
	setting : function(plugin){
			  
			},
	bind : function(){
			
			}
}
