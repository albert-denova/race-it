var p2 = require('p2');

// Using the car this way is gonna be a problem, we will not be able to test this class
// isolated since it's always depending on a Car itself, we could, for example, pass a CarFactory
// instead to solve this issue: exports.PhysicsService = function(carFactory);
// That would allow us to mock the carFactory and really test what's going on!
var Car = require('./model/car.js').Car;

exports.PhysicsService = function() {
    // Constants
    this.TURN_WHEEL_LEFT_DIRECTION = 1;
    this.TURN_WHEEL_RIGHT_DIRECTION = 0;
    
    var CAR_ACCELERATION = 100;
    var WHEEL_TURN = Math.PI/3;
    
    
    // Attributes
    var activeCircuits = [];
    
    // Public
    this.createCircuit = function(circuitDefinition) {
        if((circuitDefinition == undefined) || (circuitDefinition.length == 0)) {
            throw new Error('A circuit definition is needed to create the level!');
        }
        
        var circuitId = activeCircuits.length + 1;
        var circuit = {
            id: circuitId,
            definition: circuitDefinition,
            world: createWorld(),
            cars: []
        };
        
        //TODO: do something with circuitDefinition, it should fill the world with it.
        
        activeCircuits.push(circuit);
        
        return circuit.id;
    };
    
    this.getCircuitDefinition = function(circuitId) {
        var circuit = getCircuit(circuitId);
        var definition = undefined;
        
        if(circuit) {
            definition = circuit.definition;   
        }
        
        return definition;
    };
    
    this.update = function(deltaTime) {
        var worldsUpdated = 0;
        for(var circuitIndex in activeCircuits) {
            var circuit = activeCircuits[circuitIndex];
            circuit.world.step(deltaTime);
            ++worldsUpdated;
        }
            
        return worldsUpdated;
    };
    
    this.addCar = function(circuitId) {
        if(circuitId == undefined) {
            throw new Error('To add cars a circuitId must be provided!');   
        }
        
        var circuit = getCircuit(circuitId);
        var carId = undefined;
        
        if(circuit) {            
            var car = new Car(circuit.world, [0,0]);
            carId = circuit.cars.length + 1;

            circuit.cars.push({
                id: carId,
                body: car
            });
        }
        
        return carId;
    };
    
    this.accelerateCar = function(circuitId, carId) {
        if((circuitId == undefined) || (carId == undefined)) {
            throw new Error('You have to specify a circuitId and a carID to accelerate it');
        }
        
        var car = getCarFromCircuit(circuitId, carId);        
        var updatedCarId = undefined;
        
        if(car) {
            car.body.accelerate(CAR_ACCELERATION);
            updatedCarId = car.id;
        }
        
        return updatedCarId;
    };
    
    this.turnCarWheel = function(circuitId, carId, direction) {
        if((circuitId == undefined) || (carId == undefined) || (direction == undefined)) {
            throw new Error('You have to specify a circuitId, carID and direciton to accelerate it');
        }
        
        var car = getCarFromCircuit(circuitId, carId);        
        var updatedCarId = undefined;
        
        if(car && 
           (direction == this.TURN_WHEEL_LEFT_DIRECTION || 
            direction == this.TURN_WHEEL_RIGHT_DIRECTION)) {
            
            var wheelTurn = WHEEL_TURN;
            if(direction == this.TURN_WHEEL_LEFT_DIRECTION) {
                wheelTurn = -WHEEL_TURN;
            }
            
            car.body.turnWheel(wheelTurn);
            updatedCarId = car.id;
        }
        
        return updatedCarId; 
    };
    
    // Private
    var createWorld = function() {
        var world = new p2.World();
        world.applyGravity=false;
        world.solver.tolerance = 0.01;
        
        return world;
    };
    
    var getCircuit = function(circuitId) {
        return activeCircuits[circuitId - 1];  
    };
    
    var getCarFromCircuit = function(circuitId, carId) {
        var circuit = getCircuit(circuitId); 
        var car = undefined;
        
        if(circuit) {
            car = circuit.cars[carId - 1];
        }
        
        return car;
    }
    
};