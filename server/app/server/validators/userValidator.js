
module.exports.validateCredentials = function(name,mail,password){

    if (!(name && mail && password)) return {success:false};
    return {success:true};

};

module.exports.canWorksAsAdmin = function(user){
    return user.active==1 && user.role=='admin';
};