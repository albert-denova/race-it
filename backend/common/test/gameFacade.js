var GameFacade = require('../gameFacade.js').GameFacade;

// Mock
var GameFacadeListener = function() {
    var mTimesCalledCallback = 0;
    
    this.onGameUpdated = function() {
        ++mTimesCalledCallback;
    }
    
    this.getTimesCalledCallback = function() {
        return mTimesCalledCallback;    
    };  
};

// Tests
module.exports = {
    setUp: function (callback) {          
        callback();
    },
    tearDown: function (callback) {        
        // clean up
        callback();
    },
    createFacade: function(test) {
        test.doesNotThrow(function() {
            var gameFacade = new GameFacade();   
        });
        test.done();   
    },
    initializeFacade: function(test) {
        test.doesNotThrow(function() {
            var gameFacade = new GameFacade();   
            gameFacade.init();
            gameFacade.stop();
        });
        test.done();   
    },
    registerCallback: function(test) {
        test.doesNotThrow(function() {
            var gameFacade = new GameFacade();
            var gameFacadeListener = new GameFacadeListener();
        
            gameFacade.registerListener(gameFacadeListener);
        });
        test.done();
    },
    callbackCalledOnUpdate: function(test) {
        var gameFacade = new GameFacade();
        var gameFacadeListener = new GameFacadeListener();
        
        gameFacade.registerListener(gameFacadeListener);
        gameFacade.init();
        gameFacade.stop();
        
        var timesCalledListener = gameFacadeListener.getTimesCalledCallback();
        test.equal(timesCalledListener, 1);        
        test.done();        
    }
};