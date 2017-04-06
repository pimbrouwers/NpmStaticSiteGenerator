var hbs = require('handlebars'),
    fs = require('fs');

//config
var pagesDir = __dirname + '/../www_src/pages',
    hbsPartialsDir = __dirname + '/../www_src/pages/partials',
    compiledPagesDir = __dirname + "/../www_dist/";

//register helpers
hbs.registerHelper('if_eq', function(a, b, opts) {
    if(a == b) // Or === depending on your needs
        return opts.fn(this);
    else
        return opts.inverse(this);
});

hbs.registerHelper('json', function(context) {
    return JSON.stringify(context);
});

//register partials
fs.readdirSync(hbsPartialsDir).forEach(function (filename) {
  var matches = /^([^.]+).hbs$/.exec(filename);
  if (!matches) {
    return;
  }

  var name = matches[1],
      hbsPartialFilename = hbsPartialsDir + '/' + filename,
      template = fs.readFileSync(hbsPartialFilename, 'utf8');
  
  hbs.registerPartial(name, template);

  console.log(name + " hbs partial was registered!");
});

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