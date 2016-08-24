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
};
let _variablesSourceCodeReplaceAfter = replaceWithSpecifyLine(_variablesOption);
fs.writeFileSync(_variabesPath, _variablesSourceCodeReplaceAfter);


// modify  _variables.styl  clear banner picture
let _variablesBannerOption = {
    fileName: '_variables.styl',
    soruceCode: fs.readFileSync(_variabesPath).toString(),
    lineNumber: 38,
    expectSourceCode: 'banner-url = "images/banner.jpg"',
    myExpectSourceCode: 'banner-url = ""'
};

let _variablesBannerSourceCodeReplaceAfter = replaceWithSpecifyLine(_variablesBannerOption);
fs.writeFileSync(_variabesPath, _variablesBannerSourceCodeReplaceAfter);


let _fontawesome_webfontOption={
    fileName: '_variables.styl',
    soruceCode: fs.readFileSync(_variabesPath).toString(),
    lineNumber: 28,
    expectSourceCode: 'font-icon-path = "fonts/fontawesome-webfont"',
    myExpectSourceCode: 'font-icon-path = "//cdn.bootcss.com/font-awesome/4.0.3/fonts/fontawesome-webfont"'
};
let _fontawesome_webfontSourceCodeReplaceAfter = replaceWithSpecifyLine(_fontawesome_webfontOption);
fs.writeFileSync(_variabesPath, _fontawesome_webfontSourceCodeReplaceAfter);



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
 * modify after-footer.ejs
 */
let _afterFooterEjsPath = path.join(_partialPath, 'after-footer.ejs');
let _afterFooterEjsOption = {
    fileName: 'after-footer.ejs',
    soruceCode: fs.readFileSync(_afterFooterEjsPath).toString(),
    lineNumber: 16,
    expectSourceCode: '<script src="//ajax.googleapis.com/ajax/libs/jquery/2.0.3/jquery.min.js"></script>',
    myExpectSourceCode: '<script src="//ajax.lug.ustc.edu.cn/ajax/libs/jquery/2.0.3/jquery.min.js"></script>'
}

let _afterFooterEjsSourceCodeReplaceAfter = replaceWithSpecifyLine(_afterFooterEjsOption);
fs.writeFileSync(_afterFooterEjsPath, _afterFooterEjsSourceCodeReplaceAfter);


/**
 *
 * modify header.ejs
 */
let headerejsPath=path.join(_partialPath, 'head.ejs');
let headerjsOption={
    fileName: 'head.ejs',
    soruceCode: fs.readFileSync(headerejsPath).toString(),
    lineNumber: 31,
    expectSourceCode: '    <link href="//fonts.googleapis.com/css?family=Source+Code+Pro" rel="stylesheet" type="text/css">',
    myExpectSourceCode: '    <link href="//fonts.lug.ustc.edu.cn/css?family=Source+Code+Pro" rel="stylesheet" type="text/css">'
};
let headerejsSourceCodeReplaceAfter = replaceWithSpecifyLine(headerjsOption);
fs.writeFileSync(headerejsPath, headerejsSourceCodeReplaceAfter);













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
