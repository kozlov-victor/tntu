
var userController = require('../controllers/userController');

module.exports.setUpRotes = function(app){

    app.get('/auth', function (req, res) {
        res.send({login:req.query.login});
    });

    app.get('/register', function (req, res) {
        var mail = req.query.mail;
        var password = req.query.password;
        var name = req.query.name;
        userController.
            checkEmailForExists(mail).
            then(function(checkRes){
                if (!checkRes.success) throw checkRes;
                return userController.createUser(name,mail,password);
            }).
            then(function(result){
                console.log('createUser result',result);
                res.send(result);
            }).
            catch(function(err){
                console.log('error cached',err);
                res.send(err);
            });
    });
};