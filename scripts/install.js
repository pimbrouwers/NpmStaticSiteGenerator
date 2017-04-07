var fs = require('fs'),
    ncp = require('ncp').ncp;

//config
var dir = __dirname + '/../../'
installDir = __dirname + '/install/'
srcDir = dir + 'www_src/'
distDir = dir + 'www_dist/';

//distDir
if (!fs.existsSync(distDir)) {
    fs.mkdirSync(distDir);
}

//src
if (!fs.existsSync(srcDir)) {
    fs.mkdirSync(srcDir);
}

ncp(installDir, srcDir, function(err) {
    if (err) {
        return console.error(err);
    }

    console.log('www_src installed!');
});
