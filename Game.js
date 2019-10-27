var sketchProc = function(processingInstance) {
  with (processingInstance) {
    size(800, 800);
    frameRate(60);
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
        translate(IMAGESIZE / 2, IMAGESIZE / 2);
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
        this.rocketOne = new rocketObj(100, 100, "./images/rocketone.png", "ccw");
        this.rocketTwo = new rocketObj(350, 750, "./images/rockettwo.png", "ccw");
        this.rocketThree = new rocketObj(620, 470, "./images/rocketthree.png", "cw");
        this.rocketFour = new rocketObj(700, 200, "./images/rocketfour.png", "ccw");
        this.rocketFive = new rocketObj(150, 500, "./images/rocketfive.png", "cw");
        this.rocketSix = new rocketObj(750, 720, "./images/rocketsix.png", "cw");
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



    
    class playerOjb {}

    class gameOjb {
      constructor() {
        this.map = 1;
      }
    }

    var openScreen = new openObj();


    var keyPressed = function() {
      if (keyCode === 192) {
        changePage("OPEN");
      }
    };

    var keyReleased = function() {};

    var mouseClicked = function () {
      openScreen.startShow = true;
    };


    var draw = function() {
      background(1, 1, 1);
      if (STATE.OPEN) {
        openScreen.display();
      } else if (STATE.GAME) {
      } else if (STATE.INSTRUCTION) {
      } else if (STATE.SCORE) {
      }
    };

    //######################################################################################################
    //##############################################END HERE##############################################
    //######################################################################################################
  }
};
