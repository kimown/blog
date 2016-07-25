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

process.on('message', (err) => {
    console.log(`Caught exception: ${err}`);
});

// https://git.oschina.net/kimown/ExtJS.git
// https://github.com/hexojs/hexo-theme-landscape.git
// https://git.oschina.net/kimown/hexo-theme-landscape.git
const themeGitUrl = 'https://git.oschina.net/kimown/hexo-theme-landscape.git';
const themeDirName = themeGitUrl.match(/\/\/(.*)\/(.*)\/(.*)\.git/)[3];

const commandList = [

    //`git clone ${themeGitUrl} ${themeDirName}-tmp`,
    //`git add ${themeDirName}-tmp/*`,
    //'git commit -m powered_by_program',
    //'git push origin master',
    {
        modulePath: path.join(__dirname, 'auto-update-theme-fs.js'),
        execArgv:['--harmony_destructuring','--harmony_array_includes'],
        args: `${themeDirName}-tmp`
    }
];

commandList.forEach((v)=> {
    if (typeof v == 'object') {
        forkProcess(v.modulePath,v.args,v.execArgv);
    } else {
        spawnSync(v);
    }

});


return;

downloadTheme().then(()=> {
    return modifyThemeSourceCode();
});


/**
 * use git command to control file
 */
function initGitVCS() {


}
/**
 * modify theme source code
 * @returns {*|Promise.<T>}
 */

function modifyThemeSourceCode() {

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
var c;
function forkProcess(modulePath, args,execArgv) {
    let argsAr = args.split(' ');
    c=cp.fork(modulePath, argsAr,{ execArgv: ['--debug=5859'].concat(execArgv) });
    c.on('mescsage', function(m) {
        // Receive results from child process
        console.log('received: ' + m);
    });
    c.send('First Fun');

}








