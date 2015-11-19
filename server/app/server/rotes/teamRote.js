var express = require('express');
var session = require('express-session');

var i18n = require('../base/i18n');
var utils = require('../utils/utils');
var userController = require('../controllers/userController');
var userValidator = require('../validators/userValidator');
var teamValidator = require('../validators/teamValidator');
var teamController = require('../controllers/teamController');


module.exports.init = function(app) {

    app.get('/teams',function(req,res){
        var token = req.session.token;
        userController.
            getUserByToken(token).
            then(function(user){
                console.log('accepted user by token: ',user);
                if (!userValidator.canWorksAsAdmin(user)) {
                    res.render('accessDenied',utils.parametrize({}));
                    throw 'access denied';
                }
            }).
            then(function(){
                return teamController.getAllTeams()
            }).then(function(teams){
                res.render('teams',utils.parametrize({teams:teams}));
            });
    });

    app.get('/addTeamForm',function(req,res){
        var token = req.session.token;
        userController.
            getUserByToken(token).
            then(function(user){
                console.log('addCarform: accepted user by token: ',user);
                if (!userValidator.canWorksAsAdmin(user)) {
                    res.render('accessDenied',utils.parametrize({}));
                    console.log('security error');
                    throw 'access denied';
                } else {
                    console.log('rendering page');
                    res.render('addTeamForm',utils.parametrize({}));
                }
            })
    });

    app.get('/updateTeam',function(req,res){
        var token = req.session.token;
        var id = req.query.id;
        var name = req.query.name;
        var shortName = req.query.shortName;
        userController.
            getUserByToken(token).
            then(function(user){
                console.log('updateCar: accepted user by token: ',user);
                if (!userValidator.canWorksAsAdmin(user)) {
                    console.log('security error');
                    throw 'access denied';
                } else {
                    var validation = teamValidator.validate(name,shortName);
                    if (!validation.success) {
                        res.send(validation);
                        throw 'validation error';
                    }
                }
            }).
            then(function(){
                return teamController.updateTeam(id,name,shortName);
            }).
            then(function(){
                res.send({success:true,message:i18n.get('success')});
            });
    });

    app.get('/addTeam',function(req,res){
        var token = req.session.token;
        var id = req.query.id;
        var name = req.query.name;
        var shortName = req.query.shortName;
        userController.
            getUserByToken(token).
            then(function(user){
                console.log('addCar: accepted user by token: ',user);
                if (!userValidator.canWorksAsAdmin(user)) {
                    res.send({success:false});
                    throw 'access denied';
                }
            }).
            then(function(){
                var validation = teamValidator.validate(name,shortName);
                console.log('validated:',validation);
                if (!validation.success) {
                    res.send(validation);
                    throw 'validation error';
                }
            }).
            then(function(){
                console.log('adding car');
                return teamController.addTeam(name,shortName);
            }).
            then(function(){
                console.log('added');
                res.send({success:true,message:i18n.get('success')});
            });
    });

};


