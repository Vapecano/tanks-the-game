/* Tanks Maybe */
/*jslint sloppy:true, browser: true, devel: true, eqeq: true, vars: true, white: true*/
var game;
var map;
var tilelayer;
var tilelayer2;
var collisionlayer;
var tank;
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
    game.load.audio('music','music.mp3');

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
    tilelayer2 = map.createLayer('backgroundLayer');
    collisionlayer = map.createLayer('collisionLayer');
    map.setCollisionBetween(204, 204, true, 'collisionLayer');
    collisionlayer.resizeWorld();
    tank = game.add.sprite(300,300,'tank1');
    tank.anchor.set(0.5,0.5);
    game.physics.arcade.enable(tank);
    tank.body.collideWorldBounds = true;     
    tank.body.drag.set(0);
    cursors = game.input.keyboard.createCursorKeys();

    },
    update: function () {
        // This function is called 60 times per second
        // It contains the game's logic
        tank.body.velocity.x = 0;
        tank.body.velocity.y = 0;
        tank.body.angularVelocity = 0;

        if (game.input.keyboard.isDown(Phaser.Keyboard.LEFT))
        {
            tank.body.angularVelocity = -200;
        }
        else if (game.input.keyboard.isDown(Phaser.Keyboard.RIGHT))
        {
            tank.body.angularVelocity = 200;
        }

        if (game.input.keyboard.isDown(Phaser.Keyboard.UP))
        {
            game.physics.arcade.velocityFromAngle(tank.angle, 300, tank.body.velocity);
        }
        game.physics.arcade.collide(tank, collisionlayer);
    }
};

// Initialize Phaser
game = new Phaser.Game(650, 650, Phaser.AUTO, 'gameDiv');

// And finally we tell Phaser to add and start our 'main' state
game.state.add('main', mainState);
game.state.start('main');
