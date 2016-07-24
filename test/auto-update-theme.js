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


let cmd='git clone https://github.com/hexojs/hexo-theme-landscape.git';
let option = {
    cwd: __dirname,
    stdio: 'inherit'
};
spawn(cmd,option)
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
            } else {
                exitProcess(2);
            }

        });

        task.on('error', (err)=> {
            exitProcess(2);
        });
    })


}






