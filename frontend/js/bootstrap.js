var ioSocket = io.connect();
var i = 0;
ioSocket.on('joinedGame', function(gameInformation) {
    console.log('joined game!!!', gameInformation);
});

ioSocket.on('logicGameUpdated', function(renderInformation) {
    if(renderInformation.physics.length > 0) debugger;
    i++;
});

ioSocket.emit('joinGame');
/*
var game = new Phaser.Game(
    800, 
    800, 
    Phaser.AUTO, 
    '', 
    { 
        preload: function() {
                        
        }, 
        create: function() {
            
        },
        update: function() {
            
        }
    }
);
*/