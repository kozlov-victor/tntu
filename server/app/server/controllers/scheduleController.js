var connector = require('../base/connector');
var Promise = require('promise');
var i18n = require('../base/i18n');

const GET_ALL_SHIFT_TYPES = 'select * from shiftType';

module.exports.getAllShiftTypes = function(){
   return new Promise(function(resolve){
        connector.executeQuery(GET_ALL_SHIFT_TYPES,[])
            .then(function(shiftTypes){
                resolve(shiftTypes);
            });
   });
};
