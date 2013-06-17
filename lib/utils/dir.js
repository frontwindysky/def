var path = require('path');
var fs = require('fs');
var os = require("os");

var exec = require("child_process").exec;
var spawn = require("child_process").spawn;
module.exports = {
	"create" : function(_path){
		var dirs = _path.split(path.sep);
		var i = 0;
		var len = dirs.length;
		var tempPath = dirs[i];
		while(i < len){
			if(tempPath!='' && !fs.existsSync(tempPath)){
				//linux下无权限在根目录下创建fide目录，要找到当前用户的目录todo
				fs.mkdirSync(tempPath);

			}
			i++;
			tempPath += path.sep + dirs[i];
		}
	},
	"isAbsDir" : function(dir){
		var driver = dir.split(path.sep)[0];
		return os.platform()=='linux' ? driver=='' : fs.existsSync(driver);
	},
	"getFullFiles" : function(_path){
		var dirsp = exec("dir /OG " + _path);
			dirsp.stdout.on("data",function(data){
				console.log(data.match(/\d{4}.+(?:\s)/g));
			})
	}
}

