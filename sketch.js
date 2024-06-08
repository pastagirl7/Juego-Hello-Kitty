var PLAY = 1;
var END = 0;
var gameState = PLAY;

var kitty, kitty_running, kitty_collided;
var ground, invisibleGround, groundImage;

var cloudsGroup, cloudImage;
var obstaclesGroup, obstaculo1, obstaculo2;

var score;
var gameOverImg,restartImg
var jumpSound , checkPointSound, dieSound

function preload(){
  kitty_running = loadAnimation("kitty1.png","kitty2.png");
  kitty_collided = loadAnimation("kitty_collided.png");
  
  groundImage = loadImage("grass.png");
  
  cloudImage = loadImage("cloud.png");
  
  obstaculo1 = loadImage("obstaculo1.png");
  obstaculo2 = loadImage("obstaculo2.png");
  
  
  
  restartImg = loadImage("Restart-Button.png")
  gameOverImg = loadImage("gameovercute.png")
  
  jumpSound = loadSound("jump.mp3")
  dieSound = loadSound("die.mp3")
  checkPointSound = loadSound("checkpoint.mp3")
}

function setup() {
  createCanvas(300, 200);

  var message = "Esto es un mensaje";
 console.log(message)
  
  kitty = createSprite(50,10,20,50);
  kitty.addAnimation("running", kitty_running);
  kitty.addAnimation("collided", kitty_collided);
  

  kitty.scale = 0.2;
  
  ground = createSprite(200,50,400,20);
  ground.addImage("ground",groundImage);
  ground.x = ground.width /2;
  
  gameOver = createSprite(150,100);
  gameOver.addImage(gameOverImg);
  
  restart = createSprite(150,140);
  restart.addImage(restartImg);
  
 
  gameOver.scale = 0.5;
  restart.scale = 0.1;
  
  invisibleGround = createSprite(200,190,400,10);
  invisibleGround.visible = false;
  
  //crear grupos de obstáculos y nubes
  obstaclesGroup = createGroup();
  cloudsGroup = createGroup();

  
  kitty.setCollider("rectangle",0,0,kitty.width,kitty.height);
  kitty.debug = false
  
  score = 0;
  
}

function draw() {
  
  background("pink");
  //mostrar puntuación
  text("Puntuación: "+ score, 100,50);
  
  
  if(gameState === PLAY){

    gameOver.visible = false;
    restart.visible = false;
    
    ground.velocityX = -(4 + 3* score/100)
    //puntuación
    score = score + Math.round(getFrameRate()/60);
    
    if(score>0 && score%100 === 0){
       checkPointSound.play() 
    }
    
    if (ground.x < 0){
      ground.x = ground.width/2;
    }
    
    //hacer que el kitty salte al presionar la barra espaciadora
    if(keyDown("space")&& kitty.y >= 100) {
        kitty.velocityY = -12;
        jumpSound.play();
    }
    
    //agregar gravedad
    kitty.velocityY = kitty.velocityY + 0.8
  
    //aparecer nubes
    spawnClouds();
  
    //aparecer obstáculos en el suelo
    spawnObstacles();
    
    if(obstaclesGroup.isTouching(kitty)){
        //kitty.velocityY = -12;
        jumpSound.play();
        gameState = END;
        dieSound.play()
      
    }
  }
   else if (gameState === END) {
      gameOver.visible = true;
      restart.visible = true;
     
     //cambiar la animación del kitty
      kitty.changeAnimation("collided", kitty_collided);
    
     
     
      ground.velocityX = 0;
      kitty.velocityY = 0
      
     
      //establecer lifetime de los objetos del juego para que no sean destruidos nunca
    obstaclesGroup.setLifetimeEach(-1);
    cloudsGroup.setLifetimeEach(-1);
     
     obstaclesGroup.setVelocityXEach(0);
     cloudsGroup.setVelocityXEach(0);    
   }
  
 
  //evitar que el trex caiga
  kitty.collide(invisibleGround);
  
  if(mousePressedOver(restart)) {
      reset();
      kitty.changeAnimation("running", kitty_running);
    }


  drawSprites();
}

function reset(){
  gameState = PLAY;
  obstaclesGroup.destroyEach();
  cloudsGroup.destroyEach();
  score = 0;
}


function spawnObstacles(){
 if (frameCount % 60 === 0){
   var obstacle = createSprite(600,165,10,40);
   obstacle.velocityX = -(6 + score/100);
   
    //generar obstáculos al azar
    var rand = Math.round(random(1,2));
    switch(rand) {
      case 1: obstacle.addImage(obstaculo1);
              break;
      case 2: obstacle.addImage(obstaculo2);
              break;  
    }
   

    //asignar escala y lifetime al obstáculo           
    obstacle.scale = 0.1;
    obstacle.lifetime = 300;
   
   //agregar cada obstáculo al grupo
    obstaclesGroup.add(obstacle);
 }
}

function spawnClouds() {
  //escribir aquí el código para aparecer las nubes
  if (frameCount % 60 === 0) {
    var cloud = createSprite(600,120,40,10);
    cloud.y = Math.round(random(80,120));
    cloud.addImage(cloudImage);
    cloud.scale = 0.5;
    cloud.velocityX = -3;
    
     //asignar lifetime a la variable
    cloud.lifetime = 300;
    
    //ajustar la profundidad
    cloud.depth = kitty.depth;
    kitty.depth = kitty.depth + 1;
    
    //agregar cada nube al grupo
    cloudsGroup.add(cloud);
  }
}

