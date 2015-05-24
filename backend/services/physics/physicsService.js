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
    var mActiveCircuits = {};
    
    // Public
    this.createCircuit = function(circuitDefinition) {
        if((circuitDefinition == undefined) || (circuitDefinition.length == 0)) {
            throw new Error('A circuit definition is needed to create the level!');
        }
        
        var circuitId = Object.keys(mActiveCircuits).length + 1;
        var circuit = {
            id: circuitId,
            definition: circuitDefinition,
            world: createWorld(),
            cars: {}
        };
        
        //TODO: do something with circuitDefinition, it should fill the world with it.
        
        mActiveCircuits[circuitId] = circuit;
        
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
        for(var circuitIndex in mActiveCircuits) {
            var circuit = mActiveCircuits[circuitIndex];
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
            carId = Object.keys(circuit.cars).length + 1;
            
            circuit.cars[carId] = {
                id: carId,
                body: car
            };
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
    
    // TODO: remove circuitId and return array of circuits, then each socketMediator will
    // filter which circuit does he need the information from. That way both services
    // and gameFacade are agnostic to the fact that multiple circuits may exist
    this.getRenderInformation = function(circuitId) {        
        var renderInformation = {};
        
        for(index in mActiveCircuits) {
            var circuit = mActiveCircuits[index];
            if(circuit) {
                var circuitRenderInformation = {
                    id: circuit.id,
                    circuit: null,
                    cars: getCarsRenderInformation(circuit)
                };
                renderInformation[circuit.id] = circuitRenderInformation;
            }   
        }
        
        return renderInformation;
    };
    
    this.getActiveCircuitId = function() {
        var activeCircuitId = undefined;        
        if(Object.keys(mActiveCircuits).length > 0) {
            var firstCircuitKey = Object.keys(mActiveCircuits)[0];            
            activeCircuitId = mActiveCircuits[firstCircuitKey].id;   
        }
        return activeCircuitId;
    };
    
    this.getNumberOfCarsInCircuit = function(circuitId) {
        var numberOfCars = -1;
        var circuit = getCircuit(circuitId);
        if(circuit) {
            numberOfCars = Object.keys(circuit.cars).length;
        }
        return numberOfCars;
    };
    
    this.removeCar = function(circuitId, carId) {
        var car = getCarFromCircuit(circuitId, carId);
        if(car) {
            car.body.destroy();
            var circuit = getCircuit(circuitId);
            delete circuit.cars[carId];
        }
    };
       
    // Private
    var createWorld = function() {
        var world = new p2.World();
        world.applyGravity=false;
        world.solver.tolerance = 0.01;
        
        return world;
    };
    
    var getCircuit = function(circuitId) {
        return mActiveCircuits[circuitId];  
    };
    
    var getCarFromCircuit = function(circuitId, carId) {
        var circuit = getCircuit(circuitId); 
        var car = undefined;
        
        if(circuit) {
            car = circuit.cars[carId];
        }
        
        return car;
    }
    
    var getCarsRenderInformation = function(circuit) {
        var carsRenderInformation = [];
        for(index in circuit.cars) {
            var car = circuit.cars[index];
                        
            var renderInformation = {
                id: car.id,
                renderInformation: car.body.getRenderInformation()
            };
            carsRenderInformation.push(renderInformation);
        }
        
        return carsRenderInformation;        
    };
    
};