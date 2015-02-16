'use strict';

var path = require('path');
var assert = require('yeoman-generator').assert;
var helpers = require('yeoman-generator').test;
var os = require('os');

describe('twigup:app', function() {
    before(function(done) {
        helpers.run(path.join(__dirname, '../app'))
            .inDir(path.join(os.tmpdir(), './temp'))
            .withOptions({
				'skip-welcome': true,
                'skip-install': true
            }).withPrompts({
				pkgName: 'test'
			})

        .on('end', done);
    });

    it('creates files', function() {
        assert.file([
            'bower.json',
            'package.json',
			'Gruntfile.js',
			'.gitignore',
			'.bowerrc',
			'server.js',
			'data.json',
			'views/Index/index.html.twig',
			'views/Second/index.html.twig',
			'views/Second/inner.html.twig',
			'views/_layouts/layout.html.twig',
			'views/_partials/partial.html.twig',
			'public/scripts',
			'public/styles',
			'public/images',
			'public/favicon.ico'
        ]);

		assert.fileContent([
			['bower.json', /"name": "test"/],
			['package.json', /"name": "test"/]
		]);
    });

});
