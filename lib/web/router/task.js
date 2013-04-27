
var task = require("./../../app/task");


var taskApp = {
	"index" : function(req,res){
		var result = task.getCurrentList();
		res.render("task",{
			active : "task",
			tasklist : result
		});
	},
	"add" : function(req,res){
		res.render("task_add",{
			active : "task"
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
			active : "task"
		});
	}
}

module.exports = function(req,res){
	var subapp = req.params[1] || "index";
	taskApp[subapp](req,res);
}
