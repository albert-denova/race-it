var GameLoop = require('../gameLoop.js').GameLoop;

// Fixtures
var MockService = function() {
    var mTimesCalledUpdate = 0;
    
    this.update = function() {
        ++mTimesCalledUpdate;
    };
    
    this.getTimesCalledUpdate = function() {
        return mTimesCalledUpdate;    
    };  
};

// Tests
module.exports = {
    setUp: function (callback) {          
        this.gameLoop = new GameLoop();
        this.mockService = new MockService();
        callback();
    },
    tearDown: function (callback) {        
        // clean up
        callback();
    },
    registerFastLoopService: function (test) {        
        this.gameLoop.registerFastLoopService(this.mockService);
        
        var registeredFastLoopServicesCount = this.gameLoop.getFastLoopServiceCount();
        test.equal(registeredFastLoopServicesCount, 1);
        test.done();
    },
    registerSlowLoopService: function (test) {
        this.gameLoop.registerSlowLoopService(this.mockService);
        
        var registeredSlowLoopServicesCount = this.gameLoop.getSlowLoopServiceCount();
        test.equal(registeredSlowLoopServicesCount, 1);
        test.done();
    },
    activateAndTestOnlyFastLoop: function (test) {
        this.gameLoop.registerFastLoopService(this.mockService);
        
        // First activation will trigger an update, which will allow us to check that works
        this.gameLoop.activate();
        this.gameLoop.deactivate();
        
        var timesCalledUpdate = this.mockService.getTimesCalledUpdate();
            
        test.equal(timesCalledUpdate, 1);
        test.done();   
    },
    activateAndTestOnlySlowLoop: function (test) {
        this.gameLoop.registerSlowLoopService(this.mockService);
        
        // First activation will trigger an update, which will allow us to check that works
        this.gameLoop.activate();
        this.gameLoop.deactivate();
        
        var timesCalledUpdate = this.mockService.getTimesCalledUpdate();
            
        test.equal(timesCalledUpdate, 1);
        test.done();   
    }
};