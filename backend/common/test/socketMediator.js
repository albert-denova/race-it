var SocketMediator = require('../socketMediator.js').SocketMediator;
var SocketMock = require('socket-io-mock');

var GameFacadeMock = function() {
    
    var acceleratedCars = 0;
    
    this.accelerateCar = function(carId) {
        if(!carId) {
            throw new Error("Car id not specified");   
        }
        ++acceleratedCars;
    };
    
    this.getNumberOfAcceleratedCars = function() {
        return acceleratedCars;  
    };
};

// Tests
module.exports = {
    setUp: function (callback) {   
        this.socketMock = new SocketMock();
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
            var socketMediator = new SocketMediator(self.gameFacade, self.socketMock);               
        });
        test.done();          
    },
    accelerateCarEvent: function (test) {        
        var socketMediator = new SocketMediator(this.gameFacade, this.socketMock);
        
        this.socketMock.emitEvent('accelerateCar', 5);
        
        var timesAcceleratedCar = this.gameFacade.getNumberOfAcceleratedCars();
        test.equal(timesAcceleratedCar, 1);
        test.done();
    }
};