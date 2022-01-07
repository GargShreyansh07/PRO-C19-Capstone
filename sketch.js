var PLAY = 1;
var END = 0;
var gameState = PLAY;

var boy,boy_running,boy_collided;
var ground,invisibleGround,groundImage;

var obstaclesGroup, obstacle1,obstacle2,obstacle4;

var score = 0;

var gameOver,restart;

var jumpSound;

function preload() {
  boy_running = loadAnimation("boy1.png","boy2.png");
  boy_collided = loadAnimation("boy_collided.png");

  groundImage = loadImage("background1.png");

  obstacle1 = loadImage("obstacle1.png");
  obstacle2 = loadImage("obstacle2.png");
  obstacle4 = loadImage("obstacle4.png");

  gameOverImg = loadImage("gameOver.png");
  restartImg = loadImage("restart.png");

  jumpSound = loadSound("jump.mp3");
}

function setup() {
  createCanvas(900,windowHeight);
 
  ground = createSprite(3000,320);
  ground.addImage("ground",groundImage);
  ground.x = ground.width / 2;
  ground.velocityX = -(6 + 3*score/100);
  ground.scale=2.5;
 
  boy = createSprite(100,600);
  boy.addAnimation("running",boy_running);
  boy.addAnimation("collided",boy_collided);
  boy.scale = 0.5;
 
  gameOver = createSprite(450,300);
  gameOver.addImage(gameOverImg);
  gameOver.scale = 1;

  restart = createSprite(450,375);
  restart.addImage(restartImg);
  restart.scale = 0.5;

  gameOver.visible = false;
  restart.visible = false;

  invisibleGround = createSprite(200,600,4000,10);
  invisibleGround.visible = false;

  obstaclesGroup = new Group();

  score = 0;
}

function draw() 
{
 // boy.debug = true;
  background(0);
  text("SCORE: "+score , 500,50);

  if (gameState===PLAY){
    score = score + Math.round(getFrameRate()/60);
    ground.velocityX = -(6 + 3*score/100);
  
   if(keyDown("space") && boy.y >=450) {
    boy.velocityY = -12;
    jumpSound.play();
   }

   boy.velocityY = boy.velocityY + 0.8;

   if(ground.x < 0) {
    ground.x = ground.width / 2;
   }

   boy.collide(invisibleGround);

   spawnObstacles();

   if(obstaclesGroup.isTouching(boy)) {
    gameState = END ;
   }
  }
  
  else if(gameState === END) {
    gameOver.visible = true;
    restart.visible = true;

    textSize(20);
    fill(255);
    text("Press Enter to Restart the game!", 300,400);

   ground.velocityX = 0;
   boy.velocityY = 0;
   obstaclesGroup.setVelocityXEach(0);
   
   boy.changeAnimation("collided",boy_collided);

   obstaclesGroup.setLifetimeEach(-1);

   if(mousePressedOver(restart)) {
    reset();
   }
  }

  drawSprites();

}

function spawnObstacles() {
  if(frameCount % 100 === 0) {
    var obstacle = createSprite(650,580,10,40);
    //obstacle.debug = true;
    obstacle.velocityX = -(6 + 3*score/100);

    var randomObstacles = Math.round(random(1,3));
    switch(randomObstacles) {
     case 1 : obstacle.addImage(obstacle1);
             break;
     case 2 : obstacle.addImage(obstacle2);
             break;
     case 3 : obstacle.addImage(obstacle4);
             break;                           
     default : break;
    }

    obstacle.lifeTime = 300;
    obstacle.scale = 0.35;

    obstaclesGroup.add(obstacle);
  }
}

function reset() {
gameState = PLAY;
gameOver.visible = false;
restart.visible = false;

obstaclesGroup.destroyEach();

boy.changeAnimation("running",boy_running);

score = 0;
}
