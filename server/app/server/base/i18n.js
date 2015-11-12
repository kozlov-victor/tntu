
var _i18n = {};

_i18n.locale = 'ua';

_i18n.bundle = {
    'ua': {
        emailExists:'Даний email вже зареєстровано в системі',
        userCreated:'Реєстрація пройшла успішно'
    }
};

_i18n.setLocate = function(_locale){
    _i18n.locale = _locale;
};


module.exports.get = function(key){
    return _i18n.bundle[_i18n.locale][key];
};