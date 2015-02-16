var twig = require("twig");
var express = require('express');
var path = require('path');
var compress = require('compression');
var data = require('./data.json');


twig.cache(false);

var app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'twig');

app.use(compress());
app.use(express.static(path.join(__dirname, 'public')));


var router = express.Router();

var getViewByPath = function (path) {
    var p = path.split('/');

    if (p[p.length - 1].length == 0) {
        p.pop()
    }

    return capitalize(p[0]) + '/' + (p[1] ? p[1] + '.html.twig' : 'index.html.twig');
};

var capitalize = function (str) {
    return str.charAt(0).toUpperCase() + str.substring(1)
};

router.get('/*', function (req, res) {

    var path = req.params[0];

    if (!path) {
        path = 'index';
    }

    data.route = '/' + (path != 'index' ? path : '');

    res.render(getViewByPath(path), data);
});

app.use('/', router);


// catch 404 and forward to error handler
app.use(function (req, res, next) {
    var err = new Error('Not Found');
    err.status = 404;
    next(err);
});


module.exports = app;
