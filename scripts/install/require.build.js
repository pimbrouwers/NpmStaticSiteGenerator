({
	include: ['requireLib'],
    mainConfigFile: "require.build.js",
    name: "startup",
    out: "../www_dist/scripts.js",
    optimize: "uglify",
    paths: {
    	requireLib: 'require',
    },
    preserveLicenseComments: false,
})