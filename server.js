var net = require('net');

var HOST = '127.0.0.1';
var PORT = 6969;
var users = [];
net.createServer(function(sock) {

    console.log('CONNECTED: ' + sock.remoteAddress +':'+ sock.remotePort);

    sock.on('data', function(data) {
        var data = JSON.parse(data);
        handleClientState(data,sock);
    });


    sock.on('close', function(data) {
        console.log('CLOSED: ' + sock.remoteAddress +' '+ sock.remotePort);
    });

}).listen(PORT, HOST);

console.log('Server listening on ' + HOST +':'+ PORT);

function clearScreen(){
  for(var i = 0; i < 1; i++)
    console.log('\n');
}


function handleClientState(req,sock){
    var clientState = req.state;
    var message     = req.message;
    var input       = req.input;
    var response    = {};
    switch (clientState) {
      case 0:
        input = parseInt(input);
        switch (input) {
            case 1:
            console.log('Input 1 : checkpoint');
            response.state = 1;
            break;
            case 2:
            console.log('Input 1 : checkpoint');
            response.state = 2;
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
        response.state = 0;
      break;

      case 2 :
      response.state = 0;
      break;
      default: response.state = 0; break;
    }
    response.users = users;
    sock.write(JSON.stringify(response));
}
