var connector = require('../base/connector');
var Promise = require('promise');
var i18n = require('../base/i18n');

const GET_ALL_TEAMS = 'select * from team';
const CREATE_TEAM = 'insert into team (name,shortName) values (?,?)';
const UPDATE_TEAM = 'update team set name=?, shortName=? where id=?';

module.exports.getAllTeams = function(){
    return new Promise(function(resolve){
        connector.executeQuery(GET_ALL_TEAMS,[])
            .then(function(teams){
                resolve(teams||[]);
            });
    });
};

module.exports.updateTeam = function(id,name,shortName) {
    return new Promise(function(resolve){
        connector.executeQuery(UPDATE_TEAM,[name,shortName,id])
            .then(function(){
                resolve();
            });
    });
};


module.exports.addTeam = function(name,shortName){
    return new Promise(function(resolve){
        connector.executeQuery(CREATE_TEAM,[name,shortName])
            .then(function(){
                resolve();
            });
    });
};
