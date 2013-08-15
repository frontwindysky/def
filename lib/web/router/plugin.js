var plugin = require("./../../app/plugin");


var Plugin = {
	"install" : function(req,res,upgrade){
		var _plugin = plugin.get(req.query.name);
		if(!_plugin.status){
			_plugin.install();
		}else if(_plugin.hasLatest){
			_plugin.upgrade();
		}
		var checkStatus = function(req,res){
			switch (_plugin.status)
			{
			case "installing":
			case "upgradeing":
				setTimeout(function(){checkStatus(req,res)},1000);
				break;
			case "ok":
			case "upgradeError":
			case null:
				res.jsonp(_plugin);
				break;
			}
		}
		checkStatus(req,res);
	},
	"checkStatus" : function(req,res){
		function checker(){
			for (p in plugin.list){
				if (!plugin.list[p].checked){
					setTimeout(function(){checker();},1000);
					return;
				}
			}
			res.jsonp(plugin.list);
		}
		checker();
	},
	"state" : function(req,res){
		var _plugin = plugin.get(req.query.name);
		res.jsonp(_plugin);
	},
	"upgrade" : function(req,res){
		var _plugin = plugin.get(req.query.name);
		_plugin.upgrade();

		var checkStatus = function(req,res){
			switch (_plugin.status)
			{
			case "upgradeing":
				setTimeout(function(){checkStatus(req,res)},1000);
				break;
			case "ok":
				res.jsonp({"result":"success","name":_plugin.name});
				break;
			case "upgradeError":
			case null:
				res.jsonp({"result":"failed","name":_plugin.name});
				break;
			}
		}
		checkStatus(req,res);
	},
	"start" : function(req,res){
		var _plugin = plugin.get(req.query.name);
		_plugin.startup();
		function starting(){
			if (_plugin.status!="started" && _plugin.start){
				setTimeout(function(){starting();},1000);
			}else{
				res.jsonp({"result":"success","name":_plugin.name});
			}
		}
		starting();
	},
	"add" : function(req,res){
		var cmd = req.query.cmd;
		var apps = req.query.apps;
		var link = req.query.link;
		var iframe = req.query.iframe;
		var name = req.query.name;
		var p = plugin.add(name,req.query);
		res.jsonp({"result":"success","plugin":p});
	},
	"startCustom" : function(req,res){
		plugin.startCustom(req.query.name);
		res.jsonp({"result":"success","name":req.query.name});
	},
	"delCustom" : function(req,res){
		plugin.delCustom(req.query.name);
		res.jsonp({"result":"success","name":req.query.name});
	}
}

module.exports = function(req,res){
	var subapp = req.params[1] || "index";
	Plugin[subapp](req,res);
}
