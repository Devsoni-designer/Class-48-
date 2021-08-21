const Engine = Matter.Engine;
const World = Matter.World;
const Bodies = Matter.Bodies;

var mario,marioImg
var ground,bg;
var obstacle1Img,obstacle2Img,obstaclesGroup;
var engine,world;
var coin,coinImg;
var block;
var score=0;
var lifetime=3;
var gameState="play";
var marioCollide;
var groundImg;
var resetImg, gameoverImg;
var coin1;
var treasure,treasureImg;

var gameover,restart;

function preload()
{
    marioImg = loadImage("Mario.png")
    bg = loadImage("bg2.png")
    obstacle1Img = loadImage("Bushes1.png")
    obstacle2Img = loadImage("Obstacle2.png")
    coinImg = loadImage("Coin.png")
    marioCollide = loadSound("subway-train-1.mp3")
    groundImg = loadImage("ground2.png");
    resetImg = loadImage("restart.png");
    gameoverImg = loadImage("gameOver.png");
    treasureImg = loadImage("Treasure1.png");
    
}

function setup()
{

  createCanvas(displayWidth,displayHeight)



  engine = Engine.create();
  world = engine.world;

  mario = createSprite(20,displayHeight/2+150,20,20);
  mario.addImage(marioImg)
  mario.scale = 0.5

  restart = createSprite(displayWidth/2,displayHeight/2,50,50);
  restart.addImage(resetImg);

  gameover = createSprite(displayWidth/2,displayHeight/2-100,50,50);
  gameover.addImage(gameoverImg)

  

  ground = createSprite(0,displayHeight/2+300,displayWidth+300,50);
  ground.addImage(groundImg);
  ground.velocityX = -2;
  ground.x = ground.width/2;
  ground.visible = true;


  block1 = new Block(500,390,190,130);
  block2 = new Block(570,390,130,130);
  block3 = new Block(640,390,130,130);
  block4 = new Block(710,390,130,130);
  
  treasure = createSprite(displayWidth/2,displayHeight/2+200);
  treasure.addImage(treasureImg);
  treasure.visible=false;
  

  
  coin1 = createSprite(500,285,50,50);
  coin1.addImage(coinImg);
  coin1.scale = 0.3;

  coin2 = createSprite(590,285,50,50);
  coin2.addImage(coinImg);
  coin2.scale = 0.3;

  coin3 = createSprite(680,285,50,50);
  coin3.addImage(coinImg);
  coin3.scale = 0.3;
  
  
//invisible blocks
  block = createSprite(600,370,290,20)
  block.visible = false;


  mario.setCollider("circle",20,20,100);
  mario.debug = true;
  
  obstaclesGroup = new Group();

  
}




function draw()
{

background(bg);

//createCoin();


 //Score
 textSize(30);
 fill("red")
 text("Score: "+ score,800,300);

 // life
 textSize(30);
 fill("red");
 text("Life: "+ lifetime,1000,300);

Engine.update(engine);

block2.display();
block3.display();
block4.display();

block1.display();


if(gameState=="play")
{

    if(frameCount%250 == 0)
    score=score+Math.round(frameCount/500);

    if(score>105)
    {
        ground.velocityX = -(6+2*score/100);
        obstaclesGroup.setVelocityXEach(-4);
    }


    //Making Ground Infinite
    if(ground.x<displayWidth/2)
    {
     ground.x = ground.width/2;
    }


      gameover.visible= false;
      restart.visible = false;

      // Controls
      if(keyDown("UP_ARROW"))
    {
      mario.y = mario.y-3;
    }

    if(keyDown("DOWN_ARROW"))
    {
      mario.y = mario.y+3;
    }

    if(keyDown("RIGHT_ARROW"))
    {
      mario.x = mario.x+3;
    }

    if(keyDown("LEFT_ARROW"))
    {
      mario.x = mario.x-3;
    }
    
    // Gravity
    if(keyDown("space") && mario.y>=(displayHeight/2+100))
    {
      mario.velocityY = mario.velocityY-5;
    }

    mario.velocityY = mario.velocityY+0.8


      
    if(mario.isTouching(block))
    {
      mario.collide(block);
        marioCollide.play();
    }

    if(coin1 !== null)
    {

      if(mario.isTouching(coin1) || mario.isTouching(coin2) || mario.isTouching(coin3))
      {
          score = score+100;
          coin1.destroy();
          coin2.destroy();
          coin3.destroy();
      }

    }

    if(score>=110)
    {
        //gameState="end";
        treasure.visible=true;
        textSize(30);
        fill("Blue")
        text("Congrats!!Mario Found the Treasure",displayWidth/2,displayHeight/2);
        mario.x = displayWidth/2+150;
        gameover.visible=false;
        restart.visible=false;
        ground.velocityX=0;
        obstaclesGroup.setVelocityXEach(0);
    }


     if(lifetime == 0)
        {
          gameState="end"
          obstaclesGroup.destroyEach();
          mario.destroy();
          
        }



    if(mario.isTouching(obstaclesGroup))
    {
        
        if(lifetime == 0)
        {
          gameState="end"
        }
        else
        {
          lifetime = lifetime-1;
          obstaclesGroup
        }

        

    }


    spawnObstacles(); 
   
}


  if(gameState=="end")
  {

    console.log("gameEnd");

    mario.velocityY=0;
    mario.velocityX=0;
    ground.velocityX=0;

    obstaclesGroup.setLifetimeEach(-1);
    obstaclesGroup.setVelocityXEach(0);

    gameover.visible = true;
    restart.visible = true;

    if(mousePressedOver(restart))
    {
        reset();

    }


    //alert("Game Is Over!!")

  }

  


mario.collide(ground);

 

  //Decreasing life
 

 

 

  drawSprites();

}

function spawnObstacles()
{

    if(frameCount%250 == 0)
    {
        var obstacle = createSprite(displayWidth,displayHeight/2+300,30,30)
        obstacle.velocityX = -2;
        var rand = Math.round(random(1,2));

        switch(rand)
        {

          case 1: obstacle.addImage(obstacle1Img)
          break

          case 2: obstacle.addImage(obstacle2Img)
          break

          //default:obstacle.addImage(obstacle1Img)
        }

            obstacle.lifetime = 510;

            obstacle.scale = 0.5;
            obstaclesGroup.add(obstacle);

    }


}


function reset()
{

    gameState="play";
    score=0;
    lifetime=3;
    obstaclesGroup.destroyEach();

    coin1 = createSprite(500,285,50,50);
    coin1.addImage(coinImg);
    coin1.scale = 0.3;
    mario.x=20;


}


function createCoin()
{

  
  

    if(frameCount%120 == 0)
    {
      coin1 = createSprite(500,285,50,50);
      coin1.addImage(coinImg);
      coin1.scale = 0.3;
    }

  

}



