// import dumb from "dummy.js";

var sketchProc = function(processingInstance) {
  with (processingInstance) {
    size(800, 800);
    frameRate(120);
    var gameFont = createFont("Bitstream Charter Bold");
    noStroke();
    //######################################################################################################
    //##############################################START HERE##############################################
    //######################################################################################################
    STATE = {
      OPEN: false,
      GAME: true,
      INSTRUCTION: false,
      SCORE: false,
      ACHIEVEMENT: false,
      GAMEOVER: false
    };

    var changePage = function changePage(page) {
      for (var key in STATE) {
        STATE[key] = false;
      }
      STATE[page] = true;
    };
    const IMAGESIZE = 50;

    //############################################### LOAD IMAGES ######################################

    // When developing locally, set url = "."
    // otherwise, set url = "https://thepatriotvirus.s3.amazonaws.com"
    url = ".";

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
      recoil: [loadImage(url + "/images/shootf1.png")],
      dying: [
        loadImage(url + "/images/standf1.png"),
        loadImage(url + "/images/dyingf1.png"),
        loadImage(url + "/images/dyingf2.png"),
        loadImage(url + "/images/dyingf3.png"),
        loadImage(url + "/images/dyingf4.png")
      ],
      jump: [
        loadImage(url + "/images/jumpf1.png"),
        loadImage(url + "/images/jumpf2.png"),
        loadImage(url + "/images/jumpf3.png"),
        loadImage(url + "/images/jumpf4.png")
      ]
    };
    bulletImages = [
      loadImage(url + "/images/bulletf1.png"),
      loadImage(url + "/images/bulletf2.png"),
      loadImage(url + "/images/bulletf3.png"),
      loadImage(url + "/images/bulletf4.png")
    ];

    flameImages = [
      loadImage(url + "/images/flamef1.png"),
      loadImage(url + "/images/flamef2.png"),
      loadImage(url + "/images/flamef3.png"),
      loadImage(url + "/images/flamef4.png")
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
      loadImage(url + "/images/collectiblef1.png"),
      loadImage(url + "/images/collectiblef2.png"),
      loadImage(url + "/images/collectiblef3.png"),
      loadImage(url + "/images/collectiblef4.png")
    ];

    sniperRifle = loadImage(url + "/images/sniper.png");
    flameThrower = loadImage(url + "/images/flameThrower.png");
    keyImage = loadImage(url + "/images/key.png");

    flDiskImage = loadImage(url + "/images/floppyDisk.png");
    binaryImage = loadImage(url + "/images/binary.png");
    wireImage = loadImage(url + "/images/wire.png");
    stairImage = loadImage(url + "/images/ram.png");
    mbImage = loadImage(url + "/images/motherboard.png");
    //############################################### OBJECT ##################################

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

      removeObj() {
        this.pos.set(-1000, -1000);
      }

      display() {
        this.changeFrameIndex();
        pushMatrix();
        imageMode(CENTER);
        if (this.name === "wall") {
          image(wireImage, this.pos.x, this.pos.y, IMAGESIZE, IMAGESIZE);
        } else if (this.name === "stair") {
          image(stairImage, this.pos.x, this.pos.y, IMAGESIZE, IMAGESIZE);
        } else if (this.name === "binary") {
          image(binaryImage, this.pos.x, this.pos.y, IMAGESIZE, IMAGESIZE);
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

    //############################################### BULLET OBJECT ##################################
    class bulletObj extends obj {
      constructor() {
        super();
        this.pos = new PVector(-1000, -1000);
        this.distance = 0;
        this.curTime = millis();
        this.preTime = this.curTime;
        this.direction = "NONE";
        this.frameIndex = 0;
        this.shooting = false;
        this.gunType = "sniper";
        this.ammoImage = bulletImages;
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

      fired(x, y, direction, gunType) {
        if (gunType === "sniper") {
          this.ammoImage = bulletImages;
        }

        if (gunType === "flameThrower") {
          this.ammoImage = flameImages;
        }
        this.gunType = gunType;
        this.pos.set(x, y);
        this.direction = direction;
        this.frameIndex = 0;
        this.shooting = true;
      }

      display() {
        if (this.shooting) {
          this.changeFrameIndex();
          pushMatrix();
          if (this.direction === "LEFT") {
            scale(-1, 1);
            image(
              this.ammoImage[this.frameIndex],
              -this.pos.x,
              this.pos.y,
              IMAGESIZE,
              IMAGESIZE
            );
          } else {
            image(
              this.ammoImage[this.frameIndex],
              this.pos.x,
              this.pos.y,
              IMAGESIZE,
              IMAGESIZE
            );
          }
          popMatrix();
        }
      }

      updatePos() {
        var ammoRange = 0;
        if (this.gunType === "sniper") {
          ammoRange = 100;
        }

        if (this.gunType == "flameThrower") {
          ammoRange = 25;
        }

        if (this.direction === "LEFT") {
          this.pos.x -= ammoRange;
        } else if (this.direction === "RIGHT") {
          this.pos.x += ammoRange;
        }
      }
    }

    bullets = [
      new bulletObj(),
      new bulletObj(),
      new bulletObj(),
      new bulletObj()
    ];
    //############################################### GAME OBJECT ##################################

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
              case "s":
                this.objects.push(
                  new obj(x * IMAGESIZE, y * IMAGESIZE, "stair")
                );
                break;
              case "b":
                this.objects.push(
                  new obj(x * IMAGESIZE, y * IMAGESIZE, "binary")
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
                break;
              case "m":
                this.monsters.push(
                  new monsterObj(x * IMAGESIZE, y * IMAGESIZE)
                );
                break;
            }
          }
        }
      }

      collisionCheck() {
        // var playerBottom = this.player.pos.y + 25;
        for (var i = 0; i < this.objects.length; i++) {
          if (
            this.objects[i].name === "wall" ||
            this.objects[i].name === "stair" ||
            this.objects[i].name === "binary"
          ) {
            if (
              this.objects[i].pos.x < this.player.pos.x + 50 &&
              this.objects[i].pos.x + 50 > this.player.pos.x &&
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
              // changePage("SCORE");
            }
          } else if (this.objects[i].name == "coin") {
            if (
              dist(
                this.objects[i].pos.x,
                this.objects[i].pos.y,
                this.player.pos.x,
                this.player.pos.y
              ) < 50
            ) {
              //TODO: add score
              this.objects[i].removeObj();
            }
          } else if (this.objects[i].name == "energy") {
            if (
              dist(
                this.objects[i].pos.x,
                this.objects[i].pos.y,
                this.player.pos.x,
                this.player.pos.y
              ) < 50
            ) {
              this.player.recoverHP();
              this.objects[i].removeObj();
            }
          }
        }

        for (i = 0; i < this.monsters.length; i++) {
          if (
            dist(
              this.player.pos.x,
              this.player.pos.y,
              this.monsters[i].pos.x,
              this.monsters[i].pos.y
            ) < 50
          ) {
            this.player.deductHp();
            // changePage("SCORE");
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
            }
          }
        }
      }

      display() {
        background(255, 255, 255);
        for (var i = 0; i < this.objects.length; i++) {
          this.objects[i].display();
        }
        for (i = 0; i < this.monsters.length; i++) {
          this.monsters[i].display(this.player.pos.x, this.player.pos.y);
        }
        this.player.display();
        this.player.keyPressed();
        this.collisionCheck();
      }
    }

    //############################################### MONSTER OBJECT ##################################
    class monsterObj extends obj {
      constructor(x, y) {
        super();
        this.pos = new PVector(x, y);
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

      display(playerX, playerY) {
        if (this.die) {
          return;
        }

        this.changeFrameIndex();
        this.move(playerX, playerY);

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

      move(playerX, playerY) {
        if (abs(this.pos.y) - abs(playerY) === 0) {
          if (this.pos.x - playerX < 0) {
            this.pos.x++;
            this.direction.LEFT = false;
            this.direction.RIGHT = true;
          } else {
            this.pos.x--;
            this.direction.LEFT = true;
            this.direction.RIGHT = false;
          }
        } else {
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
    }

    //############################################### PLAYER OBJECT ##################################
    var keyArray = [];
    var GRAVITY = new PVector(0, 0.15);
    var JUMPFORCE = new PVector(0, -7);

    class playerObj extends obj {
      constructor(x, y) {
        super();
        this.velocity = new PVector(0, 0);
        this.acceleration = new PVector(0, 0);
        this.force = new PVector(0, 0);

        this.curBulletTime = millis();
        this.preBulletTime = this.curBulletTime;

        this.curHpTime = millis();
        this.preHpTime = this.curHpTime;
        this.hp = 50;

        this.groundLv = y;

        this.gunType = "sniper";
        this.bulletIndex = 0;
        this.reloadDelay = 1000;

        this.state = {
          IDLE: false,
          RUN: true,
          JUMP: false,
          SHOOT: false
        };

        this.direction = {
          LEFT: false,
          RIGHT: false
        };
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
        this.curHpTime = millis();

        this.applyForce(this.force);
        this.applyForce(GRAVITY);
        this.velocity.add(this.acceleration);
        this.pos.add(this.velocity);
        this.acceleration.set(0, 0);

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
          this.jump(-this.pos.x);
        } else {
          this.idle(this.pos.x);
          this.run(this.pos.x);
          this.jump(this.pos.x);
        }
        popMatrix();

        for (var i = 0; i < bullets.length; i++) {
          bullets[i].display();
        }

        this.displayHP();
      }

      updateGroundLv(point) {
        this.groundLv = point;
      }

      displayHP() {
        if (this.hp > 20) {
          fill(89, 216, 163);
        } else {
          fill(202, 0, 42);
        }
        rectMode(CENTER);
        rect(this.pos.x, this.pos.y - 40, this.hp, 5);
      }

      deductHp() {
        if (this.curHpTime - this.preHpTime > 120 && this.hp > 0) {
          this.hp -= 2;
          this.preHpTime = this.curHpTime;
        }
        if (this.hp === 0) {
          changePage("GAMEOVER");
        }
      }

      recoverHP() {
        this.hp += 10;
        if (this.hp > 50) {
          this.hp = 50;
        }
      }

      changeGun(gunType) {
        this.gunType = gunType;
        if (gunType === "sniper") {
          this.reloadDelay = 1000;
        }
        if (guntype === "flameThrower") {
          this.reloadDelay = 200;
        }
      }

      idle(x) {
        if (this.state.IDLE && !this.state.JUMP) {
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
        if (this.state.RUN && !this.state.JUMP) {
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
        if (this.curBulletTime - this.preBulletTime > this.reloadDelay) {
          if (this.direction.RIGHT) {
            bullets[this.bulletIndex].fired(
              this.pos.x,
              this.pos.y - 5,
              "RIGHT",
              this.gunType
            );
          } else {
            bullets[this.bulletIndex].fired(
              this.pos.x - 20,
              this.pos.y,
              "LEFT",
              this.gunType
            );
          }
          this.preBulletTime = this.curBulletTime;
          this.bulletIndex++;
        }

        if (this.bulletIndex > 3) {
          this.bulletIndex = 0;
        }
      }

      jump(x) {
        if (this.state.JUMP) {
          image(
            playerImages.jump[this.frameIndex],
            x,
            this.pos.y,
            IMAGESIZE,
            IMAGESIZE
          );
        }
      }

      keyPressed() {
        if (this.state.DIE) {
          return;
        }
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
          // this.changeState("SHOOT");
        }

        if (keyArray[32] === 1) {
          if (!this.state.JUMP) {
            this.state.JUMP = true;
            this.applyForce(JUMPFORCE);
          }
        }

        if (!pressed && !this.state.JUMP) {
          this.changeState("IDLE");
        }
      }
    }

    //############################################### GAME OVER SCREEN ######################################
    class gameOverObj extends obj {
      constructor(x, y) {
        super();
        this.pos = new PVector(x, y);
        this.rgb = 0;
      }

      changeFrameIndex() {
        this.curTime = millis();
        if (this.curTime - this.preTime > 600) {
          this.frameIndex++;
          this.preTime = this.curTime;
        }
        if (this.frameIndex > 4) {
          this.frameIndex = 4;
        }
      }

      changeColor() {
        this.rgb += 1;
      }

      display() {
        this.changeColor();

        this.changeFrameIndex();
        background(this.rgb, this.rgb, this.rgb);

        fill(255 - this.rgb, 255 - this.rgb, 255 - this.rgb);
        textFont(gameFont, 100);
        rectMode(CENTER);
        textAlign(CENTER, CENTER);
        text("GAME OVER", 400, 260);

        pushMatrix();
        imageMode(CENTER);
        image(
          playerImages.dying[this.frameIndex],
          this.pos.x,
          this.pos.y,
          IMAGESIZE * 3,
          IMAGESIZE * 3
        );
        popMatrix();
      }
    }

    //############################################### KEYPRESSED ######################################

    var keyPressed = function() {
      keyArray[keyCode] = 1;
    };

    var keyReleased = function() {
      keyArray[keyCode] = 0;
    };

    //############################################### CREATE OBJECT ######################################

    // var player = new playerObj(400, 400);
    var game = new gameObj();
    var gameOver = new gameOverObj(400, 500);
    game.initGame();
    //############################################### EXECUTION ######################################
    var draw = function() {
      // background(50, 72, 81);
      if (STATE.GAME) {
        rectMode(CENTER);
        pushMatrix();
        translate(-game.player.pos.x + 400, -game.player.pos.y + 400);
        game.display();
        popMatrix();

        rectMode(LEFT);
        rect(0, 0, game.player.hp * 16, 50);

        if (game.player.gunType === "sniper") {
          image(sniperRifle, 133, 25, 40, 40);
        } else if (game.player.gunType === "flameThrower") {
          image(flameThrower, 133, 25, 40, 40);
        }

        image(coinImages[0], 400, 25, 30, 30);
        image(keyImage, 667, 25, 30, 30);
        image(keyImage, 697, 25, 30, 30);
        image(keyImage, 727, 25, 30, 30);

        fill(0, 0, 0, 100);
        textFont(gameFont, 15);
        text(20, 420, 30);
      } else if (STATE.GAMEOVER) {
        gameOver.display();
      }
    };

    //######################################################################################################
    //##############################################END HERE##############################################
    //######################################################################################################
  }
};
