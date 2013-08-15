var exec = require("child_process").exec;

var startCMD = (process.platform == 'win32')?"start":"open";
var runCMD = (process.platform == 'win32')?"start /B":"";
module.exports = {
	"start" : function(url,callback){
		return exec(startCMD + " " + url,callback);
	},
	"run" : function(cmd,callback){
		return exec(runCMD + " " + cmd,callback);
	},
	"exec" : function(cmd,callback){
		return exec(cmd,callback);
	}
}

