var GoblinChaser = {

	init: function()
	{
		// Create the canvas
		this.Canvas = GameWork.Class.Canvas.createInstance({ width: 1024, height: 912 });
		this.gameObjects = [];

		// Background image
		this.bgImage = new Image();
		this.bgImage.src = "images/background.png";
		this.Score = GameWork.Class.Score.createInstance(this.Canvas);
		this.Sound = GameWork.Class.Sound.createInstance(this.Canvas);
		this.goblinIntervalTimer = 1000;
		this.keysDown = {};

		this.textParams = {
			color: "rgb( 250, 250, 250 )",
			font: "18px cursive",
			align: "left",
			baseLine: "top",
			text: "Awesome"
		};

		var Instance = this;
		addEventListener("keydown", function(e)
		{
			Instance.keysDown[e.keyCode] = e.keyCode;
		}, false);

		addEventListener("keyup", function(e)
		{
			delete Instance.keysDown[e.keyCode];
		}, false);

		GameWork.Class.Hero.createInstance(this.Canvas);
		GameWork.Class.Octo.createInstance(this.Canvas);
		GameWork.Class.Boots.createInstance(this.Canvas);

		this.goblinInterval = setInterval(GoblinChaser.setGoblinTimer, GoblinChaser.goblinIntervalTimer);

		document.body.appendChild(this.Canvas.canvas);
	},

	setGoblinTimer: function()
	{
		setTimeout(function()
		{

			GoblinChaser.addGoblin();

		}, GameWork.getRandomInt(1000, 6000));
	},

	addGoblin: function()
	{
		GameWork.Class.Goblin.createInstance(this.Canvas);
	},

	// Update game objects
	update: function(modifier)
	{
		if (this.Score.points === 50)
		{
			GameWork.Class.Octo.createInstance(this.Canvas);
			this.Score.points += 10;
		}

		//move game objects
		for (var i = 0; i < this.gameObjects.length; i++)
		{
			if (this.gameObjects[i].constructor.name == "Boots")
				continue;

			if (this.gameObjects[i].removeMe)
			{
				this.gameObjects.splice(i, 1);
				continue;
			}

			this.gameObjects[i].move(modifier);
		};

		GameWork.checkForCollisions( this.gameObjects );
	},

	// Draw everything
	render: function()
	{
		if (this.bgImage.complete)
			this.Canvas.drawBackground(this.bgImage);

		for (var i = 0; i < this.gameObjects.length; i++)
		{
			if (this.gameObjects[i].image.complete)
				this.Canvas.drawSpriteObj(this.gameObjects[i]);
		};

		// Score
		this.textParams.text = "Score: " + this.Score.points;
		this.Canvas.showText(this.textParams, 395, 32);
		//goblins caught
		this.textParams.text = 'Goblins caught: ' + this.Score.goblinsCaught;
		this.Canvas.showText(this.textParams, 32, 32);
	},

	mainLoop: function()
	{
		this.now = Date.now();
		this.delta = this.now - this.then;
		this.update(this.delta / 1600);
		this.render();
		this.then = this.now;
	},

	reset: function()
	{
		this.Score.reset();
		this.Sound.reset();
		this.Canvas.reset();

		for (var i = 0; i < this.gameObjects.length; i++)
		{
			this.gameObjects[i].reset();

			if (this.gameObjects[i].constructor.name == "Goblin")
				this.gameObjects.splice(i, 1);
		};
	},

	play: function()
	{
		// Let's play this game!
		var Instance = this;

		Instance.reset();

		Instance.then = Date.now();
		Instance.interval = setInterval(function() { Instance.mainLoop(); }, 1);
	}
};
