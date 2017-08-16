var hbs = require('handlebars'),
    fs = require('fs'),
    hbsPartialsDir = __dirname + '/../../../www_src/partials';

var hbsConfig = function(){};

hbsConfig.prototype.RegisterHelpers = function() {
  //register helpers
  hbs.registerHelper('ifCond', function (v1, operator, v2, options) {

    switch (operator) {
        case '==':
            return (v1 == v2) ? options.fn(this) : options.inverse(this);
        case '===':
            return (v1 === v2) ? options.fn(this) : options.inverse(this);
        case '!=':
            return (v1 != v2) ? options.fn(this) : options.inverse(this);
        case '!==':
            return (v1 !== v2) ? options.fn(this) : options.inverse(this);
        case '<':
            return (v1 < v2) ? options.fn(this) : options.inverse(this);
        case '<=':
            return (v1 <= v2) ? options.fn(this) : options.inverse(this);
        case '>':
            return (v1 > v2) ? options.fn(this) : options.inverse(this);
        case '>=':
            return (v1 >= v2) ? options.fn(this) : options.inverse(this);
        case '&&':
            return (v1 && v2) ? options.fn(this) : options.inverse(this);
        case '||':
            return (v1 || v2) ? options.fn(this) : options.inverse(this);
        default:
            return options.inverse(this);
    }
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
  });  
};

module.exports = new hbsConfig();
