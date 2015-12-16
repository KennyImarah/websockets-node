//Required dependencies
var net       = require('net');
var json = require('json-file');
var util      = require('util')

//server set up
var HOST = '127.0.0.1';
var PORT = 6969;

//file settings
var settings      = {};
    settings.file = '/users.json';

var file = json.read('/users.json');
var users = file.data;
    clearScreen();
    console.log('===============================');
    console.log('Users currently registered : ');
    console.log('===============================');
    console.log(users);
    console.log('===============================');
    clearScreen();
//var users = JSON.parse(file.data);
//console.log('');
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

//Receives a client state which is updated depending on the
//state received. req = request, sock = client
function handleClientState(req,sock){
    var clientState = req.state;
    var message     = req.message;
    var input       = parseInt(req.input);
    var response    = {};
    switch (clientState) {
      case 0:
        response.state = input;
        break;
      case 1 :
        console.log('Server: Registering user');
        console.log(message);
        var user = message;
        users.array.push(user);
        console.log('==========================');
        console.log('User list : ');
        console.log(users.array);
        console.log('==========================');

        response.state = 0;
      break;
      case 2 :
      response.state = 0;
      break;
      case 3 :
      console.log('User to delete : ');
      console.log(message);
      console.log('=============================');
      for (var i = 0; i < users.array.length; i++) {
        if (users.array[i].id == message.id) {
          console.log('Deleting user  : ' + users.array[i].username);
          console.log('With ID   : ' + users.array[i].id);
          console.log('=============================');
          users.array.splice(i,1);
        }
      }
      response.state = 0;
      break;
      default: response.state = 0; break;
    }
    response.users = users.array;

    console.log(settings.file);
    console.log(JSON.stringify(users));


    sock.write(JSON.stringify(response));
}
