'use strict';

(function(){


    var BASE_URL = 'http://0.0.0.0:8082/';
    var AUTH_URL = BASE_URL + 'auth';
    var REGISTRATION_URL = BASE_URL + 'register';


    var Api = {};

    var _defaultCredentials = {token:''};
    var credentials = _defaultCredentials;

    var _saveCredentials = function(cr) {
        localStorage.setItem('credentials',JSON.stringify(cr));
    };

    Api.resetCredentials = function() {
        credentials = _defaultCredentials;
        _saveCredentials(credentials);
    };

    Api.setCredentials = function(cr) {
        credentials = cr;
        _saveCredentials(cr);
    };

    Api.getCredentials = function() {
       return credentials||_defaultCredentials;
    };

    var resolveLocalCredentials = function() {
        try {
            if (localStorage.getItem('credentials')) credentials = JSON.parse(localStorage.getItem('credentials'));
        } catch(e){
            localStorage.removeItem('credentials');
        }
    };

    Api.authorize = function(login,pass){
        return new Promise(function(resolve,reject){
            Utils.Ajax.send({
                url:AUTH_URL,
                data: {
                    login:login,
                    pass:pass
                },
                success:function(data){
                    resolve(data);
                }
            });
        });
    };

    Api.register = function(name,email,password){
        return new Promise(function(resolve,reject){
            Utils.Ajax.send({
                url:REGISTRATION_URL,
                data:{
                    mail:encodeURIComponent(email),
                    name:encodeURIComponent(name),
                    password:encodeURIComponent(password)
                },
                success:function(data){
                    resolve(data);
                }
            });
        });
    };

    Api.makeBaseRequest = function() {
        resolveLocalCredentials();
    };

    window.Api = Api;

})();