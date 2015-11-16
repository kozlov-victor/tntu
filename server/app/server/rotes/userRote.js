var express = require('express');
var session = require('express-session');

var userController = require('../controllers/userController');
var userRolesController = require('../controllers/userRolesController');
var userValidator = require('../validators/userValidator');
var i18n = require('../base/i18n');
var utils = require('../utils/utils');

module.exports.init = function(app) {

    app.get('/admin',function(req,res){
        var token = req.session.token;
        console.log('token',token);
        userController.
            getUserByToken(token).
            then(function(user){
                console.log('accepted user by token: ',user);
                if (!userValidator.canWorksAsAdmin(user)) {
                    res.render('accessDenied',utils.parametrize({}));
                } else {
                    res.render('admin',utils.parametrize({}));
                }
            });
    });


    app.get('/userActivation',function(req,res){
        var token = req.session.token;
        console.log('token',token);
        var allUserRoles;
        userController.
            getUserByToken(token).
            then(function(user){
                console.log('accepted user by token: ',user);
                if (!userValidator.canWorksAsAdmin(user)) {
                    res.render('accessDenied',utils.parametrize({}));
                } else {
                    userRolesController.getAllUserRoles().
                    then(function(_allUserRoles){
                            allUserRoles = _allUserRoles;
                    }).
                    then(function(){
                         return userController.getAllUsers()
                    }).
                    then(function(users){
                        console.log('allUserRoles',allUserRoles);
                        res.render('userActivation',utils.parametrize({users:users,allUserRoles:allUserRoles}));
                    });
                }
            });
    });

    app.get('/authForm', function (req, res) {
        res.render('authForm',utils.parametrize());
    });

    app.get('/auth', function (req, res) {
        var mail = req.query.email;
        var password = req.query.password;
        if (!(mail && password)) {
            res.send({success:false,message:i18n.get('notAllFields')});
            return;
        }
        userController.
            getUserByMailAndPassword(mail,password).
            then(function(user){
                if (!user) {
                    res.send({success:false,message:i18n.get('incorrectCredentials')});
                } else {
                    req.session.token = user.hash;
                    res.send({success:true,user:user});
                }
            });
    });

    app.get('/register', function (req, res) {
        var mail = req.query.mail;
        var password = req.query.password;
        var name = req.query.name;
        var validation = userValidator.validateCredentials(name,mail,password);
        if (!validation) {
            res.send({success:false,message:i18n.get('notAllFields')});
            return;
        }
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
