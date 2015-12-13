var net             = require('net');
var readlineSync    = require('readline-sync');

var HOST = '127.0.0.1';
var PORT = 6969;

var state = 0;
var users = [];

// var rl = readline.createInterface({
//   input: process.stdin,
//   output: process.stdout
// });


var client = new net.Socket();
client.connect(PORT, HOST, function() {


    console.log('CONNECTED TO: ' + HOST + ':' + PORT);

    var input = readlineSync.question('User input : ');
    var req = {};
    req.state   = state;
    req.input = input;
    sayToServer(JSON.stringify(req));
});

client.on('data', function(response) {
    response = JSON.parse(response);
    state = response.state;
    users = response.users;
    handleResponse();
});


client.on('close', function() {
    console.log('Connection closed');
});

function sayToServer(message){
   client.write(message);
}


function handleResponse(){
  clearScreen();
  var req     = {};
  req.state   = state;
  req.message = {};

  switch(state){
    case 0 :
    clearScreen();
    console.log('======================');
    console.log('NodeJs - Sockets');
    console.log('======================');
    console.log('1 : Register User');
    console.log('2 : View User List');
    console.log('3 : Close connection');
    console.log('======================');
    var input = readlineSync.question('User input : ');
    req.input = input;

    break;
    case 1  :
    clearScreen();
    console.log('======================');
    console.log('Register User');
    console.log('======================');
    req.message.username  = readlineSync.question('Username : ');
    req.message.email     = readlineSync.question('Email : ');
    req.message.birthDate = readlineSync.question('Birth Date : ');
    break;
    case 2 :
    clearScreen();
    console.log('======================');
    console.log('User list');
    console.log('======================');
    for (var i = 0; i < users.length; i++) {
      console.log('User ' + i + " : ");
      console.log('Username : '   + users[i].username );
      console.log('Email : '      + users[i].email );
      console.log('Birthdate : '  + users[i].birthDate );
      console.log('======================');
    }
    break;
    case 3 : break;
    case 4 : client.destroy(); break;
  }

  sayToServer(JSON.stringify(req));
}



function clearScreen(){
  for(var i = 0; i < 1; i++)
    console.log('\n');
}
