
var express = require('express');
var session = require('express-session');

var i18n = require('../base/i18n');
var utils = require('../utils/utils');
var userController = require('../controllers/userController');
var userValidator = require('../validators/userValidator');
var departmentController = require('../controllers/departmentController');
var departmentValidator = require('../validators/departmentValidator');

module.exports.init = function(app) {

    app.get('/departments',function(req,res){
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
                return departmentController.getAllDepartments()
            }).then(function(departments){
                res.render('departments/departments',utils.parametrize({departments:departments}));
            });
    });

    app.get('/addDepartmentForm',function(req,res){
        var token = req.session.token;
        userController.
            getUserByToken(token).
            then(function(user){
                console.log('accepted user by token: ',user);
                if (!userValidator.canWorksAsAdmin(user)) {
                    res.render('user/accessDenied',utils.parametrize({}));
                    throw 'access denied';
                } else {
                    res.render('departments/addDepartment',utils.parametrize());
                }
            });
    });

    app.get('/updateDepartment',function(req,res){
        var token = req.session.token;
        var departmentId = req.query.departmentId;
        var departmentName = req.query.departmentName;
        var validationResult = departmentValidator.validate(departmentName);
        if (!validationResult.success) {
            res.send(validationResult);
            return;
        }
        userController.
            getUserByToken(token).
            then(function(user){
                console.log('accepted user by token: ',user);
                if (!userValidator.canWorksAsAdmin(user)) {
                    throw 'access denied';
                }
            }).
            then(function(){
                return departmentController.updateDepartment(departmentId,departmentName)
            }).then(function(){
                res.send({success:true,message:i18n.get('success')});
            }).
            catch(function(){
                res.send({success:false});
            });
    });

    app.get('/addDepartment',function(req,res){
        var token = req.session.token;
        var departmentName = req.query.departmentName;
        var validationResult = departmentValidator.validate(departmentName);
        if (!validationResult.success) {
           res.send(validationResult);
            return;
        }
        userController.
            getUserByToken(token).
            then(function(user){
                console.log('accepted user by token: ',user);
                if (!userValidator.canWorksAsAdmin(user)) {
                    throw 'access denied';
                }
            }).
            then(function(){
                return departmentController.addDepartment(departmentName)
            }).then(function(){
                res.send({success:true,message:i18n.get('success')});
            }).
            catch(function(){
                res.send({success:false});
            });
    });

};