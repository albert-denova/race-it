exports.SocketMediator = function(gameFacade, socket) {
    
    var mGameFacade = null;
    var mSocket = null;
    var mSelf = this;
    
    socket.on('accelerateCar', function(carId) {        
        mGameFacade.accelerateCar(carId);
    }); 
    
    socket.on('joinGame', function() {
        var gameInformation = mGameFacade.enterGame();
        socket.emit('joinedGame', gameInformation);
    });
    
    this.onGameUpdated = function(renderInformation) {
        socket.emit('logicGameUpdated', renderInformation);  
    };
    
    (function() {
        if((gameFacade == undefined) || (socket == undefined)) {
            throw new Error('You need to specify a GameFacade and Socket.IO instances');
        }
        
        mGameFacade = gameFacade;
        mSocket = socket;
        
        // Register as a listener
        mGameFacade.registerListener(mSelf);
    })();
};