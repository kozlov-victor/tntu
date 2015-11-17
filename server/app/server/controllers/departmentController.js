var connector = require('../base/connector');
var Promise = require('promise');
var i18n = require('../base/i18n');

const GET_ALL_DEPARTMENTS = 'select * from department';
const ADD_DEPARTMENT = 'insert into department (name) values (?)';
const UPDATE_DEPARTMENT = 'update department set name=? where id=?';


module.exports.getAllDepartments = function(){
    return new Promise(function(resolve){
        connector.executeQuery(GET_ALL_DEPARTMENTS,[])
            .then(function(departments){
                resolve(departments);
            });
    });
};

module.exports.addDepartment = function(departmentName){
    return new Promise(function(resolve){
        connector.executeQuery(ADD_DEPARTMENT,[departmentName])
            .then(function(){
                resolve();
            });
    });
};

module.exports.updateDepartment = function(id,name){
    return new Promise(function(resolve){
        console.log('updating department with paramaters',id,name);
        connector.executeQuery(UPDATE_DEPARTMENT,[name,id])
            .then(function(){
                resolve();
            });
    });
};
