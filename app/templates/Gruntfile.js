var path = require('path');

var makeRelativeLink = function (val) {
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

var expressPort = 3000;

module.exports = function (grunt) {

  grunt.initConfig({
    express: {
      server: {
        options: {
          port: expressPort,
          server: 'server.js'
        }
      }
    },
    browserSync: {
      dev: {
        bsFiles: {
          src: ['public/**/*', 'views/**/*']
        },
        options: {
          proxy: 'localhost:' + expressPort
        }
      }
    },
    twigRenderer: {
      build: {
        options: {
          data: 'data.json'
        },
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
    }
  });

  grunt.loadNpmTasks('grunt-express');
  grunt.loadNpmTasks('grunt-twig-renderer');
  grunt.loadNpmTasks('grunt-contrib-clean');
  grunt.loadNpmTasks('grunt-contrib-copy');
  grunt.loadNpmTasks('grunt-dom-munger');
  grunt.loadNpmTasks('grunt-browser-sync');

  grunt.registerTask('server', ['express:server', 'browserSync', 'express-keepalive']);
  grunt.registerTask('build', ['clean:build', 'twigRenderer:build', 'dom_munger:build', 'copy:build']);

};
