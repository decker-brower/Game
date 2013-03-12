(function(NameSpace)
{
	function Octo() { return true; };

	Octo.createInstance = function(canvas)
	{
		var Instance = new Octo();

		Instance.init(canvas);

		return Instance;
	};

	//inherits from Sprite Class
	Octo.prototype = new NameSpace.Class.Sprite;

	Octo.prototype.constructor = Octo;

	Octo.fn = Octo.prototype;

	Octo.fn.init = function(canvas)
	{
		this.canvas = canvas;
		this.image = new Image();
		this.image.src = 'images/Ninja_Sprite.png';
		this.imagesWidth = 96;
		this.animIndex = 0;
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

	Octo.fn.move = function(modifier)
	{
		var vec = NameSpace.Class.Vector.createInstance(GoblinChaser.gameObjects[0].x - this.x, GoblinChaser.gameObjects[0].y - this.y);
		
		vec.normalize();

		this.vector.add(vec);
		this.vector.scale(modifier);

		this.x += this.vector.x;
		this.y += this.vector.y;

		if (this.animIndex === 3)
			this.animIndex = 0;

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

		//bounce Octo off the sides of the canvas
		if (this.x > this.canvas.width)
			this.x = -32;

		if (this.y > this.canvas.height)
			this.y = -32;

		if (this.x < -32)
			this.x = this.canvas.width;

		if (this.y < -32)
			this.y = this.canvas.height;
	};

	Octo.fn.changeSpeed = function(modifier)
	{
		this.speed += modifier;

		if (this.speed >= 600)
			this.speed = 600;
		else if (this.speed <= 50)
			this.speed = 50;
	};

	Octo.fn.collide = function(gameObj)
	{
		switch (gameObj.constructor.name)
		{
			case "Hero":
				gameObj.reset();
				break;
			case "Goblin":
				break;
			case "Boots":
				break;
			default:
				break;
		}
	};

	Octo.fn.reset = function()
	{
		this.vector = NameSpace.Class.Vector.createInstance(0, 0);
		this.x = 32 + (Math.random() * (this.canvas.width - 64));
		this.y = 32 + (Math.random() * (this.canvas.height - 64));
	};

	NameSpace.Class.Octo = Octo;
})(GameWork);