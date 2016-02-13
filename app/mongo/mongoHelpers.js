'use strict';

var q = require('q');

exports.aggregate = function(db, collection, request) {
    var deferred = q.defer();
    console.log('Requête aggregate lancée');
    db.collection(collection).aggregate(request, deferred.makeNodeResolver());
    return deferred.promise;
};

exports.gethourdata = function(db, collection, date, callback) {	
  db.collection(collection).find({"datetime" : {"$gte": new Date(date)}}).sort({datetime : 1}).limit(1)
  	.toArray(function(err, docs) {
	    callback(docs);
	  });
};
