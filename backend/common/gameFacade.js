var GameLoop = require('./gameLoop.js').GameLoop;
var PhysicsService = require('../services/physics/physicsService.js').PhysicsService;

exports.GameFacade = function() {

    var mGameLoop = null;
    var mPhysicsService = null;
    var mSelf = this;
    var mListener = null;
    
    this.init = function() {
        mGameLoop.activate();  
    };
    
    this.stop = function() {
        mGameLoop.deactivate();   
    };
    
    this.update = function(deltaTime) {                
        // Inform listener 
        if(this.mListener) { 
            // Gather all information and call callback
            var informationForClient = {};
            informationForClient.physics = mPhysicsService.getRenderInformation();
            
            this.mListener.onGameUpdated(informationForClient);
        }
    };    
    
    this.registerListener = function(listener) {
       this.mListener = listener; 
    };
    
    this.enterGame = function() {
        var circuitId = getActiveCircuitIdOrCreateNew();
        var carId = mPhysicsService.addCar(circuitId);
        
        return {
            circuitId: circuitId,
            carId: carId
        };
    };
    
    // Private
    var createPhysicsService = function() {
        mPhysicsService = new PhysicsService();
        mGameLoop.registerFastLoopService(mPhysicsService);
    };
    
    var getActiveCircuitIdOrCreateNew = function() {        
        var circuitId = mPhysicsService.getActiveCircuitId();
        if(!circuitId) {
            circuitId = mPhysicsService.createCircuit([0]);
        }
        
        return circuitId;        
    };
    
    // Constructor
    (function() {
        mGameLoop = new GameLoop();
        mGameLoop.registerSlowLoopService(mSelf);
        createPhysicsService();
    })();
};