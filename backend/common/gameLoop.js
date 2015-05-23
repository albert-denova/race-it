// Code adapted from: https://github.com/timetocode/node-game-loop/blob/master/gameLoop.js
exports.GameLoop = function() {
    // Constants
    var FAST_TICK_LENGTH_IN_MILLISECONDS = 15;
    var SLOW_TICK_LENGTH_IN_MILLISECONDS = 45;
    var TICK_MARGIN = 16;
        
    // Attributes
    var mFastLoopServices = [];
    var mSlowLoopServices = [];
    var mPreviousFastTick = Date.now();
    var mPreviousSlowTick = Date.now();
    var mFastLoopTimeout  = null;
    var mSlowLoopTimeout  = null;
    
    // Public methods
    this.registerFastLoopService = function(service) {
        mFastLoopServices.push(service);
    };
    
    this.getFastLoopServiceCount = function() {
        return mFastLoopServices.length;  
    };
    
    this.registerSlowLoopService = function(service) {
        mSlowLoopServices.push(service);
    };
    
    this.getSlowLoopServiceCount = function() {
        return mSlowLoopServices.length;  
    };
    
    this.activate = function() {        
        executeFastLoop();
        executeSlowLoop();
    };
    
    this.deactivate = function() {   
        if(mFastLoopTimeout) { 
            clearTimeout(mFastLoopTimeout);
        }
        
        if(mSlowLoopTimeout) {
            clearTimeout(mSlowLoopTimeout);   
        }
    };
    
    // Private methods
    var executeFastLoop = function() {
        var now = Date.now();
        
        updateFastLoopServices(now - mPreviousFastTick);
        
        mPreviousFastTick = now;
        mFastLoopTimeout = setTimeout(executeFastLoop, FAST_TICK_LENGTH_IN_MILLISECONDS);
    };
    
    var executeSlowLoop = function() {
        var now = Date.now();
        
        updateSlowLoopServices(now - mPreviousSlowTick);
        
        mPreviousSlowTick = now;
        mSlowLoopTimeout = setTimeout(executeFastLoop, SLOW_TICK_LENGTH_IN_MILLISECONDS);
    };
    
    var calculateDeltaTime = function(date) {
        return  (now - mPreviousFastTick) / 1000;     
    };
    
    var updateFastLoopServices = function(deltaTime) {        
        for(var index in mFastLoopServices) {
            var service = mFastLoopServices[index];
            service.update(deltaTime);
        }  
    };
    
    var updateSlowLoopServices = function(deltaTime) {
        for(var index in mSlowLoopServices) {
            var service = mSlowLoopServices[index];
            service.update(deltaTime);
        }  
    };
};