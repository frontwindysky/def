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
				exec("npm install -g " + plugin.name, function(){
								
				})
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
