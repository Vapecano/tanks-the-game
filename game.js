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
var bullets;
var dummy;
var health;
var lastBulletShotAt = 0;
var lastBulletShotAt2 = 0;
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
    game.load.image('bullet','bullet.png');
    game.load.image('block2','block2.png');
    },
    create: function () { 
    // This function is called after the preload function
    game.stage.backgroundColor = '#787878';
   
    music = game.add.audio('music');
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
    //tank.height = 36
    //tank.width = 60
    tank.anchor.set(0.5,0.5);
    game.physics.arcade.enable(tank);
    tank.body.collideWorldBounds = true;     
    tank.body.drag.set(0);
    
    
    dummy = game.add.sprite(200,200,'tank1');
    dummy.anchor.set(0.5,0.5);
    //dummy.height = 36
    //dummy.width = 60
    game.physics.arcade.enable(dummy);
    dummy.body.collideWorldBounds = true;     
    dummy.body.drag.set(0);
    
    //bullet=game.add.weapon(4,'block');
    //bullet.anchor.set(0.5,0.5);
    //game.physics.arcade.enable(bullet);
    //bullet.body.drag.set(0);
    //bullet.bulletKillType = Phaser.Weapon.KILL_WORLD_BOUNDS;
    //bullet.trackSprite(tank, 60, 0, true);
    //bullet.bulletSpeed=500;
    //bullet.fireRate= 250;
    
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
    health = game.add.sprite(100,100,'block2')
    health.anchor.set(0.5,0.5);
    health.width = 2
    
    cursors = game.input.keyboard.createCursorKeys();
    },
    update: function () {
    // This function is called 60 times per second
    // It contains the game's logic
    game.physics.arcade.collide(tank, dummy, this.bump, null, this);
    game.physics.arcade.overlap(bullets, dummy, this.bump2, null, this);
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
    if (game.input.keyboard.isDown(Phaser.Keyboard.Q))
        {
            this.fire2();
        }
        game.physics.arcade.collide(dummy, collisionlayer);
    },
    bump: function(tank, dummy){
        console.log("test");
    },
    bump2: function(dummy, bullet){
        console.log("test2");
        bullet.kill();
    },
    resetBullet: function(bullet){
        bullet.kill();
    },
    fire: function(){
        if (game.time.now > lastBulletShotAt)
        {
            bullet = bullets.getFirstExists(false);
            if (bullet)
            {
                bullet.reset(tank.x-game.cache.getImage('block').width/2, tank.y-game.cache.getImage('block').height/2);
                //bullet.body.velocity.y = -500;
                game.physics.arcade.velocityFromAngle(tank.angle, 900, bullet.body.velocity);
                lastBulletShotAt = game.time.now + 300;
            }
        }
    },
   fire2: function(){
        if (game.time.now > lastBulletShotAt2)
        {
            bullet2 = bullets2.getFirstExists(false);
            if (bullet2)
            {
                bullet2.reset(dummy.x-game.cache.getImage('block').width/2, dummy.y-game.cache.getImage('block').height/2);
                //bullet.body.velocity.y = -500;
                game.physics.arcade.velocityFromAngle(dummy.angle, 900, bullet2.body.velocity);
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
