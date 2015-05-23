var Express = require('express');
var Http = require('http');
var SocketIo = require('socket.io');
var GameFacade = require('./common/gameFacade.js').GameFacade;
var SocketMediator = require('./common/socketMediator.js').SocketMediator;

// Set static resources to use
var app = Express();
app.use(Express.static(__dirname + '/../frontend'));

// Create listener in 8080
var server = Http.createServer(app);
server.listen(8080, function () {
  var host = server.address().address;
  var port = server.address().port;

  console.log('Example app listening at http://%s:%s', host, port);
});

// Create game
var gameFacade = new GameFacade();
gameFacade.init();

// Listen to socket on connection
var io = SocketIo.listen(server);
io.on('connection', function(socket){
  console.log('New user connected');
    
  socket.on('disconnect', function(){
    console.log('User disconnected');
  });
    
  var socketMediator = new SocketMediator(gameFacade, socket);    
});

