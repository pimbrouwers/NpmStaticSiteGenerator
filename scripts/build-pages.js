var hbsPrepare = require('../scripts/tasks/prepare-hbs'),
    hbs = require('handlebars'),    
    fs = require('fs'),
    path = require('path');


function BuildPage(dir, file) {
  
  var compiledDirname = (file.fileNameNoExt != "index") ? file.compiledDir + file.fileNameNoExt : file.compiledDir,
      compiledFilename = path.resolve(compiledDirname, "index.html"),
      hbsPageFilename = path.resolve(dir, file.fileNameNoExt + '.hbs'),
      pageJsonFilename = path.resolve(dir, file.fileNameNoExt + '.json');
      
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

  //add pageName to context
  pageContext.pageName = file.fileNameNoExt;

  //does this output dir exist?
  if (!fs.existsSync(compiledDirname)) {
    fs.mkdirSync(compiledDirname);
  }

  //write page to disk
  fs.writeFileSync(compiledFilename, pageTemplate(pageContext));
  console.log(compiledFilename + " was saved!");
};

function BuildPages(dir, files, builder){
  var todo = files.concat();

  setTimeout(function() {
      builder(dir, todo.shift());
      if(todo.length > 0) {
          setTimeout(arguments.callee, 25);
      }
  }, 25);
}

function DiscoverPages(dir, compiledDir, files){
  var filenames = fs.readdirSync(dir),
      files = files || [];
  
  filenames.forEach(function(filename){
    var filenameResolved = path.resolve(dir, filename);

    if(fs.statSync(filenameResolved).isDirectory()){
      files = DiscoverPages(filenameResolved, path.resolve(compiledDir, filename), files);
    }
    else {
      //is this is a handlebars file?
      var matches = /^([^.]+).hbs$/.exec(filename);
      if (!matches) {
        return;
      }
      
      //we have a file, add to array
      var fileNameNoExt = matches[1];

      files.push({
        fileNameNoExt: fileNameNoExt,
        compiledDir: compiledDir
      });

      // BuildPage(dir, compiledDir, fileNameNoExt);
      
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

BuildPages(pagesDir, pageFiles, BuildPage);