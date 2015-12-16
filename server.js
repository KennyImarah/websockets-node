//Required dependencies
var net         = require('net');
var json        = require('json-file');
var util        = require('util')
var fs          = require('fs');
var nodemailer  = require('nodemailer');
var transporter = nodemailer.createTransport({
    service: 'Gmail',
    auth: {
        user: 'lenguajesprogramacionnapky@gmail.com',
        pass: '21251122'
    }
});
function sendMail(receiverEmail, htmlString){
  // create reusable transporter object using SMTP transport

// NB! No need to recreate the transporter object. You can use
// the same transporter object for all e-mails

// setup e-mail data with unicode symbols
var mailOptions = {
    from: '<lenguajesprogramacionnapky@gmail.com>', // sender address
    to: receiverEmail, // list of receivers
    subject: 'Lenguajes de programacion', // Subject line
    html: htmlString // html body
};

// send mail with defined transport object
transporter.sendMail(mailOptions, function(error, info){
    console.log(mailOptions);
    if(error){
        return console.log(error);
    }
    console.log('Message sent: ' + info.response);

});
}



//sendMail('coco.napky@gmail.com', '<h1>HELLO WORLD</h1>');
//server set up
var HOST = '127.0.0.1';
var PORT = 6969;


//file settings
var settings      = {};
    settings.file = '/users.json';

var file  = json.read('/users.json');

function saveData(){

  var stream = fs.createWriteStream("/users.json");
  stream.once('open', function(fd) {
    console.log('');
    console.log('');
    console.log('');
    console.log('');
    var text = JSON.stringify(users);
    stream.write(text);
    stream.end();
  });
}

var users = file.data;
console.log(file.data);
    clearScreen();
    console.log('===============================');
    console.log('Users currently registered : ');
    console.log('===============================');
    console.log(users);
    console.log('===============================');
    clearScreen();

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
    var response        = {};
        response.error  =  [];
    switch (clientState) {
      case 0:
        response.state = input;
        break;
      case 1 :
        console.log('Server: Registering user');
        console.log(message);
        var user = message;

        if(!validateEmail(user.email))
          response.error.push(1);
        if(!validateID(user.id))
          response.error.push(2);
        if(!validateDate(user.birthDate))
          response.error.push(3);
        if(!compareIds(user.id))
          response.error.push(4);

        if (response.error.length == 0) {
          console.log('No errors, Registering user');
          users.push(user);
        }
        else {
          console.log('Eror codes');
          console.log(response.error);
        }
        console.log('==========================');
        console.log('User list : ');
        console.log(users);
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
      for (var i = 0; i < users.length; i++) {
        if (users[i].id == message.id) {
          console.log('Deleting user  : ' + users[i].username);
          console.log('With ID   : ' + users[i].id);
          console.log('=============================');
          users.splice(i,1);
        }
      }
      response.state = 0;
      break;
      case 5 :
      sendUsersByMail(message.receiver);
      console.log('Email Sent to : ' + message.receiver);
      break;
      default: response.state = 0; break;
    }
    response.users = users;
    clearScreen();
    saveData();

    sock.write(JSON.stringify(response));
}


function validateEmail(email){
    console.log('Validating Email : ' + email);
    var re = /\S+@\S+\.\S+/;
    return re.test(email);
}

function validateID(id){
    console.log('Validating ID : ' + id);
    var re = /^(\d{4}[- ]){2}(\d{5})$/;
    return re.test(id);
}

function compareIds(id){
  for (var i = 0; i < users.length; i++) {
    if(id == users[i].id)
    return false;
  }
  return true;
}

function validateDate(date){
  console.log('Validating birthdate : ' + date);
  var re = /^\d{1,2}\/\d{1,2}\/\d{4}$/;
  return re.test(date);

}
function sendUsersByMail(receiverEmail){
  var htmlString = '<h1>User List </h1> <ol>';
  console.log(users);
  for (var i = 0; i < users.length; i++) {
    var listItem = '<li>'
    listItem += '<span> Username :'        + users[i].username    + '</span>' + '<br>';
    listItem += '<span> Email :'           + users[i].email       + '</span>' + '<br>';
    listItem += '<span> User ID :'         + users[i].id          + '</span>' + '<br>';
    listItem += '<span> User Birthdate : ' + users[i].birthDate   + '</span>' + '<br>';
    listItem += '</li>'
    htmlString += listItem;
  }
  htmlString += '</ol> '
  sendMail(receiverEmail,htmlString);
}
