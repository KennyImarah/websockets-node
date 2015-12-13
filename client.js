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
    handleState();
    var input = readlineSync.question('User input : ');
    var data = {};
    data.state   = state;
    data.message = input;
    sayToServer(JSON.stringify(data));
});

client.on('data', function(data) {
    data = JSON.parse(data);
    state = data.state;
    console.log('Data received : ');
    console.log(data);
    handleState();


});


client.on('close', function() {
    console.log('Connection closed');
});

function sayToServer(message){
   client.write(message);
}


function handleState(){
  clearScreen();
  switch(state){
    case 0 :
    console.log('======================');
    console.log('NodeJs - Sockets');
    console.log('======================');
    console.log('1 : Register User');
    console.log('2 : View User List');
    console.log('3 : Close connection');
    console.log('======================');
    break;
    case 1  :
    var data = {};
    data.state   = state;
    data.message = {};

    clearScreen();
    console.log('======================');
    console.log('Register User');
    console.log('======================');
    data.message.username  = readlineSync.question('Username : ');
    data.message.email     = readlineSync.question('Email : ');
    data.message.birthDate = readlineSync.question('Birth Date : ');
    sayToServer(JSON.stringify(data));
    console.log(data.message);
    break;
  }
}



function clearScreen(){
  for(var i = 0; i < 2; i++)
    console.log('\n');
}
