/*
# THE PATRIOT VIRUS  
### Author: Hung Tran, Dhairya Surana

> ## IMPORTANT!!


To run this game, download as a zip file and
EXTRACT all files from the zip.
Double-click on the HTML page to load the game.

This game DOES NOT WORK on Khan Acedemy due to extra features that are not provided by the Khan Academy IDE.


> ## Game Layout

- Main page:

  - Menu section:
  - Instruction section:
  - Score section:
  - Achievements section:

- Play page:
  - Game play

> ## Main Page

- ### Menu section:
  - **START GAME**: A short animation will show up then  
     the player will enter game page.
  - **HOW TO PLAY**: The menu content will slowly shift to the  
     left and replaced by instruction content.
  - **SCORE**: The menu content will slowing shift to the right  
     and replace by the 3 highest scores of the player.
  - **ACHIEVEMENT**: The menu content will slowly shift upward  
     and replaced by the achivement mark that the player's earned.

* ### Instruction section
  - A set of instruction displayed to tell the player how  
    to operate the game.
  - The player could go back to the menu screen by pressing **`**
* ### Score section
  - The top 3 highest score will be displayed. The background  
    has a big rocket flying from the mid left side to the screen  
    to the mid top side, then mid right, then repeated.
  - The player can go back to the menu screen by pressing **`**
* ### Achievements section
  - In the main game, there are 3 small challenges. Every time the  
    player completes one of them, they will receive an achivement. All  
    the achievements from the player will be displayed here. Fireworks will  
    be displayed to celebrate the player's accomplishments.
  - The player could go back to the menu screen by pressing **`**.

> ## Play Page

-   The play page will open up to a 50 x 50 character screen with the player on the bottom-right corner. 
    The goal of the game is to collect all the batteries and kill all the droids.
    The player animation consists of a space soldier and the droids are essentially one-eyed
    robots that fly around. The player can kill the robots by pressing the h key to shoot plasma bullets.
    To collect the batteries, the player must move close to them. 
    
    Overall, the tilemap used so far is only a small section of the final tilemap, which is currently still under
    development. The final tilemap will be 96 x 112 character tilemap.
    
*/ 



