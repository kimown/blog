/**
 *
 * modify file
 *
 *   --harmony_destructuring --harmony_array_includes
 *
 * Created by kimown on 16-7-24.
 */
'use strict';
const fs = require('fs');
const path = require('path');
const assert = require('assert');

const themeDirName = process.argv[2] ? process.argv[2] : 'hexo-theme-landscape-tmp';

const themeDirPath = path.join(__dirname, themeDirName);

const cssDirPath = path.join(themeDirPath, 'source', 'css');

const _partialPath=path.join(themeDirPath,'layout','_partial');


process.on('message', function (m) {
    console.log("fs:" + m);
});

/**
 * modify   _variables.styl
 */

let _variabesPath = path.join(cssDirPath, '_variables.styl');
let _variablesOption = {
    fileName: '_variables.styl',
    soruceCode: fs.readFileSync(_variabesPath).toString(),
    lineNumber: 9,
    expectSourceCode: 'color-background = #eee',
    myExpectSourceCode: 'color-background = #171f26'
}

let _variablesSourceCodeReplaceAfter = replaceWithSpecifyLine(_variablesOption);
fs.writeFileSync(_variabesPath, _variablesSourceCodeReplaceAfter);


/**
 *
 * modify style.styl
 *
 */
let stylePath = path.join(cssDirPath, 'style.styl');
let styleOption = {
    fileName: 'style.styl',
    soruceCode: fs.readFileSync(stylePath).toString(),
    lineNumber: 64,
    expectSourceCode: '  background: color-background',
    myExpectSourceCode: ''
}

let styleSourceCodeReplaceAfter = replaceWithSpecifyLine(styleOption);
fs.writeFileSync(stylePath, styleSourceCodeReplaceAfter);



/**
 *
 * modify header.ejs
 *
 */
let headerEjsPath = path.join(_partialPath, 'head.ejs');
let styleOption = {
    fileName: 'header.ejs',
    soruceCode: fs.readFileSync(headerEjsPath).toString(),
    lineNumber: 1,
    expectSourceCode: '  <div id="banner"></div>',
    myExpectSourceCode: ''
}

let styleSourceCodeReplaceAfter = replaceWithSpecifyLine(styleOption);
fs.writeFileSync(stylePath, styleSourceCodeReplaceAfter);






console.log('change theme file successfully,exiting sub process!!');
process.send({'ok': true});
process.exit(0);


/**
 * only replace specify line
 * now,node 4.* did not support destructure
 */
function replaceWithSpecifyLine(option) {
    let {fileName,soruceCode,lineNumber,expectSourceCode,myExpectSourceCode }=option;
    let sourceCodeAr = soruceCode.split('\n');
    let soruceCodeSpecifyLine = sourceCodeAr[lineNumber];
    try {
        assert.ok([expectSourceCode, myExpectSourceCode].includes(soruceCodeSpecifyLine),
            `${fileName} encounter a problem!!WARNING: the old way changing code is outdated!!`
        );
    } catch (e) {
        process.send({'ok': false});
    }
    sourceCodeAr[lineNumber] = myExpectSourceCode;
    return sourceCodeAr.join('\n');
}
