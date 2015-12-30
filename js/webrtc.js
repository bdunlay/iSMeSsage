var RTCPeerConnection = window.mozRTCPeerConnection || window.webkitRTCPeerConnection;
var RTCIceCandidate = window.mozRTCIceCandidate || window.RTCIceCandidate;
var SessionDescription = window.mozRTCSessionDescription || window.RTCSessionDescription;
navigator.getUserMedia = navigator.getUserMedia || navigator.mozGetUserMedia || navigator.webkitGetUserMedia;

function errorHandler(err) {
console.log("WebRTC ERROR");
console.log(err);
}

function Client() {
if (!(this instanceof Client)) {
  return new Client();
}

var self = this;

var configuration = {
  iceServers: [
    {urls: "stun:stun.services.mozilla.com"},
    {urls: "stun:stun.l.google.com:19302"},
    {urls: "stun:stun1.l.google.com:19302"},
    {urls: "stun:stun2.l.google.com:19302"},
    {urls: "stun:stun3.l.google.com:19302"},
    {urls: "stun:stun4.l.google.com:19302"},
  ]
};

self.localConnection = new RTCPeerConnection(configuration);
}

Client.prototype.connect = function(url, sessionData, result) {
  var self = this;

  self.socket = io.connect(url);

  self.socket.on('connect', function() {
    self.socket.emit('offer', {
      'phoneNumber': sessionData.phoneNumber,
      'code': sessionData.code
    });
  });

  self.socket.on('offer', function(data) {
    var offer = new SessionDescription(JSON.parse(data.offer))
    self.localConnection.setRemoteDescription(offer);
    self.localConnection.createAnswer(function(answer) {
      self.localConnection.setLocalDescription(answer, function() {
        self.socket.emit('answer', {
          'phoneNumber': sessionData.phoneNumber,
          'code': sessionData.code,
          'answer': JSON.stringify(self.localConnection.localDescription)
        });
      }, errorHandler);
    }, errorHandler);
  });

  self.socket.on('failed', function(data) {
    alert(data.failed);
  });

  self.localConnection.onicecandidate = function(e) {
    // candidate exists in e.candidate
    if (!e.candidate) return;
    self.socket.emit("candidate", {
      "phoneNumber": sessionData.phoneNumber,
      "code": sessionData.code,
      "candidate": JSON.stringify(e.candidate)
    });
  };

  self.localConnection.ondatachannel = function(ev) {
    ev.channel.onopen = function() {
      console.log('Data channel is open and ready to be used.');
      self.dataChannel = ev.channel;
      result(true);
    };

    ev.channel.onclose = function(e) {
      alert("data channel closed");
    };

    ev.channel.onerror = function(e) {
      alert("data channel error");
    };

    ev.channel.onmessage = function(e) {
      console.log(e.data);
    };
  };
}

Client.prototype.sendMessage = function(data) {
  self.dataChannel.send(data);
}
