/* Tanks Maybe */
/*jslint sloppy:true, browser: true, devel: true, eqeq: true, vars: true, white: true*/
// Variables
var game;
var map;
var tilelayer;
var tilelayer2;
var collisionlayer;
var tank;
var cursors;
var music;
var style = {font: '', fill:''};
var bullets;
var health1 = [];
var health2 = [];
var maxHealth = 3;
var maxAmmo = 5;
var ammo1 = [];
var ammo2 = [];
var lastBulletShotAt = 0;
var lastBulletShotAt2 = 0;
var tankWins;
var dummyWins;
var boom;
var mainState = {
    // Here we add all the functions we need for our state
    // For this project we will just have 3 functions
    preload: function () {
    // This function will be executed at the beginning
    // That's where we load the game's assets
    game.load.tilemap('map', 'level1.json', null, Phaser.Tilemap.TILED_JSON);  
    game.load.image('tiles', 'soup.png');
    game.load.image('block','block.png');
    game.load.audio('music','looperino.mp3');
    game.load.image('tank1','tank1.png');
    game.load.image('bullet','bullet.png');
    game.load.image('block2','block2.png');
    game.load.image('health','heart.png');
    game.load.spritesheet('kaboom', 'explosion.png', 64, 64, 23);
    },
    
    create: function () { 
    // This function is called after the preload function
    game.stage.backgroundColor = '#787878';
   
    music = game.add.audio('music');
    music.loop = true;
    music.play();
    game.physics.startSystem(Phaser.Physics.ARCADE);
    
    map = game.add.tilemap('map');
    map.addTilesetImage('soup', 'tiles');
    tilelayer = map.createLayer('Tile Layer 3');
    tilelayer2 = map.createLayer('backgroundLayer');
    collisionlayer = map.createLayer('collisionLayer');
    map.setCollisionBetween(204, 204, true, 'collisionLayer');
    collisionlayer.resizeWorld();
    
    tank = game.add.sprite(300,300,'tank1');
    tank.anchor.set(0.5,0.5);
    game.physics.arcade.enable(tank);
    tank.body.collideWorldBounds = true;   tank.body.drag.set(0);
    
    dummy = game.add.sprite(200,200,'tank1');
    dummy.anchor.set(0.5,0.5);
    game.physics.arcade.enable(dummy);
    dummy.body.collideWorldBounds = true;   dummy.body.drag.set(0);

    tankWins = game.add.text(game.world.centerX, 20, " Player 1 Wins!", style);
    tankWins.anchor.set(0.5);
    tankWins.visible = false;
    
    dummyWins = game.add.text(game.world.centerX, 20, " Player 2 Wins!", style);
    dummyWins.anchor.set(0.5);
    dummyWins.visible = false;
    
    bullets = game.add.group();
    bullets.enableBody=true;
    bullets.physicsBodyType = Phaser.Physics.ARCADE;
    for (var i=0; i< 100; i++)
    {
        var bullet = bullets.create(0,0,'block');
        bullet.anchor.set(0.5,0.5);
        game.physics.arcade.enable(bullet);
        bullet.body.immovable = true;
        bullet.exists = false;
        bullet.visible = false;
        bullet.checkWorldBounds = true;
        bullet.events.onOutOfBounds.add(this.resetBullet, this);
    }
    
    bullets2 = game.add.group();
    bullets2.enableBody=true;
    bullets2.physicsBodyType = Phaser.Physics.ARCADE;
    for (var a=0; a< 100; a++)
    {
        var bullet2 = bullets2.create(0,0,'block');
        bullet2.anchor.set(0.5,0.5);
        game.physics.arcade.enable(bullet);
        bullet2.body.immovable = true;
        bullet2.exists = false;
        bullet2.visible = false;
        bullet2.checkWorldBounds = true;
        bullet2.events.onOutOfBounds.add(this.resetBullet, this);
    }
  
    for(var h = 0; h < maxHealth; h++)
    {
        var health = game.add.sprite(20 + (h * 30),20,'health');
        health1.push(health);
    }
    
    for(var k = 0; k < maxHealth; k++)
    {
        var health3 = game.add.sprite(530 + (k * 30),20,'health');
        health2.push(health3);
    }
    
        for(var a = 0; a < maxAmmo; a++)
    {
        var ammo = game.add.sprite(20 + (a * 30),60,'health');
        ammo1.push(ammo);
    }
        for(var b = 0; b < maxAmmo; b++)
    {
        var ammo3 = game.add.sprite(480 + (b * 30),60,'health');
        ammo2.push(ammo3);
    }
    
    
    cursors = game.input.keyboard.createCursorKeys();
    },
    
    update: function(){
    // This function is called 60 times per second
    // It contains the game's logic
    game.physics.arcade.collide(tank, dummy, this.bump, null, this);
    game.physics.arcade.overlap(bullets, dummy, this.bump2, null, this);
    game.physics.arcade.overlap(bullets2, tank, this.bump3, null, this);
    //Player 1 Movement    
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
            game.physics.arcade.velocityFromAngle(tank.angle, 200, tank.body.velocity);
        }
    if (game.input.keyboard.isDown(Phaser.Keyboard.DOWN))
        {
            game.physics.arcade.velocityFromAngle(tank.angle, -150, tank.body.velocity);
        }
    if (game.input.keyboard.isDown(Phaser.Keyboard.ALT))
        {
            this.fire();
        }
        game.physics.arcade.collide(tank, collisionlayer);
    
    // Player 2 Movement
    dummy.body.velocity.x = 0;
    dummy.body.velocity.y = 0;
    dummy.body.angularVelocity = 0;
    if (game.input.keyboard.isDown(Phaser.Keyboard.A))
        {
            dummy.body.angularVelocity = -200;
        }
    else if (game.input.keyboard.isDown(Phaser.Keyboard.D))
        {
            dummy.body.angularVelocity = 200;
        }
    if (game.input.keyboard.isDown(Phaser.Keyboard.W))
        {
            game.physics.arcade.velocityFromAngle(dummy.angle, 200, dummy.body.velocity);
        }
    if (game.input.keyboard.isDown(Phaser.Keyboard.S))
        {
            game.physics.arcade.velocityFromAngle(dummy.angle, -150, dummy.body.velocity);
        }
    if (health2.length > 0)
        {
            if (ammo1.length > 0)
            {
                if (game.input.keyboard.isDown(Phaser.Keyboard.Q))
                    {
                        this.fire2();
                       
                    }
            }
        }
    game.physics.arcade.collide(dummy, collisionlayer);
    
    },
    bump: function(tank, dummy){
        console.log("test");
    },
    bump2: function(dummy, bullet){
        console.log("test2");
        bullet.kill();
        
        var health = health1.pop();
        health.kill();
        
        if(health1.length == 0)
            {
                // Kill Player 1, Player 2 has Won
                boom = game.add.sprite (dummy.x,dummy.y, 'kaboom',0);
                boom.anchor.set(0.5, 0.5);
                boom.animations.add('kaboom');
                boom.animations.play('kaboom',10,false);
                tankWins.visible = true;
                game.time.events.add(Phaser.Timer.SECOND * 5, this.pauseGame, this);
                dummy.kill;
            }
    },
    bump3: function(tank, bullet2){
        console.log("test3");
        bullet2.kill();
        
        var health = health2.pop();
        health.kill();
        
        if(health2.length == 0)
            {
                // Kill Player 1, Player 2 has Won
                boom = game.add.sprite (tank.x,tank.y, 'kaboom',0);
                boom.anchor.set(0.5, 0.5);
                boom.animations.add('kaboom');
                boom.animations.play('kaboom',10,false);
                dummyWins.visible = true;
                game.time.events.add(Phaser.Timer.SECOND * 5, this.pauseGame, this);
               
            }
    },
    pauseGame: function(){
        boom.visible=false;
        game.paused =true
    },
    resetBullet: function(bullet){
        bullet.kill();
    },
    fire: function()
    {
        if (game.time.now > lastBulletShotAt)
        {
            bullet = bullets.getFirstExists(false);
            if (bullet)
            {
                bullet.reset(tank.x-game.cache.getImage('block').width/2, tank.y-game.cache.getImage('block').height/2);
                //bullet.body.velocity.y = -500;
                game.physics.arcade.velocityFromAngle(tank.angle, 900, bullet.body.velocity);
                var ammu = ammo2.pop();
                ammu.kill();
                lastBulletShotAt = game.time.now + 300;
            }
        }
    },
   fire2: function()
    {
        if (game.time.now > lastBulletShotAt2)
        {
            bullet2 = bullets2.getFirstExists(false);
            if (bullet2)
            {
                bullet2.reset(dummy.x-game.cache.getImage('block').width/2, dummy.y-game.cache.getImage('block').height/2);
                //bullet.body.velocity.y = -500;
                game.physics.arcade.velocityFromAngle(dummy.angle, 900, bullet2.body.velocity);
                var ammu = ammo1.pop();
                ammu.kill();
                lastBulletShotAt2 = game.time.now + 300;
            }
        }
    }
};

// Initialize Phaser
game = new Phaser.Game(640, 640, Phaser.AUTO, 'gameDiv');

// And finally we tell Phaser to add and start our 'main' state
game.state.add('main', mainState);
game.state.start('main');
