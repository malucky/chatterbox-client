// YOUR CODE HERE:
var message = {
  'username': 'SONALI and Ray',
  //'text': 'WHAZZZZZUPP!!',
  'roomname': '4c'
};

var postMessage = function(myMessage){
  $.ajax({
    // always use this url
    url: 'https://api.parse.com/1/classes/chatterbox',
    type: 'POST',
    data: JSON.stringify(myMessage),
    contentType: 'application/json',
    success: function (data) {
      console.log('chatterbox: Message sent');
    },
    error: function (data) {
      // see: https://developer.mozilla.org/en-US/docs/Web/API/console.error
      console.error('chatterbox: Failed to send message');
    }
  });
};

//setInterval(postMessage, 1000);

// YOUR CODE HERE:
var message;
var getMessages = function(){
  $.ajax({
    // always use this url
    url: 'https://api.parse.com/1/classes/chatterbox/',
    type: 'GET',
    data: {order: '-createdAt'},
    contentType: 'application/json',
    success: function (data) {
      //$('.display').empty();
      displayAllMessages(data);
      console.log(data);
    },
    error: function (data) {
      // see: https://developer.mozilla.org/en-US/docs/Web/API/console.error
      console.error('chatterbox: Failed to retrieve messages');
    }
  });
};

var lastTime = 0;
setInterval(getMessages, 3000);
setTimeout(getMessages, 0);
//getMessages();
console.log('here it is:', message);

var displayMessage = function(oneMessage) {
  var message = oneMessage;
  var userName = message.username;
  var text = message.text;
  var time = message.createdAt;
  var formattedTime = new Date(Date.parse(message.createdAt));
  formattedTime = formattedTime.getHours() + ":" + formattedTime.getMinutes() + ":" + formattedTime.getSeconds();
  console.log(formattedTime);
  //if (text && userName && time) {
    text = text.slice(0, Math.min(message.text.length, 169));
    console.log(userName, " ", text, " ", formattedTime);
    var $display = $(".display");
    $display.prepend("<div></div>");
    $display.find('div').first().text(formattedTime + "      " + userName + ': ' + text);
  //}
};

var displayAllMessages = function(data) {
  var messages = data.results;
  for (var i = messages.length - 1; i >= 0; i--) {
    //debugger;
    if (Date.parse(messages[i].createdAt) > lastTime) {
      displayMessage(messages[i]);
    }
  }
  lastTime = Date.parse(messages[0].createdAt);
};
$(document).ready( function(){
$('.submit').on('click', function(e){
  e.preventDefault();
  var myMessage = {
    text: $('.textBox').val(),
    username: window.location.search.slice(10),
    roomname: 'HR'
  };
  postMessage(myMessage);
  $('.textBox').val("");
});
});