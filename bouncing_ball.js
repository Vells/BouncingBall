// JavaScript Animation Tutorial
// Vela Dimitrova Mineva
// Date: 04/28/2015

var context;
var canvas;

// Coordinates of starting location for paddle
var initialX = 200; 
var initialY = 400;

// Intial Paddle Characteristics
var paddle;
var paddleWidth = 130;
var paddleHeight = 15;
var paddleColor = "#0F032B";

// Initial Ball Characteristics
var ball;
var ballColor = "#3C0A4D";
var ballRadius = 20;

var playing;
var mouseX, mouseY;


/* A Ball Class */
function Ball(x, y, r, color) {
	this.x = x;
	this.y = y;
	this.dx = 2;
	this.dy = 2;
	this.radius = r;
	this.color = color;
}

// A function that changes the direction (and the color) of the ball 
// if it hits a wall or the paddle.
Ball.prototype.checkBoundaries = function() {
	if (this.x - this.radius < 0 || this.x + this.radius > canvas.width) {
		this.dx = -this.dx;
		this.color = getRandomColor();
	}
	if (this.y - this.radius < 0) {
		this.dy = -this.dy;
		this.color = getRandomColor();
	}
	if (this.y + this.radius > paddle.y && this.x + this.radius > paddle.x && 
		this.x - this.radius < paddle.x + paddle.width)
		this.dy = -this.dy;
}

// A function that draws a ball.
Ball.prototype.draw = function(context) {
	this.checkBoundaries();
	context.beginPath()
	context.fillStyle = this.color;
	context.arc(this.x, this.y, this.radius, 0, Math.PI*2, true);
	context.closePath();
	context.fill();
}

/* A Paddle Class */
function Paddle(x, y, width, height, color) {
	this.x = x;
	this.y = y;
	this.width = width;
	this.height = height;
	this.color = color;
	this.dx = 20;
	this.radius = 5;
}

/*
A function that draws a paddle
Source: http://www.scriptol.com/html5/canvas/rounded-rectangle.php
*/
Paddle.prototype.draw = function(context) {
	var r = this.x + this.width;
  	var b = this.y + this.height;
  	context.beginPath();
  	context.fillStyle = this.color;
	context.lineWidth="4";
	context.moveTo(this.x + this.radius, this.y);
	context.lineTo(r - this.radius, this.y);
	context.quadraticCurveTo(r, this.y, r, this.y + this.radius);
	context.lineTo(r, this.y + this.height - this.radius);
	context.quadraticCurveTo(r, b, r - this.radius, b);
	context.lineTo(this.x + this.radius, b);
	context.quadraticCurveTo(this.x, b, this.x, b - this.radius);
	context.lineTo(this.x, this.y + this.radius);
	context.quadraticCurveTo(this.x, this.y, this.x + this.radius, this.y);
	context.closePath();
	context.fill();
}

function initializeState() {
	playing = false;
	dragging = false;
	context.clearRect(0, 0, canvas.width, canvas.height);
	ball = new Ball(initialX + 2 * ballRadius, initialY - ballRadius, 
					ballRadius, ballColor);
	paddle = new Paddle(initialX, initialY, 
						paddleWidth, paddleHeight, paddleColor);
}

// A function that facilitates paddle movement upon key
function doKeyDown(evnt) {
	// If left key is pressed
	if (evnt.keyCode == 37) {
    	if (paddle.x - dxPaddle > 0) {
      		paddle.x -= dxPaddle;
      	}
    }
  	else if (evnt.keyCode == 39) {
    	if (paddle.x + paddle.width + dxPaddle < canvas.width) {
      		paddle.x += dxPaddle;
      	}
    }
}

// A helper function that returns the coordinates of the mouse 
// with respect to the canvas.
function getMousePos(canvas, evnt) {
	var rect = canvas.getBoundingClientRect();
    return {
    	x: evnt.clientX - rect.left,
        y: evnt.clientY - rect.top
    };
}

// A function that listens for mouse movements that result
// in moving the paddle
function onMouseMoveListener(evnt) {
	if (playing && dragging) {
		var mousePos = getMousePos(canvas, evnt);
		paddle.x = mousePos.x - paddle.width/2;
	}
}

// A function that listens for a pressed mouse and
// indicates that the mouse is being dragged
function onMouseDownListener(evnt) {
	// Getting mouse position correctly, being mindful of resizing 
	// that may have occured in the browser:
	var mousePos = getMousePos(canvas, evnt);
	mouseX = mousePos.x;
	mouseY = mousePos.y;

	if (playing && hitTest(paddle, mouseX, mouseY)) {
		dragging = true;
	}
}

// A helper function that checks if the mouse is on the paddle
function hitTest(paddle, mouseX, mouseY) {
	var horizontalCheck = (mouseX > paddle.x) && 
	                      (mouseX < paddle.x + paddle.width);
	return horizontalCheck;
}

// A function that listens for mouse release and 
// disables the "dragging" mode
function onMouseUpListener(evnt) {
	if (dragging && playing)
		dragging = false;
}

// Methods called when the corresponding button is pressed
function start() {
	playing = true;
}

function pause() {
	playing = false;
}

function reset() {
	// The clearInterval() method is used to stop further executions 
	// of the function specified in the setInterval() method 
	window.clearInterval(timer);
	init();
}

// the "Main" function
function init() {
	canvas = document.getElementById("myCanvas");
	context = canvas.getContext('2d');
	initializeState();
	ball.draw(context);
	paddle.draw(context);
	timer = setInterval(draw, 10);

	canvas.addEventListener("mousemove", onMouseMoveListener, false);
	canvas.addEventListener("mouseup", onMouseUpListener, false);
	canvas.addEventListener("mousedown", onMouseDownListener, false);
	canvas.addEventListener("keydown", doKeyDown, false);
}

// A function that draws a circle
function draw() {

	if ((ball.x + ball.radius < paddle.x || 
		 ball.x - ball.radius > paddle.x + paddle.width) &&
		ball.y + ball.radius > paddle.y) {
		playing = false;
		context.fillStyle = "black";
  		context.font = "normal 25px Verdana";
  		context.textAlign = "center";
  		context.fillText("Go outside and enjoy the sun!", canvas.width/2, 200);
	}

	if (playing) {
		// Update ball location
		ball.x += ball.dx;
		ball.y += ball.dy;
		getSurprise()
		// Clear the canvas
		context.clearRect(0, 0, canvas.width, canvas.height);
		// Draw ball and paddle
		ball.draw(context);
		paddle.draw(context);
	}
}

function getSurprise() {
	if (new Date().getTime() % 100 == 0) {
		var surprise = Math.floor(Math.random() * 7);
		switch(surprise) {
			case 0:
				if (ball.dx <= 7 && ball.dx != -1) ball.dx += 1;
			case 1:
				if (ball.dx > 7 && paddle.width >= 10) paddle.width -= 5;
			case 2:
				if (paddle.width <= 60) paddle.width += 3;
			case 3:
				if (paddle.width >= 10) paddle.width -= 5;
			case 4:
				if (ball.dx > -7 && ball.dx != 1) ball.dx -= 1;
			case 5:
				if (ball.radius >= 10) ball.radius -= 3;
			case 6:
				if (ball.radius <= 30) ball.radius += 2;
		}
	}
}

function getRandomColor() {
	var red = Math.floor(Math.random() * 256);
	var green = Math.floor(Math.random() * 256);
	var blue = Math.floor(Math.random() * 256);
	var opacity = 0.7;
	return 'rgba(' + red + ', ' + blue + ', ' + green + ',' + opacity + ')';
}