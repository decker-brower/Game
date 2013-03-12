(function(window)
{
	// Convenient Inheritance
	Function.prototype.inheritsFrom = function(parentClassOrObject)
	{
		if (parentClassOrObject.constructor == Function)
		{
			//Normal Inheritance 
			this.prototype = new parentClassOrObject;
			this.prototype.constructor = this;
			this.prototype.parent = parentClassOrObject.prototype;
		}
		else
		{
			//Pure Virtual Inheritance 
			this.prototype = parentClassOrObject;
			this.prototype.constructor = this;
			this.prototype.parent = parentClassOrObject;
		}
		return this;
	}

	/***************************************************************************
	***************************** GameWork Class *******************************
	***************************************************************************/

	function GameWork() { return true; };

	GameWork.fn = GameWork.prototype;

	GameWork.fn.Class = {};

	// Get a random integer between a min a max range
	GameWork.fn.getRandomInt = function(min, max)
	{
		return Math.floor(Math.random() * (max - min + 1)) + min;
	};

	GameWork.fn.checkForCollisions = function(objArray)
	{
		var dist,
			gameObj1,
			gameObj2;

		//Check each object against every other object
		for (var n = 0; n < objArray.length; n++)
		{
			gameObj1 = objArray[n];

			/* the inner loop starts at one past the outer loop
			* to ensure efficient one-way testing: A against B but not B against A
			*/
			for (var i = n + 1; i < objArray.length; i++)
			{
				gameObj2 = objArray[i];

				if (
					gameObj1.x <= (gameObj2.x + gameObj2.width) &&
					gameObj2.x <= (gameObj1.x + gameObj1.width) &&
					gameObj1.y <= (gameObj2.y + gameObj2.height) &&
					gameObj2.y <= (gameObj1.y + gameObj1.height)
				)
				{
					gameObj1.collide(gameObj2);
				}
			}
		}
	};

	GameWork.fn.bounce = function(obj1, obj2)
	{
		var colnAngle = Math.atan2(obj1.y - obj2.y, obj1.x - obj2.x),
			length1 = obj1.vector.length(),
			length2 = obj2.vector.length(),
			dirAngle1 = Math.atan2(obj1.vector.y, obj1.vector.x),
			dirAngle2 = Math.atan2(obj2.vector.y, obj2.vector.x),
			newVX1 = length1 * Math.cos(dirAngle1 - colnAngle),
			newVX2 = length2 * Math.cos(dirAngle2 - colnAngle);

		obj1.vector.y = length1 * Math.sin(dirAngle1 - colnAngle);
		obj2.vector.y = length2 * Math.sin(dirAngle2 - colnAngle);
		obj1.vector.x = ((obj1.mass - obj2.mass) * newVX1 + (2 * obj2.mass) * newVX2) / (obj1.mass + obj2.mass);
		obj2.vector.y = ((obj2.mass - obj1.mass) * newVX2 + (2 * obj1.mass) * newVX1) / (obj1.mass + obj2.mass);
		obj1.vector.rotate(colnAngle);
		obj2.vector.rotate(colnAngle);
	};

	GameWork.fn.bounce2 = function(obj1, obj2)
	{
		var colnAngle = Math.atan2(obj1.y - obj2.y, obj1.x - obj2.x),
			dirAngle1 = Math.atan2(obj1.vec.y, obj1.vec.x),
			length1 = obj1.vec.length();

		obj1.vec.x = length1 * Math.cos(dirAngle1 - colnAngle) * -0.1;
		obj1.vec.y = length1 * Math.sin(dirAngle1 - colnAngle);
		obj1.vec.rotate(colnAngle);
		console.log("bounce");
	};

	GameWork.fn.mainLoop = function()
	{
		this.now = Date.now();
		this.delta = this.now - this.then;
		this.update(this.delta / 1600);
		this.render();
		this.then = this.now;
	};

	GameWork.fn.play = function()
	{
		// Let's play this game!
		var Instance = this;

		Instance.reset();

		Instance.then = Date.now();
		Instance.interval = setInterval(function() { Instance.mainLoop(); }, 1);
	};

	/***************************************************************************
	***************************** Vector Class *********************************
	***************************************************************************/

	function Vector() { return true; };

	Vector.createInstance = function(x, y)
	{
		var Instance = new Vector();

		Instance.init(x, y);

		return Instance;
	};

	Vector.inheritsFrom(Vector);

	Vector.fn = Vector.prototype;

	Vector.fn.init = function(x, y)
	{
		// x and y components of vector
		this.x = x;
		this.y = y;
	};

	//scale vector up or down
	Vector.fn.scale = function(scale)
	{
		this.x *= scale;
		this.y *= scale;
	};

	//add a vector
	Vector.fn.add = function(vector)
	{
		this.x += vector.x;
		this.y += vector.y;
	};

	//subtract a vector
	Vector.fn.subtract = function(vector)
	{
		this.x -= vector.x;
		this.y -= vector.y;
	};

	//point the vector in opposite direction
	Vector.fn.negate = function()
	{
		this.x = -this.x;
		this.y = -this.y;
	};

	//return the length of vector using Pythagorean theorem
	Vector.fn.length = function()
	{
		return Math.sqrt(this.x * this.x + this.y * this.y);
	};

	//a faster length calculation that returns the length squared.
	//usefull if all you want to know is that one vector is longer than the other
	Vector.fn.lengthSquared = function()
	{
		return this.x * this.x + this.y * this.y;
	};

	//change vector into unit length vector pointing in same direction
	Vector.fn.normalize = function()
	{
		var lenght = Math.sqrt(this.x * this.x + this.y * this.y);
		if (length)
		{
			this.x /= length;
			this.y /= length;
		}
		//return length just in case we might want it
		return length;
	};

	//rotate the vector by an angle specified in radians
	Vector.fn.rotate = function(angle)
	{
		var x = this.x,
            y = this.y,
            cosVal = Math.cos(angle),
            sinVal = Math.sin(angle);

		this.x = x * cosVal - y * sinVal;
		this.y = x * sinVal + y * cosVal;
	};

	//utility function for displaying the vector as text for debugging
	Vector.fn.toString = function()
	{
		return '( ' + this.x.toFixed(3) + ', ' + this.y.toFixed(3) + ' )';
	};

	GameWork.fn.Class.Vector = Vector;

	/***************************************************************************
	***************************** Sprite Class *********************************
	***************************************************************************/

	function Sprite() { return true; };

	Sprite.createInstance = function()
	{
		var Instance = new Sprite();

		Instance.init();

		return Instance;
	};

	Sprite.inheritsFrom(Sprite);

	Sprite.fn = Sprite.prototype;

	Sprite.fn.init = function(params)
	{
		this.width = params.width;
		this.height = params.height;
		this.imagesWidth = params.imagesWidth;
		this.imageIndex = 0;
		this.width = 32;
		this.height = 32;
		this.xStart = 0;
		this.xStop = this.width;
		this.yStart = 0;
		this.yStop = this.height;
		this.x = 0;
		this.y = 0;
		this.visible = true;
		this.remove = false;
	};

	Sprite.fn.changeSpeed = function(newSpeed)
	{
		this.speed += newSpeed;

		if (this.speed > 500)
			this.speed = 500;

		if (this.speed < 50)
			this.speed = 50;
	};

	Sprite.fn.collide = function(obj)
	{
		return true;
	}

	Sprite.fn.changeImage = function(row, col)
	{
		this.yStart = row * this.height;
		this.yStop = this.height;
		this.xStart = col * this.width;
		this.xStop = this.width;
	};

	Sprite.fn.show = function()
	{
		this.visible = true;
	};

	Sprite.fn.hide = function()
	{
		this.visible = false;
	};

	Sprite.fn.destroy = function()
	{
		this.remove = true;
	};

	GameWork.fn.Class.Sprite = Sprite;

	/***************************************************************************
	***************************** Canvas Class *********************************
	***************************************************************************/

	function Canvas() { return true; };

	Canvas.createInstance = function(params)
	{
		var Instance = new Canvas();

		Instance.init(params);

		return Instance;
	};

	Canvas.inheritsFrom(Canvas);

	Canvas.fn = Canvas.prototype;

	Canvas.fn.init = function(params)
	{
		this.canvas = document.createElement("canvas");
		this.ctx = this.canvas.getContext("2d");
		this.width = params.width;
		this.height = params.height;
		this.canvas.width = this.width;
		this.canvas.height = this.height;
	};

	Canvas.fn.drawSpriteObj = function(obj)
	{
		this.ctx.drawImage(obj.image, obj.xStart, obj.yStart, obj.xStop, obj.yStop, obj.x, obj.y, obj.width, obj.height);
	};

	Canvas.fn.drawBackground = function(img)
	{
		this.ctx.drawImage(img, 0, 0, this.canvas.width, this.canvas.height);
	};

	Canvas.fn.showText = function(params, x, y)
	{
		this.ctx.fillStyle = params.color;
		this.ctx.font = params.font;
		this.ctx.textAlign = params.align;
		this.ctx.textBaseline = params.baseLine;
		this.ctx.fillText(params.text, x, y);
	};

	Canvas.fn.reset = function()
	{
		// Store the current transformation matrix
		this.ctx.save();

		// Use the identity matrix while clearing the canvas
		this.ctx.setTransform(1, 0, 0, 1, 0, 0);
		this.ctx.clearRect(0, 0, this.width, this.height);

		// Restore the transform
		this.ctx.restore();
	};

	GameWork.fn.Class.Canvas = Canvas;

	/***************************************************************************
	****************************** Sound Class *********************************
	***************************************************************************/

	function Sound() { return true; };

	Sound.createInstance = function()
	{
		var Instance = new Sound();

		Instance.init();

		return Instance;
	};

	Sound.inheritsFrom(Sound);

	Sound.fn = Sound.prototype;

	Sound.fn.init = function()
	{
		this.disabled = true;
		this.goblinCaught = new Audio('sounds/goblin_caught.wav');
		this.speedBoost = new Audio('sounds/speedboost.wav');
		this.evilLaugh = new Audio('sounds/evil_laugh.mp3');
		this.backgroundMusic = new Audio('sounds/music.mp3');

		this.backgroundMusic.addEventListener('ended', function() { this.backgroundMusic.currentTime = 0; this.backgroundMusic.play(); });

		this.backgroundMusic.onload = function()
		{
			this.ready = true;
		};
	};

	Sound.fn.reset = function()
	{
		if (this.disabled)
			return false;

		this.backgroundMusic.currentTime = 0;
		this.backgroundMusic.play();
	};

	GameWork.fn.Class.Sound = Sound;

	/***************************************************************************
	****************************** Score Class *********************************
	***************************************************************************/

	function Score() { return true; };

	Score.createInstance = function()
	{
		var Instance = new Score();

		Instance.init();

		return Instance;
	};

	Score.inheritsFrom(Score);

	Score.fn = Score.prototype;

	Score.fn.init = function()
	{
		this.reset();
	};

	Score.fn.reset = function()
	{
		this.points = 0;
		this.goblinsCaught = 0;
	};

	GameWork.fn.Class.Score = Score;

	window.GameWork = new GameWork;
})(window);