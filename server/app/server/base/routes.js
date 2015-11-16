var express = require('express');
var session = require('express-session');

var setup = function(app){
    app.set('views', './views');
    app.engine('html', require('ejs').renderFile);
    app.set('view engine', 'html');
    app.use(session({
        key: 'session_cookie_name',
        secret: 'session_cookie_secret'
    }));
    app.use(express.static('public'));
};

module.exports.setUpRotes = function(app){

    setup(app);
    require('../rotes/userRote').init(app);
    require('../rotes/departmentRote').init(app);
};