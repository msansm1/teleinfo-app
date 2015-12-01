'use strict';

var util = require('util');

exports.getLogger = function (db) {

    var collection = db.collection('teleinfo');

    return function (data) {
        var docToInsert = {
            'datetime': new Date(),
            'indexcptHC': data.indexHC,
            'indexcptHP': data.indexHP,
            'imoy': data.imoy,
            'imax': data.imaxi,
            'pmoy': data.pmoy,
            'pmax': data.pmaxi
        };
        collection.insert(docToInsert, {safe: true}, function (err, records) {
            if (err) {
                console.log(util.inspect(records));
                console.log(util.inspect(err));
            }
        });
    };
};