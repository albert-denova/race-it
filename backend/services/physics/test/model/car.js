var p2 = require('p2');
var Car = require('../../model/car.js').Car;

// This is not a regular TDD test, I will test different things to make the class
// grow exponentially but the idea is to create the whole car in construction,
// so it does not make sense to expose different methods for creating the body, wheels, etc.
// I will use it though to be able to test different public methods.

module.exports = {
    setUp: function (callback) {        
        // Create a world to attach the car to
        this.world = new p2.World();
        this.world.applyGravity=false;
        this.world.solver.tolerance = 0.01;
        
        callback();
    },
    tearDown: function (callback) {        
        // clean up
        callback();
    },
    createCarWithoutParams: function (test) {        
        test.throws(
            function() {
                var car = new Car();   
            }, 
            Error);
        test.done();
    },
    createCarWithWorldAndPosition: function(test) {
        var carPosition = [100,100];
        var car = new Car(this.world, carPosition);
        
        test.equal(car.getPosition(), carPosition);        
        test.done();
    },
    createCarWithBody: function(test) {
        var carPosition = [100, 100];
        var car = new Car(this.world, carPosition);
        
        // We check that the first body created is the car body
        var carBody = this.world.bodies[0];    
        test.equal(carBody.position[0], carPosition[0]);
        test.equal(carBody.position[1], carPosition[1]);
        test.done();
    },
    createCarWithLeftFrontWheel: function(test) {        
        var carPosition = [100, 100];
        var car = new Car(this.world, carPosition);
        
        var wheelBody = this.world.bodies[1];
        test.equal(wheelBody.position[0], carPosition[0] + 0.25);
        test.equal(wheelBody.position[1], carPosition[1] + 0.25);        
        test.done();   
    },
    createCarWithLeftFrontWheelConstrained : function(test) {
        var carPosition = [100, 100];
        var car = new Car(this.world, carPosition);
        
        var wheelConstraint = this.world.constraints[0];
        test.equal(wheelConstraint.type, 5);
        test.done();
    },
    createCarWithLeftBackWheel : function(test) {
        var carPosition = [100, 100];
        var car = new Car(this.world, carPosition);
        
        var wheelBody = this.world.bodies[2];
        test.equal(wheelBody.position[0], carPosition[0] - 0.25);
        test.equal(wheelBody.position[1], carPosition[1] + 0.25);        
        
        var wheelConstraint = this.world.constraints[1];
        test.equal(wheelConstraint.type, 3);
        
        test.done();   
    },
    createCarWithRightFrontWheel : function(test) {
        var carPosition = [100, 100];
        var car = new Car(this.world, carPosition);
        
        var wheelBody = this.world.bodies[3];
        test.equal(wheelBody.position[0], carPosition[0] + 0.25);
        test.equal(wheelBody.position[1], carPosition[1] - 0.25);        
        
        var wheelConstraint = this.world.constraints[2];
        test.equal(wheelConstraint.type, 5);
        
        test.done();   
    },
    createCarWithRightBackWheel : function(test) {
        var carPosition = [100, 100];
        var car = new Car(this.world, carPosition);
        
        var wheelBody = this.world.bodies[4];
        test.equal(wheelBody.position[0], carPosition[0] - 0.25);
        test.equal(wheelBody.position[1], carPosition[1] - 0.25);        
        
        var wheelConstraint = this.world.constraints[3];
        test.equal(wheelConstraint.type, 3);
        test.done();   
    },
    checkWheelsMotorIsDisabledByDefault : function(test) {
        var carPosition = [100, 100];
        var car = new Car(this.world, carPosition);
        
        var leftFrontConstraint = this.world.constraints[0];
        var rightFrontConstraint = this.world.constraints[2];
        
        test.equal(leftFrontConstraint.getMotorSpeed(), false);
        test.equal(rightFrontConstraint.getMotorSpeed(), false);
        test.done();
    },
    turnWheel: function(test) {
        var carPosition = [100, 100];
        var motorSpeed = 30;
        
        var car = new Car(this.world, carPosition);
        car.turnWheel(motorSpeed);
                
        var leftFrontConstraint = this.world.constraints[0];
        var rightFrontConstraint = this.world.constraints[2];
        
        test.equal(leftFrontConstraint.getMotorSpeed(), motorSpeed * 2); // By default angle is0
        test.equal(rightFrontConstraint.getMotorSpeed(), motorSpeed * 2);
        test.done();
    },
    accelerate : function(test) {
        var carPosition = [100, 100];
        var velocity = [40];
        
        var car = new Car(this.world, carPosition);
        car.accelerate(velocity);
        
        var leftFrontwheelBody = this.world.bodies[1];
        
        var finalXForce = velocity * Math.cos(0); // By default angle is 0
        var finalYForce = velocity * Math.sin(0); // yes, sin(0) is 0...but makes sense, I guess
        
        var rightFrontWheelBody = this.world.bodies[3];
        test.equal(leftFrontwheelBody.force[0], finalXForce);
        test.equal(leftFrontwheelBody.force[1], finalYForce);
        test.equal(rightFrontWheelBody.force[0], finalXForce);
        test.equal(rightFrontWheelBody.force[1], finalYForce);
        test.done();
    },
    getRenderInformation: function(test) {
        var carPosition = [100, 100];
        var velocity = [40];
        
        var car = new Car(this.world, carPosition);
        car.accelerate(velocity);
        
        var renderInformation = car.getRenderInformation();
                
        test.equal(renderInformation.position[0], 100);
        test.equal(renderInformation.position[1], 100);
        test.equal(renderInformation.angle, 0);
        test.equal(renderInformation.wheelForce[0], 40);
        test.equal(renderInformation.wheelForce[1], 0);
        test.equal(renderInformation.wheelAngularForce, 0);        
                        
        test.done();
    },
    removeFromWorld: function(test) {
        var carPosition = [100,100];
        var bodiesBeforeCarCreation = this.world.bodies.length;
        var constraintsBeforeCarCreation = this.world.constraints.length;
        var car = new Car(this.world, carPosition);
        
        car.destroy();
        
        var bodiesAfterCarDestroyal = this.world.bodies.length;        
        var constraintsAfterCarDestroyal = this.world.constraints.length;
        
        test.equal(bodiesAfterCarDestroyal, bodiesBeforeCarCreation);        
        test.equal(constraintsAfterCarDestroyal, constraintsBeforeCarCreation);        
        test.done();
    },
    operationsAfterRemoval: function(test) {
        var carPosition = [100,100];
        var car = new Car(this.world, carPosition);
        car.destroy();
        
        test.throws(
            function() {
                car.getPosition();
            }, 
            Error);
        
        test.throws(
            function() {
                car.turnWheel();
            }, 
            Error);
        
        test.throws(
            function() {
                car.accelerate();
            }, 
            Error);
        
        test.throws(
            function() {
                car.getRenderInformation();
            }, 
            Error);
        
        test.throws(
            function() {
                car.destroy();
            }, 
            Error);
        
        test.done();
    }
    
};