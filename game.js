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
    tank.anchor.set(0.5,0.5);
    game.physics.arcade.enable(tank);
    tank.body.collideWorldBounds = true;     
    tank.body.drag.set(0);
    
    
    dummy = game.add.sprite(200,200,'tank1');
    dummy.anchor.set(0.5,0.5);
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
        var bullet = bullets.create(0,0,'bullet');
        bullet.anchor.set(0.5,0.5);
        game.physics.arcade.enable(bullet);
        bullet.body.immovable = true;
        bullet.exists = false;
        bullet.visible = false;
        bullet.checkWorldBounds = true;
        bullet.events.onOutOfBounds.add(this.resetBullet, this);
    }
    health = game.add.sprite()    
    cursors = game.input.keyboard.createCursorKeys();
    },
    update: function () {
    // This function is called 60 times per second
    // It contains the game's logic
    game.physics.arcade.collide(tank, dummy, this.bump, null, this);
    game.physics.arcade.overlap(bullets, dummy, this.bump2, null, this);
        
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
    if (game.input.keyboard.isDown(Phaser.Keyboard.DOWN))
        {
            game.physics.arcade.velocityFromAngle(tank.angle, -300, tank.body.velocity);
        }
    if (game.input.keyboard.isDown(Phaser.Keyboard.SPACEBAR))
        {
            
            this.fire();
        }
        game.physics.arcade.collide(tank, collisionlayer);
    
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
                bullet.reset(tank.x-game.cache.getImage('bullet').width/2, tank.y-game.cache.getImage('bullet').height/2);
                //bullet.body.velocity.y = -500;
                game.physics.arcade.velocityFromAngle(tank.angle, 900, bullet.body.velocity);
                lastBulletShotAt = game.time.now + 300;
            }
        }
    }
   
};

// Initialize Phaser
game = new Phaser.Game(650, 650, Phaser.AUTO, 'gameDiv');

// And finally we tell Phaser to add and start our 'main' state
game.state.add('main', mainState);
game.state.start('main');
