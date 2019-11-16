var sketchProc = function (processingInstance) {
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
      MULTIPLECHOICEMINIGAME: false,
      ADDITIONMINIGAME: false, 
      INSTRUCTION: false,
      SCORE: false,
      ACHIVEMENT: false
    };

    var changePage = function changePage(page) {
      STATE.OPEN = false;
      STATE.GAME = false;
      STATE.MULTIPLECHOICEMINIGAME = false;
      STATE.ADDITIONMINIGAME = false;
      STATE.INSTRUCTION = false;
      STATE.SCORE = false;
      STATE.ACHIVEMENT = false;
      switch (page) {
        case "OPEN":
          STATE.OPEN = true;
          break;
        case "GAME":
          STATE.GAME = true;
          break;
        case "MULTIPLECHOICEMINIGAME":
          STATE.MULTIPLECHOICEMINIGAME = true;
          break;
        case "ADDITIONMINIGAME":
          STATE.ADDITIONMINIGAME = true;
          break;
        case "INSTRUCTION":
          STATE.INSTRUCTION = true;
          break;
        case "SCORE":
          STATE.SCORE = true;
          break;
        case "ACHIVEMENT":
          STATE.ACHIVEMENT = true;
          break;
      }
    };

    //############################################### LOAD IMAGES ######################################

    // When developing locally, set url = "."
    // otherwise, set url = "https://thepatriotvirus.s3.amazonaws.com"
    url = "."
    openTitleImage = loadImage(url + "/images/gameTitle.png");
    instrTitleImage = loadImage(url + "/images/instrTitle.png");
    scoreTitleImage = loadImage(url + "/images/scoreTitle.png");
    achievementTitleImage = loadImage(url + "/images/achievementTitle.png");
    earthImage = loadImage(url + "/images/earth.png");

    miniGameBackgroundImage1 = loadImage(url + "/images/digitalBackground.png");
    miniGameBackgroundImage2 = loadImage(url + "/images/digitalBackground2.png");

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

    droidStandImage = [
      loadImage(url + "/images/droidStanding1.png"),
      loadImage(url + "/images/droidStanding2.png"),
      loadImage(url + "/images/droidStanding3.png"),
      loadImage(url + "/images/droidStanding4.png")
    ]

    droidPatrolImage = [
      loadImage(url + "/images/droidPatrolling1.png"),
      loadImage(url + "/images/droidPatrolling2.png"),
      loadImage(url + "/images/droidPatrolling3.png"),
      loadImage(url + "/images/droidPatrolling4.png")
    ];

    //############################################### LOAD SOUNDS ######################################
    
    rocketSound = new Audio("./sounds/rocketSound.mp3");
    introSoundtrack = new Audio("./sounds/introSoundtrack.mp3");
    menuSoundtrack = new Audio("./sounds/mainMenuSoundtrack.mp3");

    //############################################### OPENING SCREEN ######################################
    const IMAGESIZE = 64;
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
          PLAYMULTIPLECHOICE: false,                // TEMPORARY
          PLAYADDITION: false,                      // TEMPORARY
          INSTRUCTION: false,
          SCORE: false,
          ACHIVEMENT: false
        };
        this.clicked = false;
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
            changePage("PLAY");
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

        menuSoundtrack.pause();
        menuSoundtrack.currentTime = 0;
        introSoundtrack.play();

        if (this.startShow) {
          return;
        }
        this.currFrame = frameCount;
        this.startShow = true;
        this.earth.show();
        this.gameTitle.move(400, 400);
        this.rocketOne.move(400, 400);
        this.rocketTwo.move(400, 400);
        this.rocketThree.move(400, 400);
        this.rocketFour.move(400, 400);
        this.rocketFive.move(400, 400);
        this.rocketSix.move(400, 400);
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
        } else if (this.mouseOn.ACHIVEMENT) {
          rect(400, 600, 500, 50, 30);
        } else if (this.mouseOn.PLAYMULTIPLECHOICE) {             // TEMPORARY
          rect(400, 680, 650, 50, 30);
        } else if (this.mouseOn.PLAYADDITION) {                   // TEMPORARY
          rect(400, 760, 500, 50, 30);  
        }
        fill(255, 255, 255);
        textFont(gameFont, 30);
        rectMode(CENTER);
        textAlign(CENTER, CENTER);
        text("START GAME", 400, 360);
        text("HOW TO PLAY", 400, 440);
        text("SCORE", 400, 520);
        text("ACHIEVEMENTS", 400, 600);
        text("START MULTIPLE CHOICE MINI GAME", 400, 680);                        // TEMPORARY 
        text("START ADDITION MINI GAME", 400, 760);                               // TEMPORARY
        fill(39, 36, 89, 150);
        textSize(15);
        text("Represented By Hung Tran & Dhairya Surana", 400, 280);

        if(!this.clicked) {
          fill(255, 0, 0);
          text("(Click for sound)", 400, 310);
        }
      }

      select(x, y, clicked) {
        this.mouseOn.PLAY = false;
        this.mouseOn.INSTRUCTION = false;
        this.mouseOn.SCORE = false;
        this.mouseOn.ACHIVEMENT = false;
        this.mouseOn.PLAYMULTIPLECHOICE = false;                          // TEMPORARY
        this.mouseOn.PLAYADDITION = false;                                // TEMPORARY

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
          this.mouseOn.ACHIVEMENT = true;
          clicked === true ? changePage("ACHIVEMENT") : 1;
        }
        else if (Math.abs(x - 400) < 100 && Math.abs(y - 680) < 20) {             // TEMPORARY
          this.mouseOn.PLAYMULTIPLECHOICE = true;
          clicked === true ? changePage("MULTIPLECHOICEMINIGAME") : 1;   
        }
        else if (Math.abs(x - 400) < 100 && Math.abs(y - 760) < 20) {             // TEMPORARY
          this.mouseOn.PLAYADDITION = true;
          clicked === true ? changePage("ADDITIONMINIGAME") : 1;
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
      "\nAttack: Right Click" +
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

    class droidObj {
  
      constructor(x, y, img, direction) {

        this.pos = new PVector(x, y);

        this.state = "patrolling";
        this.img = img;
        this.imgIndex = 0;
        this.direction = "left";

        this.curFrame = frameCount;
      }

      collisionCheck() {}

      executePatrol() {

          if(this.pos.x == 0) {
              this.direction = "right";
          }
         

          if(this.pos.x == 800) {
              this.direction = "left"
          }
          

          if(!this.collisionCheck()) {
              if(this.direction == "left") {
                  this.pos.x--;
              }

              if(this.direction == "right") {
                  this.pos.x++;
              }
          }
          else {
              this.state = "standing";
              this.imgIndex = 0;
          }

      }

      executeMove() {

          switch(this.state) {
  
            case "standing":
                this.img = droidStandImage;
              break;
  
            case "patrolling":
                this.img = droidPatrolImage;
              break;
          }
      }

      display() {

          this.executeMove();

          if(this.imgIndex == this.img.length - 1) {
              this.imgIndex = 0;
          }
          else if(this.curFrame % 60 == 0){
              this.imgIndex++;
          }

          pushMatrix();
              imageMode(CENTER);
              if(this.direction == "right") {
                  scale(-1, 1);
                  image(this.img[this.imgIndex], -this.pos.x, this.pos.y);
              }
              else {
                  image(this.img[this.imgIndex], this.pos.x, this.pos.y);
              }            
          popMatrix();

      }

      move(desX, desY) {}

      

      explode() {}

      executeExplode() {}

      reset() {}
     
    }
    
    class playerObj { }

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
        }
        else {
          this.c1 = random(100, 255);
        }
        if (a === 1) {
          this.c2 = random(0, 250);
        }
        else {
          this.c2 = random(100, 255);
        }
        if (a === 3) {
          this.c3 = random(0, 250);
        }
        else {
          this.c3 = random(100, 255);
        }
        this.timer = 0;
      }

      display() {

        fill(this.c1, this.c2, this.c3, this.timer);	// 4th value fader
        noStroke();
        ellipse(this.position.x, this.position.y, this.size, this.size);

        this.position.x += this.direction.y * cos(this.direction.x);
        this.position.y += this.direction.y * sin(this.direction.x);
        /*  this.position.add(this.direction); // random cartesian direction */
        this.position.y += (90 / (this.timer + 100));    //gravity
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
        if (dist(this.position.x, this.position.y, this.target.x, this.target.y) < 4) {
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
        this.achievementTitle = new titleOjb(400, this.y + 200, achievementTitleImage);
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
            this.firework[j].direction.set(this.firework[j].target.x - this.firework[j].position.x, this.firework[j].target.y - this.firework[j].position.y);
            var s = random(1, 2) / 100;
            this.firework[j].direction.mult(s);
            this.firework[j].step++;
          }
          else if (this.firework[j].step === 1) {
            this.firework[j].display();
          }
          else if (this.firework[j].step === 2) {
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

        if (STATE.ACHIVEMENT) {
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

    //############################################### MINI GAME SCREENS  ######################################

    //                                       _______ TEXT BOX OBJECT__________
    class textBoxObj {

      constructor(str, x, y, w, h, is_question) {

        this.str = str;

        this.x = x;
        this.y = y;
        this.w = w;
        this.h = h;

        this.is_question = is_question;
        this.is_clicked = false;

      }

      getX() {
        return this.x;
      }

      getY() {
        return this.y;
      }

      getWidth() {
        return this.w;
      }

      getHeight() {
        return this.h;
      }

      display() {

        if(this.is_question == false
          && mouseX >= this.x && mouseX <= this.x + this.w && 
          mouseY >= this.y && mouseY <= this.y + this.h) {
          fill(155, 155, 0);
        }
        else {
          fill(0, 0, 0);
        }

        if(!this.is_question && this.is_clicked) {
          fill(255, 0, 0);
        }

        rect(this.x, this.y, this.w, this.h);

        fill(255, 255, 255);

        textFont(gameFont, 20);
        text(this.str, this.x, this.y);
        
      }

      reset() {
        this.is_clicked = false;
      }
    }

    //                                       _______ USER INPUT BOX OBJECT__________
    class userInputBoxObj { 

      constructor(x, y, w, h) {

        this.x = x;
        this.y = y;
        this.w = w;
        this.h = h;
        this.str = str;

        this.input = "";
      }

      storeInput(input) {
        this.input = input;
      } 

      display(time) {

        rect(this.x, this.y, this.w, this.h);

        fill(0, 0, 0);
        text("Enter: " + this.input, this.x, this.y);

      }

      reset() {
        this.input = "";
      }
    }

    //                                       _______ TIMER OBJECT__________
    class timerObj {

      constructor(limit, x, y) {

        this.limit = limit;
        this.current_sec = this.limit;

        this.x = x;
        this.y = y;

        this.is_paused = false;

      }

      getTime() {

        return this.current_sec;
      }

      pauseTime() {
        this.is_paused = true;
      }

      countDown() {

        if(this.current_sec > 0 && !this.is_paused) {
          this.current_sec-=(1/60);
        }
        
      }

      display() {

        this.countDown();

        if(this.current_sec > this.limit * (2/3)) {
          fill(0, 255, 0);
        }

        else if(this.current_sec > this.limit * (1/3)) {
          fill(255, 255, 0);
        }

        else {
          fill(255, 0, 0);
        }

        textSize(50);
        text(this.current_sec, this.x, this.y);
        
      }

      reset() {
        this.current_sec = this.limit;
        this.is_paused = false;
      }
    }

    //                                       _______ MULITPLE CHOICE MINI GAME OBJECT__________
    class multipleChoiceMiniGameObj {

      constructor() {
        
        this.question_box = new textBoxObj("Calculate the following: 4A6 + 1B3 =", 400, 150, 700, 150, true);

        this.top_left_box = new textBoxObj("659", 200, 350, 300, 100, false);
        this.top_right_box = new textBoxObj("123", 600, 350, 300, 100, false);
        this.bottom_left_box = new textBoxObj("7C2", 200, 550, 300, 100, false);
        this.bottom_right_box = new textBoxObj("H45", 600, 550, 300, 100, false);

        this.answer = "";
        this.actual_answer = "659";

        this.is_correct = false;
        this.is_clicked = false;
        
      }

      getClickStatus() {
        return this.is_clicked;
      }

      setClickStatus() {
        this.is_clicked = true;
      }

      selectOption(text_box) {
        this.answer = text_box.str;
        text_box.is_clicked = true;
        this.is_correct = (this.answer == this.actual_answer) ? true : false;
          
      }

      display() {

        image(miniGameBackgroundImage1, 400, 400, 800, 800);
        
        this.question_box.display();
        
        this.top_left_box.display();
        this.top_right_box.display();
        this.bottom_left_box.display();
        this.bottom_right_box.display();

        if(this.is_clicked) {
          textFont(gameFont, 20);
          if(this.is_correct) {
            fill(0, 255, 0);
            text("CORRECT", 400, 650);
          }
          else {
            fill(255, 0, 0);
            text("WRONG", 400, 650);
          }
        }

        fill(255, 255, 255);
        textFont(gameFont, 10);
        text("Press ` to go back", 400, 700);

      }

      reset() {

        this.selected_box = null;
        this.is_clicked = false;
        this.is_correct = false;

        this.top_left_box.reset();
        this.top_right_box.reset();
        this.bottom_left_box.reset();
        this.bottom_right_box.reset();

        this.answer = "";

      }

    
    }

    //                                       _______ ADDITION MINI GAME OBJECT__________
    class additionMiniGameObj {

        constructor() {
          
          this.timer = new timerObj(10, 700, 50);
          this.question_box = new textBoxObj("Calculate the following: 410 + 113", 400, 150, 700, 150, true);
          this.input_box = new userInputBoxObj(400, 400, 700, 150);
          this.answer = "";

          this.actual_answer = "523";

          this.is_correct = false;
          this.is_enter_pressed = false;
          
        }

        getTime() {
          return this.timer.getTime();
        }

        getEnterStatus() {
          return this.is_enter_pressed;
        }
        setEnterStatus() {
          this.is_enter_pressed = true;
        }

        storeCurrentInput(input) {
          this.input_box.storeInput(input);
        }

        checkActualAnswer() {
          this.answer = this.input_box.input;
          this.is_correct = (this.answer == this.actual_answer) ? true : false;
        }
  
        display() {
          
          image(miniGameBackgroundImage2, 400, 400, 800, 800);
          
          this.question_box.display();
          this.input_box.display(this.timer.getTime());

          this.timer.display();

          fill(255, 255, 255);
          textFont(gameFont, 10);
          text("Press ` to go back", 400, 700);

          if(this.is_enter_pressed) {

            this.timer.pauseTime();

            textFont(gameFont, 20);
            if(this.is_correct) {
              fill(0, 255, 0);
              text("CORRECT", 400, 650);
            }
            else {
              fill(255, 0, 0);
              text("WRONG", 400, 650);
            }
          }
  
        }

        reset() {
          this.timer.reset();
          this.input_box.reset();
          this.is_correct = false;
          this.is_enter_pressed = false;
        }
  
      
    }
  
    //############################################### CREATE VARIABLES ######################################
    var openScreen = new openObj();
    var scoreScreen = new scoreObj();
    var instrScreen = new instructionObj();
    var achievementScreen = new achievementObj();

    var multipleChoiceMiniGameScreen = new multipleChoiceMiniGameObj();
    var additionMiniGameScreen = new additionMiniGameObj();

    var userInput = "";

    var sectionPos = new PVector(0, 0);
    //############################################### INPUT CONTROL ######################################

    var keyPressed = function () {

      if (keyCode === 192) {

        if(STATE.ADDITIONMINIGAME) {
          additionMiniGameScreen.reset();
          userInput = "";
        }

        if(STATE.MULTIPLECHOICEMINIGAME) {
          multipleChoiceMiniGameScreen.reset();
        }

        changePage("OPEN");
        
      }

      if(STATE.ADDITIONMINIGAME) {

        if(key.toString() == "\n") {
          additionMiniGameScreen.setEnterStatus();
          additionMiniGameScreen.checkActualAnswer();
        }

        else if(additionMiniGameScreen.getTime() > 0 && !additionMiniGameScreen.getEnterStatus()){
          if(key.toString() == "0" || key.toString() == "1" || key.toString() == "2" || key.toString() == "3" || key.toString() == "4" || 
             key.toString() == "5" || key.toString() == "6" || key.toString() == "7" || key.toString() == "8" ||
             key.toString() == "9") {
          
              userInput += key.toString();
          }

          additionMiniGameScreen.storeCurrentInput(userInput);
        }
      }
    };

    var keyReleased = function () { };

    var mouseClicked = function () {

      if (STATE.OPEN && !openScreen.startShow) {
        openScreen.select(mouseX, mouseY, true);
      }

      if (!openScreen.startShow) {
        menuSoundtrack.play();
        openScreen.clicked = true;
      }

      if (STATE.MULTIPLECHOICEMINIGAME && !multipleChoiceMiniGameScreen.getClickStatus()) {

        var top_left_box = multipleChoiceMiniGameScreen.top_left_box;
        var top_right_box = multipleChoiceMiniGameScreen.top_right_box;
        var bottom_left_box = multipleChoiceMiniGameScreen.bottom_left_box;
        var bottom_right_box = multipleChoiceMiniGameScreen.bottom_right_box;

        if(mouseX >= top_left_box.getX() && mouseX <= top_left_box.getX() + top_left_box.getWidth() &&
           mouseY >= top_left_box.getY() && mouseY <= top_left_box.getY() + top_left_box.getHeight()) {

            multipleChoiceMiniGameScreen.selectOption(top_left_box);
            multipleChoiceMiniGameScreen.setClickStatus();
        }

        if(mouseX >= top_right_box.getX() && mouseX <= top_right_box.getX() + top_right_box.getWidth() &&
          mouseY >= top_right_box.getY() && mouseY <= top_right_box.getY() + top_right_box.getHeight()) {

            multipleChoiceMiniGameScreen.selectOption(top_right_box);
            multipleChoiceMiniGameScreen.setClickStatus();
          
        }

        if(mouseX >= bottom_left_box.getX() && mouseX <= bottom_left_box.getX() + bottom_left_box.getWidth() &&
          mouseY >= bottom_left_box.getY() && mouseY <= bottom_left_box.getY() + bottom_left_box.getHeight()) {
           
            multipleChoiceMiniGameScreen.selectOption(bottom_left_box);
            multipleChoiceMiniGameScreen.setClickStatus();           

        }

        if(mouseX >= bottom_right_box.getX() && mouseX <= bottom_right_box.getX() + bottom_right_box.getWidth() &&
          mouseY >= bottom_right_box.getY() && mouseY <= bottom_right_box.getY() + bottom_right_box.getHeight()) {

            multipleChoiceMiniGameScreen.selectOption(bottom_right_box);
            multipleChoiceMiniGameScreen.setClickStatus();
        }




      }
    
    };

    var mouseMoved = function() {
      if (STATE.OPEN) {
        openScreen.select(mouseX, mouseY, false);
      }
    };

    //############################################### EXECUTION ######################################
    background(245, 222, 179);
    var draw = function () {
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

        if(sectionPos.x == 0 && sectionPos.y == 0) {
          rocketSound.pause();
          rocketSound.currentTime = 0;
        }
      } else if (STATE.GAME) {
      } else if (STATE.INSTRUCTION) {
        sectionPos.x > -800 ? (sectionPos.x -= 4) : 1;
      } else if (STATE.SCORE) {
        sectionPos.x < 800 ? (sectionPos.x += 4) : 1;
        rocketSound.play();
      } else if (STATE.ACHIVEMENT) {
        sectionPos.y > -800 ? (sectionPos.y -= 4) : 1;
      }

      if (!STATE.GAME && !STATE.MULTIPLECHOICEMINIGAME && !STATE.ADDITIONMINIGAME) {
        pushMatrix();
        translate(sectionPos.x, sectionPos.y);
        openScreen.display();
        scoreScreen.display(12);
        instrScreen.display();
        achievementScreen.display();                      
        popMatrix();
      }

      if(STATE.MULTIPLECHOICEMINIGAME) {
        multipleChoiceMiniGameScreen.display();                         // TEMPORARY
      }
      if(STATE.ADDITIONMINIGAME) {
        additionMiniGameScreen.display();                               // TEMPORARY
      }
      
    };

    //######################################################################################################
    //##############################################END HERE##############################################
    //######################################################################################################
  }
};
function screenShake() { }
