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
    },
    getCarRenderInformation: function(test) {
        var circuitDefinition = [1];
        var circuitId = this.physicsService.createCircuit(circuitDefinition);
        
        var createdCarId = this.physicsService.addCar(circuitId);
        var direction = this.physicsService.TURN_WHEEL_LEFT_DIRECTION;
        var turnWheeldCarId = this.physicsService.turnCarWheel(circuitId, createdCarId, direction);
        
        var createdSecondCarId = this.physicsService.addCar(circuitId);
        var acceleratedCarId = this.physicsService.accelerateCar(circuitId, createdSecondCarId);
        
        
        var renderInformation = this.physicsService.getRenderInformation(circuitId);
        test.equal(Object.keys(renderInformation).length, 1);
        
        var circuitRenderInformation = renderInformation[circuitId];
        test.equal(circuitRenderInformation.id, circuitId);
        
        var carRenderInformation = circuitRenderInformation.cars;        
        test.equal(carRenderInformation.length, 2);
        
        var firstCar = carRenderInformation[0];
        test.equal(firstCar.id, 1);
        test.equal(firstCar.renderInformation.position[0], 0);
        test.equal(firstCar.renderInformation.position[1], 0);
        test.equal(firstCar.renderInformation.angle, 0);
        test.equal(firstCar.renderInformation.wheelForce[0], 0);
        test.equal(firstCar.renderInformation.wheelForce[1], 0);
        test.equal(firstCar.renderInformation.wheelAngularForce, 0);
        
        var secondCar = carRenderInformation[1];
        test.equal(secondCar.id, 2);
        test.equal(secondCar.renderInformation.position[0], 0);
        test.equal(secondCar.renderInformation.position[1], 0);
        test.equal(secondCar.renderInformation.angle, 0);
        test.equal(secondCar.renderInformation.wheelForce[0], 100);
        test.equal(secondCar.renderInformation.wheelForce[1], 0);
        test.equal(secondCar.renderInformation.wheelAngularForce, 0);
        
        test.done();
    },
    getActiveCircuitIdWithNoneActive: function(test) {
        var activeCircuitId = this.physicsService.getActiveCircuitId();
        test.equal(activeCircuitId, undefined);
        test.done();
    },
    getActiveCircuitId: function(test) {
        var circuitDefinition = [1];
        var circuitId = this.physicsService.createCircuit(circuitDefinition);
        
        var activeCircuitId = this.physicsService.getActiveCircuitId();
        test.equal(circuitId, activeCircuitId);
        test.done();
    },
    getNumberOfCarsWhenNoCircuit: function(test) {
        var numberOfCars = this.physicsService.getNumberOfCarsInCircuit(1);
        test.equal(numberOfCars, -1);
        test.done();
    },
    getNumberOfCarsInCircuit: function(test) {
        var circuitDefinition = [1];
        var circuitId = this.physicsService.createCircuit(circuitDefinition);
        
        var carId = this.physicsService.addCar(circuitId);
        var numberOfCars = this.physicsService.getNumberOfCarsInCircuit(circuitId);
        test.equal(numberOfCars, 1);
        test.done();
    },
    removeCar: function(test) {
        var circuitDefinition = [1];
        var circuitId = this.physicsService.createCircuit(circuitDefinition);
        
        var carId = this.physicsService.addCar(circuitId);
        this.physicsService.removeCar(circuitId, carId);
        
        var numberOfCarsInCircuit = this.physicsService.getNumberOfCarsInCircuit(circuitId);
        test.equal(numberOfCarsInCircuit, 0);
        test.done();
    },
    removeCarAndCheckOthersAreThere: function(test) {
        var circuitDefinition = [1];
        var circuitId = this.physicsService.createCircuit(circuitDefinition);
        
        var firstCarId = this.physicsService.addCar(circuitId);
        var secondCarId = this.physicsService.addCar(circuitId);
        
        this.physicsService.removeCar(circuitId, firstCarId);
        
        var numberOfCarsInCircuit = this.physicsService.getNumberOfCarsInCircuit(circuitId);
        test.equal(numberOfCarsInCircuit, 1);
        
        var acceleratedCarId = this.physicsService.accelerateCar(circuitId, secondCarId);
        
        test.equal(acceleratedCarId, secondCarId);
        
        test.done();        
    }
};