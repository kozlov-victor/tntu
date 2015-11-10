
(function(){

    var Utils = window.Utils;

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

    Api.makeBaseRequest = function() {
        resolveLocalCredentials();
    };

    window.Api = Api;

})();