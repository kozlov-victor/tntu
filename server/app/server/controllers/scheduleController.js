var connector = require('../base/connector');
var Promise = require('promise');
var i18n = require('../base/i18n');



const GET_ALL_SHIFT_TYPES = 'select * from shiftType';
const CREATE_SCHEDULE = 'insert into schedule (month,year,departmentId) values(?,?,?)';
const CREATE_SCHEDULE_LINE = 'insert into scheduleLine (dayOfMonth,userId,teamId,shiftTypeId,done,scheduleId) values (?,?,?,?,?,?)';

//Month is 1 based
module.exports.getNumOfDaysInMonth = function(month,year) {
    return new Date(year, month, 0).getDate();
};

module.exports.getAllShiftTypes = function(){
   return new Promise(function(resolve){
        connector.executeQuery(GET_ALL_SHIFT_TYPES,[])
            .then(function(shiftTypes){
                resolve(shiftTypes);
            });
   });
};

module.exports.createSchedule = function(month,year,departmentId){
    console.log('createSchedule',month,year,departmentId);
    return new Promise(function(resolve){
       connector.executeQuery(CREATE_SCHEDULE,[month,year,departmentId])
           .then(function(data){
               resolve(data.insertId)
           });
   });
};

module.exports.createScheduleLines = function(scheduleId,rows){
    console.log('createScheduleLines');
    return new Promise(function(resolve){
        var promises = [];
        rows.forEach(function(row){
            var p = new Promise(function(r){
                connector.executeQuery(CREATE_SCHEDULE_LINE,[
                    row.dayOfMonth,
                    row.userId,
                    row.teamId,
                    row.shiftTypeId,
                    row.done,
                    scheduleId
                ])
                    .then(function(res){
                        console.log('new schedulerLine created with id',res.insertId);
                        r(res.insertId);
                    });
            });
            promises.push(p);
        });
        Promise
            .all(promises)
            .then(function(){
                console.log('all lines are inserted');
                resolve();
            });
    });
};


