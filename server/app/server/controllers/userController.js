var connector = require('../base/connector');
var Promise = require('promise');
var i18n = require('../base/i18n');

const CREATE_USER = 'insert into user (name,mail,password,hash) values (?,?,?,?)';
const GET_EMAIL = 'select id from user where LOWER(mail)=LOWER(?) limit 1';
const GET_USER_BY_TOKEN = 'select * from user where hash=? limit 1';
const GET_ALL_USERS = 'select * from user;';
const GET_USER_BY_MAIL_AND_PASSWORD = 'select * from user where mail=? and password=?';
const UPDATE_USER = 'UPDATE user SET name=?,active=?,roleId=?,departmentId=? WHERE id=?';

var hashCode = function(s) {
    var hash = 0, i, chr, len;
    if (s.length == 0) return hash;
    for (i = 0, len = s.length; i < len; i++) {
        chr   = s.charCodeAt(i);
        hash  = ((hash << 5) - hash) + chr;
        hash |= 0; // Convert to 32bit integer
    }
    return hash;
};


module.exports.createUser = function(name,mail,password) {
    var token = hashCode(mail+password);
    return new Promise(function(resolve){
        connector.executeQuery(CREATE_USER,[name,mail,password,token]).
            then(function(){
                resolve ({
                    success:true,
                    credentials: {
                        name:name,
                        mail:mail,
                        token:token
                    },
                    message:i18n.get('userCreated')
                });
            });
    });
};

module.exports.getUserByToken = function(token) {
    return new Promise(function(resolve){
        connector.
            executeQuery(GET_USER_BY_TOKEN,[token]).
            then(function(rows){
                var user = (rows && rows[0])||{};
                resolve(user);
            });
    });
};

module.exports.getUserByMailAndPassword = function(mail,password) {
   return new Promise(function(resolve){
       connector.
           executeQuery(GET_USER_BY_MAIL_AND_PASSWORD,[mail,password]).
           then(function(rows){
               var user = (rows && rows[0]);
               resolve(user);
           });
   });
};


module.exports.getAllUsers = function(){
    return new Promise(function(resolve){
        connector.
            executeQuery(GET_ALL_USERS,[]).
            then(function(rows){
                resolve(rows);
            });
    });
};

module.exports.checkEmailForExists = function(email){
    return new Promise(function(resolve){
        connector.
            executeQuery(GET_EMAIL,[email]).
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


module.exports.updateUser = function(id,name,active,userRoleId,departmentId){
    return new Promise(function(resolve){
        connector.executeQuery(UPDATE_USER,[name,active,userRoleId,departmentId,id])
            .then(function(){
                resolve();
            });
    });
};