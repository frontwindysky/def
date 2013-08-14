var fs = require('fs');
var path = require("path");
var dir = require("./../utils/dir");

var config = {};
var configFile = process.env.userprofile + path.sep + ".def";
module.exports = {
	"get" : function(key){
		if(fs.existsSync(configFile)){
			config = JSON.parse(fs.readFileSync(configFile));
			return config[key];
		}else{
			return '';
		}
	},
	"set" : function(key,value){
		if(fs.existsSync(configFile)){
			config = JSON.parse(fs.readFileSync(configFile));
		}
		config[key] = value;
		fs.writeFileSync(configFile,JSON.stringify(config));
	},
	"all" : function(){
		if(fs.existsSync(configFile)){
			return JSON.parse(fs.readFileSync(configFile));
		}else{
			fs.writeFileSync(configFile,JSON.stringify(config));
			return config;
		}
	},
	"del" : function(name){
		config = JSON.parse(fs.readFileSync(configFile));
		config[name] && delete(config[name]);
		fs.writeFileSync(configFile,JSON.stringify(config));
	},
	"setRoot" : function(root){
			if(!dir.isAbsDir(root)){
				return {"state":"error","msg":"没有此盘符"};
			}
			if(fs.existsSync(root)){
				this.set('root',root);
				return {"state":"success"};
			}else{
				try{
					dir.create(root);
					config.set('root',root);
					return {"state":"success"};
				}catch(e){
					return {"state":"error","msg":"目录无法创建"};
				}			
			}
	}
}
