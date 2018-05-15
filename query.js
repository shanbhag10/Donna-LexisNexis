var fs = require('fs');
var xmldoc = require('xmldoc');
var MongoClient = require('mongodb').MongoClient;
var assert = require('assert');
var Promise = require("bluebird");
// Connect to the db
var url = 'mongodb://localhost:27017/db';
MongoClient.connect(url, function(err, db) {
 assert.equal(null, err);
 //console.log(“Connected correctly to server.“);
 db.close();
});

var findjudge= function(db, callback) {
  var j = []
  var name = "Peleg Sprague"
  var cursor =db.collection('lb').find({"First Name": name.split(" ")[0], "Last Name": name.split(" ")[1]} );
   console.log("List of all cases by Judge "+name)
   cursor.each(function(err, doc) {
      if (doc != null) {      
         var jid = doc['judge_id']
         if(jid!=null){
            // console.dir(doc['judge_id']);
            j.push(doc['judge_id']);
            var cursor1 =db.collection('lb1').find({"judge_id": doc['judge_id']});
             // console.log(cursor)
             cursor1.each(function(err, doc) {
                assert.equal(err, null);
                if (doc != null) {
                  var xml = fs.readFileSync('casemets/'+doc['case_id']+'.xml', 'utf8');
                 // var xml = fs.readFileSync('casemets/32044046873683_0001.xml', 'utf8');
                   var document = new xmldoc.XmlDocument(xml);
                   console.log(document.valueWithPath("dmdSec.mdWrap.xmlData.case.name"));
                   //console.log(inspect(obj));
                   //console.dir(doc['case_id']);
                   //window.print(doc['First Name'])
                } else {
                   callback();
                }
             });
           return jid;
         }
         //window.print(doc['First Name'])
      } else {
         callback();
      }
   });
};

// function getUserDataAsync(db) {
  
//     return new Promise(function(resolve, reject) {

//         // Put all your code here, this section is throw-safe.
//         var k = findjudge(db, function() {
//            db.close();
//        });
//     });
//     console.dir("Here!"+k);
//     return k;
// }

// var findCase = function(db, callback) {

//   var jid = findjudge(db, function() {
//        db.close();
//    });

//   console.dir(jid);
//   var cursor1 =db.collection('lb1').find({"judge_id": 2256});
//    // console.log(cursor)
//    cursor1.each(function(err, doc) {
//       assert.equal(err, null);
//       if (doc != null) {
//          console.dir(doc['case_id']);
//          //window.print(doc['First Name'])
//       } else {
//          callback();
//       }
//    });
// };

MongoClient.connect(url, function(err, db) {
    findjudge(db, function() {
        db.close();
    });
   assert.equal(null, err);
 });