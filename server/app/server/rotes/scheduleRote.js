
var express = require('express');
var session = require('express-session');

var i18n = require('../base/i18n');
var utils = require('../utils/utils');
var userController = require('../controllers/userController');
var userValidator = require('../validators/userValidator');
var scheduleController = require('../controllers/scheduleController');

module.exports.init = function(app){

    app.get('/schedules',function(req,res){
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
                res.render('schedules',utils.parametrize({}));
            });
    });

    app.get('/addScheduleForm',function(req,res){
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
                res.render('addScheduleForm',utils.parametrize({}));
            });
    });

    app.get('/createScheduleForm',function(req,res){
        var token = req.session.token;
        var users;
        var shiftTypes;
        userController.
            getUserByToken(token).
            then(function(user){
                console.log('accepted user by token: ',user);
                if (!userValidator.canWorksAsAdmin(user)) {
                    throw 'access denied';
                }
            }).
            then(function(){
                return userController.getAllUsersSortedByRole();
            }).
            then(function(_users){
                users = _users;
            }).
            then(function(){
                return scheduleController.getAllShiftTypes()
            }).

            then(function(_shiftTypes){
                shiftTypes = _shiftTypes;
                res.send({users:users,shiftTypes:shiftTypes});
            });
    });

};