var sketchProc = function(processingInstance) {
  with (processingInstance) {
    size(800, 800);
    frameRate(60);
    var gameFont = createFont("Bitstream Charter Bold");
    noStroke();
    //######################################################################################################
    //##############################################START HERE##############################################
    //######################################################################################################
    STATE = {
      OPEN: true,
      GAME: false,
      INSTRUCTION: false,
      SCORE: false,
      ACHIEVEMENT: false
    };

    playerScore = {
      one: 0,
      two: 0,
      three: 0
    }

    remainPoints = 0;

    var changePage = function changePage(page) {
      STATE.OPEN = false;
      STATE.GAME = false;
      STATE.INSTRUCTION = false;
      STATE.SCORE = false;
      STATE.ACHIEVEMENT = false;
      switch (page) {
        case "OPEN":
          STATE.OPEN = true;
          break;
        case "GAME":
          STATE.GAME = true;
          break;
        case "INSTRUCTION":
          STATE.INSTRUCTION = true;
          break;
        case "SCORE":
          STATE.SCORE = true;
          break;
        case "ACHIEVEMENT":
          STATE.ACHIEVEMENT = true;
          break;
      }
    };

    //############################################### LOAD IMAGES ######################################

    // When developing locally, set url = "."
    // otherwise, set url = "https://thepatriotvirus.s3.amazonaws.com"
    url = ".";
    openTitleImage = loadImage(url + "/images/gameTitle.png");
    instrTitleImage = loadImage(url + "/images/instrTitle.png");
    scoreTitleImage = loadImage(url + "/images/scoreTitle.png");
    achievementTitleImage = loadImage(url + "/images/achievementTitle.png");
    earthImage = loadImage(url + "/images/earth.png");
    ouchImage = [
      loadImage(url + "/images/ouch.png"),
      loadImage(url + "/images/ouch.png"),
      loadImage(url + "/images/ouch.png"),
      loadImage(url + "/images/ouch.png"),
      loadImage(url + "/images/ouch.png")
    ];
    rocketOneImage = [
      loadImage(url + "/images/r1f1.png"),
      loadImage(url + "/images/r1f2.png"),
      loadImage(url + "/images/r1f3.png"),
      loadImage(url + "/images/r1f4.png"),
      loadImage(url + "/images/r1f5.png")
    ];
    rocketTwoImage = [
      loadImage(url + "/images/r2f1.png"),
      loadImage(url + "/images/r2f2.png"),
      loadImage(url + "/images/r2f3.png"),
      loadImage(url + "/images/r2f4.png"),
      loadImage(url + "/images/r2f5.png")
    ];
    rocketThreeImage = [
      loadImage(url + "/images/r3f1.png"),
      loadImage(url + "/images/r3f2.png"),
      loadImage(url + "/images/r3f3.png"),
      loadImage(url + "/images/r3f4.png"),
      loadImage(url + "/images/r3f5.png")
    ];
    rocketFourImage = [
      loadImage(url + "/images/r4f1.png"),
      loadImage(url + "/images/r4f2.png"),
      loadImage(url + "/images/r4f3.png"),
      loadImage(url + "/images/r4f4.png"),
      loadImage(url + "/images/r4f5.png")
    ];
    rocketFiveImage = [
      loadImage(url + "/images/r5f1.png"),
      loadImage(url + "/images/r5f2.png"),
      loadImage(url + "/images/r5f3.png"),
      loadImage(url + "/images/r5f4.png"),
      loadImage(url + "/images/r5f5.png")
    ];
    rocketSixImage = [
      loadImage(url + "/images/r6f1.png"),
      loadImage(url + "/images/r6f2.png"),
      loadImage(url + "/images/r6f3.png"),
      loadImage(url + "/images/r6f4.png"),
      loadImage(url + "/images/r6f5.png")
    ];

    playerImages = {
      idle: [
        loadImage(url + "/images/standf1.png"),
        loadImage(url + "/images/standf2.png"),
        loadImage(url + "/images/standf3.png"),
        loadImage(url + "/images/standf4.png")
      ],
      run: [
        loadImage(url + "/images/runf1.png"),
        loadImage(url + "/images/runf2.png"),
        loadImage(url + "/images/runf3.png"),
        loadImage(url + "/images/runf4.png")
      ],
      shoot: [
        loadImage(url + "/images/shootf1.png"),
        loadImage(url + "/images/shootf2.png"),
        loadImage(url + "/images/shootf3.png"),
        loadImage(url + "/images/shootf4.png")
      ],
      dying: [],
      jump: []
    };

    bulletImages = [
      loadImage(url + "/images/bulletf1.png"),
      loadImage(url + "/images/bulletf2.png"),
      loadImage(url + "/images/bulletf3.png"),
      loadImage(url + "/images/bulletf4.png")
    ];

    monsterImages = [
      loadImage(url + "/images/monsterf1.png"),
      loadImage(url + "/images/monsterf2.png"),
      loadImage(url + "/images/monsterf3.png"),
      loadImage(url + "/images/monsterf4.png")
    ];

    trapImages = [
      loadImage(url + "/images/trapf1.png"),
      loadImage(url + "/images/trapf2.png"),
      loadImage(url + "/images/trapf3.png"),
      loadImage(url + "/images/trapf4.png")
    ];

    coinImages = [
      loadImage(url + "/images/coinf1.png"),
      loadImage(url + "/images/coinf2.png"),
      loadImage(url + "/images/coinf3.png"),
      loadImage(url + "/images/coinf4.png")
    ];

    wallImage = loadImage(url + "/images/wall.png");
    trapImage = loadImage(url + "/images/trap.png");
    backgroundImage = loadImage(url + "/images/background.png");

    //############################################### OPENING SCREEN ######################################
    const IMAGESIZE = 50;
    const ROTATESPEED = 0.03;
    //                                        _______ ROCKET OBJECT__________
    class rocketObj {
      constructor(x, y, img, direction) {
        this.pos = new PVector(x, y);
        this.nextPos = new PVector(x, y);
        this.orgPos = this.pos;
        this.img = img;
        this.imgIndex = 0;
        this.curAngle = 0;
        this.nextAngle = 0;
        this.direction = direction;
        this.moving = false;
        this.curFrame = frameCount;
        this.state = "stationary";
        this.size = IMAGESIZE * 1.5;
        this.exploding = false;
        this.rocketImg = img;
        this.collide = false;
      }

      reset() {
        this.pos = this.orgPos;
        this.nextPos = this.orgPos;
        this.imgIndex = 0;
        this.curAngle = 0;
        this.nextAngle = 0;
        this.moving = false;
        this.curFrame = frameCount;
        this.state = "stationary";
        this.exploding = false;
        this.img = this.rocketImg;
        this.collide = false;
      }

      display() {
        if (this.moving && frameCount - this.curFrame > 3) {
          this.curFrame = frameCount;
          this.imgIndex = Math.floor(Math.random() * 3) + 1;
        }

        if (!this.moving) {
          this.imgIndex = 0;
        }

        if (this.moving) {
          this.executeFly();
        } else if (this.exploding) {
          this.executeExplode();
        } else {
          this.direction === "cw"
            ? (this.curAngle -= ROTATESPEED)
            : (this.curAngle += ROTATESPEED);
        }
        if (this.curAngle < -2 * PI || this.curAngle > 2 * PI) {
          this.curAngle = 0;
        }

        pushMatrix();
        translate(this.pos.x, this.pos.y);
        imageMode(CENTER);
        rotate(this.curAngle);
        image(this.img[this.imgIndex], 0, 0, this.size, this.size);
        popMatrix();
      }

      move(desX, desY) {
        if (this.moving) {
          return;
        }
        this.moving = true;
        this.nextPos.set(desX, desY);
        this.nextAngle =
          Math.atan2(desY - this.pos.y, desX - this.pos.x) + PI / 2;
        this.state = "rotate";
      }

      executeFly() {
        switch (this.state) {
          case "rotate":
            Math.abs(this.curAngle - this.nextAngle) <= 0.03
              ? (this.state = "move")
              : (this.state = "rotate");
            this.curAngle > this.nextAngle
              ? (this.curAngle -= ROTATESPEED)
              : (this.curAngle += ROTATESPEED);
            break;
          case "move":
            if (
              dist(this.pos.x, this.pos.y, this.nextPos.x, this.nextPos.y) === 0
            ) {
              this.state = "stationary";
              this.moving = false;
            } else {
              this.pos.x > this.nextPos.x
                ? this.pos.x--
                : this.pos.x < this.nextPos.x
                ? this.pos.x++
                : (this.pos.x = this.pos.x);
              this.pos.y > this.nextPos.y
                ? this.pos.y--
                : this.pos.y < this.nextPos.y
                ? this.pos.y++
                : (this.pos.y = this.pos.y);
            }
            break;
          case "stationary":
            break;
        }
      }

      collisionCheck(desX, desY, rad) {
        if (this.collide === false) {
          if (dist(this.pos.x, this.pos.y, desX, desY) < rad) {
            this.explode();
            this.collide = true;
          }
        }
      }

      explode() {
        this.exploding = true;
        this.moving = false;
        this.img = ouchImage;
        this.curAngle = 0;
        this.nextAngle = 0;
        this.state = "stationary";
        this.curFrame = frameCount;
        this.imgIndex = 0;
      }

      executeExplode() {
        if (frameCount - this.curFrame > 240) {
          this.img = this.rocketImg;
          this.exploding = false;
          this.pos.x = -1000000;
          this.pos.y = -1000000;
        }
      }
    }

    //                                        _______ EARTH OBJECT__________
    class earthObj {
      constructor(x, y, img) {
        this.pos = new PVector(x, y);
        this.img = img;
        this.opacity = 50;
        this.showing = false;
      }
      reset() {
        this.opacity = 50;
        this.showing = false;
      }
      display() {
        if (this.showing) {
          pushMatrix();
          imageMode(CENTER);
          tint(255, 255, 255, this.opacity);
          image(this.img, this.pos.x, this.pos.y, 300, 300);
          tint(255, 255, 255, 255);
          popMatrix();
          if (this.opacity < 255) {
            this.opacity++;
          }
        }
      }
      show() {
        this.showing = true;
      }
    }

    //                                          _______ TITLE OBJECT__________

    class titleOjb {
      constructor(x, y, img) {
        this.pos = new PVector(x, y);
        this.nextPos = new PVector(x, y);
        this.img = img;
        this.moving = false;
      }

      display() {
        if (this.moving) {
          this.executeMove();
        }

        pushMatrix();
        imageMode(CENTER);
        image(this.img, this.pos.x, this.pos.y, 500, 100);
        popMatrix();
      }

      move(desX, desY) {
        this.moving = true;
        this.nextPos.set(desX, desY);
      }

      executeMove() {
        if (
          dist(this.pos.x, this.pos.y, this.nextPos.x, this.nextPos.y) === 0
        ) {
          this.moving = false;
        } else {
          this.pos.x > this.nextPos.x
            ? this.pos.x--
            : this.pos.x < this.nextPos.x
            ? this.pos.x++
            : (this.pos.x = this.pos.x);
          this.pos.y > this.nextPos.y
            ? this.pos.y--
            : this.pos.y < this.nextPos.y
            ? this.pos.y++
            : (this.pos.y = this.pos.y);
        }
      }
    }

    //                                        _______ OPEN SCREEN OBJECT__________

    class openObj {
      constructor() {
        this.rocketOne = new rocketObj(100, 100, rocketOneImage, "ccw");
        this.rocketTwo = new rocketObj(750, 750, rocketTwoImage, "ccw");
        this.rocketThree = new rocketObj(700, 100, rocketThreeImage, "cw");
        this.rocketFour = new rocketObj(50, 400, rocketFourImage, "ccw");
        this.rocketFive = new rocketObj(500, 50, rocketFiveImage, "cw");
        this.rocketSix = new rocketObj(100, 750, rocketSixImage, "cw");
        this.earth = new earthObj(400, 400, earthImage);
        this.gameTitle = new titleOjb(400, 200, openTitleImage);
        this.startShow = false;
        this.currFrame = 0;
        this.color = { r: 250, g: 185, b: 167 };
        this.mouseOn = {
          PLAY: false,
          INSTRUCTION: false,
          SCORE: false,
          ACHIEVEMENT: false
        };
      }

      reset() {
        this.color = { r: 250, g: 185, b: 167 };
        this.currFrame = 0;
        this.select(0, 0, false);
        this.startShow = false;
        this.rocketOne.reset();
        this.rocketTwo.reset();
        this.rocketThree.reset();
        this.rocketFour.reset();
        this.rocketFive.reset();
        this.rocketSix.reset();
        this.earth.reset();
      }

      display() {
        background(this.color.r, this.color.g, this.color.b);
        if (this.startShow) {
          this.changeBGColor();
          if (frameCount - this.currFrame > 500) {
            changePage("GAME");
            this.reset();
          }
        } else {
          this.showSelection();
        }

        this.gameTitle.display();
        this.rocketOne.display();
        this.rocketTwo.display();
        this.rocketThree.display();
        this.rocketFour.display();
        this.rocketFive.display();
        this.rocketSix.display();
        this.earth.display();
        this.collisionCheck();
      }

      show() {
        // if (!this.startShow) {
        //   this.currFrame = frameCount;
        //   this.startShow = true;
        //   this.earth.show();
        //   this.gameTitle.move(400, 400);
        //   this.rocketOne.move(400, 400);
        //   this.rocketTwo.move(400, 400);
        //   this.rocketThree.move(400, 400);
        //   this.rocketFour.move(400, 400);
        //   this.rocketFive.move(400, 400);
        //   this.rocketSix.move(400, 400);
        // }
        changePage("GAME");

      }

      collisionCheck() {
        this.rocketOne.collisionCheck(400, 400, 180);
        this.rocketTwo.collisionCheck(400, 400, 180);
        this.rocketThree.collisionCheck(400, 400, 180);
        this.rocketFour.collisionCheck(400, 400, 180);
        this.rocketFive.collisionCheck(400, 400, 180);
        this.rocketSix.collisionCheck(400, 400, 180);
      }

      changeBGColor() {
        this.color.r < 250 ? this.color.r++ : (this.color.r = this.color.r);
        this.color.g < 240 ? this.color.g++ : (this.color.g = this.color.g);
        this.color.b > 127 ? this.color.b-- : (this.color.b = this.color.b);
      }

      showSelection() {
        fill(245, 113, 70);
        rectMode(CENTER);

        if (this.mouseOn.PLAY) {
          rect(400, 360, 500, 50, 30);
        } else if (this.mouseOn.INSTRUCTION) {
          rect(400, 440, 500, 50, 30);
        } else if (this.mouseOn.SCORE) {
          rect(400, 520, 500, 50, 30);
        } else if (this.mouseOn.ACHIEVEMENT) {
          rect(400, 600, 500, 50, 30);
        }
        fill(255, 255, 255);
        textFont(gameFont, 30);
        rectMode(CENTER);
        textAlign(CENTER, CENTER);
        text("START GAME", 400, 360);
        text("HOW TO PLAY", 400, 440);
        text("SCORE", 400, 520);
        text("ACHIEVEMENTS", 400, 600);
        fill(39, 36, 89, 150);
        textSize(15);
        text("Represented By Hung Tran & Dhairya Surana", 400, 280);
      }

      select(x, y, clicked) {
        this.mouseOn.PLAY = false;
        this.mouseOn.INSTRUCTION = false;
        this.mouseOn.SCORE = false;
        this.mouseOn.ACHIEVEMENT = false;

        if (Math.abs(x - 400) < 100 && Math.abs(y - 360) < 20) {
          this.mouseOn.PLAY = true;
          clicked === true ? this.show() : 1;
        } else if (Math.abs(x - 400) < 100 && Math.abs(y - 440) < 20) {
          this.mouseOn.INSTRUCTION = true;
          clicked === true ? changePage("INSTRUCTION") : 1;
        } else if (Math.abs(x - 400) < 100 && Math.abs(y - 520) < 20) {
          this.mouseOn.SCORE = true;
          clicked === true ? changePage("SCORE") : 1;
        } else if (Math.abs(x - 400) < 100 && Math.abs(y - 600) < 20) {
          this.mouseOn.ACHIEVEMENT = true;
          clicked === true ? changePage("ACHIEVEMENT") : 1;
        }
      }
    }
    //############################################### INSTRUCTION SCREEN ######################################
    var content =
      "Feed the virus instructions into MIPS architecture " +
      "\nprocessor that control the rockets " +
      "to destroy them." +
      "\nMove Left: A" +
      "\nMove Right: D" +
      "\nJump: Space Bar" +
      "\nAttack: H" +
      "\nExit: `";

    //CITATION: brownianMotion is initially comes from
    //http://processingjs.org/learning/topic/brownian/
    class brownianMotion {
      constructor() {
        this.maxVal = 2;
        this.points = [];
        for (var i = 0; i < this.maxVal; i++) {
          this.points.push(new PVector(400 + 800, 400));
        }
      }

      display() {
        for (var i = 1; i < this.maxVal; i++) {
          this.points[i - 1].x = this.points[i].x;
          this.points[i - 1].y = this.points[i].y;
        }
        this.points[this.maxVal - 1].x += random(-100, 100);
        this.points[this.maxVal - 1].y += random(-100, 100);
        this.points[this.maxVal - 1].x = constrain(
          this.points[this.maxVal - 1].x,
          850,
          1600
        );
        this.points[this.maxVal - 1].y = constrain(
          this.points[this.maxVal - 1].y,
          0,
          800
        );
        for (var i = 1; i < this.maxVal; i++) {
          stroke((i / this.maxVal) * 204.0 + 51);
          strokeWeight(10);

          line(
            this.points[i - 1].x,
            this.points[i - 1].y,
            this.points[i].x,
            this.points[i].y
          );
          noStroke();
        }
      }
    }

    class instructionObj {
      constructor() {
        this.x = 800;
        this.instrTitle = new titleOjb(400 + this.x, 200, instrTitleImage);
        this.brownian = [];
        for (var i = 0; i < 10; i++) {
          this.brownian.push(new brownianMotion());
        }
      }
      display() {
        rectMode(CENTER);
        fill(53, 150, 181);
        rect(400 + this.x, 400, 800, 800);
        fill(254, 254, 223);
        for (var i = 0; i < 10; i++) {
          this.brownian[i].display();
        }
        textAlign(CENTER);
        textFont(gameFont, 20);
        textLeading(40);
        text(content, 400 + this.x, 320);
        textFont(gameFont, 10);
        text("Press ` to go back", 400 + this.x, 700);
        fill(255, 255, 255);
        this.instrTitle.display();
      }
    }

    //############################################### SCORE SCREEN ############################################

    //                                        _______ BIG ROCKET OBJECT__________

    class bigRocketObj extends rocketObj {
      constructor(x, y, img, direction) {
        super();
        this.pos = new PVector(x, y);
        this.nextPos = new PVector(x, y);
        this.img = img;
        this.imgIndex = 0;
        this.curAngle = 0;
        this.nextAngle = 0;
        this.direction = direction;
        this.moving = false;
        this.curFrame = frameCount;
        this.state = "stationary";
        this.travelPos = "left";
        this.size = IMAGESIZE * 2;
      }

      travel() {
        this.display();
        switch (this.travelPos) {
          case "left":
            if (!this.moving) {
              this.move(-400, 50);
              this.travelPos = "top";
            }
            break;

          case "top":
            if (!this.moving) {
              this.move(-50, 400);
              this.travelPos = "right";
            }
            break;

          case "right":
            if (!this.moving) {
              this.move(-400, 750);
              this.travelPos = "bottom";
            }
            break;

          case "bottom":
            if (!this.moving) {
              this.move(-750, 400);
              this.travelPos = "left";
            }
            break;
        }
      }
    }
    //                                        _______ SCORE SCREEN OBJECT__________

    class scoreObj {
      constructor() {
        this.score = 0;
        this.x = -800;
        this.bigRocket = new bigRocketObj(
          50 + this.x,
          400,
          rocketOneImage,
          "ccw"
        );
        this.scoreTitle = new titleOjb(400 + this.x, 200, scoreTitleImage);
      }

      display(score) {
        this.score = score;
        rectMode(CENTER);
        fill(127, 158, 250);
        rect(-400, 400, 800, 800);
        fill(254, 254, 223);
        this.bigRocket.travel();
        textAlign(CENTER, CENTER);
        textFont(gameFont, 30);
        text("Player One", 400 + this.x, 340);
        text("Player Two", 400 + this.x, 400);
        text("Player Three", 400 + this.x, 460);
        textFont(gameFont, 10);
        text("Press ` to go back", 400 + this.x, 700);
        this.scoreTitle.display();
      }
    }

    //############################################### GAME SCREEN ######################################

    class playerOjb {}

    class gameOjb {
      constructor() {
        this.map = 1;
      }
    }

    //############################################### ACHIEVEMENT SCREEN ######################################

    // Fireworks are implemented from the Professor's code samples (code_lec09_fireworks_3.txt)
    angleMode = "degrees";
    //                                        _______ EXPLOSION OBJECT__________
    class explosionObj {
      constructor(a) {
        this.position = new PVector(0, 0);
        this.direction = new PVector(0, 0);
        this.size = random(1, 20);
        if (a === 0) {
          this.c1 = random(0, 250);
        } else {
          this.c1 = random(100, 255);
        }
        if (a === 1) {
          this.c2 = random(0, 250);
        } else {
          this.c2 = random(100, 255);
        }
        if (a === 3) {
          this.c3 = random(0, 250);
        } else {
          this.c3 = random(100, 255);
        }
        this.timer = 0;
      }

      display() {
        fill(this.c1, this.c2, this.c3, this.timer); // 4th value fader
        noStroke();
        ellipse(this.position.x, this.position.y, this.size, this.size);

        this.position.x += this.direction.y * cos(this.direction.x);
        this.position.y += this.direction.y * sin(this.direction.x);
        /*  this.position.add(this.direction); // random cartesian direction */
        this.position.y += 90 / (this.timer + 100); //gravity
        this.timer--;
      }
    }

    //                                        _______ FIREWORK OBJECT__________
    class fireworkObj {
      constructor(a) {
        this.position = new PVector(200, 380);
        this.direction = new PVector(0, 0);
        this.target = new PVector(mouseX, mouseY);
        this.step = 0;
        this.explosions = [];
        for (var i = 0; i < 200; i++) {
          this.explosions.push(new explosionObj(a));
        }
      }

      display() {
        fill(255, 255, 255);
        noStroke();
        ellipse(this.position.x, this.position.y, 2, 2);

        this.position.add(this.direction);
        if (
          dist(this.position.x, this.position.y, this.target.x, this.target.y) <
          4
        ) {
          this.step = 2;
          for (var i = 0; i < this.explosions.length; i++) {
            this.explosions[i].position.set(this.target.x, this.target.y);
            this.explosions[i].direction.set(random(0, 360), random(-0.3, 0.3));
            this.explosions[i].timer = 180;
          }
        }
      }
    }

    //                                        _______ ACHIEVEMENT OBJECT__________
    class achievementObj {
      constructor() {
        this.y = 800;
        this.achievements = [];
        this.achievementTitle = new titleOjb(
          400,
          this.y + 200,
          achievementTitleImage
        );
        this.firework = [];
        for (var i = 0; i < 10; i++) {
          this.firework.push(new fireworkObj(random(0, 2)));
        }
      }

      displayFireworks() {
        for (var j = 0; j < this.firework.length; j++) {
          if (this.firework[j].step === 0) {
            this.firework[j].position.set(400, 1500);
            this.firework[j].target.set(random(100, 800), random(800, 1600));
            this.firework[j].direction.set(
              this.firework[j].target.x - this.firework[j].position.x,
              this.firework[j].target.y - this.firework[j].position.y
            );
            var s = random(1, 2) / 100;
            this.firework[j].direction.mult(s);
            this.firework[j].step++;
          } else if (this.firework[j].step === 1) {
            this.firework[j].display();
          } else if (this.firework[j].step === 2) {
            for (var i = 0; i < this.firework[j].explosions.length; i++) {
              this.firework[j].explosions[i].display();
            }
            if (this.firework[j].explosions[0].timer <= 0) {
              this.firework[j].step = 0;
            }
          }
        }
      }

      display() {
        rectMode(CENTER);
        fill(44, 31, 34);
        rect(0, 1200, 1600, 800);

        if (STATE.ACHIEVEMENT) {
          this.displayFireworks();
        }

        fill(254, 254, 223);

        textAlign(CENTER, CENTER);
        textFont(gameFont, 30);
        text("Achievement One!", 400, this.y + 340);
        text("Achievement Two!", 400, this.y + 400);
        text("Achievement Three!", 400, this.y + 460);
        textFont(gameFont, 10);
        text("Press ` to go back", 400, this.y + 700);
        this.achievementTitle.display();
      }
    }



    //############################################### BULLET OBJECT ##################################
    class bulletObj {
      constructor() {
        this.pos = new PVector(-1000, -1000);
        this.distance = 0;
        this.curTime = millis();
        this.preTime = this.curTime;
        this.direction = "NONE";
        this.frameIndex = 0;
        this.shooting = false;
      }

      changeFrameIndex() {
        this.curTime = millis();
        if (this.curTime - this.preTime > 100) {
          this.updatePos();
          this.frameIndex++;
          this.preTime = this.curTime;
        }
        if (this.frameIndex > 3) {
          this.frameIndex = 0;
          this.shooting = false;
          this.direction = "NONE";
          this.pos.set(-1000, -1000);
        }
      }

      fire(x, y, direction) {
        this.pos.set(x, y);
        this.direction = direction;
        this.frameIndex = 0;
        this.shooting = true;
      }

      display() {
        if (this.shooting) {
          this.changeFrameIndex();
          image(
            bulletImages[this.frameIndex],
            this.pos.x,
            this.pos.y,
            IMAGESIZE,
            IMAGESIZE
          );
        }
      }

      updatePos() {
        if (this.direction === "LEFT") {
          this.pos.x -= 50;
        } else if (this.direction === "RIGHT") {
          this.pos.x += 50;
        }
      }
    }

    bullets = [
      new bulletObj(),
      new bulletObj(),
      new bulletObj(),
      new bulletObj()
    ];
    //############################################### TILE MAP ##################################

    class obj {
      constructor(x, y, name) {
        this.pos = new PVector(x, y);
        this.name = name;
        this.curTime = millis();
        this.preTime = this.curTime;
        this.frameIndex = 0;
      }

      changeFrameIndex() {
        this.curTime = millis();
        if (this.curTime - this.preTime > 200) {
          this.frameIndex++;
          this.preTime = this.curTime;
        }
        if (this.frameIndex > 3) {
          this.frameIndex = 0;
        }
      }

      removeObj(){
        this.pos.set(-1000, -1000);
      }

      display() {
        this.changeFrameIndex();
        pushMatrix();
        imageMode(CENTER);
        if (this.name === "wall") {
          image(wallImage, this.pos.x, this.pos.y, IMAGESIZE, IMAGESIZE);
        } else if (this.name == "trap") {
          image(
            trapImages[this.frameIndex],
            this.pos.x,
            this.pos.y,
            IMAGESIZE,
            IMAGESIZE
          );
        } else if (this.name == "coin") {
          image(
            coinImages[this.frameIndex],
            this.pos.x,
            this.pos.y,
            IMAGESIZE,
            IMAGESIZE
          );
        }
        popMatrix();
      }
    }

    var tileMap = [
      "wwwwwwwwwwwwwwwww",
      "w  m      c     w",
      "wwwww   w www   w",
      "w   c c     c   w",
      "w   w w  ww     w",
      "w  c  c    m    w",
      "w  c     wwww   w",
      "w    m        t w",
      "w   www  c      w",
      "w        cc w   w",
      "w  c   w c      w",
      "w  m        ww  w",
      "w   c     w     w",
      "wtttt  c     cccw",
      "w      c   c wwww",
      "w   m         p w",
      "wwwwwwwwwwwwwwwww"
    ];

    class gameObj {
      constructor() {
        this.objects = [];
        this.monsters = [];
        this.player = new playerObj(0, 0);
        this.gameCenter = new PVector(0, 0);
      }

      initGame() {
        for (var y = 0; y < tileMap.length; y++) {
          for (var x = 0; x < tileMap[y].length; x++) {
            switch (tileMap[y][x]) {
              case "w":
                this.objects.push(
                  new obj(x * IMAGESIZE, y * IMAGESIZE, "wall")
                );
                break;
              case "t":
                this.objects.push(
                  new obj(x * IMAGESIZE, y * IMAGESIZE, "trap")
                );
                break;
              case "p":
                this.player.setPos(x * IMAGESIZE, y * IMAGESIZE);
                break;
              case "c":
                this.objects.push(
                  new obj(x * IMAGESIZE, y * IMAGESIZE, "coin")                 
                );
                remainPoints++;
                break;
              case "m":
                this.monsters.push(
                  new monsterObj(x * IMAGESIZE, y * IMAGESIZE)
                );
                remainPoints++;
                break;
            }
          }
        }
      }

      collisionCheck() {
        // var playerBottom = this.player.pos.y + 25;
        for (var i = 0; i < this.objects.length; i++) {
          // var wallTop = this.objects[i].pos.y - 25;
          if (this.objects[i].name === "wall") {
            if (
              this.objects[i].pos.x < this.player.pos.x + 25 &&
              this.objects[i].pos.x + 25 > this.player.pos.x &&
              this.player.pos.y + 25 <= this.objects[i].pos.y - 25
            ) {
              // GROUND COLLISION
              this.player.updateGroundLv(this.objects[i].pos.y - IMAGESIZE);
              break;
            } else {
              this.player.groundLv = 1000;
            }
          } else if (this.objects[i].name === "trap") {
            if (
              dist(
                this.objects[i].pos.x,
                this.objects[i].pos.y,
                this.player.pos.x,
                this.player.pos.y
              ) < 50
            ) {
              changePage("SCORE");
            }
          }
          else if (this.objects[i].name == "coin"){
            if (
              dist(
                this.objects[i].pos.x,
                this.objects[i].pos.y,
                this.player.pos.x,
                this.player.pos.y
              ) < 50
            ) {
              //TODO: add score
              playerScore.one ++;
              this.objects[i].removeObj();
              remainPoints--;
            }
          }
        }

        for (var i = 0; i < this.monsters.length; i++) {
          if (
            dist(
              this.player.pos.x,
              this.player.pos.y,
              this.monsters[i].pos.x,
              this.monsters[i].pos.y
            ) < 50
          ) {
            changePage("SCORE");
          }

          for (var z = 0; z < bullets.length; z++) {
            if (
              dist(
                this.monsters[i].pos.x,
                this.monsters[i].pos.y,
                bullets[z].pos.x,
                bullets[z].pos.y
              ) < 50
            ) {
              this.monsters[i].killed();
              remainPoints--;
              playerScore.one ++;
            }
          }
        }
      }

      display() {
        if (remainPoints === 0){
          changePage("ACHIEVEMENT");
        }
        for (var i = 0; i < this.objects.length; i++) {
          this.objects[i].display();
        }
        for (var i = 0; i < this.monsters.length; i++) {
          this.monsters[i].display();
        }
        this.player.display();
        this.player.keyPressed();
        this.collisionCheck();
      }
    }

    //############################################### MONSTER OBJECT ##################################
    class monsterObj {
      constructor(x, y) {
        this.pos = new PVector(x, y);
        this.curTime = millis();
        this.preTime = this.curTime;
        this.frameIndex = 0;
        this.direction = {
          LEFT: true,
          RIGHT: false
        };
        this.die = false;
      }

      killed() {
        this.die = true;
        this.pos.set(-1000, -1000);
      }

      changeFrameIndex() {
        this.curTime = millis();
        if (this.curTime - this.preTime > 200) {
          this.frameIndex++;
          this.preTime = this.curTime;
        }
        if (this.frameIndex > 3) {
          this.frameIndex = 0;
        }
      }

      display() {
        if (!this.die) {
          this.changeFrameIndex();
          this.move();
          pushMatrix();
          if (this.direction.RIGHT) {
            scale(-1, 1);
            image(
              monsterImages[this.frameIndex],
              -this.pos.x,
              this.pos.y,
              IMAGESIZE,
              IMAGESIZE
            );
          } else {
            image(
              monsterImages[this.frameIndex],
              this.pos.x,
              this.pos.y,
              IMAGESIZE,
              IMAGESIZE
            );
          }
          popMatrix();
        }
      }

      move() {
        if (this.direction.LEFT) {
          this.pos.x--;
        } else if (this.direction.RIGHT) {
          this.pos.x++;
        }

        if (this.pos.x < 100) {
          this.direction.LEFT = false;
          this.direction.RIGHT = true;
        }

        if (this.pos.x > 700) {
          this.direction.LEFT = true;
          this.direction.RIGHT = false;
        }
      }
    }

    //############################################### PLAYER OBJECT ##################################
    var keyArray = [];
    var GRAVITY = new PVector(0, 0.15);
    var LEFTFORCE = new PVector(-0.01, 0);
    var RIGHTFORCE = new PVector(0.01, 0);
    var JUMPFORCE = new PVector(0, -7);

    class playerObj {
      constructor(x, y) {
        this.pos = new PVector(x, y);
        this.velocity = new PVector(0, 0);
        this.acceleration = new PVector(0, 0);
        this.force = new PVector(0, 0);
        this.curTime = millis();
        this.preTime = this.curTime;
        this.curBulletTime = millis();
        this.preBulletTime = this.curBulletTime;
        this.frameIndex = 0;
        this.groundLv = y;
        this.stop = false;

        this.bulletIndex = 0;
        // this.stopLeft = false;
        // this.stopRight = false;
        this.state = {
          IDLE: false,
          RUN: true,
          JUMP: false,
          SHOOT: false,
          DIE: false
        };

        this.direction = {
          LEFT: false,
          RIGHT: false
        };
      }

      stopMovement() {
        this.stop = true;
      }

      setPos(x, y) {
        this.pos.set(x, y);
        this.groundLv = y;
      }

      changeState(inputState) {
        this.state.IDLE = false;
        this.state.RUN = false;
        this.state.DIE = false;
        this.state[inputState] = true;
      }

      changeDirection(inputDirection) {
        this.direction.LEFT = false;
        this.direction.RIGHT = false;
        this.direction[inputDirection] = true;
      }

      changeFrameIndex() {
        this.curTime = millis();
        if (this.curTime - this.preTime > 200) {
          this.frameIndex++;
          this.preTime = this.curTime;
        }
        if (this.frameIndex > 3) {
          this.frameIndex = 0;
        }
      }

      applyForce(force) {
        this.acceleration.add(force);
      }

      updateVelocity() {
        this.velocity.add(0, this.acceleration.y);
        this.pos.add(this.velocity);
      }

      standing() {
        if (this.velocity.y > 0) {
          if (this.pos.y >= this.groundLv) {
            this.pos.y = this.groundLv;
            this.velocity.y = 0;
            this.state.JUMP = false;
          }
        }
      }

      display() {
        this.curBulletTime = millis();
        this.applyForce(this.force);
        this.applyForce(GRAVITY);
        this.velocity.add(this.acceleration);
        this.pos.add(this.velocity);
        this.acceleration.set(0, 0);
        this.stopLeft = false;
        if (this.state.JUMP) {
          this.force.set(0, 0);
          this.acceleration.set(0, 0);
        } else {
          this.acceleration.set(0, 0.1);
        }

        this.standing();

        this.changeFrameIndex();
        pushMatrix();
        imageMode(CENTER);
        if (this.direction.LEFT) {
          scale(-1.0, 1.0);
          this.idle(-this.pos.x);
          this.run(-this.pos.x);
        } else {
          this.idle(this.pos.x);
          this.run(this.pos.x);
        }
        popMatrix();
        for (var i = 0; i < bullets.length; i++) {
          bullets[i].display();
        }

        this.stop = false;
      }

      updateGroundLv(point) {
        this.groundLv = point;
      }

      keyPressed() {
        var pressed = false;
        if (keyArray[65] === 1) {
          if (!this.stop) {
            this.pos.x -= 2;
            this.changeDirection("LEFT");
            this.changeState("RUN");
          }
          pressed = true;
        }
        if (keyArray[68] === 1) {
          if (!this.stop) {
            this.pos.x += 2;
            this.changeDirection("RIGHT");
            this.changeState("RUN");
          }
          pressed = true;
        }
        if (keyArray[72] == 1) {
          this.shoot();
          this.changeState("SHOOT");
        }

        if (keyArray[32] === 1) {
          this.jump();
        }

        if (!pressed) {
          this.changeState("IDLE");
        }
      }

      idle(x) {
        if (this.state.IDLE) {
          image(
            playerImages.idle[this.frameIndex],
            x,
            this.pos.y,
            IMAGESIZE,
            IMAGESIZE
          );
        }
      }

      run(x) {
        if (this.state.RUN) {
          image(
            playerImages.run[this.frameIndex],
            x,
            this.pos.y,
            IMAGESIZE,
            IMAGESIZE
          );
        }
      }

      shoot() {
        if (this.curBulletTime - this.preBulletTime > 200) {
          if (this.direction.RIGHT) {
            bullets[this.bulletIndex].fire(
              this.pos.x + 20,
              this.pos.y,
              "RIGHT"
            );
          } else {
            bullets[this.bulletIndex].fire(this.pos.x - 20, this.pos.y, "LEFT");
          }
          this.preBulletTime = this.curBulletTime;
          this.bulletIndex++;
        }

        if (this.bulletIndex > 3) {
          this.bulletIndex = 0;
        }
      }

      jump() {
        if (!this.state.JUMP) {
          this.state.JUMP = true;
          this.applyForce(JUMPFORCE);
        }
      }
    }

    //############################################### CREATE VARIABLE ######################################
    var openScreen = new openObj();
    var scoreScreen = new scoreObj();
    var instrScreen = new instructionObj();
    var achievementScreen = new achievementObj();
    var sectionPos = new PVector(0, 0);
    var game = new gameObj();
    game.initGame();
    //############################################### INPUT CONTROL ######################################

    var keyPressed = function() {
      keyArray[keyCode] = 1;
      if (keyCode === 192) {
        changePage("OPEN");
      }
    };

    var keyReleased = function() {
      keyArray[keyCode] = 0;
    };

    var mouseClicked = function() {
      if (STATE.OPEN && !openScreen.startShow) {
        openScreen.select(mouseX, mouseY, true);
      }
    };

    var mouseMoved = function() {
      if (STATE.OPEN) {
        openScreen.select(mouseX, mouseY, false);
      }
    };

    //############################################### EXECUTION ######################################
    background(245, 222, 179);
    var draw = function() {
      if (STATE.OPEN) {
        sectionPos.x < 0
          ? (sectionPos.x += 4)
          : sectionPos.x > 0
          ? (sectionPos.x -= 4)
          : 1;

        sectionPos.y < 0
          ? (sectionPos.y += 4)
          : sectionPos.y > 0
          ? (sectionPos.y -= 4)
          : 1;
      } else if (STATE.GAME) {
        background(50, 72, 81);
        game.display();
      } else if (STATE.INSTRUCTION) {
        sectionPos.x > -800 ? (sectionPos.x -= 4) : 1;
      } else if (STATE.SCORE) {
        sectionPos.x < 800 ? (sectionPos.x += 4) : 1;
      } else if (STATE.ACHIEVEMENT) {
        sectionPos.y > -800 ? (sectionPos.y -= 4) : 1;
      }

      if (!STATE.GAME) {
        pushMatrix();
        translate(sectionPos.x, sectionPos.y);
        openScreen.display();
        scoreScreen.display(12);
        instrScreen.display();
        achievementScreen.display();
        popMatrix();
      }
    };

    //######################################################################################################
    //##############################################END HERE##############################################
    //######################################################################################################
  }
};
