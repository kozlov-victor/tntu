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
            console.log('Connection established');
            resolve();
        });
    });
};

var dbQuery = function(connection,queryStr,params) {
    return new Promise(function(resolve,reject){
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
                dbClose(con);
                resolve(rows);
            });
    });

};

module.exports.executeQuery = executeQuery;