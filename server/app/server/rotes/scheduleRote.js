
var express = require('express');
var session = require('express-session');

var i18n = require('../base/i18n');
var utils = require('../utils/utils');
var userController = require('../controllers/userController');
var userValidator = require('../validators/userValidator');
var scheduleController = require('../controllers/scheduleController');
var teamController = require('../controllers/teamController');
var departmentController = require('../controllers/departmentController');

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
                return departmentController.getAllDepartments();
            }).
            then(function(departments){
                res.render('addScheduleForm',utils.parametrize({departments:departments}));
            });
    });

    app.get('/createScheduleForm',function(req,res){
        var token = req.session.token;
        var users;
        var shiftTypes;
        var teams;
        var month = req.query.month;
        var year = req.query.year;
        console.log('accepted params',month,year);
        var numOfDaysInMonth = scheduleController.getNumOfDaysInMonth(month,year);
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
                return userController.getAllUsersSortedByRole();
            }).
            then(function(_users){
                users = _users;
            }).
            then(function(){
                return teamController.getAllTeams();
            }).
            then(function(_teams){
                teams = _teams;
            }).
            then(function(){
                return scheduleController.getAllShiftTypes()
            }).
            then(function(_shiftTypes){
                shiftTypes = _shiftTypes;
                res.render('createScheduleForm',utils.parametrize(
                    {
                        users:users,
                        shiftTypes:shiftTypes,
                        numOfDaysInMonth:numOfDaysInMonth,
                        teams:teams
                    })
                );
            });
    });

    app.post('/createSchedule',function(req,res){
        console.log('request body',req.body);
        var month = req.body.month;
        var year = req.body.year;
        var edited = req.body.edited;
        var departmentId = req.body.departmentId;
        console.log('departmentId',departmentId);
        scheduleController.createSchedule(month,year,departmentId)
            .then(function(id){
                console.log('id',id);
                return scheduleController.createScheduleLines(id,edited);
            }).
            then(function(){
                res.send({success:true,message:i18n.get('success')});
            });
    });

};
