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
    game.load.tilemap('map', 'map.json', null,Phaser.Tilemap.TILED_JSON);  
    game.load.image('tiles', 'soup.png');
    game.load.image('block','block.png');
    game.load.audio('music','Music.mp3');
    },
    create: function () { 
    
        // This function is called after the preload function
    
    game.stage.backgroundColor = '#787878';
    map = game.add.tilemap('map');
    music = game.add.audio('music');
    music.play();
    map.addTilesetImage("soup", 'tiles');
     game.physics.startSystem(Phaser.Physics.ARCADE);
    tilelayer = map.createLayer('Background');
    tilelayer.resizeWorld();
    block = game.add.sprite(32,32,'block');
        block.anchor.set(0.5);
    game.physics.arcade.enable(block);
    block.body.collideWorldBounds = true;     
        cursors = game.input.keyboard.createCursorKeys();
    },
    update: function () {
        // This function is called 60 times per second
        // It contains the game's logic

    /*if (cursors.left.isDown)
    {
        block.rotation += 0.1;
        //block.body.x = Math.max(0, block.body.x - 10);
    }
    else if (cursors.right.isDown)
    {
        //block.body.x+=10;
        block.rotoation -= 0.1;
    }

    if (cursors.up.isDown)
    {
        block.body.y-=10;
    }
    else if (cursors.down.isDown)
    {
        block.body.y+=10;
    }*/    
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
    else if(game.input.keyboard.isDown(Phaser.Keyboard.DOWN)){ game.physics.arcade.velocityFromAngle(block.angle, -100, block.body.velocity);}
    }
};

// Initialize Phaser
game = new Phaser.Game(650, 650, Phaser.AUTO, 'gameDiv');

// And finally we tell Phaser to add and start our 'main' state
game.state.add('main', mainState);
game.state.start('main');
