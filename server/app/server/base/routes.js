var express = require('express');
var session = require('express-session');

var userController = require('../controllers/userController');
var userValidator = require('../validators/userValidator');
var i18n = require('../base/i18n');

var parametrize = function(params) {
    params=params||{};
    params.i18n = i18n.getAll();
    return params;
};

module.exports.setUpRotes = function(app){

    app.set('views', './views');
    app.engine('html', require('ejs').renderFile);
    app.set('view engine', 'html');
    app.use(session({
        key: 'session_cookie_name',
        secret: 'session_cookie_secret'
    }));
    app.use(express.static('public'));


    app.get('/admin',function(req,res){
        var token = req.session.token;
        console.log('token',token);
        console.log('token',token);
        userController.
            getUserByToken(token).
            then(function(user){
                console.log('accepted user by token: ',user);
                if (!userValidator.canWorksAsAdmin(user)) {
                    res.render('accessDenied',parametrize({}));
                } else {
                    res.render('admin',parametrize({}));
                }
            });
    });


    app.get('/userActivation',function(req,res){
        var token = req.query.token;
        console.log('token',token);
        userController.
            getUserByToken(token).
            then(function(user){
                console.log('accepted user by token: ',user);
                if (!userValidator.canWorksAsAdmin(user)) {
                    res.render('accessDenied',parametrize({}));
                } else {
                    userController.getAllUsers().
                    then(function(users){
                        res.render('userActivation',parametrize({users:users}));
                    });
                }
            });
    });

    app.get('/authForm', function (req, res) {
        res.render('authForm',parametrize());
    });

    app.get('/auth', function (req, res) {
        res.send({email:req.query.email});
    });

    app.get('/register', function (req, res) {
        var mail = req.query.mail;
        var password = req.query.password;
        var name = req.query.name;
        var validation = userValidator.validateCredentials(name,mail,password);
        userController.
            checkEmailForExists(mail).
            then(function(checkRes){
                if (!checkRes.success) throw checkRes;
                return userController.createUser(name,mail,password);
            }).
            then(function(result){
                console.log('createUser result',result);
                res.send(result);
            }).
            catch(function(err){
                console.log('error cached',err);
                res.send(err);
            });
    });
};