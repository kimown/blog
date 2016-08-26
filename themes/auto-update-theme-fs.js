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


process.on('message', function (m) {
    console.log("fs:" + m);
});

const themeDirName = process.argv[2] ? process.argv[2] : 'hexo-theme-landscape-tmp';
// const themeDirName = 'hexo-theme-landscape-tmp';
const themePath = path.resolve(__dirname, themeDirName);
const config = {
    ignore: true
};
const filePaths = {
    'cssPath': path.resolve(themePath, 'source/css'),
    '_partialPath': path.resolve(themePath, 'layout/_partial')
};

let modifyFileOption = [
    {
        "filePath": path.resolve(filePaths.cssPath, '_variables.styl'),
        "rules": [
            {
                "line": 10,
                "old": "color-background = #eee",
                "new": "color-background = #171f26"
            },
            {
                "line": 29,
                "old": `font-icon-path = "fonts/fontawesome-webfont"`,
                "new": `font-icon-path = "//cdn.bootcss.com/font-awesome/4.0.3/fonts/fontawesome-webfont"`
            },
            {
                "line": 39,
                "old": `banner-url = "images/banner.jpg"`,
                "new": `banner-url = ""`
            }
        ]
    },
    {
        "filePath": path.resolve(filePaths.cssPath, 'style.styl'),
        "rules": [
            {
                "line": 65,
                "old": "  background: color-background",
                "new": ""
            }
        ]
    },
    {
        "filePath": path.resolve(filePaths._partialPath, 'after-footer.ejs'),
        "rules": [
            {
                "line": 17,
                "old": `<script src="//ajax.googleapis.com/ajax/libs/jquery/2.0.3/jquery.min.js"></script>`,
                "new": `<script src="//staticfile.qnssl.com/jquery/2.0.3/jquery.min.js"></script>`
            },
            {
                "line": 20,
                "old": "'fancybox/jquery.fancybox'",
                "new": "'//staticfile.qnssl.com/fancybox/2.1.5/jquery.fancybox'"
            },
            {
                "line": 21,
                "old": "'fancybox/jquery.fancybox.pack'",
                "new": "'//staticfile.qnssl.com/fancybox/2.1.5/jquery.fancybox.pack'"
            }
        ]
    },
    {
        "filePath": path.resolve(filePaths._partialPath, 'head.ejs'),
        "rules": [
            {
                "line": 32,
                "old": `fonts.googleapis.com`,
                "new": `fonts.lug.ustc.edu.cn`
            }
        ]
    }
];

/**
 * add google analytics
 */
modifyFileOption.push(
    {
        "filePath": path.resolve(themePath, '_config.yml'),
        "rules": [
            {
                "line": 31,
                "old": `google_analytics:`,
                "new": `google_analytics: UA-83215567-1`
            }
        ]
    });
modifyFileOption.push(
    {
        "filePath": path.resolve(filePaths._partialPath, 'google-analytics.ejs'),
        "rules": {
            "line": 'ALL',
            "new": `
<% if (theme.google_analytics){ %>
<!-- Google Analytics -->
<script>
    (function(i,s,o,g,r,a,m){i['GoogleAnalyticsObject']=r;i[r]=i[r]||function(){
                (i[r].q=i[r].q||[]).push(arguments)},i[r].l=1*new Date();a=s.createElement(o),
            m=s.getElementsByTagName(o)[0];a.async=1;a.src=g;m.parentNode.insertBefore(a,m)
    })(window,document,'script','//o4jiepyc4.qnssl.com/analytics.js','ga');

    ga('create', '<%= theme.google_analytics %>', 'auto');
    ga('send', 'pageview');

</script>
<!-- End Google Analytics -->
<% } %>
`
        }

    }
);


replaceWithSpecifyLine(modifyFileOption);


console.log('change theme file successfully,exiting sub process!!');
process.send({'ok': true});
process.exit(0);


/**
 * only replace specify line
 * now,node 4.* did not support destructure
 */
function replaceWithSpecifyLine(filesOption) {
    try {

        filesOption.map((fileOption)=> {
            let {filePath, rules}=fileOption;
            let fileName = filePath.split('/').pop();
            if (!Array.isArray(rules)) {
                fs.writeFileSync(filePath, rules['new']);
            } else {
                let sourceCode = fs.readFileSync(filePath).toString();
                let sourceCodeAr = sourceCode.split('\n');
                rules.map((rule)=> {
                    let {line, old} = rule;
                    let now = rule['new'];
                    let soruceCodeSpecifyLine = sourceCodeAr[line - 1];

                    if (line == 'ALL') {
                        //replace all file
                        fs.writeFileSync(filePath, now);
                    } else {

                        config.ignore && assert.ok(soruceCodeSpecifyLine.search(old) != -1,
                            `${fileName} encounter a problem At ${line}
                    I want to find ${old},
                    but the file is ${soruceCodeSpecifyLine},
                    !!WARNING: the old way changing code is outdated!!`
                        );
                        sourceCodeAr[line - 1] = soruceCodeSpecifyLine.replace(old, now);
                    }

                });
                let currentSourceCode = sourceCodeAr.join('\n');
                fs.writeFileSync(filePath, currentSourceCode);
            }


        });

    } catch (e) {
        console.error(e);
        process.send({'ok': false});
    }


}
