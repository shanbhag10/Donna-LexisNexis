var MongoClient = require('mongodb').MongoClient;
var assert = require('assert');
var Promise  = require('bluebird')
// Connect to the db
var url = 'mongodb://localhost:27017/db';
// MongoClient.connect(url, function(err, db) {
//   assert.equal(null, err);
//   //console.log("Connected correctly to server.");
//   db.close();
// });
// var list = []
  var newList = [];
//
// function myCallback(bot, message,response,db) {
//    console.log("List length:" + list.length);
//     if(list.length == 0) {
//                     bot.reply(message, response.result.fulfillment.speech);
//               } else {
//                   console.log(list)
//                   var foundJudges = list.toString();
//                   list = [];
//                   bot.reply(message, "foundJudges");
//               }
//    db.close();
//   }

module.exports = {
      searchJudgeByLastName :  function testDB(bot, message,response,  lastName) {
            console.log("I am here")

                 MongoClient.connect(url, function(err, db) {
                   if(err) {
                     console.log("error")
                   } else {

                     getDetails(bot, message, response, db, lastName);
                }
              });
        }
}

 // function testDB(lastName) {
 //
 //        MongoClient.connect(url, function(err, db) {
 //
 //              findjudge(db, lastName, function() {
 //                     db.close();
 //                 });
 //
 //        });
 //  };


// function pushElement(element) {function
//   list.push(element);
//   console.log(list.toString());
// }
// console.log("List length:" + newList.length);
//  if(newList.length == 0) {
//                  bot.reply(message, response.result.fulfillment.speech);
//            } else {
//              console.log("List length:" + newList.length);
//                console.log(newList)
//                var foundJudges = newList.toString();
//                newList.length = 0;
//                console.log("List length new:" + newList.length);
//                bot.reply(message, "foundJudges");
//            }
// db.close();
function getDetails(bot, message, response, db, lastName) {
  return new Promise(function(resolve, reject)
  {
    fillList(bot, message, response, db, lastName).then(function(newList) {
      console.log("List length:" + newList.length);
       if(newList.length == 0) {
                       bot.reply(message, response.result.fulfillment.speech);
                 } else {
                     console.log("List length:" + newList.length);
                     console.log(newList)
                     var foundJudges = newList.toString();
                     newList.length = 0;
                     console.log("List length new:" + newList.length);
                     bot.reply(message, "foundJudges");
                 }
      db.close();
    });
    resolve(newList)
  });
};

function fillList(bot, message, response, db, lastName) {
    return new Promise(function(resolve, reject) {
      checkDB(db,lastName).then(function(newList) {
      resolve(newList);
    });
  });
}

function checkDB(db, lastName) {
  return new Promise(function(resolve, reject) {
    db.collection('ld').find({"Last Name": lastName}).forEach(function(myDoc) {
         if(myDoc != null) {
           console.log(myDoc['First Name'])
            newList.push(myDoc['First Name']);
         }

    });
    resolve(newList)
  });

}
    // db.collection('ld').find({"Last Name": lastName}, function(err, doc) {
    //   // console.log(doc);
    //    doc.each(function(err, result) {
    //      console.log(JSON.stringify(result));
    //      if(result != null) {
    //        list.push(result['First Name']);
    //       //  console.log(result['First Name']);
    //     }
    //    });
    //
    //  }
  // myCallback(bot, message, response,db);

  // };

// function getDetails(bot, message, response, db, lastName, callback) {
//   var flag = true;
//    console.log("also here")
//     var cursor =db.collection('ld').find({"Last Name": lastName} );
//     console.log(cursor)
//     cursor.each(function(err, doc) {
//        assert.equal(err, null);
//        if (doc != null) {
//          list.push(doc['First Name']);
//           // console.dir(doc['First Name']);
//        } else {
//          flag = false;
//           callback(list);
//        }
//     });
//     if(flag == false) {
//           bot.reply(message, response.result.fulfillment.speech);
//     } else {
//         console.log(list)
//         var foundJudges = list.toString();
//         bot.reply(message, foundJudges);
//     }
//     console.log("Count: " + flag)

 // };
//
//  MongoClient.connect(url, function(err, db) {
//     assert.equal(null, err);
//     findjudge(db, function() {
//         db.close();
//     });
//   });
