var fs = require("fs");
var Path = require("path");
var exec = require("child_process").exec;

var _=require("underscore");

var pluginPath = Path.resolve(__dirname,'./../../plugin/');
var config = require("./config");

var configPath = config.get("root") + Path.sep + '.config';
var pluginConfigFile = configPath + Path.sep + 'plugin';

/*
 *接入脚本格式：
 *	{
 		name:<npm.module.name>,//vmarket
		description:"",
		server:"<command line>",//vm
		settingPage:"/setting",
		workingPage:"/working"
	}
 *
 *
 *
 *
 */

var Plugin = function(plugin){
	_.extend(this,plugin);
	this.status = "failed";
}

Plugin.prototype = {
	install: function(){
		var _self = this;
		this.status = "installing";		
		exec("npm install -g " + this.name, function(err,stdout,stderr){

			//exec("npm install -g tbdef", function(err,stdout,stderr){
			//console.log("err:\n"+ typeof(err) + "\n" + err);
			//console.log("stdout:\n" + typeof(stdout) + "\n" + stdout);
			//console.log("stderr:\n"+ typeof(stderr) + "\n" + stderr);

			if(err !== null){
				_self.status = "failed";
			}else{
				_self.status = "ok";
			}
		});	
	},
	update : function(){
				 
	}
}


exports = module.exports = {
	list : {},
	verify : function(plugin){
				return plugin.name &&
					plugin.description
			},
	getAll : function(){
				var pluginlist = fs.readdirSync(pluginPath);
				var plugins = [];
				for(plugin in pluginlist){
					var p = require(pluginPath + Path.sep + pluginlist[plugin]);
					if(this.verify(p)){
						var pluginObj = new Plugin(p); 
						plugins.push(pluginObj);
						this.list[p.name] = pluginObj;
					}
				}
				return plugins;
			},
	get : function(plugin){
			return this.list[plugin.name];
			},
	start : function(plugin){
			
			},
	setting : function(plugin){
			  
			},
	bind : function(){
			
			}
}
