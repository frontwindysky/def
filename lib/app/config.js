var fs = require('fs');

var config = {};
var configFile = __dirname + "/../../etc/config";
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
	"addTask" : function(path){
		var defFile = this.get("root") + '/.def';
		var defObj;
		if(fs.existsSync(defFile)){
			defObj = JSON.parse(fs.readFileSync(defFile));
			defObj.continueTaskList.push(path);
		}else{
			defObj = {};
			defObj.continueTaskList = [path];
		}
		fs.writeFileSync(defFile,JSON.stringify(defObj));
	},
	"initTask" : function(path,taskname){
		
		var taskFile = this.get("root") + path + "/.task";
		var task = {};
		task.taskname = taskname;
		task.status = "continue";
		task.assets = [];
		task.demo = [];

		fs.writeFileSync(taskFile,JSON.stringify(task));

	},
	"getTaskList" : function(){
		var defFile = this.get("root") + '/.def';
		console.log(defFile);
		var defObj;
		if(fs.existsSync(defFile)){
			defObj = JSON.parse(fs.readFileSync(defFile));
			return defObj.continueTaskList;
		}else{
			return [];
		}
	}
}
