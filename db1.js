var MongoClient = require('mongodb').MongoClient;
/*
node.js has native support for promises in recent versions.
If you are using an older version there are several libraries available:
bluebird, rsvp, Q. I'll use rsvp here as I'm familiar with it.
*/
var Promise = require('rsvp').Promise;

module.exports = {
  findJudgeByLastName: function(lastName) {
    return new Promise(function(resolve, reject) {
      MongoClient.connect('mongodb://localhost:27017/db', function(err, db) {
        if (err) {
          reject(err);
        } else {
          resolve(db);
        }
      })
    }).then(function(db) {
      return new Promise(function(resolve, reject) {
        var collection = db.collection('ld');

        collection.find({"Last Name": lastName}).toArray(function(err, items) {
          if (err) {
            reject(err);
          } else {
            // console.log(items);
            resolve(items);
          }
        });
      });
    });
  },

  findJudgeByFirstAndLastName: function(firstName,lastName) {
    return new Promise(function(resolve, reject) {
      MongoClient.connect('mongodb://localhost:27017/db', function(err, db) {
        if (err) {
          reject(err);
        } else {
          resolve(db);
        }
      })
    }).then(function(db) {
      return new Promise(function(resolve, reject) {
        var collection = db.collection('ld');

        collection.find({
          "First Name": firstName,
          "Last Name": lastName
        }).toArray(function(err, items) {
          if (err) {
            reject(err);
          } else {
            // console.log(items);
            resolve(items);
          }
        });
      });
    });
  }

};
