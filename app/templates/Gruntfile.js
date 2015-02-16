var path = require('path');

var makeRelativeLink = function(val) {
	var htmlHref;
	var url;

	url = val.split('#')[0];
	if (url) {
		if (url == '/') {
			htmlHref = 'index.html';
		} else {
			htmlHref = url.replace(/^\//, '').replace(/\//ig, '_') + '.html';
		}
	} else {
		htmlHref = val;
	}

	return htmlHref;
};

module.exports = function (grunt) {

	grunt.initConfig({
		express: {
			server: {
				options: {
					port: 3000,
					server: 'server.js'
				}
			}
		},
		twigRender: {
			build: {
				data: 'data.json',
				expand: true,
				cwd: 'views/',
				src: [
					'**/*.twig',
					'!_*/*.twig',
					'!**/_*.twig'
				], // Match twig templates but not partials
				dest: 'build/html',
				rename: function (dest, src) {
					return dest + '/' + src.replace(/\//g, '_').toLowerCase().replace('_index.html', '.html');
				},
				ext: '.html' // index.twig + datafile.json => index.html
			}
		},
		clean: {
			build: ["build"]
		},
		copy: {
			build: {
				files: [{
					src: 'public/**/*',
					dest: 'build/html',
					rename: function (dest, src) {
						return path.normalize(dest + '/' + src.replace('public/', ''));
					},
					expand: true
				}, {
					src: 'views/**/*',
					dest: 'build',
					expand: true
				}, {
					src: ['.bowerrc', 'package.json', 'bower.json'],
					dest: 'build/root/'
				}]
			}
		},
		dom_munger: {
			build: {
				options: {
					update: [
						{
							selector: 'a[href]:not([href^="http"])',
							attribute: 'href',
							value: function (i, val) {
								return makeRelativeLink(val);
							}
						},
						{
							selector: 'form[action]',
							attribute: 'action',
							value: function (i, val) {
								return makeRelativeLink(val);
							}
						},
						{
							selector: 'link[href^="/"]',
							attribute: 'href',
							value: function (i, val) {
								return val.replace(/^\//, '');
							}
						},
						{
							selector: '[src^="/"]',
							attribute: 'src',
							value: function (i, val) {
								return val.replace(/^\//, '');
							}
						},
						{
							selector: 'script[data-main]',
							attribute: 'data-main',
							value: function (i, val) {
								return val.replace(/^\//, '');
							}
						}
					]
				},
				src: 'build/html/*.html'
			}
		},
		prettify: {
			options: {
				indent_char: '	',
				indent: 1,
				condense: false
			},
			build: {
				expand: true,
				cwd: 'build/html/',
				ext: '.html',
				src: ['*.html'],
				dest: 'build/html/'
			}
		}
	});

	grunt.loadNpmTasks('grunt-express');
	grunt.loadNpmTasks('grunt-twig-render');
	grunt.loadNpmTasks('grunt-contrib-clean');
	grunt.loadNpmTasks('grunt-contrib-copy');
	grunt.loadNpmTasks('grunt-dom-munger');
	grunt.loadNpmTasks('grunt-prettify');

	grunt.registerTask('server', ['express:server', 'express-keepalive']);
	grunt.registerTask('build', ['clean:build', 'twigRender:build', 'prettify:build', 'dom_munger:build', 'copy:build']);

};
