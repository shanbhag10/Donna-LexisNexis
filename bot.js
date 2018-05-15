var Botkit = require('botkit');
var apiai = require('apiai');
var app = apiai(process.env.HACKATHONAPIAITOKEN);
var Slack = require('slack-node')
var request = require('request')

var slack = new Slack(process.env.HACKATHONSLACKTOKEN)

var search = require('./app');

// variable to store all slack user details
var slackUsersList =[]
var url = "https://api.api.ai/v1/"
var userIdNameMap = {}


function getSlackUsers() {

  slack.api("users.list", function(error, response) {
    slackUsersList = response.members;
  });
  for(var i = 0 ; i < slackUsersList.length; i++) {
    var user = slackUsersList[i];
    userIdNameMap[user.id] = user.real_name
  }
}


// var possibleFunctions = "Here is what my autobots can do for you: \n 1. `create vm` : creates virtual machine on AWS or Digital Ocean, you can add flavors on top of the requested machine\n 2. `create VM image with eclipse` : creates a virtual machine image with eclipse configured and you can also install selective plugins\n 3. `manage reservations` : shows all your current reservations and further options to edit/delete the specific reservation\n 4. `exit` : exit the conversation\n"

var controller = Botkit.slackbot({
    debug: false
});

// connect the bot to a stream of messages
controller.spawn({
    token: process.env.HACKATHONSLACKTOKEN,
}).startRTM()

/** Stores the latest session id associated with the user **/
var sessionMap = {}
getSlackUsers()

controller.hears('(.*)', ['mention', 'direct_mention', 'direct_message'], function (bot, message) {
      if (sessionMap[message.user] == undefined) {
      sessionMap[message.user] = message.user;
    }

      if(message.text.indexOf("<") > 1) {
        console.log("Initial:" + message.text)
        message.text = message.text.substring(0,message.text.indexOf("<"));
        console.log("Alert" + message.text)
      }

      var request = app.textRequest(message.text, {
      sessionId: sessionMap[message.user]
    });

    request.on('response', function (response) {
        // console.log(response);
        if (response.result.actionIncomplete) {
            bot.reply(message, response.result.fulfillment.speech);
        } else {
            switch (response.result.action) {

                case 'user.initiation':
                   if(userIdNameMap[message.user] == undefined) {
                     getSlackUsers()
                   }
                   bot.reply(message, "Hello, " + userIdNameMap[message.user])

                   break;

                case 'greeting.initial':
                    bot.reply(message, response.result.fulfillment.speech);
                    break;

                case 'user.reply':
                    bot.reply(message, response.result.fulfillment.speech);
                    break;

                case 'find.cases.judge.last.name':
                    var lastName = response.result.parameters.any;
                    lastName = fixCase(lastName)
                    search.searchJudgeByLastName(bot, message, response, lastName);
                    //bot.reply(message, response.result.fulfillment.speech);
                    break;

                case 'find.cases.judge.first.last.name':
                    var firstName = response.result.parameters.any;
                    var lastName = response.result.parameters.any1;
                    firstName = fixCase(firstName)
                    lastName = fixCase(lastName)
                    console.log("updated name:" + firstName)
                    search.searchJudgeByFirstAndLastName(bot, message, response, firstName, lastName);
                    break;
                // case 'bot.help':
                //     bot.reply(message, possibleFunctions);
                //     break;

                case 'action.exit':
                    bot.reply(message, response.result.fulfillment.speech);
                    sessionMap[message.user] = message.user;
                    deleteContextsForUser(message.user)
                    break;

                case 'conversation.end':
                    if(userIdNameMap[message.user] == undefined) {
                        getSlackUsers()
                    }
                     bot.reply(message, "Good Bye, " + userIdNameMap[message.user])

                    break;

                default:
                    bot.reply(message, response.result.fulfillment.speech);

            }
        }
    });

    request.on('error', function (error) {
        console.log(error);
    });

    request.end();
});


function deleteContextsForUser(sessionId)
{

	var options = {
		url: url + "contexts/?sessionId=" + sessionId,
		method: 'DELETE',
		headers: {
			"User-Agent": "EnableIssues",
			"content-type": "application/json",
			"Authorization": "Bearer" + process.env.APIAITOKEN
		}
	};

	// Send a http request to url and specify a callback that will be called upon its return.
	request(options, function (error, response, body)
	{
    console.log("context cleared");
	});

}

function fixCase(name) {
  var firstChar = name.charAt(0);
  if(firstChar != firstChar.toUpperCase())  {
    name = firstChar.toUpperCase() + name.slice(1);
  }
  return name
}
