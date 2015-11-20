var connector = require('../base/connector');
var Promise = require('promise');
var i18n = require('../base/i18n');

const GET_ALL_TEAMS = 'select * from team';
const CREATE_TEAM = 'insert into team (name,shortName) values (?,?)';
const UPDATE_TEAM = 'update team set name=?, shortName=? where id=?';
const GET_ALL_TEAM_TO_CARS = 'select * from teamToCar';
const DELETE_TEAM_CAR_BY_TEAM_ID = 'delete from teamToCar where teamId=?';
const INSERT_TEAM_CAR = 'insert into teamToCar(teamId,carId) values (?,?)';

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


module.exports.getAllTeamToCars = function() {
   return new Promise(function(resolve){
       connector.executeQuery(GET_ALL_TEAM_TO_CARS,[])
           .then(function(rows){
               resolve(rows||[]);
           });
   });
};

module.exports.updateTeamToCars = function(arr){
    return new Promise(function(resolve){
        var promises  = [];
        arr.forEach(function(item){
            var p = new Promise(function(r){
                connector.executeQuery(DELETE_TEAM_CAR_BY_TEAM_ID,[item.teamId,item.carId])
                    .then(function(){
                        return connector.executeQuery(INSERT_TEAM_CAR,[item.teamId,item.carId])
                    })
                    .then(function(){
                        console.log('resolved item',item);
                        r();
                    });
            });
            promises.push(p);
        });
        Promise.all(promises)
            .then(function(){
                console.log('all items resolved');
                resolve();
            })

    });
};
