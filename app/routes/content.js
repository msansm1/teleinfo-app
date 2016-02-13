'use strict';

var mongo = require('../mongo/mongoHelpers');
var moment = require('moment');

function ContentMongo(db) {

    this.consoParJour = function (req, res) {

        // Url attendue du type : /rest/conso/journaliere?debut=2014-01-27&fin=2014-03-16

        var debut = moment(req.query.debut);
        var fin = moment(req.query.fin);

        // Conso journalière triée par conso (jour le plus consommateur en premier)
        var request = [
            {$match: {datetime: {$gte: debut.toDate(), $lte: fin.toDate()}}},
            {$project: {annee: {'$year': '$datetime'},
                mois: {'$month': '$datetime'},
                jour: {'$dayOfMonth': '$datetime'},
                datetime: 1,
                indexcpt: 1}},
            {$group: {_id: {annee: '$annee', mois: '$mois', jour: '$jour'},
                mini: {$min: '$indexcptHC'},
                maxi: {$max: '$indexcptHC'}}},
            {$group: {_id: {annee: '$annee', mois: '$mois', jour: '$jour'},
                mini: {$min: '$indexcptHP'},
                maxi: {$max: '$indexcptHP'}}},
            {$project: {conso: {$subtract: ['$maxi', '$mini']},
                annee: {$substr: ['$_id.annee', 0, 4]},  // Workaround pour conversion d'un nombre en string pour la concaténation
                mois: {$substr: ['$_id.mois', 0, 2]},
                jour: {$substr: ['$_id.jour', 0, 2]}}},
            {$project: {_id: 0,
                date: {$concat: ['$annee', '-', '$mois', '-', '$jour']},
                conso: 1}},
            {$sort: {conso: -1}}
        ];

        mongo.aggregate(db, 'teleinfo', request)
            .then(function (result) {
                res.send(result);
            })
            .catch(function (err) {
                console.log(err);
                res.send(err);
            });
    };

    this.pmaxParHeure = function (req, res) {

        // Url attendue du type : /rest/puissance/pmaxparheure?debut=2014-01-27&fin=2014-03-16

        var debut = moment(req.query.debut);
        var fin = moment(req.query.fin);

        // Conso journalière triée par conso (jour le plus consommateur en premier)
        var request = [

            {$match: {datetime: {$gte: debut.toDate(), $lte: fin.toDate()}}},
            {$project: {annee: {'$year': '$datetime'},
                mois: {'$month': '$datetime'},
                jour: {'$dayOfMonth': '$datetime'},
                heure: {'$hour': '$datetime'},
                minute: {'$minute': '$datetime'},
                datetime: 1,
                pmax: 1}},
            {$group: {_id: {annee: '$annee', mois: '$mois', jour: '$jour', heure: '$heure'},
                pmax: {$max: '$pmax'}
            }},
            {$project: {annee: {$substr: ['$_id.annee', 0, 4]},  // Workaround pour conversion d'un nombre en string pour la concaténation
                mois: {$substr: ['$_id.mois', 0, 2]},
                jour: {$substr: ['$_id.jour', 0, 2]},
                heure: '$_id.heure',
                pmax: 1}},
            {$project: {_id: 0,
                date: {$concat: ['$annee', '-', '$mois', '-', '$jour']},
                heure: 1,
                pmax: 1}},
            {$sort: {'pmax': -1}}
        ];

        mongo.aggregate(db, 'teleinfo', request)
            .then(function (result) {
                res.send(result);
            })
            .catch(function (err) {
                console.log(err);
                res.send(err);
            });

    };
    
    this.indexLastHour = function (req, res) {

        // Url attendue du type : /rest/puissance/pmaxparheure?debut=2014-01-27&fin=2014-03-16
  
        var begin = null;
        var end = null;
        mongo.gethourdata(db, 'teleinfo', req.query.debut+":00:00.000Z", function(docs) {
        	begin = docs;
            mongo.gethourdata(db, 'teleinfo', req.query.fin+":00:00.000Z", function(docs) {
            	end = docs;
                res.send({first:begin, last:end});
            });
        });
    };

}

module.exports = ContentMongo;