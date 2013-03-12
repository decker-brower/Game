(function(NameSpace)
{
	function Boots() { return true; };

	Boots.createInstance = function(canvas)
	{
		var Instance = new Boots();

		Instance.init(canvas);

		return Instance;
	};

	//inherits from Sprite Class
	Boots.prototype = new NameSpace.Class.Sprite;

	Boots.prototype.constructor = Boots;

	Boots.fn = Boots.prototype;

	Boots.fn.init = function(canvas)
	{
		this.canvas = canvas;
		this.image = new Image();
		this.image.src = "images/boots.png";
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

	Boots.fn.reset = function()
	{
		this.x = 32 + (Math.random() * (this.canvas.width - 64));
		this.y = 32 + (Math.random() * (this.canvas.height - 64));
	};

	NameSpace.Class.Boots = Boots;
})(GameWork);