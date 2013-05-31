var fs = require("fs");
var Path = require("path");
var exec = require("child_process").exec;

var _=require("underscore");

var Port = require("./../utils/port");
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
	this.status = "unavailable";
	this.init();	
}

Plugin.prototype = {
	checkInstalled : function(){
		var self = this;
		exec("npm ls " + this.name + " -g",function(err,stdout,stderr){
			if(stdout.indexOf(self.name) != -1){
				self.status = 'ok';
				self.version = stdout.match(self.name + "@([\\S]+)")[1];
				self.startSever();
				self.checkLatest();
			}
		});			  
	},
	install: function(){
		var _self = this;
		this.status = "installing";		
		exec("npm install -g " + this.name, function(err,stdout,stderr){

			//exec("npm install -g tbdef", function(err,stdout,stderr){
			//console.log("err:\n"+ typeof(err) + "\n" + err);
			//console.log("stdout:\n" + typeof(stdout) + "\n" + stdout);
			//console.log("stderr:\n"+ typeof(stderr) + "\n" + stderr);

			if(err !== null){
				_self.status = "unavailable";
			}else{
				_self.status = "ok";
			}
		});	
	},
	checkLatest : function(){
		var self = this
		exec("npm view "+ this.name, function(err,stdout,stderr){
			var pluginObj = eval("("+stdout+")");
			if(pluginObj.version !== self.version){
				self.hasLatest = pluginObj.version;
			};
		});	   
	},
	startSever : function(){
		var self = this;
		Port.pop(function(p){
			self.port = p;
			var cmd = _.template(self.sever,{port:p});
			exec(cmd,function(err,stdout,stderr){
				console.log(err);
			})	
		})			 
	},
	init : function(){
		this.checkInstalled();
	},
	update : function(){
				 
	}
}


exports = module.exports = {
	list : {},
	_status : "off",
	verify : function(plugin){
				return plugin.name &&
					plugin.description
			},
	getAll : function(){
				if(this._status=='off'){
					this.init();
				}
				return _.toArray(this.list);
			},
	getAvailable : function(){
			return _.filter(this.getAll(),function(p){
				return p.status == 'ok';
			})
	},
	get : function(pluginName){
			return this.list[pluginName];
			},
	start : function(plugin){
			
			},
	setting : function(plugin){
			  
			},
	init : function(){
				var pluginlist = fs.readdirSync(pluginPath);
				for(plugin in pluginlist){
					var p = require(pluginPath + Path.sep + pluginlist[plugin]);
					if(this.verify(p)){
						this.list[p.name] = new Plugin(p);
					}
				}
				this._status = 'on';
			}
}
