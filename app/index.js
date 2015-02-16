'use strict';
var yeoman = require('yeoman-generator');
var yosay = require('yosay');

var TwigUpGenerator = yeoman.generators.Base.extend({
	initializing: function () {
		this.pkg = require('../package.json');
	},

	prompting: function () {
		if (!this.options['skip-welcome']) {
			this.log(yosay(
				'Generator for creating html markup using Twig template engine.'
			));
		}

		var done = this.async();

		var prompts = [{
			name: 'pkgName',
			message: 'Package name',
			default: this.appname,
			type: 'input'
		}];

		this.prompt(prompts, function (props) {

			this.appname = props.pkgName;

			done();
		}.bind(this));
	},

	gruntfile: function () {
		this.copy('Gruntfile.js');
	},

	packageJSON: function () {
		this.template('_package.json', 'package.json');
	},

	bower: function () {
		this.template('_bower.json', 'bower.json');
		this.copy('bowerrc', '.bowerrc');
	},

	git: function () {
		this.template('gitignore', '.gitignore');
	},

	app: function () {
		this.copy('server.js', 'server.js');
		this.copy('data.json', 'data.json');
		this.directory('views', 'views');
		this.directory('public', 'public');
		this.mkdir('public/images');
	},

	end: function () {
		if (!this.options['skip-install']) {
			this.installDependencies();
		}
	}

});

module.exports = TwigUpGenerator;
