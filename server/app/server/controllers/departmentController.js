var connector = require('../base/connector');
var Promise = require('promise');
var i18n = require('../base/i18n');

const GET_ALL_DEPARTMENTS = 'select * from department';

module.exports.getAllDepartments = function(){
    return new Promise(function(resolve){
        connector.executeQuery(GET_ALL_DEPARTMENTS,[])
            .then(function(departments){
                resolve(departments);
            });
    });
};
