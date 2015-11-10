

module.exports.setUpRotes = function(app){

    app.get('/auth', function (req, res) {
        res.send({login:req.query.login});
    });
};