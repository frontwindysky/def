var plugin = require("./../../app/plugin");

module.exports = function(req,res){
	res.set('Content-Type', 'text/html; charset=utf8');
	res.render("index",{
		plugin : plugin.list,
		customPluginlist : plugin.customPluginlist
	});	
}
