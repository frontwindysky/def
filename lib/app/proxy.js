var httpProxy = require("http-proxy");

module.exports = {
	start : function(pluginlist){
		var vmPort,httpxPort;
		for (p in pluginlist){
			switch (p){
				case "Vmarket":
					vmPort = pluginlist[p].port;
					break;
				case "HttpX":
					httpxPort = pluginlist[p].port;
					break;
			}
		}
		httpProxy.createServer(function(req,res,proxy){
			if(req.headers.host.indexOf("tbcdn.cn")!==-1){
				port = httpxPort;
			}else{
				port = vmPort;
			}
			proxy.proxyRequest(req,res,{
				host:"localhost",
				port:port
			})
		}).listen(80);
		console.log("def 反向代理已经启动");
	}
}
