

var express = require('express');
var session = require('express-session');

var i18n = require('../base/i18n');
var utils = require('../utils/utils');
var userController = require('../controllers/userController');
var userValidator = require('../validators/userValidator');
var callController = require('../controllers/callController');

module.exports.init = function(app) {

    app.get('/callsManagement',function(req,res){
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
                res.render('calls/callsManagement',utils.parametrize({}));
            });
    });

    app.get('/callsNow',function(req,res){
        userController.
            getUserByToken(req.session.token).
            then(function(user){
                if (!userValidator.canWorksAsAdmin(user)) {
                    res.render('user/accessDenied',utils.parametrize({}));
                    throw 'access denied';
                }
            }).
            then(function(){
                var date = new Date();
                console.log('date',date);
                var day = date.getDate();
                console.log('day',day);
                var month = date.getMonth()+1;
                console.log('month',month);
                var year = date.getFullYear();
                console.log('year',year);
                return callController.getCallsForThisDay(day,month,year)
            }).
            then(function(calls){
                res.render('calls/callsNow',utils.parametrize({
                    time:new Date().getTime(),
                    calls:calls
                }));
            }).
            catch(function(e){
                console.log('error:',e);
            });
    });

};