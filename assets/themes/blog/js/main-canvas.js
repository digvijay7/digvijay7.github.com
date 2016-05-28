var heroReady;
var heroSprite = [];
var heroSpriteReady = [];
var currHeroIndex;
var heroImgLeft1;
var heroImgLeft2;
var heroImgLeft3;
var heroImgRight1;
var heroImgRight3;
var redButtonImg;
var redButtonReady;
var circleImg;
var circleReady;
var redButton = { x: 10, y: 425};
var heroLeftIndex = 1;
var heroRightIndex = 2;
var heroImg;
var heroImgRight1;
var backImg;
var backReady;
var hero;
var keysDown = {};
var canvas;
var ctx;
var w;
var then;
var sprite_change_modifier_sum = 0;
var angle_to_rotate = 0;
var net_modifier = 0;
var seconds_from_which_timer = 3;
var seconds_to_run = 14;
var start;
var canvasDivName;
var font_size=150;
function setup_main_canvas(div_name){
  canvas = document.createElement("canvas");
  ctx = canvas.getContext("2d");
  canvas.width = 512;
  canvas.height = 480;
  canvasDivName = '#' + String(div_name);
  $(canvasDivName).append(canvas);
  include_images();
  setup_background();
  setup_hero();
  setup_controls();
  w = window;
  requestAnimationFrame = w.requestAnimationFrame || w.webkitRequestAnimationFrame || w.msRequestAnimationFrame || w.mozRequestAnimationFrame;
  then = Date.now();
  start = then;
  reset();
  main();
}

function include_images(){
  heroImg = new Image();
  heroImgLeft1 = new Image();
  heroImgLeft2 = new Image();
  heroImgLeft3 = new Image();
  heroImgRight1 = new Image();
  var heroImgRight2 = new Image();
  heroImgRight3 = new Image();
  heroImg.onload = function () {
    heroReady = true;   
  };
  images_dir = '/assets/themes/blog/images'
  heroImg.src = "/assets/themes/blog/images/step1.png";
  heroImgLeft1.src = images_dir + '/step1.png';
  heroImgLeft2.src = images_dir + '/step2.png';
  heroImgLeft3.src = images_dir + '/step3.png';
  heroImgRight1.src = images_dir + '/step1_right.png'
  heroImgRight3.src = images_dir + '/step3_right.png'
  //heroSprite = [heroImgLeft3, heroImgLeft2, heroImgLeft1, heroImgRight1];
  heroSprite = [heroImgLeft3, heroImgLeft1, heroImgRight1, heroImgRight3];
  for (i=0;i<heroSprite.length; i++){
    heroSprite[i].onload = function () {  heroSpriteReady[this.index] = true; };
    heroSprite[i].index = i;
  }
  currHeroIndex = heroLeftIndex;
  backImg = new Image();
  backImg.onload = function () {
    backReady = true;
  };
  backImg.src = "/assets/themes/blog/images/back.png";
  redButtonImg = new Image();
  redButtonImg.onload = function() { redButtonReady = true; };
  redButtonImg.src = images_dir + '/red_button.png';
  circleImg = new Image();
  circleImg.onload = function() { circleReady = true; };
  circleImg.src = images_dir + '/circle2_smudged.jpg';
}

function setup_background(){
}

function setup_hero(){
  hero = {
    speed: 200,
    x: 0,
    y: 0,
    direction: 'left'
  };
}
function setup_controls(){
  addEventListener("keydown", function (e) {
    keysDown[e.keyCode] = true;
  }, false);

  addEventListener("keyup", function (e) {
    delete keysDown[e.keyCode];
  }, false);
}

var reset = function () {
  hero.x = canvas.width / 2;
  hero.y = canvas.height / 2;
}

