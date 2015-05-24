exports.SocketMediator = function(gameFacade, socket) {
    
    var mGameFacade = null;
    var mSocket = null;
    var mSelf = this;
    var mCircuitId = null;
    var mCarId = null;
    
    socket.on('accelerateCar', function(carId) {        
        if(carId != mCarId) {
            console.warn('User trying to accelerate other user or non existing car!');
            return;
        }
        
        mGameFacade.accelerateCar(carId);        
    }); 
    
    socket.on('joinGame', function() {
        console.log('Received request to join game!');
        var gameInformation = mGameFacade.enterGame();
        
        mCircuitId = gameInformation.circuitId;
        mCarId = gameInformation.carId;
        
        socket.emit('joinedGame', gameInformation);
    });
    
    socket.on('disconnect', function(){        
        console.log('User disconnected');
        
        if(mCarId != null) {
            mGameFacade.removeCar(mCircuitId, mCarId);
        }
        
        mCircuitId = null;
        mCarId = null;
    });
    
    this.onGameUpdated = function(renderInformation) {
        var userCircuitInformation = filterInformationForUserCircuitId(renderInformation);        
        socket.emit('logicGameUpdated', userCircuitInformation);  
    };
    
    // Private
    var filterInformationForUserCircuitId = function(allCircuitsRenderInformation) {
        var renderInformation = undefined;
        if(mCircuitId) { 
            renderInformation = {
                physics: allCircuitsRenderInformation.physics[mCircuitId]
            };
        }
        
        return renderInformation;
    };  
    
    
    // Constructor
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