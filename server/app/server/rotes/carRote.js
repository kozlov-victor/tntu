
var express = require('express');
var session = require('express-session');

var i18n = require('../base/i18n');
var utils = require('../utils/utils');
var userController = require('../controllers/userController');
var userValidator = require('../validators/userValidator');
var carController = require('../controllers/carController');
var carValidator = require('../validators/carValidator');

module.exports.init = function(app) {

    app.get('/cars',function(req,res){
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
                return carController.getAllCars()
            }).then(function(cars){
                res.render('cars',utils.parametrize({cars:cars}));
            });
    });

    app.get('/addCarForm',function(req,res){
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
                    res.render('addCarForm',utils.parametrize({}));
                }
            })
    });

    app.get('/updateCar',function(req,res){
        var token = req.session.token;
        var id = req.query.id;
        var number = req.query.number;
        var model = req.query.model;
        var description = req.query.description;
        userController.
            getUserByToken(token).
            then(function(user){
                console.log('updateCar: accepted user by token: ',user);
                if (!userValidator.canWorksAsAdmin(user)) {
                    console.log('security error');
                    throw 'access denied';
                } else {
                    var validation = carValidator.validate(number,model,description);
                    if (!validation.success) {
                        res.send(validation);
                        throw 'validation error';
                    }
                }
            }).
            then(function(){
                return carController.updateCar(id,number,model,description);
            }).
            then(function(){
                res.send({success:true,message:i18n.get('success')});
            });
    });

    app.get('/addCar',function(req,res){
        var token = req.session.token;
        var number = req.query.number;
        var model = req.query.model;
        var description = req.query.description;
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
                var validationResult = carValidator.validate(number,model,description);
                console.log('validated:',validationResult);
                if (!validationResult.success) {
                    res.send(validationResult);
                    throw 'validation error';
                }
            }).
            then(function(){
                console.log('adding car');
                return carController.addCar(number,model,description);
            }).
            then(function(){
                console.log('added');
                res.send({success:true,message:i18n.get('success')});
            });
    });

};
