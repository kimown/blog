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

// https://git.oschina.net/kimown/ExtJS.git
const config = {

    cmd: 'git clone https://git.oschina.net/kimown/ExtJS.git'
};
var a;
try {
    a=spawnSync(config.cmd)
}catch (e){
    console.error(e);
}

spawnSync('git add ExtJS/*');

spawnSync("git commit");
spawnSync('git push origin master');

return ;

downloadTheme().then(()=> {
    return modifyThemeSourceCode();
});


/**
 * use git command to control file
 */
function initGitVCS(){


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
                let themeDir = config.cmd.match(/\/\/(.*)\/(.*)\/(.*)\.git/)[3];
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

function spawnSync(cmd,option){
    option=option||{
            cwd: __dirname,
            stdio: 'inherit'
        };
    let args = cmd.split(' ');
    let command = args.shift();
    return cp.spawnSync(command, args, option);
}








