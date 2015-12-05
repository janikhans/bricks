//Setting up the canvas
var canvas = document.getElementById("myCanvas");
//Sets the canvas up into x and y plane
var ctx = canvas.getContext("2d");

//defining x and y coordinates
var x = canvas.width/2;
var y = canvas.height-30;

//make it appear the ball is moving by this amount. Added on every iteration of the draw function
var dx = 2;
var dy = -2;

//Setting up our paddle / platform
var paddleHeight = 10;
var paddleWidth = 70;
var paddleX = (canvas.width-paddleWidth)/2; // relative horizontal space around paddle

//variable to define ball radius to help with edge detection
var ballRadius = 10;
var ballColor = ranBallColor();

//setting up controls
var rightPressed = false;
var leftPressed = false;

//setting up bricks
var brickRowCount = 3;
var brickColumnCount = 5;
var brickWidth = 75;
var brickHeight = 20;
var brickPadding = 10;
var brickOffsetTop = 30;
var brickOffsetLeft = 30;

//score! woohoo
var score = 0;

//And lives! more wohoo!
var lives = 3;

//setup listeners for the keystrokes
document.addEventListener("keydown", keyDownHandler, false);
document.addEventListener("keyup", keyUpHandler, false);
document.addEventListener("mousemove", mouseMoveHandler, false);


//an array to hold all the bricks and their locations
var bricks = [];
for ( c = 0; c < brickColumnCount; c++) {
bricks[c] = [];
for (r = 0; r < brickRowCount; r++) {
    bricks[c][r] = { x:0, y: 0, status: 1};
}
}

//like the name implies, this function will draw out each brick to the canvas.
function drawBricks() {
for ( c = 0; c < brickColumnCount; c++) {
    for ( r = 0; r < brickRowCount; r++) {
        if ( bricks[c][r].status == 1) {
            var brickX = (c*(brickWidth+brickPadding))+brickOffsetLeft;
            var brickY = (r*(brickHeight+brickPadding))+brickOffsetTop;
            bricks[c][r].x = brickX;
            bricks[c][r].y = brickY;
            ctx.beginPath();
            ctx.rect(brickX, brickY, brickWidth, brickHeight);
            ctx.fillStyle = "#0095DD";
            ctx.fill();
            ctx.closePath();
        }
    }
}
}

//ball code, size color etc.
function drawBall() {
ctx.beginPath();
ctx.arc(x,y,ballRadius,0, Math.PI*2);
ctx.fillStyle = ballColor;
ctx.fill();
ctx.closePath();
}

//should be obvious.
function drawPaddle() {
ctx.beginPath();
ctx.rect(paddleX, canvas.height-paddleHeight, paddleWidth, paddleHeight);
ctx.fillStyle = '#0095DD';
ctx.fill();
ctx.closePath();
}

function drawScore() {
ctx.font = "16px Arial";
ctx.fillStyle = "#0095DD";
ctx.fillText("Score: " + score, 8, 20);
}

function drawLives() {
ctx.font = "16px Arial";
ctx.fillstyle = "#0095DD";
ctx.fillText("Lives " + lives, canvas.width-65, 20);
}


function ranBallColor() {
ballColor = '#'+Math.floor(Math.random()*16777215).toString(16);
}

//the handlers for the keystrokes
function keyDownHandler(e) {
if (e.keyCode == 39) {
    rightPressed = true;
} else if (e.keyCode == 37) {
    leftPressed = true;
}
}

function keyUpHandler(e) {
if (e.keyCode == 39) {
    rightPressed = false;
} else if (e.keyCode == 37) {
    leftPressed = false;
}
}

//handler for mouse movements
function mouseMoveHandler(e) {
var relativeX = e.clientX - canvas.offsetLeft;
if(relativeX > 0 && relativeX < canvas.width) {
    paddleX = relativeX - paddleWidth/2;
}
}

function collisionDetection() {
for(c=0; c<brickColumnCount; c++) {
    for(r=0; r<brickRowCount; r++) {
        var b = bricks[c][r];
        if(b.status == 1) {
            if(x > b.x && x < b.x+brickWidth && y > b.y && y < b.y+brickHeight) {
                dy = -dy;
                b.status = 0;
                ranBallColor();
                score++;
                if ( score == brickColumnCount*brickRowCount) {
                    alert("You win this awesome game!");
                    document.location.reload();
                }
            }
        }
    }
}
}


//This will draw to our canvas
function draw() {
ctx.clearRect(0,0, canvas.width, canvas.height);
drawBricks();
drawBall();
drawPaddle();
drawScore();
drawLives();
collisionDetection();
x += dx;
y += dy;
//Reverse the ball if it finds the edges of the canvas
if (x + dx > canvas.width-ballRadius || x + dx < ballRadius) {
    dx = -dx;
}
if (y + dy < ballRadius) {
    dy = -dy;
} else if (y + dy > canvas.height-ballRadius ) {
    if (x > paddleX && x < paddleX + paddleWidth) {
        dy = -dy;
//                dy += -1;
//                dx += 1;
    } else {
        lives--;
        if (!lives) {
            alert("GAME OVER! You scored " + score + " points.");
            document.location.reload();
        } else {
            x = canvas.width/2;
            y = canvas.height-30;
            dx = 2;
            dy = -2;
            paddleX = (canvas.width-paddleWidth)/2;
        }
    }
}
if (rightPressed && paddleX < canvas.width-paddleWidth) {
    paddleX += 7;
}
if (leftPressed && paddleX > 0) {
    paddleX += -7;
}
requestAnimationFrame(draw);
}

draw();