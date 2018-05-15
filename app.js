var db = require('./db1');

module.exports = {
  searchJudgeByLastName: function(bot, message, response, lastName) {
    var list = [];
    db.findJudgeByLastName(lastName).then(function(items) {
      for(var i = 0; i < items.length; i++) {
        list.push(items[i]['First Name'] + " " + items[i]['Last Name'] + "(" + items[i]['Court Name (1)'] + ")" );
        console.log("First name: " + items[i]['First Name'])
      }
      if(list.length == 0) {
        bot.reply(message, "no match found")
      } else if(list.length == 1) {
        bot.reply(message, list.toString())
      } else {
        bot.reply(message, "multiple match founds: do you have anyone specific in mind: " + list.toString());
      }
    }, function(err) {
      console.error('The promise was rejected', err, err.stack);
    });
  },

  searchJudgeByFirstAndLastName: function(bot, message, response, firstName, lastName) {
    var list = [];
    db.findJudgeByFirstAndLastName(firstName, lastName).then(function(items) {
      for(var i = 0; i < items.length; i++) {
        list.push(items[i]['First Name'] + " " + items[i]['Last Name']  + "(" + items[i]['Court Name (1)'] + ")");
      }
      if(list.length == 0) {
        bot.reply(message, "no match found")
      } else if(list.length == 1) {
        bot.reply(message, list.toString())
      } else {
        bot.reply(message, "multiple match founds: do you have anyone specific in mind: " + list.toString());
      }
    }, function(err) {
      console.error('The promise was rejected', err, err.stack);
    });
  }

}
