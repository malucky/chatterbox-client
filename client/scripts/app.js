// YOUR CODE HERE:

/****************************jokes *************************/
/*var jokes = ["Knock, knock. Who's there? Lettuce. Lettuce who? Lettuce in, it's cold out here.", "Knock, knock Who's there? Kent. Kent who? Kent you tell by my voice?", "Knock, knock. Who's there? Jess. Jess who? Jess me and my shadow", "Yo mama so dumb she hears it's chilly outside so she gets a bowl", "Yo mama so dumb she got hit by a cup and told the police she got mugged", "yo mama so dumb she sprayed a tree with axe body spray and thought it would fall down", "Yo mama's so dumb she put two M&M's in her ears and thought she was listening to Eminem.", "Yo mama so dumb she went to the library to find Facebook"];

var sendJokes = function(data) {
  for (var i = 0; i < data.results.length; i++) {
    var jokeMessage = {
      'username': data.results[i].username,
      'text': jokes[Math.floor(Math.random()*jokes.length)],
      'roomname': 'joke room'
    };
    postMessage(jokeMessage);
  }
};
*/

var message;
var lastTime = 0; //time when most recent message was posted

//Ajax POST- submits messages and stringifies them
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

//Ajax GET- retrieves messages and calls displayAllMessages to display all of the messages
var getMessages = function(){
  $.ajax({
    // always use this url
    url: 'https://api.parse.com/1/classes/chatterbox/',
    type: 'GET',
    data: {order: '-createdAt'},
    contentType: 'application/json',
    success: function (data) {
      displayAllMessages(data);
    },
    error: function (data) {
      // see: https://developer.mozilla.org/en-US/docs/Web/API/console.error
      console.error('chatterbox: Failed to retrieve messages');
    }
  });
};

/*****************display single message ******************/
var displayMessage = function(message) {
  var roomName = scrubbing(message.roomname);
  var userName = scrubbing(message.username);
  var text = scrubbing(message.text);
  var time = message.createdAt;
  var $display = $(".display");
  var formattedTime = new Date(Date.parse(message.createdAt));
  formattedTime = formattedTime.getHours() + ":" + formattedTime.getMinutes() + ":" + formattedTime.getSeconds();

  $display.prepend('<div class="' + roomName + '"></div>');
  $display.find('div').first().text(formattedTime + "      " + userName + ': ' + text);
  addRoom(roomName);
};

var scrubbing = function(str){
  str = str || ""; //If string is undefined, set it to an empty string
  str = str.slice(0, Math.min(str.length, 169)); //limits the length of a string (text, username, roomname, etc)
  return str.replace(/<|>/g, ""); //prevents hacking by removing opening tags
};

/******************display all messages ******************************/
var displayAllMessages = function(data) {
  var messages = data.results;
  var currentRoom = $('.rooms').val();

//If the message is more recent than the last message posted, call displayMessage to post it
  for (var i = messages.length - 1; i >= 0; i--) {
    if (Date.parse(messages[i].createdAt) > lastTime) {
      displayMessage(messages[i]);
    }
  }
  lastTime = Date.parse(messages[0].createdAt); //Continue to reset the last time a message was posted
  changeRoom();
};


/****************** room drop down list *****************************/
var rooms = {};
var addRoom = function(roomName) {
  if (rooms[roomName] === undefined) {
    rooms[roomName] = roomName;
    $('.rooms').append('<option value="' + roomName + '">' + roomName + '</option>'); //create a new roomname on the dropdown list of options
  }
};

var changeRoom = function() {
  var roomName = scrubbing($('.rooms').val()); //so this matches the entered/scrubbed roomnames
  var $messagesToHide = $(".display").find('div');
  for (var i = 0; i < $messagesToHide.length; i++) {
    var $message = $($messagesToHide[i]);
    $message.removeClass('hideMessage'); // remove hideMessage class from all elements to display everything
    if (roomName === "commonRoom") {
      continue; //if commonRoom is selected, continue to run through for loop and remove hideMessage class from everything
    } else if (roomName !== $messagesToHide[i].className) {
      $message.addClass('hideMessage');
    }
  }
};



/**************** main *********************/
$(document).ready( function(){
  setInterval(getMessages, 3000);
  setTimeout(getMessages, 0);

  //send message
  $('.submit').on('click', function(e){
    e.preventDefault(); //preventing the page from refreshing on click
    var myMessage = {
      text: $('.textBox').val(),
      username: window.location.search.slice(10),
      roomname: scrubbing($('.rooms').val())
    };
    postMessage(myMessage);
    $('.textBox').val("");
  });

  //change room
  $('.rooms').change(function(){
    changeRoom();
  });
});
