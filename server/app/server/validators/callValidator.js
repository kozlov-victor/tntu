const PHONE_MAX_LENGTH = 20;
const ADDRESS_MAX_LENGTH = 100;
const DESCRIPTION_MAX_LENGTH = 100;

var i18n = require('../base/i18n');

module.exports.validate = function(phone,address,description) {
    if (!(phone && address && description)) {
        return {success:false,message:i18n.get('notAllFields')}
    }
    if (phone.length>PHONE_MAX_LENGTH || address>ADDRESS_MAX_LENGTH || description>DESCRIPTION_MAX_LENGTH) {
        return {success:false,message:i18n.get('tooLargeField')}
    }
    return {success:true};
};

