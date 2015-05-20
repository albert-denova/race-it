var p2 = require('p2');
var PhysicsService = require('../physicsService.js').PhysicsService;

// Fixtures

// Tests
module.exports = {
    setUp: function (callback) {          
        this.physicsService = new PhysicsService();
        callback();
    },
    tearDown: function (callback) {        
        // clean up
        callback();
    },
    createCircuitWithoutParams: function (test) {        
        var self = this;
        test.throws(
            function() {
                // Have to do this self trick because this here has the global scope
                self.physicsService.createCircuit(); 
            }, 
            Error);
        test.done();
    },
    createCircuitWithEmptyWorldDefinition: function(test) {
        var self = this;
        test.throws(
            function() {
                // Have to do this self trick because this here has the global scope
                self.physicsService.createCircuit([]); 
            }, 
            Error);
        test.done();
    },
    createCircuitWithWorldDefinition: function(test) {
        var circuitDefinition = [1,2,3,4];   
        
        var circuitId = this.physicsService.createCircuit(circuitDefinition);
        test.equal(circuitId, 1);
        test.done();
    },
    updateWorld: function(test) {
        var circuitDefinition = [1,2,3,4];   
        
        var circuitId = this.physicsService.createCircuit(circuitDefinition);
        var self = this;
        var worldsUpdated = 0;
        test.doesNotThrow(function() {
            worldsUpdated = self.physicsService.update();            
        });
        
        test.equal(worldsUpdated, 1);        
        test.done();
    },
    createTwoCircuitsInOneInstance: function(test) {
        var firstCircuitDefinition = [1,2,3,4];
        var secondCircuitDefinition = [4,5,6];
        
        this.physicsService.createCircuit(firstCircuitDefinition);
        var secondCircuitId = this.physicsService.createCircuit(secondCircuitDefinition);
        
        test.equal(secondCircuitId, 2);
        
        
        test.equal(this.physicsService.getCircuitDefinition(1), firstCircuitDefinition);
        test.equal(this.physicsService.getCircuitDefinition(2), secondCircuitDefinition);
        test.done();
    },
    addCarWithoutCircuit: function(test) {
        var self = this;
        test.throws(
            function() {
                self.physicsService.addCar(); 
            }, 
            Error);
        test.done();
    },
    addCarToInvalidCircuit: function(test) {            
        var carId = this.physicsService.addCar(1);
        test.equal(carId, undefined);
        test.done();
    },
    addCarToCircuit: function(test) {
        var circuitDefinition = [1];
        var circuitId = this.physicsService.createCircuit(circuitDefinition);
        
        var carId = this.physicsService.addCar(circuitId);
        test.equal(carId, 1);
        test.done();
    },
    addTwoCarsToCircuit: function(test) {
        var circuitDefinition = [1];
        var circuitId = this.physicsService.createCircuit(circuitDefinition);
        
        var carId = this.physicsService.addCar(circuitId);
        test.equal(carId, 1);
        
        var secondCarId = this.physicsService.addCar(circuitId);
        test.equal(secondCarId, 2);        
        test.done();
    },
    accelerateUndefinedCar: function(test) {
        var self = this;
        test.throws(
            function() {
                self.physicsService.accelerateCar();
            });
        test.done();        
    },
    accelerateCar: function(test) {
        var circuitDefinition = [1];
        var circuitId = this.physicsService.createCircuit(circuitDefinition);
        
        var createdCarId = this.physicsService.addCar(circuitId);
        var acceleratedCarId = this.physicsService.accelerateCar(circuitId, createdCarId);
        
        test.equal(createdCarId, acceleratedCarId);
        test.done();
    },
    accelerateInvalidCar: function(test) {
        var circuitDefinition = [1];
        var circuitId = this.physicsService.createCircuit(circuitDefinition);
            
        var acceleratedCarId = this.physicsService.accelerateCar(circuitId, 1);
        
        test.equal(acceleratedCarId, undefined);
        test.done();
    },
    accelerateCarInvalidCircuit: function(test) {
        var acceleratedCarId = this.physicsService.accelerateCar(1, 1);
        test.equal(acceleratedCarId, undefined);
        test.done();
    },
    turnWheelUndefinedCar: function(test) {
        var self = this;
        test.throws(
            function() {
                self.physicsService.turnWheelCar();
            });
        test.done();        
    },
    turnCarWheel: function(test) {
        var circuitDefinition = [1];
        var circuitId = this.physicsService.createCircuit(circuitDefinition);
        
        var createdCarId = this.physicsService.addCar(circuitId);
        var direction = this.physicsService.TURN_WHEEL_LEFT_DIRECTION;
        var turnWheeldCarId = this.physicsService.turnCarWheel(circuitId, createdCarId, direction);
        
        test.equal(createdCarId, turnWheeldCarId);
        test.done();
    },
    turnWheelInvalidCar: function(test) {
        var circuitDefinition = [1];
        var circuitId = this.physicsService.createCircuit(circuitDefinition);
            
        var direction = this.physicsService.TURN_WHEEL_LEFT_DIRECTION;
        var turnWheeldCarId = this.physicsService.turnCarWheel(circuitId, 1, direction);
        
        test.equal(turnWheeldCarId, undefined);
        test.done();
    },
    turnCarWheelInvalidCircuit: function(test) {
        var direction = this.physicsService.TURN_WHEEL_LEFT_DIRECTION;
        var turnWheeldCarId = this.physicsService.turnCarWheel(1, 1, direction);
        test.equal(turnWheeldCarId, undefined);
        test.done();
    },
    turnCarWheelInvalidDirection: function(test) {
        var circuitDefinition = [1];
        var circuitId = this.physicsService.createCircuit(circuitDefinition);
        
        var createdCarId = this.physicsService.addCar(circuitId);
        var turnWheeldCarId = this.physicsService.turnCarWheel(circuitId, createdCarId, -1);
        
        test.equal(turnWheeldCarId, undefined);
        test.done();
    }
    
};