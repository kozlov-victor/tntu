const MAX_LENGTH = 64;
var i18n = require('../base/i18n');

module.exports.validateCredentials = function(name,mail,password){

    if (!(name && mail && password)) return {success:false};
    return {success:true};

};

module.exports.validateName = function(name){
    if (!name) {
        return {success:false,message:i18n.get('notAllFields')}
    }
    if (name.length>MAX_LENGTH) {
        return {success:false,message:i18n.get('tooLargeField')}
    }
    return {success:true};
};

module.exports.canWorksAsAdmin = function(user){
    return user.active==1 && user.roleId==1;
};