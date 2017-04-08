var hbsPrepare = require('../scripts/tasks/prepare-hbs'),
    fs = require('fs'),
    hbs = require('handlebars'),
    parser = require('markdown-parse');

//setup handlebars
hbsPrepare.RegisterHelpers();
hbsPrepare.RegisterPartials();

//config
var postsDir = __dirname + '/../../www_src/posts/',
    postsContentDir = postsDir + 'content/',
    compiledPostsDir = __dirname + "/../../www_dist/posts/",
    parsedPostsAry = [];

if (fs.existsSync(postsDir)) {
    //compile posts
    fs.readdirSync(postsContentDir).forEach(function(filename) {
        var matches = /^([^.]+).md$/.exec(filename);
        if (!matches) {
            return;
        }

        var postName = matches[1],
            post = fs.readFileSync(postsContentDir + '/' + filename, 'utf8'),
            compiledPostDirname = compiledPostsDir + postName,
            compiledPostFilename = compiledPostDirname + "/index.html";

        parser(post, function(err, result) {
            parsedPostsAry.push(result);
        });
    });

    console.log(parsedPostsAry);
}

