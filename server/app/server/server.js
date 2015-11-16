var app = require('./base/expressApp').app;

require('./base/routes').setUpRotes(app);

var server = app.listen(8081, function () {

  var host = server.address().address;
  var port = server.address().port;

  console.log("app listening at http://%s:%s", host, port)

});
