var hbsConfig = require('../tools/tasks/configure-hbs'),
    hbs = require('handlebars'),    
    fs = require('fs');

//setup handlebars
hbsConfig.RegisterHelpers();
hbsConfig.RegisterPartials();

//config
var pagesDir = __dirname + '/../www_src/pages',    
    compiledPagesDir = __dirname + "/../www_dist/";

//compile pages
fs.readdirSync(pagesDir).forEach(function (filename) {
  var matches = /^([^.]+).hbs$/.exec(filename);
  if (!matches) {
    return;
  }

  var pageName = matches[1],
      page = fs.readFileSync(pagesDir + '/' + filename, 'utf8'),
      compiledPageDirname = (pageName != "index") ? compiledPagesDir + pageName : compiledPagesDir,
      compiledPageFilename = compiledPageDirname + "/index.html",
      pageJsonFilename = pagesDir + '/' + pageName + '.json',
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
  pageContext.pageName = pageName;

  if (!fs.existsSync(compiledPageDirname)) {
    fs.mkdirSync(compiledPageDirname);
  }

  fs.writeFileSync(compiledPageFilename, pageTemplate(pageContext));
  console.log(pageName + "/index.html was saved!");

});