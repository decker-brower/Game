(function(NameSpace)
{
	function Goblin() { return true; };

	Goblin.createInstance = function(canvas)
	{
		var Instance = new Goblin();

		Instance.init(canvas);

		return Instance;
	};

	//inherits from Sprite Class
	Goblin.prototype = new NameSpace.Class.Sprite;

	Goblin.prototype.constructor = Goblin;

	Goblin.fn = Goblin.prototype;

	Goblin.fn.init = function(canvas)
	{
		this.canvas = canvas;
		this.image = new Image();
		this.image.src = "images/Catgirl_Sprite.png";
		this.imagesWidth = 96;
		this.animIndex = 0;
		this.x = 0;
		this.y = 0;
		this.vector = NameSpace.Class.Vector.createInstance(0, 0);
		this.goToX = GameWork.getRandomInt(0, this.canvas.width);
		this.goToY = GameWork.getRandomInt(0, this.canvas.height);
		this.width = 32;
		this.height = 32;
		this.xStart = 0;
		this.xStop = this.width;
		this.yStart = 0;
		this.yStop = this.height;
		this.removeMe = false;

		GoblinChaser.gameObjects.push(this);

		this.reset();
	};

	Goblin.fn.move = function(modifier)
	{
		var vec = NameSpace.Class.Vector.createInstance(this.goToX - this.x, this.goToY - this.y);
		vec.normalize();

		this.vector.add(vec);
		this.vector.scale(modifier);
		this.x += this.vector.x;
		this.y += this.vector.y;

		if (this.animIndex === 3)
		{
			this.animIndex = 0;
		}

		if (this.vector.x < 0)
		{
			this.changeImage(1, this.animIndex);
			this.animIndex += 1;
		}
		else
		{
			this.changeImage(2, this.animIndex);
			this.animIndex += 1;
		}

		//if Goblin leaves the canvas wrap him around to the other side
		if (this.x + 30 > this.canvas.width)
			this.destroy();

		if (this.y + 32 > this.canvas.height)
			this.destroy();

		if (this.x < -30)
			this.destroy();

		if (this.y < -32)
			this.destroy();
	};

	Goblin.fn.collide = function(gameObj)
	{
		switch (gameObj.constructor.name)
		{
			case "Hero":
				this.reset();
				break;
			case "Goblin":
				break;
			case "Octo":
				break;
			case "Boots":
				break;
			default:
				break;
		};
	};

	Goblin.fn.reset = function()
	{
		this.vector = NameSpace.Class.Vector.createInstance(0, 0);
		this.goToX = GameWork.getRandomInt(0, this.canvas.width);
		this.goToY = GameWork.getRandomInt(0, this.canvas.height);
		this.x = 32 + (Math.random() * (this.canvas.width - 64));
		this.y = 32 + (Math.random() * (this.canvas.height - 64));
	};

	Goblin.fn.destroy = function()
	{
		this.removeMe = true;
	};

	NameSpace.Class.Goblin = Goblin;
})(GameWork);