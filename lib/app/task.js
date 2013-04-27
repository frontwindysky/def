var fs = require("fs");
var path = require("path");
var config = require("./config");
var pinyin = require("./../utils/pinyin");
var dir = require("./../utils/dir");

function preZero(num){
	if(num < 10){
	   return "0" + num;
	}else{
		return num;
	}
}

exports = module.exports = {
	
	create : function(taskname){
		var folder = pinyin(taskname);
		var root = config.get('root');
		var now = new Date();
		var taskPath = path.sep + now.getFullYear() + preZero(now.getMonth()+1) + path.sep + folder;
		var abspath = root + taskPath;
		if(fs.existsSync(abspath)){
			return "DIREXIST";
		}else{
			dir.create(abspath);
			
			config.addTask(taskPath);
			
			config.initTask(taskPath,taskname);
			
			return "SUCCESS";
		}
	},

	getCurrentList : function(){
		var tasklist = config.getTaskList();
		var tasks = [];
		for(var i = tasklist.length-1; i>=0; i--){
			tasks.push({
				path : tasklist[i],
				detail : JSON.parse(fs.readFileSync(config.get('root')+tasklist[i]+path.sep+'.task'))
			});
		};
		return tasks;
	}

}
