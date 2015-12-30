(function() {
  var remoteConnection = new RTCPeerConnection({
      iceServers: [
        {urls: "stun:stun.services.mozilla.com"},
        {urls: "stun:stun.l.google.com:19302"},
        {urls: "stun:stun1.l.google.com:19302"},
        {urls: "stun:stun2.l.google.com:19302"},
        {urls: "stun:stun3.l.google.com:19302"},
        {urls: "stun:stun4.l.google.com:19302"},
      ]
    });

  remoteConnection.onicecandidate = function (e) {
      // candidate exists in e.candidate
      if (!e.candidate) return;
      // send("icecandidate", JSON.stringify(e.candidate));
  };


  var channelName = "datachannel";
  var channelOptions = {};
  var channel = remoteConnection.createDataChannel(channelName, channelOptions);


  channel.onopen = function(event) {
    channel.send("hello!");
  }

  channel.onerror = function (err) {
      console.error("Channel Error:", err);
  };

  channel.onmessage = function (e) {
    console.log("Got message:", e.data);
  } 

  var mobile = io.connect('http://localhost:8080/mobile');

  mobile.on('connect', function () {
    remoteConnection.createOffer(function (offer) {
        remoteConnection.setLocalDescription(offer, function() {
          mobile.emit('offer', {
            'phoneNumber': "0001234567",
            'offer': JSON.stringify(remoteConnection.localDescription)
          }); 
        }, errorHandler);
    }, errorHandler);
  });

  mobile.on('answer', function(data) {
    var answer = new SessionDescription(JSON.parse(data.answer))
    remoteConnection.setRemoteDescription(answer);
  });

  mobile.on('code', function(data) {
    var phoneNumberInput = document.getElementById('inputEmail');
    var codeInput = document.getElementById('inputPassword');
    phoneNumberInput.value = "0001234567";
    codeInput.value = data.code;
  });

  mobile.on('candidate', function(data) {
    remoteConnection.addIceCandidate(new RTCIceCandidate(JSON.parse(data.candidate)));
  });
})();


