var express = require('express');
var session = require('express-session');

var i18n = require('../base/i18n');
var utils = require('../utils/utils');
var userController = require('../controllers/userController');
var userValidator = require('../validators/userValidator');
var teamValidator = require('../validators/teamValidator');
var teamController = require('../controllers/teamController');
var carController = require('../controllers/carController');

module.exports.init = function(app) {

    app.get('/teams',function(req,res){
        var token = req.session.token;
        userController.
            getUserByToken(token).
            then(function(user){
                console.log('accepted user by token: ',user);
                if (!userValidator.canWorksAsAdmin(user)) {
                    res.render('user/accessDenied',utils.parametrize({}));
                    throw 'access denied';
                }
            }).
            then(function(){
                return teamController.getAllTeams()
            }).then(function(teams){
                res.render('teams/teams',utils.parametrize({teams:teams}));
            });
    });

    app.get('/addTeamForm',function(req,res){
        var token = req.session.token;
        userController.
            getUserByToken(token).
            then(function(user){
                console.log('addCarform: accepted user by token: ',user);
                if (!userValidator.canWorksAsAdmin(user)) {
                    res.render('user/accessDenied',utils.parametrize({}));
                    console.log('security error');
                    throw 'access denied';
                } else {
                    console.log('rendering page');
                    res.render('teams/addTeamForm',utils.parametrize({}));
                }
            })
    });

    app.get('/teamToCarForm',function(req,res){
        var token = req.session.token;
        var teams;
        var cars;
        var teamToCars;
        userController.
            getUserByToken(token).
            then(function(user){
                if (!userValidator.canWorksAsAdmin(user)) {
                    res.render('user/accessDenied',utils.parametrize({}));
                    console.log('security error');
                    throw 'access denied';
                }
            }).
            then(function(){
                return teamController.getAllTeams()
            }).
            then(function(_teams){
                console.log('accepted teams');
                teams = _teams;
            }).
            then(function(){
                return carController.getAllCars()
            }).
            then(function(_cars){
                console.log('accepted cars');
                cars = _cars;
            }).
            then(function(){
                return teamController.getAllTeamToCars()
            }).
            then(function(_teamToCars){
                console.log('accepted teamToCars');
                teamToCars = _teamToCars;
            }).
            then(function(){
                console.log('rendering');
                res.render('teams/teamToCarForm',utils.parametrize({
                    teams:teams,
                    cars:cars,
                    teamToCars:teamToCars
                }));
            });
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

    app.post('/saveTeamToCar',function(req,res){
        var opts = req.body.teamToCar;
        teamController.updateTeamToCars(opts)
            .then(function(){
                console.log('query executed with success');
                res.send({success:true,message:i18n.get('success')});
            });
    });

};


