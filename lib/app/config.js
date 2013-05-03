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
	}
}
