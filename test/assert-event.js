/**
 *
 *
 * Created by kimown on 16-7-24.
 */


const assert = require('assert');
try {
    assert.ok(false);
}catch (e){
    console.log(e);
}


process.on('uncaughtException', (err) => {
    console.log(`Caught exception: ${err}`);
});
process.on('unhandledRejection', (reason, p) => {
    unhandledRejections.set(p, reason);
});
process.on('rejectionHandled', (p) => {
    unhandledRejections.delete(p);
});
process.on('uncaughtException', (err) => {
    console.log(`Caught exception: ${err}`);
});
process.on('SIGINT', () => {
    console.log('Got SIGINT.  Press Control-D to exit.');
});
process.on('SIGHUP', () => {
    console.log('Got SIGHUP signal.');

});

process.on('exit', (code) => {
    // do *NOT* do this
    setTimeout(() => {
        console.log('This will not run');
    }, 0);
    console.log('About to exit with code:', code);
});

// http://stackoverflow.com/questions/7310521/node-js-best-practice-exception-handling
