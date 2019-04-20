var MAX_POINTS = 30;

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
var globalWidth;
var globalHeight;

function rescale() {
  dpr = window.devicePixelRatio || 1;
  globalWidth  = window.innerWidth;
  globalHeight = window.innerHeight;
  canvas.setAttribute("width", globalWidth * dpr);
  canvas.setAttribute("height", globalHeight * dpr);
  context.scale(dpr, dpr);
}

rescale();


window.addEventListener('resize', rescale);


function drawCircle(x, y, radius, fillstyle) {
  context.beginPath();
  context.arc(x, y, radius, 0, 2 * Math.PI, false);
  context.fillStyle = fillstyle;
  context.fill();
}

function getMousePos(canvas, evt) {
  var rect = canvas.getBoundingClientRect();
  return {
    x: (evt.clientX - rect.left),
    y: (evt.clientY - rect.top)
  };
}

mousePos = {x: 0, y: 0};
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

    this.fullSize = (this.y/context.canvas.height)*this.sizeMax;

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

    this.x += this.speed_x*deltaTime;
    this.y += this.speed_y*deltaTime;

    this.lifetime += deltaTime;

    this.mouseDistance = Math.sqrt(Math.pow(mousePos.x - this.x, 2) + Math.pow(mousePos.y - this.y, 2));
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

      var strokeStyle = "rgba(255, 255, 255, "+strokeOpacity+")";

      var circleSize = this.fullSize / 2.0;

      drawCircle(this.x, this.y, circleSize, strokeStyle);

      context.beginPath();
      context.moveTo(this.x, this.y);
      context.lineTo(mousePos.x, mousePos.y);
      context.strokeStyle = strokeStyle;
      context.lineWidth = 2;
      context.lineCap = "round";
      context.stroke();
    }
  }
}

var pointsArray = new Array(MAX_POINTS);

for(n=0; n<MAX_POINTS; n++) {
    var point = new Point(getRandomFloat(0, globalWidth), getRandomFloat(0, globalHeight));
    point.reset();
    pointsArray[n] = point;
}

var lastFrameTime = Date.now();

function draw() {
  //context.save();
  //context.scale(dpr, dpr);

  var currentFrameTime = Date.now();
  var deltaTime = (currentFrameTime - lastFrameTime)/1000.0;
  lastFrameTime = currentFrameTime;

  context.clearRect(0, 0, globalWidth, globalHeight);

  //circleSize = iterator/20.0;
  //circleSize.clamp(5, 15);

  for(n=0; n<MAX_POINTS; n++) {
    var point = pointsArray[n];
    point.move(deltaTime);
    point.drawMouseLine();
    point.draw();
  }


  //iterator++;


  if(mouseOnCanvas) {
    drawCircle(mousePos.x, mousePos.y, 2, whiteFillStyle);
  }

  //context.restore();
}

setInterval(draw,30);



// --- Menu color

var menuChanged = false;
var menuElement = $("#menu");

var offset = $("#introduction").offset();

$(document).scroll(function() {

  var offsetTop = offset.top;


  var scrollTop = $(this).scrollTop();
  if(scrollTop > (offsetTop - 100)) {
    if(menuChanged == false) {
      $("#arrow-down").fadeOut();
      menuChanged = true;
      menuElement.addClass("menu-white");
    }
  } else if(scrollTop < offsetTop - 100) {
    if(menuChanged == true) {
      $("#arrow-down").fadeIn();
      menuChanged = false;
      menuElement.removeClass("menu-white");
    }
  }

  $('a[href*=#]').smoothScroll({easing: 'easeOutExpo',
  speed: 1600, offset: -68});

});


$(document).ready(function(){
  $(".hover-animated").hover(function(){
    $(this).addClass("animated " + $(this).data("animation"));
  }, function(){
    $(this).removeClass("animated " + $(this).data("animation"));
  });
});
