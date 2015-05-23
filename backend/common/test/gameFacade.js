// Being forced to do an integration test since I didn't want to extend much 
// more the dependency injection. This benefits us to really see if everything
// is working well, so it's not that bad at all.
var GameFacade = require('../gameFacade.js').GameFacade;

// Mock
var GameFacadeListener = function() {
    var mTimesCalledCallback = 0;
        
    this.onGameUpdated = function() {
        ++mTimesCalledCallback;
    };
    
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
    },
    createNewGame: function(test) {
        var gameFacade = new GameFacade();
        
        var gameInformation = gameFacade.enterGame();
        
        test.equal(gameInformation.circuitId, 1);
        test.equal(gameInformation.carId, 1);
        test.done();
    },
    joinExistingGame: function(test) {
        var gameFacade = new GameFacade();
        
        var firstPlayerGameInformation = gameFacade.enterGame();
        var secondPlayerGameInformation = gameFacade.enterGame();
        
        test.equal(secondPlayerGameInformation.circuitId, firstPlayerGameInformation.circuitId);
        test.equal(secondPlayerGameInformation.carId, 2);
        test.done();
    }
};