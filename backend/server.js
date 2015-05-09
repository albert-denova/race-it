var express = require('express');
var http = require('http');
var socketIo = require('socket.io');

// Set static resources to use
var app = express();
app.use(express.static(__dirname + '/../frontend'));

// Create listener in 8080
var server = http.createServer(app);
server.listen(8080, function () {
  var host = server.address().address;
  var port = server.address().port;

  console.log('Example app listening at http://%s:%s', host, port);
});

// Listen to socket on connection
var io = socketIo.listen(server);
io.on('connection', function(socket){
  console.log('New user connected');
    
  socket.on('disconnect', function(){
    console.log('User disconnected');
  });
    
  var socketMediator = require('./game/socketMediator.js').SocketMediator(socket);
    
});