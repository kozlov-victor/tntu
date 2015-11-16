
var express = require('express');
var session = require('express-session');

var i18n = require('../base/i18n');
var utils = require('../utils/utils');
var userController = require('../controllers/userController');
var userValidator = require('../validators/userValidator');
var departmentController = require('../controllers/departmentController');

module.exports.init = function(app) {

    app.get('/departments',function(req,res){
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
                return departmentController.getAllDepartments()
            }).then(function(departments){
                res.render('departments',utils.parametrize({departments:departments}));
            });
    });

};