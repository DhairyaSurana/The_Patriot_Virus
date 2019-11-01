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
      ACHIVEMENT: false
    };

    var changePage = function changePage(page) {
      STATE.OPEN = false;
      STATE.GAME = false;
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
    url = "https://thepatriotvirus.s3.amazonaws.com"
    openTitleImage = loadImage(url + "/images/gameTitle.png");
    instrTitleImage = loadImage(url + "/images/instrTitle.png");
    scoreTitleImage = loadImage(url + "/images/scoreTitle.png");
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

        this.speed = 1;
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
                ? this.pos.x-=this.speed
                : this.pos.x < this.nextPos.x
                ? this.pos.x+=this.speed
                : (this.pos.x = this.pos.x);
              this.pos.y > this.nextPos.y
                ? this.pos.y-=this.speed
                : this.pos.y < this.nextPos.y
                ? this.pos.y+=this.speed
                : (this.pos.y = this.pos.y);

              this.speed+=0.5;
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
          ACHIVEMENT: false
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
        }
        fill(255, 255, 255);
        textFont(gameFont, 30);
        rectMode(CENTER);
        textAlign(CENTER, CENTER);
        text("START GAME", 400, 360);
        text("HOW TO PLAY", 400, 440);
        text("SCORE", 400, 520);
        text("ACHIVEMENT", 400, 600);
      }

      select(x, y, clicked) {
        this.mouseOn.PLAY = false;
        this.mouseOn.INSTRUCTION = false;
        this.mouseOn.SCORE = false;
        this.mouseOn.ACHIVEMENT = false;

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
      }
    }
    //############################################### INSTRUCTION SCREEN ######################################
    var content =
      "Feed virus instruction to MIPS architecture " +
      "\nprocessor that control the rockets " +
      "to destry them." +
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
    console.log(PFont.list());

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
    //############################################### CREATE VARIABLE ######################################
    var openScreen = new openObj();
    var scoreScreen = new scoreObj();
    var instrScreen = new instructionObj();
    var sectionPos = new PVector(0, 0);
    //############################################### INPUT CONTROL ######################################

    var keyPressed = function() {
      if (keyCode === 192) {
        changePage("OPEN");
      }
    };

    var keyReleased = function() {};

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
      } else if (STATE.GAME) {
      } else if (STATE.INSTRUCTION) {
        sectionPos.x > -800 ? (sectionPos.x -= 4) : 1;
      } else if (STATE.SCORE) {
        sectionPos.x < 800 ? (sectionPos.x += 4) : 1;
      }
      pushMatrix();
      translate(sectionPos.x, sectionPos.y);
      openScreen.display();
      scoreScreen.display(12);
      instrScreen.display();
      popMatrix();
    };

    //######################################################################################################
    //##############################################END HERE##############################################
    //######################################################################################################
  }
};
function screenShake() {}
