var hbs = require('handlebars'),
	fs = require('fs');

//config
var pagesDir = __dirname + '/../www_src/pages';
	partialsDir = __dirname + '/../www_src/pages/partials',
	compiledPagesDir = __dirname + "/../www_dist/";

//register partials
fs.readdirSync(partialsDir).forEach(function (filename) {
  var matches = /^([^.]+).hbs$/.exec(filename);
  if (!matches) {
    return;
  }

  var name = matches[1];
  var template = fs.readFileSync(partialsDir + '/' + filename, 'utf8');
  
  hbs.registerPartial(name, template);
});

//compile pages
fs.readdirSync(pagesDir).forEach(function (filename) {
  var matches = /^([^.]+).hbs$/.exec(filename);
  if (!matches) {
    return;
  }

  var name = matches[1];
  var page = fs.readFileSync(pagesDir + '/' + filename, 'utf8');
  
  var compiledPage = hbs.compile(page);

  var stream = fs.createWriteStream(compiledPagesDir + name + ".html");
	stream.once('open', function(fd) {
	    stream.write(compiledPage());
	    stream.end();

	    console.log(name + " was saved!");
	});

});