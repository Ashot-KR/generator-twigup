# generator-twigup

TwigUp is [Yeoman](http://yeoman.io) generator for creating Html markup using Twig template engine ([twig.js](https://github.com/justjohn/twig.js) implementation).

## Getting Started
Make sure you have Yeoman installed:
```bash
npm install -g yo
```
To install generator-twigup from npm, run:

```bash
npm install -g generator-twigup
```

Initiate generator with:

```bash
yo twigup
```

## File structure
```
public                      // static resources
|- images
|- scripts
|- styles
|- vendor

views                       // contains twig views templates
|- _layouts                 // layouts templates for pages
|- _partials                // templates for partials
|- Index
   |- index.html.twig       // index page
|- Second
   |- index.html.twig       // /second page
   |- inner.html.twig       // /second/inner page
```

## Front-end libraries
Generator will install jQuery, Require.js and normalize.css.

## Grunt tasks
Generated project has 2 useful tasks aliases: `server` and `build`  
`server` alias launches [express](http://expressjs.com/) server on port `3000` (you can change port number in Gruntfile.js).
It compiles requested twig template and responses with pure html.  
Rule for urls is simple: for example url `http://localhost:3001/second` compiles `./views/Second/index.html.twig`, `http://localhost:3001/second/inner` compiles `./views/Second/inner.html.twig` and so on.  

`build` alias creates `build` folder, which contains `html` folder with static resources and compiled html files, `root` folder with files^ that should be placed in root folder of production server (for now its package.json, bower.json and .bowerrc files), and `views` folder with all twig templates (useful for projects uses Twig template, for example Symfony framework projects).

## Data for templates
`data.json` file contains data for templates for both tasks.


## License

MIT
