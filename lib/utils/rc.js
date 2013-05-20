var exec = require('child_process').exec;
var util = require('util');
var colors = require('colors');

colors.setTheme({
    info: 'green',
    error: 'red'
});

var CML = {
    HELP: {
        git: 'git help',
        svn: 'svn help',
        tortoiseSVN: 'TortoiseProc.exe /command:about'
    },
    CO: {
        git: 'git clone %s',
        svn: 'svn checkout %s --username %s --password %s',
        tortoiseSVN: ''
    },
    ADD: {
        git: 'git add .',
        svn: 'svn add .',
        tortoiseSVN: ''
    },
    COMMIT: {
        git: 'git commit -m %s',
        svn: 'svn',
        tortoiseSVN: ''
    }
};

function log(error, data) {
    //设计到权限的问题，如果反馈，是cmd还是界面
    var prefix = '版本控制软件信息提示：';
    data = prefix + data;
    console.log(error ? data.error : data.info);
}

module.exports = {
    /**
     * 检查是否已经安装版本控制软件
     * @param type{String} 版本控制软件类型 git/svn/tortoiseSVN
     * @param callback 回调函数统一格式:错误对象error{Object}、操作信息data{String}
     */
    isInstallation: function (type, callback) {
        var child = exec(CML.HELP[type], function (error, stdout, stderr) {
            var data = '未安装';
            if (!error) {
                data = '已安装';
            }
            log(error, data);
            callback(error, data);
        });

        child.stdin.on('data', function(chunk) {
            process.stdout.write('data: ' + chunk);
        });

        child.stdin.on('end', function() {
            process.stdout.write('end');
        });
    },
    /**
     * 获取源码
     * @param type 类型
     * @param source 检出路径
     * @param path 存放路径
     * @param name 用户名
     * @param pwd 密码
     * @param callback 回调
     */
    checkout: function (type, source, path, name, pwd, callback) {
        process.chdir(source);
        exec(util.format(CML.CO[type], source, name, pwd), function (error, stdout, stderr) {
            var data = stdout;
            if (!error) {
                data = '下载失败';
            }
            callback(error, data);
        });
    },
    add: function (type, path, callback) {
        process.chdir(source);
        exec(CML.ADD[type], function (error, stdout, stderr) {
            var data = stdout;
            if (!error) {
                data = '添加失败';
            }
            callback(error, data);
        });
    },
    update: function (type, path, callback) {

    },
    merge: function (type, source, branch, path, name, pwd, callback) {

    },
    commit: function (type, source, path, msg, name, pwd, callback) {
        process.chdir(path);
        var commit = exec(util.format(CML.CO[type], msg, source, name, pwd), function (error, stdout, stderr) {
            var data = stdout;
            if (!error) {
                data = '失败';
            }
            callback(error, data);
        });
    }
};

/*
 疑点list:
 1.参数到底是对象好，还是一个一个单独好：单个好处该模块无需知道对象构成且需要哪些参数清晰明了；对象好处无需多个参数且不够透明化，即无法知道需要哪些参数
 2.git私密，比如需要手动填写密码改如何处理
 3.如果使用tortoiseSVN则所有操作得等用户出发后才会返回，那么callback该如果处理，这边也有timeout，不过就无法预知该操作是否有效
 4.git需要输入密码和用户名，一考虑提示设置无需密码和用户名
 5.在window下的cmd中无法检测git（因为他是依附于shell环境），除非node运行在shell环境下--在shell环境下运行

 需求list：
 1.模块分rc（utils）和scm（apps）
 2.rc只做版本控制方面的事情，不做配置文件方面的事情，每个方法都需要配置参数对象，对底层做svn/git的适配

 尝试
 单元测试
 colors
 */