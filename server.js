var net = require('net');

var HOST = '127.0.0.1';
var PORT = 6969;
var users = [];
net.createServer(function(sock) {

    console.log('CONNECTED: ' + sock.remoteAddress +':'+ sock.remotePort);

    sock.on('data', function(data) {
        var data = JSON.parse(data);
        console.log(data);
        handleClientState(data,sock);
    });


    sock.on('close', function(data) {
        console.log('CLOSED: ' + sock.remoteAddress +' '+ sock.remotePort);
    });

}).listen(PORT, HOST);

console.log('Server listening on ' + HOST +':'+ PORT);

function clearScreen(){
  for(var i = 0; i < 3; i++)
    console.log('\n');
}


function handleClientState(data,sock){
    var clientState = data.state;
    var message     = data.message;
    var response    = {};
    console.log('handle client state');
    console.log(message);
    switch (clientState) {
      case 0:
        message = parseInt(message);
        switch (message) {
            case 1:
            console.log('message 1 : checkpoint');
            response.state = 1;
            sock.write(JSON.stringify(response));
            break;
            case 2:
            default:
            break;
        }
        break;
      case 1 :
        console.log('Server: Registering user');
        console.log(message);
        var user = message;
        users.push(user);
        console.log(users);
      break;
      default:
      break;
    }
}
