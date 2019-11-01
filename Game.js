var sketchProc = function(processingInstance) {
  with (processingInstance) {
    size(800, 800);
    frameRate(60);
    var gameFont = createFont("monospace");
    //######################################################################################################
    //##############################################START HERE##############################################
    //######################################################################################################
    STATE = {
      OPEN: true,
      GAME: false,
      INSTRUCTION: false,
      SCORE: false
    };

    var changePage = function changePage(page) {
      switch (page) {
        case "OPEN":
          STATE.OPEN = true;
          STATE.GAME = false;
          STATE.INSTRUCTION = false;
          STATE.SCORE = false;
          break;
        case "GAME":
          STATE.OPEN = false;
          STATE.GAME = true;
          STATE.INSTRUCTION = false;
          STATE.SCORE = false;
          break;
        case "INSTRUCTION":
          STATE.OPEN = false;
          STATE.GAME = false;
          STATE.INSTRUCTION = true;
          STATE.SCORE = false;
          break;
        case "SCORE":
          STATE.OPEN = false;
          STATE.GAME = false;
          STATE.INSTRUCTION = false;
          STATE.SCORE = true;
          break;
      }
    };

    //############################################### LOAD IMAGES ######################################
    gameTitleImage = loadImage("./images/gameTitle.png");
    ouchImage = [
      loadImage("./images/ouch.png"),
      loadImage("./images/ouch.png"),
      loadImage("./images/ouch.png"),
      loadImage("./images/ouch.png"),
      loadImage("./images/ouch.png")
    ];
    rocketOneImage = [
      loadImage("./images/r1f1.png"),
      loadImage("./images/r1f2.png"),
      loadImage("./images/r1f3.png"),
      loadImage("./images/r1f4.png"),
      loadImage("./images/r1f5.png")
    ];
    rocketTwoImage = [
      loadImage("./images/r2f1.png"),
      loadImage("./images/r2f2.png"),
      loadImage("./images/r2f3.png"),
      loadImage("./images/r2f4.png"),
      loadImage("./images/r2f5.png")
    ];
    rocketThreeImage = [
      loadImage("./images/r3f1.png"),
      loadImage("./images/r3f2.png"),
      loadImage("./images/r3f3.png"),
      loadImage("./images/r3f4.png"),
      loadImage("./images/r3f5.png")
    ];
    rocketFourImage = [
      loadImage("./images/r4f1.png"),
      loadImage("./images/r4f2.png"),
      loadImage("./images/r4f3.png"),
      loadImage("./images/r4f4.png"),
      loadImage("./images/r4f5.png")
    ];
    rocketFiveImage = [
      loadImage("./images/r5f1.png"),
      loadImage("./images/r5f2.png"),
      loadImage("./images/r5f3.png"),
      loadImage("./images/r5f4.png"),
      loadImage("./images/r5f5.png")
    ];
    rocketSixImage = [
      loadImage("./images/r6f1.png"),
      loadImage("./images/r6f2.png"),
      loadImage("./images/r6f3.png"),
      loadImage("./images/r6f4.png"),
      loadImage("./images/r6f5.png")
    ];

    //############################################### OPENING SCREEN ######################################
    const IMAGESIZE = 64;
    const ROTATESPEED = 0.03;

    class rocketObj {
      constructor(x, y, img, direction) {
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
        this.size = IMAGESIZE * 1.5;
        this.exploding = false;
        this.rocketImg = img;
        this.collide = false;

        this.speed = 1;
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

    class earthObj {
      constructor(x, y, img, direction) {
        this.pos = new PVector(x, y);
        this.img = loadImage(img);
        this.opacity = 50;
        this.show = false;
      }
      display() {
        if (this.show) {
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
      move() {
        this.show = true;
      }
    }

    class openObj {
      constructor() {
        this.rocketOne = new rocketObj(100, 100, rocketOneImage, "ccw");
        this.rocketTwo = new rocketObj(750, 750, rocketTwoImage, "ccw");
        this.rocketThree = new rocketObj(700, 100, rocketThreeImage, "cw");
        this.rocketFour = new rocketObj(50, 400, rocketFourImage, "ccw");
        this.rocketFive = new rocketObj(500, 50, rocketFiveImage, "cw");
        this.rocketSix = new rocketObj(100, 750, rocketSixImage, "cw");
        this.earth = new earthObj(400, 400, "./images/earth.png");
        this.startShow = false;
        this.r = 250;
        this.g = 185;
        this.b = 167;
        this.testing = 200;
      }

      display() {
        background(this.r, this.g, this.b);

        if (this.startShow) {
          this.r < 250 ? this.r++ : (this.r = this.r);
          this.g < 240 ? this.g++ : (this.g = this.g);
          this.b > 127 ? this.b-- : (this.b = this.b);
          this.testing <  400 ? this.testing++ : this.testing = this.testing;
        }

        pushMatrix();
        imageMode(CENTER);
        translate(400,this.testing);
        image(gameTitleImage, 0, 0, 500, 100);
        popMatrix();

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
        this.startShow = true;
        this.earth.move();
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
    }

    //############################################### SCORE SCREEN ######################################
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
              this.move(400, 50);
              this.travelPos = "top";
            }
            break;

          case "top":
            if (!this.moving) {
              this.move(750, 400);
              this.travelPos = "right";
            }
            break;

          case "right":
            if (!this.moving) {
              this.move(400, 750);
              this.travelPos = "bottom";
            }
            break;

          case "bottom":
            if (!this.moving) {
              this.move(50, 400);
              this.travelPos = "left";
            }
            break;
        }
      }
    }
    console.log(PFont.list());
    class scoreObj {
      constructor() {
        this.bigRocket = new bigRocketObj(50, 400, rocketOneImage, "ccw");
        this.score = 0;
      }

      display(score) {
        this.score = score;
        background(127, 158, 250);
        this.bigRocket.travel();
        textAlign(CENTER);
        textLeading(10); //set line distance

        textFont(gameFont, 30);
        text("Achivement", 400, 260);
        textFont(gameFont, 20);
        text("Player One", 400, 320);
        text("Player Two", 400, 380);
        text("Player Three", 400, 440);
        textFont(gameFont, 10);
        text("Press ` to go back", 400, 700);
      }
    }

    //############################################### GAME SCREEN ######################################

    class playerOjb {}

    class gameOjb {
      constructor() {
        this.map = 1;
      }
    }

    var openScreen = new openObj();
    var scoreScreen = new scoreObj();

    var keyPressed = function() {
      if (keyCode === 192) {
        changePage("OPEN");
      }
    };

    var keyReleased = function() {};

    var mouseClicked = function() {
      openScreen.show();
    };

    background(245, 222, 179);
    var draw = function() {
      if (STATE.OPEN) {
        openScreen.display();
      } else if (STATE.GAME) {
      } else if (STATE.INSTRUCTION) {
      } else if (STATE.SCORE) {
        scoreScreen.display(12);
        openScreen.startShow = false;
      }
    };

    //######################################################################################################
    //##############################################END HERE##############################################
    //######################################################################################################
  }
};
function screenShake() {}
