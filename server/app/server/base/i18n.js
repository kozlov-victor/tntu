
var _i18n = {};

_i18n.locale = 'ua';

_i18n.bundle = {
    'ua': {
        emailExists:'Даний email вже зареєстровано в системі',
        userCreated:'Реєстрація пройшла успішно',
        userActivation:'Активація користувачів',
        accessDenied:'Недостатньо прав для перегляду цієї сторінки',
        email:'E-mail',
        pass:'Пароль',
        name:'Им\'я',
        enter:'Увійти',
        forgotPass:'Забули пароль',
        registration:'Реєстрація',
        fieldIsEmpty:'Не заповнено поле {field}',
        fieldIsNotEmail:'Не корректний e-mail',
        enterFieldInRange:'Введіть від {min} до {max} символів',
        sendPassword:'Отправить пароль',
        toMain:'На головну',
        register:'Зареєструватися',
        alreadyRegistered:'Вже зареєструвались?',
        incorrectSymbols:'Поле містить некоректні символи',
        IAgreeWith:'Я погоджуюсь із політикою конфіденційності цього програмного забезпечення'
    }
};

_i18n.setLocate = function(_locale){
    _i18n.locale = _locale;
};


module.exports.get = function(key){
    return _i18n.bundle[_i18n.locale][key];
};

module.exports.getAll = function(){
    return _i18n.bundle[_i18n.locale];
};