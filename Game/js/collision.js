var bounce = function( obj1, obj2 ) {
    var colnAngle = Math.atan2( obj1.y - obj2.y, obj1.x - obj2.x ),
        length1 = obj1.vector.length(),
        length2 = obj2.vector.length(),
        dirAngle1 = Math.atan2( obj1.vector.y, obj1.vector.x ),
        dirAngle2 = Math.atan2( obj2.vector.y, obj2.vector.x ),
        newVX1 = length1 * Math.cos( dirAngle1 - colnAngle ),
        newVX2 = length2 * Math.cos( dirAngle2 - colnAngle );
    
    obj1.vector.y = length1 * Math.sin( dirAngle1 - colnAngle );
    obj2.vector.y = length2 * Math.sin( dirAngle2 - colnAngle );
    obj1.vector.x = ( ( obj1.mass - obj2.mass ) * newVX1 + ( 2 * obj2.mass) * newVX2 ) / ( obj1.mass + obj2.mass );
    obj2.vector.y = ( ( obj2.mass - obj1.mass ) * newVX2 + ( 2 * obj1.mass) * newVX1 ) / ( obj1.mass + obj2.mass );
    obj1.vector.rotate( colnAngle );
    obj2.vector.rotate( colnAngle );
  };

var bounce2 = function(ball1, ball2)
{
	var colnAngle = Math.atan2(ball1.y - ball2.y, ball1.x - ball2.x),
		dirAngle1 = Math.atan2(ball1.vector.y, ball1.vector.x),
		length1 = ball1.vector.length();
	ball1.vector.x = length1 * Math.cos(dirAngle1 - colnAngle) * -0.1;
	ball1.vector.y = length1 * Math.sin(dirAngle1 - colnAngle);
	ball1.vector.rotate(colnAngle);
};

var collideAll = function() {
    var vec = vector2d( 0, 0 ),
        dist, gameObj1, gameObj2, c, i;
    //Check each object against every other object
    for ( var c = 0; c < gameObjects.length; c++ ) {
        gameObj1 = gameObjects[c];
        //the inner loop starts at one past the outer loop
        //to ensure efficient one-way testing: A against B but not B against A
        for( i = c + 1; i < gameObjects.length; i++ ) {
            gameObj2 = gameObjects[i];
            //get the distance between the two objects
            vec.vx = gameObj2.x - gameObj1.x;
            vec.vy = gameObj2.y - gameObj1.y;
            dist = vec.length();
            //if distance < sum of the two radii then we have a collision
            if( dist < gameObj1.radius + gameObj2.radius ) {
                //move objects apart so they are no longer intersecting but flush against each other
                vec.normalize();
                vec.scale( gameObj1.radius + gameObj2.radius - dist );
                vec.negate();
                gameObj1.x += vec.vx;
                gameObj2.y += vec.vy;
                //bounce the two colliding objects
                bounce( gameObj1, gameObj2 );
            }
        }
    }
}