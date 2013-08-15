var exec = require("child_process").spawn;

var child = exec("start",["node"],{});


child.stdout.on("data",function(d){
	console.log(d.toString());
})

console.log('start');
process.stdin.on("data",function(data){
	child.stdin.write(data);
})

