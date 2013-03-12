(function(NameSpace)
{
	function Hero() { return true; };

	Hero.createInstance = function(canvas)
	{
		var Instance = new Hero();

		Instance.init(canvas);

		return Instance;
	};

	//inherits from Sprite Class
	Hero.prototype = new NameSpace.Class.Sprite;

	Hero.prototype.constructor = Hero;

	Hero.fn = Hero.prototype;

	Hero.fn.init = function(canvas)
	{
		this.canvas = canvas;
		this.image = new Image();
		this.image.src = "images/Hero_Sprite.png";
		this.imagesWidth = 96;
		this.animIndex = 0;
		this.speed = 256; //movement in pixels per second
		this.x = 0;
		this.y = 0;
		this.vector = NameSpace.Class.Vector.createInstance(0, 0);
		this.width = 32;
		this.height = 32;
		this.xStart = 0;
		this.xStop = this.width;
		this.yStart = 0;
		this.yStop = this.height;

		GoblinChaser.gameObjects.push(this);

		this.reset();
	};

	Hero.fn.move = function(modifier)
	{
		for (var i in GoblinChaser.keysDown)
		{
			switch (parseInt(i))
			{
				case 37: // Player holding left
					this.x -= this.speed * modifier;

					if (this.animIndex === 3)
						this.animIndex = 0;

					this.changeImage(1, this.animIndex);
					this.animIndex += 1;
					break;
				case 39: // Player holding right
					this.x += this.speed * modifier;

					if (this.animIndex === 3)
						this.animIndex = 0;

					this.changeImage(2, this.animIndex);
					this.animIndex += 1;
					break;
				case 38: // Player holding up
					this.y -= this.speed * modifier;

					this.x += this.vector.x;
					this.y += this.vector.y;

					if (this.animIndex === 3)
						this.animIndex = 0;

					this.changeImage(3, this.animIndex);
					this.animIndex += 1;
					break;
				case 40: // Player holding down
					this.y += this.speed * modifier;

					if (this.animIndex === 3)
						this.animIndex = 0;

					this.changeImage(0, this.animIndex);
					this.animIndex += 1;
					break;
				default:
					continue;
			};
		};

		//if Hero leaves the canvas wrap him around to the other side
		if (this.x > this.canvas.width)
			this.x = -32;

		if (this.y > this.canvas.height)
			this.y = -32;

		if (this.x < -32)
			this.x = this.canvas.width;

		if (this.y < -32)
			this.y = this.canvas.height;
	};

	Hero.fn.collide = function(gameObj)
	{
		switch (gameObj.constructor.name)
		{
			case "Goblin":
				gameObj.destroy();
				GoblinChaser.Score.points += 10;
				GoblinChaser.Score.goblinsCaught += 1;
				break;
			case "Octo":
				GoblinChaser.reset();
				break;
			case "Boots":
				gameObj.reset();
				this.changeSpeed(50);
				break;
			default:
				break;
		}
	};

	Hero.fn.reset = function()
	{
		this.speed = 256; //movement in pixels per second
		this.x = this.canvas.width / 2;
		this.y = this.canvas.height / 2;
	};

	NameSpace.Class.Hero = Hero;
})(GameWork);