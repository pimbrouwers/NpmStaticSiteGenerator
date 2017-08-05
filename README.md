# NPM Static Site Generator

Leveraging the power of NPM scripts, the tool facilitates generating static html site using:

- Handlebars - backed by JSON data
- LESS
- RequireJs (setup as a KnockoutJS solution, but can easily be configured)

## Install
Install generator as **git submodule**:
- `mkdir mycoolsite`
- `cd mycoolsite`
- `git submodule add https://github.com/pimbrouwers/NpmStaticSiteGenerator.git tools`
- `npm run --prefix tools init`

You're now left with a `www_src` dir, which houses your website code. And a `www_dist` dir which houses your deployable code.

## Compile
When you're ready to build & test your code, simply run: `npm run --prefix tools compile` to populate your `www_dist` directory. At this point it is recommended to use the built-in node web server to view the result via `http-server www_dist/`

## API
```
"clean": "rimraf ../www_dist/*",
"clobber": "rimraf ../www_dist ../www_src",

"init": "npm install && node scripts/install.js && npm run devlib:js",

"copy:img": "ncp ../www_src/img ../www_dist/img",

"devlib:js": "ncp node_modules/requirejs/require.js ../www_src/require.js & ncp node_modules/requirejs/bin/r.js ../www_src/r.js & ncp node_modules/knockout/build/output/knockout-latest.js ../www_src/knockout.js & ncp node_modules/jquery/dist/jquery.min.js ../www_src/jquery.js & ncp node_modules/requirejs-text/text.js ../www_src/text.js",
"build:js": "node ../www_src/r.js -o ../www_src/require.build.js",

"watch:less": "less-watch-compiler ../www_src/less ../www_dist/css",
"build:less": "lessc --clean-css ../www_src/less/app.less ../www_dist/app.css",       

"build:pages": "node scripts/build-pages.js",

"build:posts": "node scripts/build-posts.js",

"build": "npm run build:js & npm run copy:img & npm run build:pages & npm run build:posts & npm run build:less",

"compile": "npm run clean && npm run build"
```

Built with ♥ by [Pim Brouwers](https://github.com/pimbrouwers) in Toronto, ON. Licensed under [MIT](https://github.com/pimbrouwers/NpmStaticSiteGenerator/blob/master/LICENSE).
