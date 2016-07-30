/**
 *
 * auto update hexo theme
 * 1.did not have to use minimist ,just use simple way
 * 2.like hexoserver-cli , use spawn clone git repo
 *
 *
 * Created by kimown on 16-7-24.
 */
'use strict';
const cp = require('child_process');
const fs = require('hexo-fs');
const path = require('path');
const log = require('util').log;
var cprocess;


// https://git.oschina.net/kimown/ExtJS.git
// https://github.com/hexojs/hexo-theme-landscape.git
// https://git.oschina.net/kimown/hexo-theme-landscape.git
const themeGitUrl = 'https://github.com/hexojs/hexo-theme-landscape.git';
const themeDirName = themeGitUrl.match(/\/\/(.*)\/(.*)\/(.*)\.git/)[3];

const commandList = [
    `rm -rf  ${themeGitUrl} ${themeDirName}-tmp`,
    'git commit -m powered_by_program_delete_tmp_files',
    'git push origin master',
    `git clone ${themeGitUrl} ${themeDirName}-tmp`,
    `git add ${themeDirName}-tmp/*`,
    'git commit -m powered_by_program_commit_tmp_files',
    'git push origin master',
    {
        modulePath: path.join(__dirname, 'auto-update-theme-fs.js'),
        execArgv: ['--harmony_destructuring', '--harmony_array_includes'],
        args: `${themeDirName}-tmp`
    }

];

executeCmd(commandList);


function executeCmd(cmdList) {

    cmdList.forEach((v)=> {
        if (typeof v == 'object') {
            forkProcess(v.modulePath, v.args, v.execArgv);
        } else {
            spawnSync(v);
        }
    });
}


/**
 * download theme landscape
 * @returns {*|Promise.<T>}
 */
function downloadTheme() {
    let cmd = config.cmd;
    let option = {
        cwd: __dirname,
        stdio: 'inherit'
    };
    return spawn(cmd, option).then((data)=> {
        return console.log(data);
    })

}


/**
 * promise wrapper
 * @param command
 * @param args
 * @param option
 */
function spawn(cmd, option) {
    let args = cmd.split(' ');
    let command = args.shift();
    return new Promise((resolve, reject)=> {
        let task = cp.spawn(command, args, option);

        task.on('close', (code) => {
            if (code == 0) {
                resolve("installed hexoserver finished");
            } else if (code == 128) {
                let themeDir = config.themeDir;
                log(`will remove directory ${themeDir}`)
                fs.rmdirSync(path.join(__dirname, themeDir));
                downloadTheme();
            }

        });

        task.on('error', (err)=> {
            exitProcess(2);
        });
    })
}

function spawnSync(cmd, option) {
    option = option || {
            cwd: __dirname,
            stdio: 'inherit'
        };
    let args = cmd.split(' ');
    let command = args.shift();
    return cp.spawnSync(command, args, option);
}


/**
 *  http://stackoverflow.com/questions/34096458/passing-node-flags-args-to-child-process
 *  https://social.msdn.microsoft.com/Forums/en-US/058f3383-0551-4cb8-99c1-558d7b5bbce3/nodejs-web-apps-nodejs-app-with-childprocess-fork-call-failes-with-error-listen-eaddrinuse?forum=opensourcedevwithazure
 * 　http://stackoverflow.com/questions/18634296/send-error-to-parent-from-child-using-fork
 * @param modulePath
 * @param args
 * @param execArgv
 * @returns {*}
 */
function forkProcess(modulePath, args, execArgv) {
    let argsAr = args.split(' ');
    cprocess = cp.fork(modulePath, argsAr, {execArgv: ['--debug=5859'].concat(execArgv)});
    cprocess.send('Begin execute fs operation');
    cprocess.on('message', function (result) {
        // Receive results from child process
        if (result.ok) {
            executeCmdAfterModified();
        } else {
            console.error("修改主题文件失败，请重新对比修改规则和最新的主题文件");
            fs.rmdirSync(path.join(__dirname, `${themeDirName}-tmp`));
            process.exit(1);
        }
    });
}


/**
 * execute cmd after file changed successfully
 */
function executeCmdAfterModified() {
    const commandList = [
        `rm -rf ${themeDirName}`,
        `mv ${themeDirName}-tmp landscape`,
        `git add landscape/*`,
        'git commit -m powered_by_program_commit_change_files',
        'git push origin master'
    ];
    executeCmd(commandList);
}