var update = function (modifier) {
  if (38 in keysDown) { // Player holding up
    //hero.y -= hero.speed * modifier;
  }
  if (40 in keysDown) { // Player holding down
    //hero.y += hero.speed * modifier;
  }
  if (37 in keysDown) { // Player holding left
    hero.x -= hero.speed * modifier;
    next_sprite('left', modifier);
    rotate_circle('left', modifier);
  }
  if (39 in keysDown) { // Player holding right
    hero.x += hero.speed * modifier;
    next_sprite('right', modifier);
    rotate_circle('right', modifier);
  }
}

function rotate_circle(direction, modifier){
  if ( direction == 'left' ) { net_modifier += modifier; }
  else if ( direction == 'right') { net_modifier -= modifier; }
  angle_to_rotate = 60 * net_modifier;
  //if ( (direction == 'right' && angle_to_rotate > 0) || (direction == 'left' && angle_to_rotate < 0) ) angle_to_rotate *= -1;
}
function next_sprite(direction, modifier){
  if (hero.direction != direction){
    if (direction == 'left'){
      currHeroIndex = heroLeftIndex;
      hero.direction = direction;
      sprite_change_modifier_sum = 0;
    }
    else if(direction == 'right'){
      currHeroIndex = heroRightIndex;
      hero.direction = direction;
      sprite_change_modifier_sum = 0;
    }
  }
  else { // direction same as before
    // got next sprite
    sprite_change_modifier_sum += modifier;
    if(direction == 'left'){
      if (sprite_change_modifier_sum > 0.1) { currHeroIndex--; sprite_change_modifier_sum = 0;}
    }
    else if( direction == 'right'){
      if (sprite_change_modifier_sum > 0.1) { currHeroIndex++; sprite_change_modifier_sum = 0;}
    }
    if (currHeroIndex < 0) { currHeroIndex = heroLeftIndex; }
    else if (currHeroIndex >= heroSprite.length) { currHeroIndex = heroRightIndex; }
  }
}
var render = function () {
  if (backReady){
    ctx.drawImage(backImg, 0, 0);
  }
  if (circleReady){
    ctx.save();
    offsetX = (canvas.width /2 ) - (circleImg.width / 2);
    offsetY = -25;
    objectRotationCenterX = (circleImg.width / 2) + offsetX;
    objectRotationCenterY = (circleImg.height / 2) + offsetY;
    ctx.translate(objectRotationCenterX, objectRotationCenterY);
    ctx.rotate( Math.PI / 180 * (angle_to_rotate));
    ctx.translate( -objectRotationCenterX, -objectRotationCenterY );
    //ctx.drawImage(circleImg, - circleImg.width / 2 , - circleImg.height / 2, circleImg.width, circleImg.height);
    ctx.drawImage(circleImg, offsetX , offsetY);
    ctx.restore();
  }
  if (heroSpriteReady[currHeroIndex]) {
    ctx.drawImage(heroSprite[currHeroIndex], hero.x, hero.y);
  }
  // Draw timer
  if ( (Date.now() - start ) / 1000 > seconds_from_which_timer){
    ctx.save();
    ctx.beginPath();
    ctx.fillStyle = "white";
    ctx.globalAplha = 0.50;
    var seconds_elapsed = (( Date.now() - start ) /1000);
    var seconds_left = Math.floor(seconds_to_run - seconds_elapsed);
    ctx.font = (font_size - seconds_left)+"px Verdana";
    ctx.fillText( seconds_left, canvas.width / 2 - font_size / 2, canvas.height / 2) ;
    ctx.restore();
  }


  if (redButtonReady) {
    //ctx.drawImage(redButtonImg, redButton.x, redButton.y, 50, 40);
  }

}

var main = function () {
  var now = Date.now();
  var delta = now - then;

  update(delta / 1000);
  render();

  then = now;

  // Request to do this again ASAP
  if ( (now - start) / 1000 < seconds_to_run) {
    requestAnimationFrame(main);
  }
  else{
    cleanup();
  }
}

function cleanup(){
  $(canvasDivName).css('display', 'none');
  // Call main cleanup if exists
  if (main_canvas_cleanup && typeof main_canvas_cleanup == 'function'){
    main_canvas_cleanup();
  }

}
