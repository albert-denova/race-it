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
        // Gather all information and call callback
        
        // Inform listener 
        if(this.mListener) {
            this.mListener.onGameUpdated();
        }
    };    
    
    this.registerListener = function(listener) {
       this.mListener = listener; 
    };
    
    // Private
    var createPhysicsService = function() {
        mPhysicsService = new PhysicsService();
        mGameLoop.registerFastLoopService(mPhysicsService);
    };
    
    // Constructor
    (function() {
        mGameLoop = new GameLoop();
        mGameLoop.registerSlowLoopService(mSelf);
        createPhysicsService();
    })();
};