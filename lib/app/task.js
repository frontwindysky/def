var fs = require("fs");
var path = require("path");
var config = require("./config");
var pinyin = require("./../utils/pinyin");
var dir = require("./../utils/dir");
var _ = require("underscore");

var configPath = config.get("root") + path.sep + '.config';
var taskConfigFile = configPath + path.sep + 'task';

function preZero(num){
	if(num < 10){
	   return "0" + num;
	}else{
		return num;
	}
}

function getGitDirName(gitUrl){
	return encodeURIComponent(gitUrl).replace(/%\w{2}/g,'');
	//return gitUrl.match(/([^\.\/]+)\.git/)[1] + "_" + gitUrl.length;
}

function Task(taskname){
	this.taskname = taskname;
	this.dirname = pinyin(taskname);
	this.init();
}

_.extend(Task.prototype,{
	init : function(){
		var root = config.get('root');
		var now = new Date();
		this.path = now.getFullYear() + preZero(now.getMonth()+1) + path.sep + this.dirname;
		this.absPath = root + path.sep +  this.path;
		if(!fs.existsSync(this.absPath)){
			dir.create(this.absPath);
			this.taskFile = this.absPath + path.sep + ".task";
			this.status = "continue";
			this.repos = [];

			fs.writeFileSync(this.taskFile,JSON.stringify(this));
	 		this.register();		
		}else{
			throw('DIREXIST');
		}
	},
	register : function(){
		var taskObj;
		if(fs.existsSync(taskConfigFile)){
			taskObj = JSON.parse(fs.readFileSync(taskConfigFile));
			taskObj.currentTasks.push(this.path);
		}else{
			taskObj = {};
			taskObj.currentTasks = [this.path];
			dir.create(configPath);
		}
		fs.writeFileSync(taskConfigFile,JSON.stringify(taskObj));
	},
	addRepos : function(url){
		var exist = false;
		for(var i = 0, l = this.repos.length; i < l ; i++){
			if(this.repos[i][0] == url){
				exist = true;
				break;
			}
		}
		if(exist){
			return "EXIST";	
		}else{
			this.repos.push([url,getGitDirName(url)]);
			dir.create(this.absPath + path.sep + getGitDirName(url));
			fs.writeFileSync(this.taskFile,JSON.stringify(this));
			return "SUCCESS";
		}		   
	}
});


exports = module.exports = {
	cache : {},
	create : function(taskname){
		try{
			var task = new Task(taskname);
			this.cache[task.path] = task;
			return "SUCCESS";
		}catch(e){
			return e;
		}
	},
	getDetail : function(_path){
		if(!this.cache[_path]){
			this.cache[_path] = _.extend(JSON.parse(fs.readFileSync(config.get('root') + path.sep + _path + path.sep + ".task")),Task.prototype);
		}
		return this.cache[_path];
	},
	getCurrentList : function(){
		var currentTasks = [];
		if(fs.existsSync(taskConfigFile)){
			currentTasks = JSON.parse(fs.readFileSync(taskConfigFile)).currentTasks || [];
		}else{
			console.log('configfilenotexist');
		}

		var tasks = [];
		for(var i = currentTasks.length-1; i>=0; i--){
			tasks.push(this.getDetail(currentTasks[i]));
		};
		return tasks;
	},
	getAll : function(){
		var taskPaths = [], tasks = [];
		var root = config.get('root');
		var months = fs.readdirSync(root);
		for(m in months){
			if(/\d{6}/.test(months[m])){
				var ts = fs.readdirSync(root + path.sep + months[m]);
				for(t in ts){
					taskPaths.push(months[m] + path.sep + ts[t])
				}
			}
		}
		for(p in taskPaths){
			tasks.push(this.getDetail(taskPaths[p]));
		}
		return tasks
	},
	addRepos : function(_path,url){
		var task = this.getDetail(_path);

		return task.addRepos(url);
	},
	getFolderList : function(absPath,folder){
		var folderList = fs.readdirSync(absPath + (folder ? (path.sep + folder) : ''));
		//dir.getFullFiles(config.get("root"));
		//for(f in folderList){
		//	console.log(path.extname(folderList[f]))
		//}
		return folderList;
	}
}
