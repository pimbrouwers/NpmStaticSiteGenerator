var hbs = require('handlebars'),
    fs = require('fs'),
    hbsPartialsDir = __dirname + '/../../www_src/partials';

var hbsConfig = function(){};

hbsConfig.prototype.RegisterHelpers = function() {
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
};

hbsConfig.prototype.RegisterPartials = function() {
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
};

module.exports = new hbsConfig();
