// Initialize Phaser and create 800 x 490 px game
var game = new Phaser.Game(800, 490, Phaser.AUTO, 'gameDiv');


// create main state to contain the game
var mainState = {
    preload: function () {
        "use strict";
        //game.stage.backgroundColor = '#71c5cf';
        game.load.image('bgtile', 'assets/stars3.jpg');
        game.load.image('deadbat', 'assets/deadbat.png');
        game.load.image('obstacle', 'assets/obstacle.png');
        game.load.audio('jump', 'assets/jump.wav');
        game.load.audio('collision', 'assets/collision.wav');
        game.load.spritesheet('batflysheet', 'assets/batsheet1.png', 50, 50, 4);
    },
    
    create: function () {
        "use strict";
        //background
        this.bgtile = game.add.tileSprite(0, 0, game.stage.bounds.width, game.cache.getImage('bgtile').height, 'bgtile');
        // add physics
        game.physics.startSystem(Phaser.Physics.ARCADE);
        // display bat, coordinates where it appears, spritesheet name and index
        this.bat = this.game.add.sprite(100, 245, 'batflysheet', 0);
        //add different animations by spritesheet index for images in each animation
        this.bat.animations.add("fly", [0, 1, 2]);
        this.bat.animations.add("deadbat", [3]);
        this.bat.play("fly", 10, true);
        // add gravity to make it fall
        game.physics.arcade.enable(this.bat);
        this.bat.body.gravity.y = 750;
        // change the bat anchor for the turning animation
        this.bat.anchor.setTo(-0.2, 0.5);
        // call jump when space is hit
        var spaceKey = this.game.input.keyboard.addKey(Phaser.Keyboard.SPACEBAR);
        spaceKey.onDown.add(this.jump, this);
        //add sound to jump and hitting obstacle
        this.jumpSound = game.add.audio('jump');
        this.hitSound = game.add.audio('collision');
        
        //add a group for obstacles and physics for them
        this.obstacles = game.add.group();
        this.obstacles.enableBody = true;
        this.obstacles.createMultiple(20, 'obstacle');
        
        // add a new row of obstacles every 1.5 secs
        this.timer = game.time.events.loop(1500,        this.addRowOfObstacles, this);
        
        // add score
        this.score = 0;
        this.labelScore = game.add.text(20, 20, "0", { font: "30px Arial", fill: "#ffffff"});
    },
    
    update: function () {
        "use strict";
        if (this.bat.angle < 20) {
            this.bat.angle += 1;
        }
        // if bat is out of the game too high or
        //too low, call restart
        if (this.bat.inWorld === false) {
            this.restartGame();
        }
        // if bat hits obstacle, call function for hitting obstacle
        game.physics.arcade.overlap(this.bat, this.obstacles, this.hitObstacle, null, this);
        
        // background
        if (this.bat.alive === true) {
            this.bgtile.tilePosition.x -= 3.2;
        }
    },
    
    jump: function () {
        "use strict";
        // if dead, do not jump!
        if (this.bat.alive === false) {
            return;
        }
        // Add a vertical velocity to bat
        this.bat.body.velocity.y = -250;
        //animate the bat to change angle more slowly
        var animation = game.add.tween(this.bat);
        animation.to({angle: -20}, 100);
        animation.start();
        // play sound
        this.jumpSound.play();
        
    },
    
    hitObstacle: function () {
        "use strict";
        // no action if bat already hit a obstacle
        if (this.bat.alive === false) {
            return;
        }
        
        this.bat.alive = false;
        this.hitSound.play();
        this.bat.play('deadbat');
        
        
        // prevent new obstacles form appearing
        game.time.events.remove(this.timer);
        // stop all the visible obstacles moving
        this.obstacles.forEachAlive(function (p) {
            p.body.velocity.x = 0;
        }, this);
    },
    
    restartGame: function () {
        "use strict";
        game.state.start('main');
    },
    
    addOneObstacle: function (x, y) {
        "use strict";
        //get first dead obstacle out of the group
        var obstacle = this.obstacles.getFirstDead();
        // set position for it
        obstacle.reset(x, y);
        // Add velocity to the obstacle to make it move left
        obstacle.body.velocity.x = -200;
        // kill the obstacle when it is no longer visible
        obstacle.checkWorldBounds = true;
        obstacle.outOfBoundsKill = true;
    },
    
    addRowOfObstacles: function () {
        "use strict";
        
        // pick where the hole will be
        var hole = Math.floor(Math.random() * 5) + 1;
        //add 6 obstacles
        for (var i = 0; i < 8; i++) {
            if (i != hole && i != hole + 1) {
                this.addOneObstacle(800, i * 60 + 10);
            }
        }
        //add one score point when more obstacles are created
        this.score += 1;
        this.labelScore.text = this.score;
    }
        
    
};

// add and start the main state to start the game
game.state.add('main', mainState);
game.state.start('main');