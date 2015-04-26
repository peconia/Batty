BasicGame.Preloader = function (game) {
    "use strict";
	this.background = null;
	this.preloadBar = null;
	this.ready = false;

};

BasicGame.Preloader.prototype = {

	preload: function () {
        "use strict";
		this.background = this.add.sprite(-50, 0, 'preloaderBackground');
		this.preloadBar = this.add.sprite(300, 400, 'preloaderBar');

		this.load.setPreloadSprite(this.preloadBar);

        this.load.image('bgtile', 'assets/stars3.jpg');
        this.load.image('obstacle', 'assets/obstacle.png');
        this.load.audio('jump', 'assets/jump.wav');
        this.load.audio('collision', 'assets/collision.wav');
        this.load.spritesheet('batflysheet', 'assets/batsheet1.png', 50, 50, 4);
        this.load.spritesheet('playButton', 'assets/start-button.png', 150, 60);
	

	},

	create: function () {
        "use strict";
		this.state.start('MainMenu');

	}

};

