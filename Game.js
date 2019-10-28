var sketchProc = function(processingInstance) {
  with (processingInstance) {
    size(800, 800);
    frameRate(60);
    //######################################################################################################
    //##############################################START HERE##############################################
    //######################################################################################################
    STATE = {
      OPEN: false,
      GAME: false,
      INSTRUCTION: false,
      SCORE: true
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
    //############################################### OPENING SCREEN ######################################
    const IMAGESIZE = 64;
    const ROTATESPEED = 0.03;

    rocketOneImage = [
      loadImage("./images/r1f1.png"),
      loadImage("./images/r1f2.png"),
      loadImage("./images/r1f3.png"),
      loadImage("./images/r1f4.png")
    ];
    rocketTwoImage = [
      loadImage("./images/r2f1.png"),
      loadImage("./images/r2f2.png"),
      loadImage("./images/r2f3.png"),
      loadImage("./images/r2f4.png")
    ];
    rocketThreeImage = [
      loadImage("./images/r3f1.png"),
      loadImage("./images/r3f2.png"),
      loadImage("./images/r3f3.png"),
      loadImage("./images/r3f4.png")
    ];
    rocketFourImage = [
      loadImage("./images/r4f1.png"),
      loadImage("./images/r4f2.png"),
      loadImage("./images/r4f3.png"),
      loadImage("./images/r4f4.png")
    ];
    rocketFiveImage = [
      loadImage("./images/r5f1.png"),
      loadImage("./images/r5f2.png"),
      loadImage("./images/r5f3.png"),
      loadImage("./images/r5f4.png")
    ];
    rocketSixImage = [
      loadImage("./images/r6f1.png"),
      loadImage("./images/r6f2.png"),
      loadImage("./images/r6f3.png"),
      loadImage("./images/r6f4.png")
    ];

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
        this.size = IMAGESIZE;
      }

      display() {
        if (this.moving && frameCount - this.curFrame > 3) {
          this.curFrame = frameCount;
          this.imgIndex = Math.floor(Math.random() * 4);
        }

        if (!this.moving) {
          this.imgIndex = 0;
        }

        if (this.moving) {
          this.action();
        } else {
          this.direction === "cw"
            ? (this.curAngle -= ROTATESPEED)
            : (this.curAngle += ROTATESPEED);
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

      action() {
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
    }

    class earthObj {
      constructor(x, y, img, direction) {
        this.pos = new PVector(x, y);
        this.img = loadImage(img);
        this.opacity = 50;
      }
      display() {
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

    class openObj {
      constructor() {
        this.startShow = false;
        this.rocketOne = new rocketObj(100, 100, rocketOneImage, "ccw");
        // this.rocketTwo = new rocketObj(100, 100, rocketTwoImage, "ccw");
        // this.rocketThree = new rocketObj(100, 100, rocketThreeImage, "cw");
        // this.rocketFour = new rocketObj(100, 100, rocketFourImage, "ccw");
        // this.rocketFive = new rocketObj(100, 100, rocketFiveImage, "cw");
        // this.rocketSix = new rocketObj(100, 100, rocketSixImage, "cw");
        this.earth = new earthObj(400, 400, "./images/earth.png");
      }

      display() {
        this.rocketOne.display();
        // this.rocketTwo.display();
        // this.rocketThree.display();
        // this.rocketFour.display();
        // this.rocketFive.display();
        // this.rocketSix.display();
        if (this.startShow) {
          this.earth.display();
        }
      }

      show() {
        this.startShow = true;
        this.rocketOne.move(400, 400);
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

    class scoreObj {
      constructor() {
        this.bigRocket = new bigRocketObj(50, 400, rocketOneImage, "ccw");
        this.score = 0;
      }

      display(score) {
        this.score = score;
        this.bigRocket.travel();
        textAlign(CENTER);
        textLeading(10); //set line distance
        textFont(createFont("monospace", 30), 30);
        text("Achivement", 400, 260);
        textFont(createFont("monospace", 20), 20);
        text("Player One", 400, 320);
        text("Player Two", 400, 380);
        text("Player Three", 400, 440);
        textFont(createFont("monospace", 10), 10);
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

    var draw = function() {
      background(1, 1, 1);
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
