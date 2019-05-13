var MAX_POINTS = 25;

var whiteFillStyle = "rgba(255, 255, 255, 1)";

var requestAnimationFrame = window.requestAnimationFrame || window.mozRequestAnimationFrame || window.webkitRequestAnimationFrame || window.msRequestAnimationFrame;

var canvas = document.getElementById("animated-floaters");
var context = canvas.getContext('2d');

var introSection = document.querySelector("section.intro");


Number.prototype.clamp = function(min, max) {
  return Math.min(Math.max(this, min), max);
};

function getRandomFloat(min, max) {
  return Math.random() * (max - min) + min;
}


var dpr;
var adjustedDpr;
var globalWidth;
var globalHeight;

function rescale() {
  dpr = window.devicePixelRatio || 1;
  adjustedDpr = dpr;

  if (adjustedDpr >= 2) {
    adjustedDpr = 1.25;
  }

  globalWidth  = window.innerWidth;
  globalHeight = window.innerHeight;
  canvas.setAttribute("width", globalWidth * adjustedDpr);
  canvas.setAttribute("height", globalHeight * adjustedDpr);
  context.scale(adjustedDpr, adjustedDpr);
}

rescale();


window.addEventListener('resize', rescale);


function drawCircle(x, y, radius, strokeStyle) {
  context.beginPath();
  context.setLineDash([]);
  context.arc(x, y, radius, 0, 2 * Math.PI, false);
  context.strokeStyle = strokeStyle;
  context.stroke();
}

function getMousePos(canvas, evt) {
  var rect = canvas.getBoundingClientRect();
  return {
    x: (evt.clientX - rect.left),
    y: (evt.clientY - rect.top)
  };
}

mousePos = {x: 0, y: 0};
mainDotPos = {x: 0, y: 0};
mouseOnCanvas = true;

introSection.addEventListener('mousemove', function(evt) {
  mousePos = getMousePos(canvas, evt);
}, false);

introSection.addEventListener('mouseover', function(evt) {
  mouseOnCanvas = true;
}, false);

introSection.addEventListener('mouseout', function(evt) {
  mouseOnCanvas = false;
}, false);

var iterator = 0;

var Point = function(x,y) {
  this.reset = function() {
    this.maxSpeed = 7;

    this.lifetimeMax = getRandomFloat(5, 20);
    this.lifetime = 0;

    this.fullFadeTime = getRandomFloat(0, 5);
    this.fullFadeStopTime = this.lifetimeMax - (getRandomFloat(2, 5));

    this.sizeMax = 30;

    this.x = x;
    this.y = y;

    this.fullSize = (this.y / globalHeight) * this.sizeMax;

    if(this.fullSize < this.sizeMax/2) {
      this.maxSpeed = 9;
    }

    this.speed_x = getRandomFloat(-this.maxSpeed, this.maxSpeed);
    this.speed_y = getRandomFloat(-this.maxSpeed, this.maxSpeed);

    this.opacityMax = getRandomFloat(0, 0.15);

    if(this.fullSize < 3) {
      this.opacityMax = getRandomFloat(0.15, 0.3);
    }
  }

  this.move = function(deltaTime) {
    if(this.isDead()) {
      this.reset();
    }

    this.x += this.speed_x * deltaTime;
    this.y += this.speed_y * deltaTime;

    this.lifetime += deltaTime;

    this.mouseDistance = Math.sqrt(Math.pow(mainDotPos.x - this.x, 2) + Math.pow(mainDotPos.y - this.y, 2));
  }

  this.draw = function() {
    this.size = this.fullSize;

    if(this.lifetime < this.fullFadeTime) {
      this.opacity = this.opacityMax * (this.lifetime / this.fullFadeTime);

    } else if(this.lifetime > this.fullFadeStopTime) {
      var max = (this.lifetimeMax - this.fullFadeStopTime);
      var cur = (this.lifetime - this.fullFadeStopTime);

      this.opacity = this.opacityMax - this.opacityMax * (cur / max);
    } else {
      this.opacity = this.opacityMax;
    }

    var fillstyle = "rgba(255, 255, 255, "+this.opacity+")";
    drawCircle(this.x, this.y, this.size, fillstyle);
  }

  this.isDead = function() {
    if(this.lifetime > this.lifetimeMax) {
      return true;
    }
    return false;
  }

  this.drawMouseLine = function() {
    if(this.mouseDistance < 180 && mouseOnCanvas) {
      strokeOpacity = (180.0 - this.mouseDistance)/180.0;
      strokeOpacity = strokeOpacity.clamp(0, 0.6);

      var baseStrokeStyle = "rgba(255, 255, 255, "+strokeOpacity+")";
      var circleSize = 3
      drawCircle(this.x, this.y, circleSize, baseStrokeStyle);

      strokeOpacity = strokeOpacity * 0.3;
      strokeStyle = "rgba(255, 255, 255, "+strokeOpacity+")";
      circleSize = this.fullSize / 2.0;
      drawCircle(this.x, this.y, circleSize, strokeStyle);

      context.beginPath();
      context.moveTo(this.x, this.y);
      context.lineTo(mainDotPos.x, mainDotPos.y);
      context.strokeStyle = strokeStyle;
      context.setLineDash([5, 20])
      context.lineWidth = 3;
      context.lineCap = "round";
      context.stroke();
    }
  }
}

var pointsArray = new Array(MAX_POINTS);

for(n = 0; n < MAX_POINTS; n++) {
    var point = new Point(getRandomFloat(0, globalWidth), getRandomFloat(0, globalHeight));
    point.reset();
    pointsArray[n] = point;
}

var lastFrameTime = Date.now();

function draw() {
  var currentFrameTime = Date.now();
  var deltaTime = (currentFrameTime - lastFrameTime)/1000.0;
  lastFrameTime = currentFrameTime;

  context.clearRect(0, 0, globalWidth, globalHeight);
  let diff = {x: 0, y: 0}
  diff = {
    x: mainDotPos.x - mousePos.x,
    y: mainDotPos.y - mousePos.y
  }

  mainDotPos = {
    x: mainDotPos.x - diff.x / 10,
    y: mainDotPos.y - diff.y / 10
  }

  for(n=0; n<MAX_POINTS; n++) {
    var point = pointsArray[n];
    point.move(deltaTime);
    point.drawMouseLine();
    point.draw();
  }

  if(mouseOnCanvas) {


    drawCircle(mainDotPos.x, mainDotPos.y, 3, whiteFillStyle);
  }
}

setInterval(draw, 20);



