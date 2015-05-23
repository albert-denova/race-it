var p2 = require('p2');

exports.Car = function(world, position) {
    var DAMPING = 1;
    var ANGULAR_DAMPING = 1;
    var BODY_WIDTH = 1;
    var BODY_HEIGHT = 0.5;
    var WHEEL_WIDTH = 0.25;
    var WHEEL_HEIGHT = 0.15;
    var REVOLUTE_CONSTRAINT_MIN = -0.45;
    var REVOLUTE_CONSTRAINT_MAX = 0.45;
    var STEERING_FACTOR = 2;
    var UNIT_CIRCLE_AREA_RADS = (2*Math.PI);
    
    // Attributes   
    var mWorld = null;
    var mPosition = null;
    var mBody = null;
    var mFrontWheels = [];
    var mBackWheels = [];
    
    // Public methods
    this.getPosition = function() {
        return mPosition;  
    };
    
    this.turnWheel = function(angle) {
        for(var wheelIndex in mFrontWheels) {
            var wheelConstraint = mFrontWheels[wheelIndex].constraint;
            if(!wheelConstraint.getMotorSpeed()) {
                wheelConstraint.enableMotor();   
            }
            
            var motorSpeed = (angle + wheelConstraint.angle) * STEERING_FACTOR;    
            
            wheelConstraint.setMotorSpeed(motorSpeed);
        }
    };
    
    this.accelerate = function(velocity) {
        for(var wheelIndex in mFrontWheels) {
            var wheelBody = mFrontWheels[wheelIndex].body;                        
            
            var forceToApply = [
                velocity * Math.cos(wheelBody.angle),
                velocity * Math.sin(wheelBody.angle)
            ];
            
            wheelBody.applyForce(forceToApply, wheelBody.position);
        }
    };
    
    this.getRenderInformation = function() {        
        var bodyPosition = [mBody.position[0], mBody.position[1]];
        
        // We only need the first one since we apply always the same force to both wheels
        var firstWheelBody = mFrontWheels[0].body;
        var wheelForce = [firstWheelBody.force[0], firstWheelBody.force[1]];
        var wheelAngularforce = firstWheelBody.angularForce;
        
        var renderInformation = {
            position: bodyPosition,
            angle: getBodyNormalizedAngle(), 
            wheelForce: wheelForce,
            wheelAngularForce: wheelAngularforce
        };
        
        return renderInformation;
    };
        
    // Private methods
    var createCarBody = function() {
        mBody = new p2.Body({ mass: 1, position: mPosition});
        var carBodyShape = new p2.Rectangle(BODY_WIDTH, BODY_HEIGHT);

        mBody.addShape(carBodyShape);
        mBody.damping = DAMPING;
        mBody.angularDamping = ANGULAR_DAMPING;
        mWorld.addBody(mBody);
    };
    
    var createWheel = function(pivot) {
        var position = [mPosition[0] + pivot[0], mPosition[1] + pivot[1]];

        var wheelBody = new p2.Body({ mass:1, position: position});
        var wheelBodyShape = new p2.Rectangle(WHEEL_WIDTH, WHEEL_HEIGHT);
        wheelBody.addShape(wheelBodyShape);
        mWorld.addBody(wheelBody);
                
        var constraint = null;       
        
        if(pivot[0] > 0) {    
            // Revolutes lets the connected bodies rotate around a shared point.
            constraint = new p2.RevoluteConstraint(mBody, wheelBody, {
                localPivotA: pivot,   // Where to hinge first wheel on the chassis
                localPivotB: [0, 0],
                collideConnected: false
            });

            constraint.setLimits(REVOLUTE_CONSTRAINT_MIN, REVOLUTE_CONSTRAINT_MAX);
        }
        else {
            constraint = new p2.LockConstraint(mBody, wheelBody,{
                collideConnected : false
            });   
        }

        mWorld.addConstraint(constraint);    
        

        return {
            'body' : wheelBody,
            'constraint' : constraint
        };
    };
    
    var getBodyNormalizedAngle = function() {
        var bodyAngle = mBody.angle;
        
        var normalizedAngle = bodyAngle % UNIT_CIRCLE_AREA_RADS;
        if(normalizedAngle < 0){
            normalizedAngle += UNIT_CIRCLE_AREA_RADS;
        }
        
        return normalizedAngle;  
    };
        
    // Constructor
    (function() {
        if((world == undefined) || (position == undefined)) {
            throw new Error('World and position have to be defined!');
        }
        
        mWorld = world;
        mPosition = position;
        
        createCarBody();
        
        // Left wheels
        mFrontWheels.push(createWheel([0.25,0.25]));
        mBackWheels.push(createWheel([-0.25,0.25]));
        
        // Right wheels
        mFrontWheels.push(createWheel([0.25,-0.25]));
        mBackWheels.push(createWheel([-0.25,-0.25]));
    })();
};