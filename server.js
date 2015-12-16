//Required dependencies
var net       = require('net');
var json = require('json-file');
var util      = require('util')
var fs = require('fs');
var nodemailer = require('nodemailer');
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
  var stream = fs.createWriteStream("users.json");
  stream.once('open', function(fd) {
    var text = JSON.stringify(users);
    stream.write(text);
    stream.end();
  });
}

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
    var response        = {};
        response.error  =  0;
    switch (clientState) {
      case 0:
        response.state = input;
        break;
      case 1 :
        console.log('Server: Registering user');
        console.log(message);
        var user = message;
        if(validateEmail(user.email))
          users.push(user);
        else
          response.error = 1;
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
      case 5 : sendUsersByMail(); break;
      default: response.state = 0; break;
    }
    response.users = users;

    saveData();

    sock.write(JSON.stringify(response));
}


function validateEmail(email)
{
    console.log('Validating Email : ' + email);
    var re = /\S+@\S+\.\S+/;
    return re.test(email);
}

function validateID(email)
{
    console.log('Validating Email : ' + email);
    var re = /\S+@\S+\.\S+/;
    return re.test(email);
}

function sendUsersByMail(receiverEmail){
  var htmlString = '<h1>User List </h1> <ul>';
  console.log(users);
  for (var i = 0; i < users.length; i++) {
    var listItem = '<li>'
    listItem += '<span> Username :'        + users[i].username    + '<span>' + '<br>';
    listItem += '<span> Email :'           + users[i].email       + '<span>' + '<br>';
    listItem += '<span> User ID :'         + users[i].id          + '<span>' + '<br>';
    listItem += '<span> User Birthdate : ' + users[i].birthDate   + '<span>' + '<br>';
    listItem += '</li>'
    htmlString += listItem;
  }
  htmlString += '</ul>'

  send
  console.log(htmlString);
}
