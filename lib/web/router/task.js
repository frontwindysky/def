
var task = require("./../../app/task");
var plugin = require("./../../app/plugin");

var dir = require("./../../utils/dir");

var taskApp = {
	"index" : function(req,res){
		res.render("myTask",{
			page : "taskList",
			tasklist :  task.getCurrentList()
		});
	},
	"add" : function(req,res){
		res.render("task_add",{
			page : "taskList"
		});
	},
	"create" : function(req,res){
		var result = task.create(req.query.taskname);

		switch (result){
			case "DIREXIST":
				res.jsonp({"state":"error","msg":"目录已存在"});
				break;
			case "SUCCESS":
				res.jsonp({"state":"success"});
				break;
		}
	},
	"all" : function(req,res){
		res.render("task_all",{
			page : "taskList",
			tasklist : task.getAll()
		});
	},
	"detail" : function(req,res){
		var taskObj = task.getDetail(req.query.task);
		//var currentFolder = taskObj.repos[0];
		var currentFolder = "a";
		//var filelist = task.getFullFileList(config.get("root")+path.sep+taskObj.path+path.sep+currentFolder);
		var filelist = task.getFolderList(taskObj.absPath);
		res.render("task_detail",{
			page : "taskDetail",
			task : taskObj,
			files : filelist,
			plugins : plugin.getAvailable()
		});
	},
	"addRepos" : function(req,res){
		var url = req.query.url,
			taskpath = req.query.taskpath;
		var result = task.addRepos(taskpath,url);
		if(result == 'EXIST'){
			res.jsonp({"status":"error","msg":"代码库已存在"});
		}else{
			res.jsonp({"status":"success"});
		}

	},
	"dir" : function(req,res){
		var absPath = req.query.path,
			folder = req.query.folder;
		var filelist = task.getFolderList(absPath,folder);
			res.jsonp(filelist);
	}
}

module.exports = function(req,res){
	var subapp = req.params[1] || "index";
	taskApp[subapp](req,res);
}
