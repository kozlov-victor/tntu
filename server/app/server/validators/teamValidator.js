const MAX_LENGTH = 64;
const MAX_LENGTH_SHORT_NAME = 5;
var i18n = require('../base/i18n');

module.exports.validate = function(name,shortName) {
    if (!(name && shortName)) {
        return {success:false,message:i18n.get('notAllFields')}
    }
    if (name.length>MAX_LENGTH || shortName>MAX_LENGTH_SHORT_NAME) {
        return {success:false,message:i18n.get('tooLargeField')}
    }
    return {success:true};
};

