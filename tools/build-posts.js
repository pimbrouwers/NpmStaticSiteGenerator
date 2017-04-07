var hbsConfig = require('../tools/tasks/configure-hbs'),
    fs = require('fs'),
    hbs = require('handlebars'),
    parser = require('markdown-parse');

//setup handlebars
hbsConfig.RegisterHelpers();
hbsConfig.RegisterPartials();

//config
var postsDir = __dirname + '/../www_src/posts/content',
    compiledPostsDir = __dirname + "/../www_dist/posts/",
    parsedPostsAry = [];

//compile posts
fs.readdirSync(postsDir).forEach(function(filename) {
    var matches = /^([^.]+).md$/.exec(filename);
    if (!matches) {
        return;
    }

    var postName = matches[1],
        post = fs.readFileSync(postsDir + '/' + filename, 'utf8'),
        compiledPostDirname = compiledPostsDir + postName,
        compiledPostFilename = compiledPostDirname + "/index.html";

    parser(post, function(err, result){
        parsedPostsAry.push(result);
    });
});

console.log(parsedPostsAry);
