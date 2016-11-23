/* Tanks Maybe */
/*jslint sloppy:true, browser: true, devel: true, eqeq: true, vars: true, white: true*/
var game;
var map;
var tilelayer;
var collisionlayer;
var block;
var cursors;
var music;
var mainState = {
    // Here we add all the functions we need for our state
    // For this project we will just have 3 functions
    preload: function () {
        // This function will be executed at the beginning
        // That's where we load the game's assets


    game.load.tilemap('map', 'level1.json', null, Phaser.Tilemap.TILED_JSON);  

    game.load.image('tiles', 'soup.png');

    game.load.image('block','block.png');
    game.load.audio('music','Music.mp3');

    game.load.image('tank1','tank1.png');

    },
    create: function () { 
    
        // This function is called after the preload function
    
    game.stage.backgroundColor = '#787878';
    map = game.add.tilemap('map');
    music = game.add.audio('music');
    music.play();
    map.addTilesetImage('soup', 'tiles');
     game.physics.startSystem(Phaser.Physics.ARCADE);
    tilelayer = map.createLayer('Tile Layer 3');
    tilelayer.resizeWorld();
    block = game.add.sprite(100,100,'tank1');
        block.anchor.set(0.5,0.5);
         
    game.physics.arcade.enable(block);

    block.body.collideWorldBounds = true;     
        cursors = game.input.keyboard.createCursorKeys();

        block.body.drag.set(0);
         cursors = game.input.keyboard.createCursorKeys();

    },
    update: function () {
        // This function is called 60 times per second
        // It contains the game's logic


    block.body.velocity.x = 0;
    block.body.velocity.y = 0;
    block.body.angularVelocity = 0;

    if (game.input.keyboard.isDown(Phaser.Keyboard.LEFT))
    {
        block.body.angularVelocity = -200;
    }
    else if (game.input.keyboard.isDown(Phaser.Keyboard.RIGHT))
    {
        block.body.angularVelocity = 200;
    }

    if (game.input.keyboard.isDown(Phaser.Keyboard.UP))
    {
        game.physics.arcade.velocityFromAngle(block.angle, 300, block.body.velocity);
    }

    }
};

// Initialize Phaser
game = new Phaser.Game(650, 650, Phaser.AUTO, 'gameDiv');

// And finally we tell Phaser to add and start our 'main' state
game.state.add('main', mainState);
game.state.start('main');
