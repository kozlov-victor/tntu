
var connector = require('../base/connector');
var Promise = require('promise');
var i18n = require('../base/i18n');

const GET_CALLS_BY_DATE ='\
    SELECT \
        c.id,c.inPhone,c.address,c.description, UNIX_TIMESTAMP(c.date) as date, \
        t.id as teamId, t.shortName as teamShortName, \
        cs.id as callStatusId, cs.code as callStatusCode \
    FROM _call c \
    INNER JOIN team t ON t.id=c.teamId \
    INNER JOIN callStatus cs ON cs.id=c.callStatusId \
    WHERE YEAR(c.date)=? AND MONTH(c.date)=? AND DAY(c.date)=? \
    ';

module.exports.getCallsForThisDay = function(day,month,year) {
    return new Promise(function(resolve){
        connector.executeQuery(GET_CALLS_BY_DATE,[year,month,day])
            .then(function(calls){
                resolve(calls||[]);
            });
    });
};