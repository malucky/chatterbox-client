// YOUR CODE HERE:
var message = {
  'username': 'shawn',
  'text': 'tro',
  'roomname': '4c'
};

$.ajax({
  // always use this url
  url: 'https://api.parse.com/1/classes/chatterbox',
  type: 'POST',
  data: JSON.stringify(message),
  contentType: 'application/json',
  success: function (data) {
    console.log('chatterbox: Message sent');
  },
  error: function (data) {
    // see: https://developer.mozilla.org/en-US/docs/Web/API/console.error
    console.error('chatterbox: Failed to send message');
  }
});


// YOUR CODE HERE:
var message;
var getMessages = function(){
  $.ajax({
    // always use this url
    url: 'https://api.parse.com/1/classes/chatterbox',
    type: 'GET',
    data: {order: '-createdAt'},
    contentType: 'application/json',
    success: function (data) {
      $('.display').empty();
      displayAllMessages(data);
      console.log(data);
    },
    error: function (data) {
      // see: https://developer.mozilla.org/en-US/docs/Web/API/console.error
      console.error('chatterbox: Failed to retrieve messages');
    }
  });
};

setInterval(function() {getMessages();},1000);
//getMessages();
console.log('here it is:', message);

var displayMessage = function(oneMessage) {
  var message = oneMessage;
  var userName = message.username;
  var text = message.text;
  var time = message.createdAt;
  debugger;
  console.log(userName, " ", text, " ", time);
  var $display = $(".display");
  $display.append("<div></div>");
  $display.find('div').last().text(userName + ': ' + text + ' ' + time);
};

var displayAllMessages = function(data) {
  var messages = data.results;
  for (var i = 0; i < messages.length; i++) {
    displayMessage(messages[i]);
  }
};