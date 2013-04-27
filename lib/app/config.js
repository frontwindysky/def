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
		console.log('start write');
		fs.writeFileSync(configFile,JSON.stringify(config));
		console.log('end write');
	},
	"addTask" : function(_path){
		var defFile = this.get("root") + path.sep + '.def';
		var defObj;
		if(fs.existsSync(defFile)){
			defObj = JSON.parse(fs.readFileSync(defFile));
			defObj.continueTaskList.push(_path);
		}else{
			defObj = {};
			defObj.continueTaskList = [_path];
		}
		fs.writeFileSync(defFile,JSON.stringify(defObj));
	},
	"initTask" : function(_path,taskname){
		
		var taskFile = this.get("root") + _path + path.sep + "/.task";
		var task = {};
		task.taskname = taskname;
		task.status = "continue";
		task.assets = [];
		task.demo = [];

		fs.writeFileSync(taskFile,JSON.stringify(task));

	},
	"getTaskList" : function(){
		var defFile = this.get("root") + path.sep + '.def';
		var defObj;
		if(fs.existsSync(defFile)){
			defObj = JSON.parse(fs.readFileSync(defFile));
			return defObj.continueTaskList;
		}else{
			return [];
		}
	}
}
