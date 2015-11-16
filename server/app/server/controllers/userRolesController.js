var connector = require('../base/connector');
var Promise = require('promise');
var i18n = require('../base/i18n');

const GET_ALL_USER_ROLES = 'select * from userRole';

module.exports.getAllUserRoles = function(){
    return new Promise(function(resolve){
        connector.
            executeQuery(GET_ALL_USER_ROLES,[]).
            then(function(rows){
                var resultArr = rows.map(function(item){
                    item['desc']=i18n.get(item['code']);
                    return item;
                });
                resolve(resultArr);
            });
    });
};


