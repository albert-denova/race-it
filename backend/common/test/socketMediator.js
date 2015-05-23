// This is a unit test, we want to prove that this class will forward things to GameFacade but that 
// the class is isolated properly.

var SocketMediator = require('../socketMediator.js').SocketMediator;
var SocketMock = require('socket-io-mock');

var GameFacadeMock = function() {
    
    var mAcceleratedCars = 0;
    var mRegisteredListener = 0;
    
    this.accelerateCar = function(carId) {
        if(!carId) {
            throw new Error("Car id not specified");   
        }
        ++mAcceleratedCars;
    };
    
    this.enterGame = function() {
        return {
            circuitId: 1,
            carId: 1
        };
    };
    
    this.getNumberOfAcceleratedCars = function() {
        return mAcceleratedCars;  
    };
    
    this.registerListener = function() {
        ++mRegisteredListener;   
    }
    
    this.getNumberOfRegisteredListeners = function() {
        return mRegisteredListener;  
    };
};

// Tests
module.exports = {
    setUp: function (callback) {   
        this.socketServer = new SocketMock();
        this.socketClient = this.socketServer.socketClient;
        
        this.gameFacade = new GameFacadeMock();        
        callback();
    },
    tearDown: function (callback) {        
        // clean up
        callback();
    },
    creationWithoutParams: function (test) {
        test.throws(function() {
            var socketMediator = new SocketMediator();               
        });
        test.done();   
    },
    creationWithParams: function (test) {
        var self = this;
        test.doesNotThrow(function() {
            var socketMediator = new SocketMediator(self.gameFacade, self.socketServer);               
            
        });
        
        test.equal(self.gameFacade.getNumberOfRegisteredListeners(), 1);
        test.done();          
    },
    createGame: function(test) {
        var socketMediator = new SocketMediator(this.gameFacade, this.socketServer);
        
        this.socketClient.on('joinedGame', function(gameInformation) {            
            test.equal(gameInformation.circuitId, 1);
            test.equal(gameInformation.carId, 1);
        });
        
        this.socketClient.emit('joinGame',{});   
        
        test.done();
    },
    accelerateCarEvent: function (test) {        
        var socketMediator = new SocketMediator(this.gameFacade, this.socketServer);
        
        this.socketServer.emitEvent('accelerateCar', 5);
        
        var timesAcceleratedCar = this.gameFacade.getNumberOfAcceleratedCars();
        test.equal(timesAcceleratedCar, 1);
        test.done();
    },
    onGameUpdated: function (test) {
        var socketMediator = new SocketMediator(this.gameFacade, this.socketServer);
        // We only want to see that the information is propagated, we can put whatever we want.
        var renderInformation = {
            physics: [0,1,2]
        };
                
        this.socketClient.on('logicGameUpdated', function(gameInformation) {
            test.equal(gameInformation.physics.length, renderInformation.physics.length);
            test.equal(gameInformation.physics[1], renderInformation.physics[1]);
        });
        
        socketMediator.onGameUpdated(renderInformation);
        test.done();
    }
};