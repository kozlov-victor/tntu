

var express = require('express');
var session = require('express-session');

var i18n = require('../base/i18n');
var utils = require('../utils/utils');
var userController = require('../controllers/userController');
var teamController = require('../controllers/teamController');
var userValidator = require('../validators/userValidator');
var callController = require('../controllers/callController');
var callValidator = require('../validators/callValidator');

var dateToStr = function(date){
    var normalizeLength = function(val) {
        if ((''+val).length==1) val='0'+val;
        return val;
    };
    var d = new Date(date);
    var day = normalizeLength(d.getDate());
    var month = normalizeLength(d.getMonth()+1);
    var year = d.getFullYear();
    var h = normalizeLength(d.getHours());
    var m = normalizeLength(d.getMinutes());
    var s = normalizeLength(d.getSeconds());
    return {
        date:day + '.' + month +'.' + year,
        time: h +':' + m +':' +s
    }
};

var mapCalls = function(calls){
    return calls.map(function(call){
        var date = dateToStr(call.date);
        var dateCompleted = dateToStr(call.dateCompleted);
        call['date']= date.date +' '+date.time;
        if (call['dateCompleted']) {
            call['dateCompleted'] = dateCompleted.date +' '+dateCompleted.time;
        } else {
            call['dateCompleted'] = '---';
        }
        return call;
    })
};

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

    app.get('/createNewCall',function(req,res){
        userController.
            getUserByToken(req.session.token).
            then(function(user){
                console.log('accepted user by token: ',user);
                if (!userValidator.canWorksAsAdmin(user)) {
                    throw 'access denied';
                }
            }).
            then(function(){
                var opts = {};
                opts.inPhone = req.query.inPhone;
                opts.address = req.query.address;
                opts.description = req.query.description;
                opts.teamId = req.query.teamId;
                console.log('accepted data',opts);
                var valid = callValidator.validate(opts.inPhone,opts.address,opts.description);
                if (!valid.success) {
                    res.send(valid);
                    throw 'validation exception'
                }
                return opts;
            }).
            then(function(opts){
                new callController.createNewCall(opts)
            }).
            then(function(){
                res.send({success:true,message:i18n.get('success')});
            }).
            catch(function(e){
                console.log('error',e);
            });
    });

    app.get('/callsArchive',function(req,res){
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
                res.render('calls/callsArchive',utils.parametrize({}));
            });
    });

    app.get('/newCallForm',function(req,res){
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
                return teamController.getAllTeams()
            }).
            then(function(teams){
                res.render('calls/newCall',utils.parametrize({teams:teams}));
            });
    });

    app.get('/getCallsSearchList',function(req,res){
        userController.
            getUserByToken(req.session.token).
            then(function(user){
                console.log('accepted user by token: ',user);
                if (!userValidator.canWorksAsAdmin(user)) {
                    throw 'access denied';
                }
            }).
            then(function(){
                var dateFrom = req.query.dateFrom;
                var dateTo = req.query.dateTo;
                console.log('callRoter,dates for search',dateFrom,dateTo);
                return callController.getCallsArchive(dateFrom,dateTo)
            }).
            then(function(calls){
                return mapCalls(calls);
            }).
            then(function(calls){
                res.render('calls/callsListForInclude',utils.parametrize({
                    time:new Date().getTime(),
                    calls:calls
                }));
            }).
            catch(function(e){
                console.log('error:',e);
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
                var day = date.getDate();
                var month = date.getMonth()+1;
                var year = date.getFullYear();
                return callController.getCallsForThisDay(day,month,year)
            }).
            then(function(calls){
                return mapCalls(calls)
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