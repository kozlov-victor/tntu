const MAX_LENGTH = 64;
var i18n = require('../base/i18n');

module.exports.validate = function(number,model,description) {
    if (!(number && model)) {
        return {success:false,message:i18n.get('notAllFields')}
    }
    if (number.length>MAX_LENGTH || model>MAX_LENGTH || description>MAX_LENGTH) {
        return {success:false,message:i18n.get('tooLargeField')}
    }
    return {success:true};
};
