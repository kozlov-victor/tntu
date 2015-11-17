const MAX_LENGTH = 64;
var i18n = require('../base/i18n');

module.exports.validate = function(departmentName) {
    if (!departmentName) {
        return {success:false,message:i18n.get('notAllFields')}
    }
    if (departmentName.length>MAX_LENGTH) {
        return {success:false,message:i18n.get('tooLargeField')}
    }
    return {success:true};
};
