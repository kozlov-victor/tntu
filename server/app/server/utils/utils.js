var i18n = require('../base/i18n');

module.exports.parametrize = function(params) {

    params=params||{};
    params.i18n = i18n.getAll();
    return params;

};
