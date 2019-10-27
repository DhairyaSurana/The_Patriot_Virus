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

    class rocketObj {
      constructor(x, y, img, direction) {
        this.x = x;
        this.y = y;
        this.img = loadImage(img);
        this.angle = 0;
        this.direction = direction;
      }

      display() {
        pushMatrix();
        translate(this.x, this.y);
        imageMode(CENTER);
        rotate(this.angle);
        image(this.img, 0, 0, IMAGESIZE, IMAGESIZE);
        popMatrix();
        this.direction === "cw"
          ? (this.angle -= ROTATESPEED)
          : (this.angle += ROTATESPEED);
      }

      fly() {}
    }

    class earthObj {
      constructor(x, y, img) {
        this.x = x;
        this.y = y;
        this.img = loadImage(img);
        this.opacity = 50;
      }
      display() {
        pushMatrix();
        imageMode(CENTER);
        tint(255, 255, 255, this.opacity);
        image(this.img, this.x, this.y, 300, 300);
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
        this.rocketOne = new rocketObj(
          100,
          100,
          "./images/rocketone.png",
          "ccw"
        );
        this.rocketTwo = new rocketObj(
          350,
          750,
          "./images/rockettwo.png",
          "ccw"
        );
        this.rocketThree = new rocketObj(
          620,
          470,
          "./images/rocketthree.png",
          "cw"
        );
        this.rocketFour = new rocketObj(
          700,
          200,
          "./images/rocketfour.png",
          "ccw"
        );
        this.rocketFive = new rocketObj(
          150,
          500,
          "./images/rocketfive.png",
          "cw"
        );
        this.rocketSix = new rocketObj(
          750,
          720,
          "./images/rocketsix.png",
          "cw"
        );
        this.earth = new earthObj(400, 400, "./images/earth.png");
      }

      display() {
        this.rocketOne.display();
        this.rocketTwo.display();
        this.rocketThree.display();
        this.rocketFour.display();
        this.rocketFive.display();
        this.rocketSix.display();
        if (this.startShow) {
          this.show();
        }
      }

      show() {
        this.earth.display();
      }
    }

    //############################################### SCORE SCREEN ######################################

    class bigRocketObj {
      constructor(x, y, img) {
        this.x = x;
        this.y = y;
        this.img = loadImage(img);
        this.direction = "top";
        this.angle = 0;
        this.nextAngle = PI / 2;
      }

      display() {
        switch (this.direction) {
          case "top":
            if (this.x == 400) {
              this.angle += ROTATESPEED;
              if (this.angle > this.nextAngle) {
                this.direction = "right";
                this.nextAngle += PI / 2;
              }
            } else {
              this.x++;
              this.y--;
            }
            break;

          case "right":
            if (this.y == 400) {
              this.angle += ROTATESPEED;
              if (this.angle > this.nextAngle) {
                this.direction = "bottom";
                this.nextAngle += PI / 2;
              }
            } else {
              this.x++;
              this.y++;
            }
            break;

          case "bottom":
            if (this.x == 400) {
              this.angle += ROTATESPEED;
              if (this.angle > this.nextAngle) {
                this.direction = "left";
                this.nextAngle += PI / 2;
              }
            } else {
              this.x--;
              this.y++;
            }
            break;

          case "left":
            if (this.y == 400) {
              this.angle += ROTATESPEED;
              if (this.angle > this.nextAngle) {
                this.direction = "top";
                this.nextAngle += PI / 2;
              }
            } else {
              this.x--;
              this.y--;
            }
            break;
        }

        pushMatrix();
        imageMode(CENTER);
        translate(this.x, this.y);
        rotate(this.angle);
        image(this.img, 0, 0, IMAGESIZE * 2, IMAGESIZE * 2);
        popMatrix();
      }
    }

    class scoreObj {
      constructor() {
        this.bigRocket = new bigRocketObj(70, 400, "./images/rocketone.png");
        this.score = 0;
      }

      display(score) {
        this.score = score;
        this.bigRocket.display();
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
      openScreen.startShow = true;
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
