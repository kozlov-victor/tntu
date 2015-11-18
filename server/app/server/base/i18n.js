
var _i18n = {};

_i18n.locale = 'ua';

_i18n.bundle = {
    'ua': {
        emailExists:'Даний email вже зареєстровано в системі',
        userCreated:'Реєстрація пройшла успішно',
        accessDenied:'Недостатньо прав для перегляду цієї сторінки',
        notAllFields:'Не всі поля заповнено',
        tooLargeField:'Поле занадто довге',
        email:'E-mail',
        pass:'Пароль',
        name:'Им\'я',
        enter:'Увійти',
        save:'Зберігти',
        forgotPass:'Забули пароль',
        registration:'Реєстрація',
        fieldIsEmpty:'Не заповнено поле {field}',
        fieldIsNotEmail:'Не корректний e-mail',
        enterFieldInRange:'Введіть від {min} до {max} символів',
        toMain:'На головну',
        register:'Зареєструватися',
        alreadyRegistered:'Вже зареєструвались?',
        incorrectSymbols:'Поле містить некоректні символи',
        IAgreeWith:'Я погоджуюсь із політикою конфіденційності цього програмного забезпечення',
        incorrectCredentials:'Користувача з такими даними не зареєстровано в системі',
        userActivation:'Управління користувачами в системі',
        success:'Дія виконана успішно',

        'undefined':'Не визначено',
        doctor:'Лікар',
        doctorAssys:'Фельшер',
        driver:'Водій',
        paramedic:'Санітар',
        admin:'Адміністратор',

        number:'Номер',
        user:'Користувач',
        role:'Роль',
        isActive:'Активність',
        department:'Відділ',
        actions:'Дії',
        departments:'Управління відділами підприємства',
        departmentName:'Назва відділу',
        addDepartment:'Створити відділ',
        carsManagement:'Управління транспортними ресурсами',
        addCar:'Додати',
        carNumber:'Номер автомобіля',
        carModel:'Модель автомобіля',
        carDescription:'Додатково',
        schedules:'Графіки роботи',
        addSchedule:'Новий графік роботи',
        month:'Місяць',
        year:'Рік',
        createSchedule:'Створити графік'
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