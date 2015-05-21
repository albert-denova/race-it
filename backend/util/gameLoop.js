// Code adapted from: https://github.com/timetocode/node-game-loop/blob/master/gameLoop.js
exports.GameLoop = function() {
    // Constants
    var FAST_TICK_LENGTH_IN_MILLISECONDS = 15;
    var SLOW_TICK_LENGTH_IN_MILLISECONDS = 45;
    var TICK_MARGIN = 16;
        
    // Attributes
    var fastLoopServices = [];
    var slowLoopServices = [];
    var previousFastTick = Date.now();
    var previousSlowTick = Date.now();
    var fastLoopTimeout  = null;
    var slowLoopTimeout  = null;
    
    // Public methods
    this.registerFastLoopService = function(service) {
        fastLoopServices.push(service);
    };
    
    this.getFastLoopServiceCount = function() {
        return fastLoopServices.length;  
    };
    
    this.registerSlowLoopService = function(service) {
        slowLoopServices.push(service);
    };
    
    this.getSlowLoopServiceCount = function() {
        return slowLoopServices.length;  
    };
    
    this.activate = function() {        
        executeFastLoop();
        executeSlowLoop();
    };
    
    this.desactivate = function() {   
        if(fastLoopTimeout) { 
            clearTimeout(fastLoopTimeout);
        }
        
        if(slowLoopTimeout) {
            clearTimeout(slowLoopTimeout);   
        }
    };
    
    // Private methods
    var executeFastLoop = function() {
        var now = Date.now();
        
        updateFastLoopServices(now - previousFastTick);
        
        previousFastTick = now;
        fastLoopTimeout = setTimeout(executeFastLoop, FAST_TICK_LENGTH_IN_MILLISECONDS);
    };
    
    var executeSlowLoop = function() {
        var now = Date.now();
        
        updateSlowLoopServices(now - previousSlowTick);
        
        previousSlowTick = now;
        slowLoopTimeout = setTimeout(executeFastLoop, SLOW_TICK_LENGTH_IN_MILLISECONDS);
    };
    
    var calculateDeltaTime = function(date) {
        return  (now - previousFastTick) / 1000;     
    };
    
    var updateFastLoopServices = function(deltaTime) {        
        for(var index in fastLoopServices) {
            var service = fastLoopServices[index];
            service.update(deltaTime);
        }  
    };
    
    var updateSlowLoopServices = function(deltaTime) {
        for(var index in slowLoopServices) {
            var service = slowLoopServices[index];
            service.update(deltaTime);
        }  
    };
};