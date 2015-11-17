var connector = require('../base/connector');
var Promise = require('promise');
var i18n = require('../base/i18n');

const GET_ALL_CARS = 'select * from car';
const ADD_CAR = 'insert into car (number,model,description) values (?,?,?)';
const UPDATE_CAR = 'update car set number=?, model=?,description=? where id=?';

module.exports.getAllCars = function(){
    return new Promise(function(resolve){
        connector.executeQuery(GET_ALL_CARS,[])
            .then(function(cars){
                resolve(cars||[]);
            });
    });
};

module.exports.addCar = function(number,model,description){
    return new Promise(function(resolve){
        connector.executeQuery(ADD_CAR,[number,model,description])
            .then(function(){
                resolve();
            });
    });
};

module.exports.updateCar = function(id,number,model,description){
    return new Promise(function(resolve){
        connector.executeQuery(UPDATE_CAR,[number,model,description,id])
            .then(function(){
                resolve();
            });
    });
};
