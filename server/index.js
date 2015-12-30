var io = require('socket.io')(8080);

var phones = {};

var mobile = io
  .of('/mobile')
  .on('connection', function (socket) {
    socket.on('offer', function(data) {
      console.log("mobile: offer");
      console.log(data);
      var code = randomInt(0, 1000000);
      phones[data.phoneNumber] = {
        'code': code,
        'offer': data.offer,
        'socket': socket
      }
      socket.emit('code', {'code': code});
    });
  });

var clients = {};

var browser = io
  .of('/browser')
  .on('connection', function (socket) {
    // Get SDP offer
    socket.on('offer', function(data) {
      if (phones[data.phoneNumber] && phones[data.phoneNumber]['code'] == data.code) {
        socket.emit('offer', {'offer': phones[data.phoneNumber]['offer']});
      } else {
        socket.emit('failed', {'failed': 'couldn\'t connect. is phone online?'})
      }
    });
    // Get SDP answer
    socket.on('answer', function(data) {
      if (phones[data.phoneNumber] && phones[data.phoneNumber]['code'] == data.code) {
        phones[data.phoneNumber]['socket'].emit('answer', {'answer': data.answer});
      }
    });
    socket.on('candidate', function(data) {
      if (phones[data.phoneNumber] && phones[data.phoneNumber]['code'] == data.code) {
        phones[data.phoneNumber]['socket'].emit('candidate', {'candidate': data.candidate});
      }
    });
  });

function randomInt (low, high) {
    return Math.floor(Math.random() * (high - low) + low);
}

/*

  mobile registers with SDP offer, phone number, and random number
  client registers phone number, and random number.
  client receives offer
  client submits answer
  mobile receives answer

*/
