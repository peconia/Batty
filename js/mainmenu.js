BasicGame.MainMenu = function (game) {
    "use strict";
	this.playButton = null;

};

BasicGame.MainMenu.prototype = {
    
	create: function () {
        "use strict";
		this.add.sprite(-50, 0, 'preloaderBackground');
		this.playButton = this.add.button(424, 350, 'playButton', this.startGame, this, 0, 0, 1, 0);
	},

	startGame: function () {
        "use strict";
		this.state.start('Game');

	}

};

