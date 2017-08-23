var hbsPrepare = require('../scripts/tasks/prepare-hbs'),
    hbs = require('handlebars'),    
    fs = require('fs'),
    path = require('path'),
    marked = require('marked'),
    yaml = require('yamljs');

//setup handlebars	 
hbsPrepare.RegisterHelpers();
hbsPrepare.RegisterPartials();

function BuildPage(siteData, fileNameNoExt, postsDir, compiledDirname) {
	var compiledFilename = path.resolve(compiledDirname, "index.html"),
		markdownFilename = path.resolve(fileNameNoExt + '.md'),
		hbsTemplateFilename = path.resolve(postsDir, 'post.hbs');
	fs.readFile(hbsTemplateFilename, "utf8", function(err, page){
		if (err) throw err;
	
		fs.readFile(markdownFilename, "utf8", function(err, post) {
			if (err) throw err;

			var pageTemplate = hbs.compile(page),
	    		pageContext = {},
	    		postYaml;

	    	//parse yaml
			var re = /-{3}([^)]+)-{3}/gm,
				match,
				count = 1;

			do {				
				match = re.exec(post);			
				
				if (match && count === 1) {
					postYaml = match[1];
					pageContext = yaml.parse(postYaml);
				}

				count++;
			} while (match && count < 2);

			marked(post.replace(postYaml, ""), function (err, postHtml) {		
	    		if (err) throw err;												

				pageContext.body = postHtml;
				pageContext.siteData = siteData;

				//write page to disk
				fs.writeFile(compiledFilename, pageTemplate(pageContext), function(err) {
				    if(err) {
				        return console.log(err);
				    }

				    console.log(compiledFilename + " was saved!");
				}); 
				
			});
		});
	});
};

function DiscoverPosts(siteData, postsDir, compiledDir, BuildPage){
	var files = [];
	
	fs.readdir(path.resolve(postsDir, 'content'), function(err, filenames){

	  	filenames.forEach(function(filename){  	
	  		//is this is a handlebars file?
			var matches = /^([^.]+).md$/.exec(filename);
			if (!matches) {
				return;
			}

			//we have a file, add to array
			var fileNameNoExt = matches[1],
			compiledDirname = (fileNameNoExt != "index") ? path.resolve(compiledDir, fileNameNoExt) : compiledDir;

			// does this output dir exist?
			if (!fs.existsSync(compiledDir)) {
				fs.mkdirSync(compiledDir);
			}

			if (!fs.existsSync(compiledDirname)) {
				fs.mkdirSync(compiledDirname);
			}

			BuildPage(siteData, path.resolve(postsDir, 'content', fileNameNoExt), postsDir, compiledDirname);
	  	});
	});
}

//compile posts
const postsDir = path.resolve(__dirname, '../../www_src/posts'),
      compiledPostsDir = path.resolve(__dirname, '../../www_dist/posts');

//do we have a site.json
var siteJsonFilename = path.resolve(__dirname, '../../www_src/site.json'),
    siteData = {};

if(fs.existsSync(siteJsonFilename)) {
  var siteJson = fs.readFileSync(siteJsonFilename, 'utf8');

  if(typeof siteJson != 'undefined' && siteJson != null) {
    //parse json into context object
    siteData = JSON.parse(siteJson);
  }
}

DiscoverPosts(siteData, postsDir, compiledPostsDir, BuildPage);