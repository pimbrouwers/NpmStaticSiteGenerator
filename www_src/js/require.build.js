({
    baseUrl: ".",
    mainConfigFile: "require.build.js",
    name: "startup",
    out: "../../www_dist/scripts.js",
    paths: {
        "jquery": "../../node_modules/jquery/dist/jquery.min",
        "knockout": "../../node_modules/knockout/build/output/knockout-latest",
        "text": "../../node_modules/requirejs-text/text"
    }
})