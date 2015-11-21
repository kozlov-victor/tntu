var connector = require('../base/connector');
var Promise = require('promise');
var i18n = require('../base/i18n');



const GET_ALL_SHIFT_TYPES = 'select * from shiftType';
const CREATE_SCHEDULE = 'insert into schedule (month,year,departmentId) values(?,?,?)';
const CREATE_SCHEDULE_LINE = 'insert into scheduleLine (dayOfMonth,userId,teamId,shiftTypeId,done,scheduleId) values (?,?,?,?,?,?)';
const UPDATE_SCHEDULE_LINE = 'update scheduleLine set dayOfMonth=?,userId=?,teamId=?,shiftTypeId=?,done=? where id=?';
const GET_SCHEDULE_LIST_BY_YEAR = '\
    select s.id,s.month,s.year, d.name as departmentName from schedule s \
    inner join department d on s.departmentId = d.id \
    where s.year=?\
    ';
const GET_SCHEDULE_LINES_BY_SCHEDULE_ID =
    'SELECT * FROM scheduleLine WHERE scheduleId = ?';

const DELETE_SCHEDULE_LINES = 'delete from scheduleLine where id in (?)';

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
        if (!rows || !rows.length) resolve();
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


module.exports.updateScheduleLines = function(rows){
    console.log('updateScheduleLines');
    return new Promise(function(resolve){
        if (!rows || !rows.length) resolve();
        var promises = [];
        rows.forEach(function(row){
            var p = new Promise(function(r){
                connector.executeQuery(UPDATE_SCHEDULE_LINE,[
                    row.dayOfMonth,
                    row.userId,
                    row.teamId,
                    row.shiftTypeId,
                    row.done,
                    row.lineId
                ])
                    .then(function(){
                        console.log('line  updated',row);
                        r();
                    });
            });
            promises.push(p);
        });
        Promise
            .all(promises)
            .then(function(){
                console.log('all lines are updated');
                resolve();
            });
    });
};


module.exports.deleteScheduleLines = function(rows) {
    console.log('deleteScheduleLines');
    return new Promise(function(resolve){
        if (!rows || !rows.length) resolve();
        var ids = rows.map(function(item){return item.lineId});
        connector.executeQuery(DELETE_SCHEDULE_LINES,[ids])
            .then(function(){
                resolve();
            })
    });
};


module.exports.getScheduleListByYear = function(year){
    return new Promise(function(resolve){
        connector.executeQuery(GET_SCHEDULE_LIST_BY_YEAR,[year])
            .then(function(rows){
                resolve(rows||[]);
            })
    });
};

module.exports.getScheduleLinesByScheduleId = function(scheduleId){
    return new Promise(function(resolve){
        console.log('resolving schedule lines for scheduleId',scheduleId);
        connector.executeQuery(GET_SCHEDULE_LINES_BY_SCHEDULE_ID,[scheduleId])
            .then(function(lines){
                console.log('resolved lines',lines);
                resolve(lines||[]);
            });
    });
};


