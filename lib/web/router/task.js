var config = require("./../../app/config");
var fs = require("fs");
var dir = require("./../../utils/dir");
var pinyin = require("../../utils/pinyin");

function preZero(num){
	if(num < 10){
	   return "0" + num;
	}else{
		return num;
	}
}

var taskApp = {
	"index" : function(req,res){
		var tasklist = config.getTaskList();
		var tasks = [];
		for(var i = tasklist.length-1; i>=0; i--){
			tasks.push({
				path : tasklist[i],
				detail : JSON.parse(fs.readFileSync(config.get('root')+tasklist[i]+'/.task'))
			});
		};
		console.log(tasks);
		res.render("task",{
			active : "task",
			tasklist : tasks
		});
	},
	"add" : function(req,res){
		res.render("task_add",{
			active : "task"
		});
	},
	"create" : function(req,res){
		var taskname = req.query.taskname;
		var folder = pinyin(taskname);
		var root = config.get('root');
		var now = new Date();
		var taskPath = "/" + now.getFullYear() + preZero(now.getMonth()+1) + "/" + folder;
		var path = root + taskPath;
		if(fs.existsSync(path)){
			res.jsonp({"state":"error","msg":"目录已存在"});
		}else{
			dir.create(path);
			config.addTask(taskPath);
			config.initTask(taskPath,taskname);
			res.jsonp({"state":"success"});
		}
	},
	"all" : function(req,res){
		res.render("task_all",{
			active : "task"
		});
	}
}

module.exports = function(req,res){
	var subapp = req.params[1] || "index";
	taskApp[subapp](req,res);
}
