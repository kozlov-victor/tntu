

module.exports.setUpRotes = function(app){
    app.get('/api', function (req, res) {
        res.send('API is running in rotes.js');
    });
};