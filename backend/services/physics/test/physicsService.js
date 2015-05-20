var p2 = require('p2');
var PhysicsService = require('../physicsService.js').PhysicsService;

module.exports = {
    setUp: function (callback) {                
        callback();
    },
    tearDown: function (callback) {        
        // clean up
        callback();
    },
    createCarWithoutParams: function (test) {        
        test.done();
    }
};