var PLAY = 1;
var END = 0;
var gameState = PLAY;

var bgImg;
var sun, sunImg;
var solider, solider_running, solider_collided;
var ground, invisibleGround, groundImage;

var jump, collide;

var cloudsGroup, cloudImage;
var obstaclesGroup, obstacle1;

var score=0;

var gameOver, restart;

localStorage = ["HighestScore"];
localStorage[0] = 0;

function preload(){
  solider_running =   loadAnimation("db2fdh0-ad391b69-8400-41da-ae81-97843b4a9e1b-2 (dragged).png","db2fdh0-ad391b69-8400-41da-ae81-97843b4a9e1b-3 (dragged).png","db2fdh0-ad391b69-8400-41da-ae81-97843b4a9e1b-4 (dragged).png","db2fdh0-ad391b69-8400-41da-ae81-97843b4a9e1b-5 (dragged).png","db2fdh0-ad391b69-8400-41da-ae81-97843b4a9e1b-8 (dragged).png","db2fdh0-ad391b69-8400-41da-ae81-97843b4a9e1b-9 (dragged).png","db2fdh0-ad391b69-8400-41da-ae81-97843b4a9e1b-10 (dragged).png","db2fdh0-ad391b69-8400-41da-ae81-97843b4a9e1b-11 (dragged).png","db2fdh0-ad391b69-8400-41da-ae81-97843b4a9e1b-12 (dragged).png");
  
  solider_collided = loadImage("db2fdh0-ad391b69-8400-41da-ae81-97843b4a9e1b-1 (dragged).png");
  
  sunImg = loadImage("sun.png");
  
  bgImg = loadImage("backgroundImg.png");
  
  groundImage = loadImage("ground.png");
  
  cloudImage = loadImage("cloud.png");
  
  obstacle1 = loadImage("obstacle1.png");
  jump = loadSound("jump.wav");
  
  gameOverImg = loadImage("gameOver.png");
  restartImg = loadImage("restart.png");
}

function setup() {
  createCanvas(windowWidth, windowHeight);
  
  sun = createSprite(width-90,120,10,10);
  sun.addImage(sunImg);
  sun.scale = 0.15;
  
  solider = createSprite(50, height-150,20,50);
  
  solider.addAnimation("running", solider_running);
  solider.addImage("collided", solider_collided);
  solider.scale = 0.15;
  
  solider.setCollider("circle", 10, 0, 200);
  
  ground = createSprite(width/2,height+20,width,10);
  ground.addImage("ground",groundImage);
  ground.x = width/2
  ground.velocityX = -(6 + 3*score/100);
  
  gameOver = createSprite(width/2,height/2 - 50);
  gameOver.addImage(gameOverImg);
  
  restart = createSprite(width/2,height/2 + 50);
  restart.addImage(restartImg);
  
  gameOver.scale = 1;
  restart.scale = 0.1;

  gameOver.visible = false;
  restart.visible = false;
  
  invisibleGround = createSprite(width/2, height-70,width, 10);
  invisibleGround.visible = false;
  
  cloudsGroup = new Group();
  obstaclesGroup = new Group();
  
  score = 0;
}

function draw() {
  solider.debug = true;
  background(bgImg);
  fill("black")
  textSize(20);
  textFont("Comic Sans MS");
  text("Score: "+ score, width/5, height/10);
  text("HI: "+ localStorage[0], width/20, height/10);
  
  if (gameState===PLAY){
    score = score + Math.round(getFrameRate()/60);
    ground.velocityX = -(6 + 3*score/100);
  
    if((keyDown("SPACE")) && solider.y  >= height-120) {
      jump.play( )
      solider.velocityY = solider.velocityY-9.5;
    }
  
    solider.velocityY = solider.velocityY + 0.6
  
    if (ground.x < 0){
      ground.x = ground.width/2;
    }
    
    solider.collide(invisibleGround);
    spawnClouds();
    spawnObstacles();
  
    if(obstaclesGroup.isTouching(solider)){
        gameState = END;
    }
  }
  else if (gameState === END) {
    gameOver.visible = true;
    restart.visible = true;
    
    //set velcity of each game object to 0
    ground.velocityX = 0;
    solider.velocityY = 0;
    obstaclesGroup.setVelocityXEach(0);
    cloudsGroup.setVelocityXEach(0);
    
    //change the solider animation
    solider.changeAnimation("collided",solider_collided);
    
    //set lifetime of the game objects so that they are never destroyed
    obstaclesGroup.setLifetimeEach(-1);
    cloudsGroup.setLifetimeEach(-1);
    
    if(mousePressedOver(restart)) {
      reset();
    }
  }
  
  ground.depth = solider.depth;
  solider.depth = solider.depth + 1;
  
  drawSprites();
}

function spawnClouds() {
  //write code here to spawn the clouds
  if (frameCount % 80 === 0) {
    var cloud = createSprite(width+20,height-300,40,10);
    cloud.y = Math.round(random(height-300,height-400));
    cloud.addImage(cloudImage);
    cloud.scale = 0.5;
    cloud.velocityX = -3;
    
     //assign lifetime to the variable
    cloud.lifetime = 300;
    
    //adjust the depth
    cloud.depth = gameOver.depth;
    gameOver.depth = gameOver.depth + 1;
    
    cloud.depth = sun.depth;
    sun.depth = sun.depth + 1;
    
    //add each cloud to the group
    cloudsGroup.add(cloud);
  }
  
}

function spawnObstacles() {
  if(frameCount % 80 === 0) {
    var obstacle = createSprite(600,height-85,10,40);
    obstacle.debug = true;
    obstacle.velocityX = -(6 + 3*score/100);
     obstacle.addImage(obstacle1);
    obstacle.scale = (0.5);


    obstacle.lifetime = 300;
    
    obstacle.depth = solider.depth;
    solider.depth = solider.depth + 1;    
    //add each obstacle to the group
    obstaclesGroup.add(obstacle);
    obstacle.setCollider("rectangle", 0.5,1);
  }  
}

function reset(){
  gameState = PLAY;
  gameOver.visible = false;
  restart.visible = false;
  
  obstaclesGroup.destroyEach();
  cloudsGroup.destroyEach();
  
  solider.changeAnimation("running",solider_running);
  
  if(localStorage[0]<score){
    localStorage[0] = score;
  }
}