var fs = require("fs");
var config = require("./../../app/config");
var dir = require("./../../utils/dir");

module.exports = function(req,res){
	switch (req.params[1]){
		case undefined:
			res.render("setting",{
				root : config.get('root'),
				active: "setting"
			});
			break;
		case "saveRoot":
			var root = req.query.rootDir;
			if(!dir.isAbsDir(root)){
				res.jsonp({"state":"error","msg":"没有此盘符"});
				break;
			}
			if(fs.existsSync(root)){
				res.jsonp({"state":"success"});
				config.set('root',root);
			}else{
				try{
					dir.create(root);
					config.set('root',root);
					res.jsonp({"state":"success"});
				}catch(e){
					res.jsonp({"state":"error","msg":"目录无法创建"});
				}			
			}
			break;
	}
}
