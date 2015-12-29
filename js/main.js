(function() {

  function scrollHistory() {
    $('#message-history').animate({ scrollTop: messageHistory.scrollHeight }, 250);
  }

  function handleSend(e) {

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

  // focus on the text input
  sendMessageInput.focus();

  // scroll history to bottom
  scrollHistory();

})();
