var mysql = require("mysql");
var Promise = require('promise');

var dbGetConnection = function() {
    return mysql.createConnection({
        host: "localhost",
        user: "root",
        password: "10cls",
        database: "tntu"
    });
};

var dbConnect = function(connection) {
    return new Promise(function(resolve,reject){
        connection.connect(function(err){
            if(err){
                throw err;
            }
            resolve();
        });
    });
};

var dbQuery = function(connection,queryStr,params) {
    return new Promise(function(resolve,reject){
        //console.log('query:',queryStr,params);
        connection.query(queryStr,params,function(err,rows){
            if(err) throw err;
            resolve(rows);
        });
    });
};

var dbClose = function(connection) {
    connection.end(function(err) {
        if (err) throw err;
    });
};

var executeQuery = function(query,params) {
    return new Promise(function(resolve,reject){
        var con = dbGetConnection();
        dbConnect(con).
            then(function(){
                return dbQuery(con,query,params);
            }).
            then(function(rows){
                rows=rows||[];
                //console.log('accepted rows',rows);
                dbClose(con);
                resolve(rows);
            }).catch(function(e){
                console.log('error:',e);
            });
    });

};

module.exports.executeQuery = executeQuery;