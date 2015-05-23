exports.SocketMediator = function(gameFacade, socket) {
    
    var mGameFacade = null;
    var mSocket = null;
    
    socket.on('accelerateCar', function(carId) {        
        mGameFacade.accelerateCar(carId);
    }); 
    
    
    
    (function() {
        if((gameFacade == undefined) || (socket == undefined)) {
            throw new Error('You need to specify a GameFacade and Socket.IO instances');
        }
        
        mGameFacade = gameFacade;
        mSocket = socket;
    })();
};