
var connector = require('../base/connector');
var Promise = require('promise');
var i18n = require('../base/i18n');

const GET_CALL_BASE ='\
    SELECT \
        c.id,c.inPhone,c.address,c.description, UNIX_TIMESTAMP(c.date) as date, UNIX_TIMESTAMP(c.dateCompleted) as dateCompleted,\
        t.id as teamId, t.shortName as teamShortName, \
        cs.id as callStatusId, cs.code as callStatusCode \
    FROM _call c \
    INNER JOIN team t ON t.id=c.teamId \
    INNER JOIN callStatus cs ON cs.id=c.callStatusId \
    ';

const GET_CALLS_BY_DATE =GET_CALL_BASE +' \
    WHERE YEAR(c.date)=? AND MONTH(c.date)=? AND DAY(c.date)=? \
    ';

const GET_CALLS_ARCHIVE =
    GET_CALL_BASE +' \
    WHERE (? IS NULL OR ?>=UNIX_TIMESTAMP(c.date)) AND (? IS NULL OR ?<=UNIX_TIMESTAMP(c.dateCompleted)) \
    ';

const CREATE_NEW_CALL =
    'insert into _call (inPhone,address,description,teamId,callStatusId) values(?,?,?,?,1)';

module.exports.getCallsForThisDay = function(day,month,year) {
    console.log('gettting calls for his dat',day,month,year);
    return new Promise(function(resolve){
        connector.executeQuery(GET_CALLS_BY_DATE,[year,month,day])
            .then(function(calls){
                resolve(calls||[]);
            });
    });
};

module.exports.getCallsArchive = function(dateFrom,dateTo) {
    return new Promise(function(resolve){
        if (!dateFrom) dateFrom = null;
        if (!dateTo) dateTo = null;
        console.log('dateFrom',dateFrom,'dateTo',dateFrom);
        connector.executeQuery(GET_CALLS_ARCHIVE,[dateFrom,dateFrom,dateTo,dateTo])
            .then(function(calls){
                console.log('queried archive list',calls);
                resolve(calls||[]);
            });
    });
};

module.exports.createNewCall = function(call) {
    return new Promise(function(resolve){
        console.log('creating call',call);
        connector.executeQuery(CREATE_NEW_CALL,[call.inPhone,call.address,call.description,call.teamId])
            .then(function(){
                resolve();
            });
    });
};