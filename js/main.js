(function() {
  // scroll to bottom of message history
  function scrollHistory() {
    $('#message-history').animate({ scrollTop: messageHistory.scrollHeight }, 250);
  }

  function handleSend(e) {
    // bail if keypress is not "enter"
    if (e.type == "keypress" && e.keyCode != 13) {
      return;
    }

    // bail if message input is blank
    if (sendMessageInput.value.length == 0) {
      return;
    }

    // add sent message to message history & clear input
    var sentMessage = document.createElement('li');
    sentMessage.setAttribute('class', 'list-group-item text-right');
    sentMessage.innerHTML = sendMessageInput.value;
    messageHistory.appendChild(sentMessage);
    sendMessageInput.value = "";

    // scroll to bottom of message history
    scrollHistory();
  }

  // handle send message on click
  var sendMessage = document.getElementById('send-message');      
  sendMessage.addEventListener('click', handleSend, false);

  // handle send message on "enter"
  var sendMessageInput = document.getElementById('send-message-input');
  sendMessageInput.addEventListener('keypress', handleSend, false);

  // get message history element
  var messageHistory = document.getElementById('message-history');

  // scroll history to bottom
  scrollHistory();

  var phoneNumberInput = document.getElementById('inputEmail');
  var codeInput = document.getElementById('inputPassword');

  var client = new Client();

  var connectButton = document.getElementById('connect');
  connectButton.addEventListener('click', function() {
    client.connect("http://localhost:8080/browser", {
      "phoneNumber": phoneNumberInput.value,
      "code": codeInput.value
    }, function(result) {
      if (result) {
        $('.form-signin').hide();
        $('.sidebar').show();
        $('.main').show();
        sendMessageInput.focus();
      }
    });
  }, false);
})();
