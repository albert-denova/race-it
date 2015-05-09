var ioSocket = io.connect();
var game = new Phaser.Game(
    800, 
    800, 
    Phaser.AUTO, 
    '', 
    { 
        preload: function() {
            // Load sprite
            game.load.atlasJSONHash('boardSprite', 'media/img/boardSprite.png', 'media/img/boardSprite.json');
        }, 
        create: function() {
            console.log("Create");
            var boardController = new BoardController();
        },
        update: function() {
            
        }
    }
);