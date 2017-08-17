var hbsPrepare = require('../scripts/tasks/prepare-hbs'),
    hbs = require('handlebars'),    
    fs = require('fs'),
    path = require('path');


function BuildPage(siteData, file) {  
  var compiledFilename = path.resolve(file.compiledDirname, "index.html"),
      hbsPageFilename = path.resolve(file.pagesDir, file.fileNameNoExt + '.hbs'),
      pageJsonFilename = path.resolve(file.pagesDir.replace('/pages', '/pages-json'), file.fileNameNoExt + '.json');
  
  //read page
  var page = fs.readFileSync(hbsPageFilename, 'utf8');
      pageTemplate = hbs.compile(page),
      pageContext = {};

  //does this page have a context?
  if(fs.existsSync(pageJsonFilename)) {
    var pageJson = fs.readFileSync(pageJsonFilename, 'utf8');

    if(typeof pageJson != 'undefined' && pageJson != null) {
      //parse json into context object
      pageContext = JSON.parse(pageJson);
    }
  }

  pageContext.siteData = siteData;

  //add pageName to context
  pageContext.pageName = file.fileNameNoExt;
  
  //write page to disk
  fs.writeFileSync(compiledFilename, pageTemplate(pageContext));
  console.log(compiledFilename + " was saved!");
};

function BuildPages(siteData, files, builder){
  var todo = files.concat();

  setTimeout(function() {
      builder(siteData, todo.shift());
      if(todo.length > 0) {
          setTimeout(arguments.callee, 25);
      }
  }, 25);
}

function DiscoverPages(pagesDir, compiledDir, files){
  var filenames = fs.readdirSync(pagesDir),
      files = files || [];
  
  filenames.forEach(function(filename){
    var filenameResolved = path.resolve(pagesDir, filename);

    if(fs.statSync(filenameResolved).isDirectory()){
      files = DiscoverPages(filenameResolved, path.resolve(compiledDir,  filename), files);
    }
    else {
      //is this is a handlebars file?
      var matches = /^([^.]+).hbs$/.exec(filename);
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

      files.push({
        fileNameNoExt: fileNameNoExt,
        pagesDir: pagesDir,
        compiledDirname: compiledDirname
      });

    }
  });

  return files;
}; 

//setup handlebars
hbsPrepare.RegisterHelpers();
hbsPrepare.RegisterPartials();

// //compile pages
const pagesDir = path.resolve(__dirname, '../../www_src/pages'),
      compiledPagesDir = path.resolve(__dirname, '../../www_dist');

var pageFiles = DiscoverPages(pagesDir, compiledPagesDir);

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

BuildPages(siteData, pageFiles, BuildPage);