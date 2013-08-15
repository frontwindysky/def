var fs = require("fs");
var Path = require("path");

var _=require("underscore");

var Child = require("./../utils/child");
var config = require("./config");

var pluginPath = Path.resolve(__dirname,'./../../plugin/');


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
	this.init();
}

Plugin.prototype = {
	checkInstalled : function(){
		var self = this;
		if(this.npm){
			console.log("install checking:" + self.npm);
			var check = Child.exec("npm ls " + this.npm + " -g",function(err,stdout,stderr){

				if(stdout.indexOf(self.npm) != -1){
					
					console.log(self.npm + " installed");
					self.status = 'ok';
					self.version = stdout.match(self.npm + "@([\\S]+)")[1];
					//self.startSever();
					self.checkLatest();
				}else{
					self.checked = true;
				}
			});
		}else{
			self.checked = true;
		}
	},
	checkLatest : function(){
		var self = this;
		console.log("version checking:" + self.npm);
		Child.exec("npm view "+ self.npm, function(err,stdout,stderr){
			var pluginObj = eval("("+stdout+")");
			if(pluginObj.version !== self.version){
				self.hasLatest = pluginObj.version;
				console.log(self.npm + " has new version");
			}
			self.checked = true;
		});		
	},
	install: function(){
		var self = this;
		this.status = "installing";
		console.log(self.name + " is installing...");	
		var child = Child.exec("npm install -g " + this.npm, function(err,stdout,stderr){
			if(err !== null){
				self.status = null;
			}else{
				self.status = "ok";
				self.startSever();
			}

		});	
		child.stdout.on('data',function(data){
			console.log(data);
		});
	},
	upgrade : function(){
		var self = this;
		if (self.hasLatest){
			console.log(self.name + " is upgradeing...");
			this.status = "upgradeing";	
			Child.exec("npm update -g " + this.npm, function(err,stdout,stderr){

				if(err !== null){
					self.upgradeStatus = "error";
				}else{
					self.status = "ok";
					self.version = self.hasLatest;
					self.hasLatest = null;
					console.log(self.name + " has update to latest @"+self.version);

				}
			});
		}else{
			return false;
		}
	},
	startSever : function(){
		var self = this;
		console.log(self.name + " is starting...");
		var child = Child.run(self.start,function(err,stdout,stderr){
			if(err || stderr){
				console.log("error:" + err + stderr);
				self.status = "error";
				//self.openUI();
			}
		});
		child.stdout.on("data",function(data){
			console.log(data);
			self.timer && clearTimeout(self.timer);
			self.timer = setTimeout(function(){
				self.status = 'started';
				self.openUI();
			},2000);
		});
		process.on("exit",function(){
			child.kill();
		});
		self.status = "starting";
	},
	openUI : function(){
		var self = this;
		if(self.status == 'started'){
			Child.start("http://localhost:" + self.port + "/",function(){});
		}else{
			setTimeout(function(){self.openUI();},1000);
		}	
	},
	openURL : function(){
		var self = this;
		Child.start(self.url,function(){});		 
	},
	startup : function(){
		var self = this;		
		if(self.start){
			if(self.status == 'ok'){
				self.startSever();
			}else if(self.status == 'started'){
				self.openUI();
			}else if(!self.status){
				self.install();
			}
		}else{
			self.openURL();
		}
	},
	init : function(){
		this.checkInstalled();
	}
}


exports = module.exports = {
	list : {},
	customPluginlist : {},
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
	add : function(name,customPlugin){
		var p = {name:name};
		p.type =	customPlugin.cmd ? "cmd" : 
					customPlugin.link ? "link" :
					customPlugin.apps ? "apps" :
					customPlugin.iframe ? "iframe" : 0;
		p.value = customPlugin.cmd || customPlugin.link || customPlugin.apps || customPlugin.iframe;
		config.set(name,p);
		this.customPluginlist = config.all();
		return p
	},
	startCustom : function(name){
		var p = this.customPluginlist[name];
		switch(p.type){
			case 'apps':
			case 'link':
			case 'iframe':
				Child.start(p.value,function(){});
				breaks;
			case 'cmd':
				Child.exec(p.value,function(){});
				break;
		}
	},
	delCustom : function(name){
		config.del(name);
		this.customPluginlist = config.all();
	},
	init : function(){
				var pluginlist = fs.readdirSync(pluginPath);
				for(plugin in pluginlist){
					var p = require(pluginPath + Path.sep + pluginlist[plugin]);
					if(this.verify(p)){
						this.list[p.name] = new Plugin(p);
					}
				}
				this.customPluginlist = config.all();
				this._status = 'on';
			}
}
