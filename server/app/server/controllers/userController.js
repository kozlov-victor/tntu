var connector = require('../base/connector');
var Promise = require('promise');
var i18n = require('../base/i18n');

const CREATE_USER = 'insert into user (name,mail,password) values (?,?,?)';
const GET_EMAIL = 'select id from user where LOWER(mail)=LOWER(?) limit 1';

module.exports.createUser = function(name,mail,password) {
    return new Promise(function(resolve,reject){
        connector.
            executeQuery(CREATE_USER,[name,mail,password]).
            then(function(){
                resolve({
                    success:true,
                    credentials: {
                        name:name,
                        mail:mail,
                        token:'token'
                    },
                    message:i18n.get('userCreated')
                });
            });
    });
};


module.exports.checkEmailForExists = function(email){
    return new Promise(function(resolve,reject){
        connector.executeQuery(GET_EMAIL,[email]).
        then(function(rows){
            var res;
            if (rows && rows.length) {
                res = {success:false,message:i18n.get('emailExists')};
            }
            else {
                res = {success:true};
            }
            resolve(res);
        });
    });
};