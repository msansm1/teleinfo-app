'use strict';

var consoinst = require('../teleinfo/consoinst');
var ContentMongo = require('./content');

module.exports = exports = function(app, db, tarifbleu) {

    var content = new ContentMongo(db);

    // home
    app.get('/', function (req, res) {
        res.redirect('/index.html');
    });

    // Requête 'isAlive'
    app.get('/isAlive', function (req, res) {
        res.json('application teleinfo démarrée');
    });

    // Mise à jour du contexte des requêtes sur le compteur
    app.all('/rest/inst/*', function (req, res, next) {
        req.tarifbleu = tarifbleu;
        next();
    });

    // Requêtes données instantannées
    app.get('/rest/inst/p', consoinst.pinst);
    app.get('/rest/inst/i', consoinst.iinst);
    app.get('/rest/inst/index', consoinst.index);
    app.get('/rest/inst/indexhc', consoinst.indexHC);
    app.get('/rest/inst/indexhp', consoinst.indexHP);

    // Requêtes mongo
    app.get('/rest/conso/journaliere', content.consoParJour);
    app.get('/rest/puissance/pmaxparheure', content.pmaxParHeure);

};