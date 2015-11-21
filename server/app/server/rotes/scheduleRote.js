
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
                    res.render('user/accessDenied',utils.parametrize({}));
                    throw 'access denied';
                }
            }).
            then(function(){
                res.render('schedules/schedules',utils.parametrize({}));
            });
    });

    app.get('/addScheduleForm',function(req,res){
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
                return departmentController.getAllDepartments();
            }).
            then(function(departments){
                res.render('schedules/addScheduleForm',utils.parametrize({departments:departments}));
            });
    });

    app.get('/createScheduleForm',function(req,res){
        var users;
        var shiftTypes;
        var teams;
        var month = req.query.month;
        var year = req.query.year;
        console.log('accepted params',month,year);
        var numOfDaysInMonth = scheduleController.getNumOfDaysInMonth(month,year);
        userController.
            getUserByToken(req.session.token).
            then(function(user){
                console.log('accepted user by token: ',user);
                if (!userValidator.canWorksAsAdmin(user)) {
                    res.render('user/accessDenied',utils.parametrize({}));
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
                res.render('schedules/createScheduleForm',utils.parametrize(
                    {
                        users:users,
                        shiftTypes:shiftTypes,
                        numOfDaysInMonth:numOfDaysInMonth,
                        teams:teams,
                        scheduleLines:[],
                        manageType:'create',
                        scheduleId:null
                    })
                );
            });
    });

    app.post('/createSchedule',function(req,res){
        console.log('request body',req.body);
        var month = req.body.month;
        var year = req.body.year;
        var created = req.body.created;
        var departmentId = req.body.departmentId;
        console.log('departmentId',departmentId);
        scheduleController.createSchedule(month,year,departmentId)
            .then(function(id){
                console.log('id',id);
                return scheduleController.createScheduleLines(id,created);
            }).
            then(function(){
                res.send({success:true,message:i18n.get('success')});
            });
    });

    app.post('/updateScheduleLines',function(req,res){
        var creaded = req.body.created;
        var updated = req.body.updated;
        var deleted = req.body.deleted;
        var scheduleId = req.body.scheduleId;
        console.log('created',creaded);
        console.log('updated',updated);
        console.log('deleted',deleted);
        console.log('scheduleId',scheduleId);
        userController.
            getUserByToken(req.session.token).
            then(function(user){
                console.log('accepted user by token: ',user);
                if (!userValidator.canWorksAsAdmin(user)) {
                    throw 'access denied';
                }
            }).
            then(function(){
                return scheduleController.createScheduleLines(scheduleId,creaded)
            }).
            then(function(){
                return scheduleController.updateScheduleLines(updated)
            }).
            then(function(){
                return scheduleController.deleteScheduleLines(deleted)
            }).
            then(function(){
                res.send({success:true,message:i18n.get('success')});
            });
    });

    app.get('/scheduleListByYear',function(req,res){
        var dataToSend = {};
        var year = req.query.year;
        dataToSend.year = year;
        scheduleController.getScheduleListByYear(year)
            .then(function(sch){
                dataToSend.schedules = sch;
                res.render('schedules/scheduleListByYear',utils.parametrize(dataToSend));
            })
    });


    app.get('/editScheduleForm',function(req,res){
        var scheduleId = req.query.id;
        var month = req.query.month;
        var year = req.query.year;
        var opts = {};
        opts.manageType = 'update';
        opts.scheduleId = scheduleId;
        opts.numOfDaysInMonth = scheduleController.getNumOfDaysInMonth(month,year);
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
                return scheduleController.getScheduleLinesByScheduleId(scheduleId)
            }).
            then(function(lines){
                opts.scheduleLines = lines;
            }).
            then(function(){
                return userController.getAllUsersSortedByRole();
            }).
            then(function(_users){
                opts.users = _users;
            }).
            then(function(){
                return teamController.getAllTeams();
            }).
            then(function(_teams){
                opts.teams = _teams;
            }).
            then(function(){
                return scheduleController.getAllShiftTypes()
            }).
            then(function(_shiftTypes){
                opts.shiftTypes = _shiftTypes;
            }).
            then(function(){
                res.render('schedules/editScheduleForm',utils.parametrize(opts));
            });
    });

};
