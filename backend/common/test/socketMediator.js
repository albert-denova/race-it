// This is a unit test, we want to prove that this class will forward things to GameFacade but that 
// the class is isolated properly.

var SocketMediator = require('../socketMediator.js').SocketMediator;
var SocketMock = require('socket-io-mock');

var GameFacadeMock = function() {
    
    var mAcceleratedCars = 0;
    var mRegisteredListener = 0;
    var mRemovedCars = 0;
    var mRemovedCarId = -1;
    
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
    
    this.removeCar = function(carId) {
        mRemovedCars++;
        mRemovedCarId = carId;
    }
    
    this.getNumberOfAcceleratedCars = function() {
        return mAcceleratedCars;  
    };
    
    this.registerListener = function() {
        ++mRegisteredListener;   
    }
    
    this.getNumberOfRegisteredListeners = function() {
        return mRegisteredListener;  
    };
    
    this.getNumberOfRemovedCars = function() {
        return mRemovedCars;  
    };
    
    this.getRemovedCarId = function() {
        return mRemovedCarId;  
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
    accelerateNonUserCar: function (test) {
        var socketMediator = new SocketMediator(this.gameFacade, this.socketServer);
        
        this.socketServer.emitEvent('accelerateCar', 5);
        
        var timesAcceleratedCar = this.gameFacade.getNumberOfAcceleratedCars();
        // No car should be accelerated if it's not your own car
        test.equal(timesAcceleratedCar, 0);
        test.done();
    },
    accelerateUserCar: function (test) {
        var socketMediator = new SocketMediator(this.gameFacade, this.socketServer);
        
        var circuitId = null;
        var carId = null;
        var self = this;
        this.socketClient.on('joinedGame', function(gameInformation) {            
            circuitId = gameInformation.circuitId;
            carId = gameInformation.carId;
            
            self.socketServer.emitEvent('accelerateCar', carId);
        
            var timesAcceleratedCar = self.gameFacade.getNumberOfAcceleratedCars();
            test.equal(timesAcceleratedCar, 1);
        });
        
        this.socketClient.emit('joinGame',{});   
                
        test.done();
    },
    onGameUpdatedWithoutJoiningGame: function (test) {
        var socketMediator = new SocketMediator(this.gameFacade, this.socketServer);
        // We only want to see that the information is propagated, we can put whatever we want.
        var renderInformation = {
            1: {
                physics: [0,1,2]   
            },
            2: {
                physics: [4,5,6]   
            }
        };
        
        this.socketClient.on('logicGameUpdated', function(gameInformation) {            
            test.equal(gameInformation, undefined);
        });
        
        socketMediator.onGameUpdated(renderInformation);
        test.done();
    },
    onGameUpdatedWhenJoinedGame: function (test) {
        var socketMediator = new SocketMediator(this.gameFacade, this.socketServer);
        // We only want to see that the information is propagated, we can put whatever we want.
        var renderInformation = {
            1: {
                physics: [0,1,2]   
            },
            2: {
                physics: [4,5,6]   
            }
        };
        
        this.socketClient.emit('joinGame',{});
                
        this.socketClient.on('logicGameUpdated', function(gameInformation) {            
            test.equal(gameInformation.physics.length, renderInformation[1].physics.length);
            test.equal(gameInformation.physics[1], renderInformation[1].physics[1]);
        });
        
        socketMediator.onGameUpdated(renderInformation);
        test.done();
    },
    onUserDisconnectedWithoutJoiningGame: function (test) {
        var socketMediator = new SocketMediator(this.gameFacade, this.socketServer);
                
        this.socketClient.emit('disconnect',{});
        
        var removedCars = this.gameFacade.getNumberOfRemovedCars();
        test.equal(removedCars, 0);
        test.done();
    },
    onUserDisconnectedAfterJoiningGame: function (test) {
        var socketMediator = new SocketMediator(this.gameFacade, this.socketServer);
                
        this.socketClient.emit('joinGame',{});
        this.socketClient.emit('disconnect',{});
        
        var removedCars = this.gameFacade.getNumberOfRemovedCars();
        test.equal(removedCars, 1);
        
        var removedCarId = this.gameFacade.getRemovedCarId();
        test.equal(removedCarId, 1);
        test.done();
    }
};