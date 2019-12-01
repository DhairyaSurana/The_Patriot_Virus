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
      MUTIPLECHOICE: false,
      ADDITION: false,
      THEMAZE: false,
      INSTRUCTION: false,
      SCORE: false,
      ACHIEVEMENT: false,
      GAMEOVER: false
    };

    var collectedItems = {
      coins: 0,
      key: 0
    };

    var changePage = function changePage(page) {
      for (var key in STATE) {
        STATE[key] = false;
      }
      STATE[page] = true;
    };
    const GAMEIMGSIZE = 50;

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

    shockTrapImages = {
      trap_switch: [
        loadImage(url + "/images/switchf1.png"),
        loadImage(url + "/images/switchf2.png"),
        loadImage(url + "/images/switchf3.png"),
        loadImage(url + "/images/switchf4.png")
      ],

      shock: [
        loadImage(url + "/images/shockf1.png"),
        loadImage(url + "/images/shockf2.png"),
        loadImage(url + "/images/shockf3.png"),
        loadImage(url + "/images/shockf4.png")
      ]
    };

    crushTrapImages = [
      loadImage(url + "/images/springf1.png"),
      loadImage(url + "/images/springf2.png"),
      loadImage(url + "/images/springf3.png"),
      loadImage(url + "/images/springf4.png")
    ];

    parallaxImages = [
      loadImage(url + "/images/purpleSpaceBackground.png"),
      loadImage(url + "/images/purpleFarStars.png"),
      loadImage(url + "/images/spaceStation1.png")
    ];

    coinImages = [
      loadImage(url + "/images/collectiblef1.png"),
      loadImage(url + "/images/collectiblef2.png"),
      loadImage(url + "/images/collectiblef3.png"),
      loadImage(url + "/images/collectiblef4.png")
    ];

    energyImages = [
      loadImage(url + "/images/energyf1.png"),
      loadImage(url + "/images/energyf2.png"),
      loadImage(url + "/images/energyf3.png"),
      loadImage(url + "/images/energyf4.png")
    ];

    sniperRifle = loadImage(url + "/images/sniper.png");
    flameThrower = loadImage(url + "/images/flameThrower.png");
    keyImage = loadImage(url + "/images/key.png");

    flDiskImage = loadImage(url + "/images/floppyDisk.png");
    binaryImage = loadImage(url + "/images/binary.png");
    wireImage = loadImage(url + "/images/wire.png");
    stairImage = loadImage(url + "/images/ram.png");
    mbImage = loadImage(url + "/images/motherboard.png");

    player_image = loadImage("./images/astronaut.png");
    enemy_image = loadImage("./images/alien.png");
    wall_image = loadImage("./images/sciFiWall.png");

    miniGameBackgroundImage1 = loadImage(url + "/images/digitalBackground.png");
    miniGameBackgroundImage2 = loadImage(
      url + "/images/digitalBackground2.png"
    );
    //############################################### LOAD SOUNDS ######################################

    laserSound = new Audio(url + "/sounds/laser.mp3");
    flameSound = new Audio(url + "/sounds/flame.mp3");
    jumpSound = new Audio(url + "/sounds/jump.mp3");
    chargeSound = new Audio(url + "/sounds/charge.mp3");
    blipSound = new Audio(url + "/sounds/blip.mp3");
    clangSound = new Audio(url + "/sounds/clang.mp3");        // Crush trap
    explosionSound = new Audio(url + "/sounds/explosion.mp3");
    powerUpSound = new Audio(url + "/sounds/powerUp.mp3");
    keySound = new Audio (url + "/sounds/keyCollected.mp3");
    mainMenuSoundtrack = new Audio(url + "/sounds/mainMenuSoundtrack.mp3");

    gameSoundtrack = new Audio(url + "/sounds/gameSoundtrack.mp3");
    gameSoundtrack.volume = 0.2;

    gameOverSoundtrack = new Audio(url + "/sounds/OnThingsToCome.mp3");

    additionMiniGameSoundtrack = new Audio(url + "/sounds/CyberREM.mp3");
    additionMiniGameSoundtrack.volume = 0.2;  
    
    multipleChoiceMiniGameSoundtrack = new Audio(url + "/sounds/Stratosphere.mp3");
    multipleChoiceMiniGameSoundtrack.volume = 0.2;

    mazeMiniGameSoundtrack = new Audio(url + "/sounds/SectorOffLimits.mp3");
    mazeMiniGameSoundtrack.volume = 0.2;

    var playSound = function(sound) {
      sound.play();
    };

    var stopSound = function(sound) {
      sound.pause();
      sound.currentTime = 0;
    };

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
        if (this.name === "sniper" || this.name === "flameThrower") {
          playSound(powerUpSound);
        } else if (
          this.name === "miniGame1" ||
          this.name === "miniGame2" ||
          this.name === "miniGame3"
        ) {
          playSound(keySound);
        } else if (this.name === "energy") {
          playSound(chargeSound);
        } else if (this.name == "trap") {

        } else if (this.name == "coin") {
          playSound(blipSound);
        }
        this.pos.set(-1000, -1000);
      }

      display() {
        this.changeFrameIndex();
        pushMatrix();
        imageMode(CENTER);
        if (this.name === "wall") {
          image(wireImage, this.pos.x, this.pos.y, GAMEIMGSIZE, GAMEIMGSIZE);
        } else if (this.name === "stair") {
          image(stairImage, this.pos.x, this.pos.y, GAMEIMGSIZE, GAMEIMGSIZE);
        } else if (this.name === "binary") {
          image(binaryImage, this.pos.x, this.pos.y, GAMEIMGSIZE, GAMEIMGSIZE);
        } else if (this.name === "sniper") {
          image(sniperRifle, this.pos.x, this.pos.y, GAMEIMGSIZE, GAMEIMGSIZE);
        } else if (this.name === "flameThrower") {
          image(flameThrower, this.pos.x, this.pos.y, GAMEIMGSIZE, GAMEIMGSIZE);
        } else if (
          this.name === "miniGame1" ||
          this.name === "miniGame2" ||
          this.name === "miniGame3"
        ) {
          image(keyImage, this.pos.x, this.pos.y, GAMEIMGSIZE, GAMEIMGSIZE);
        } else if (this.name === "energy") {
          image(
            energyImages[this.frameIndex],
            this.pos.x,
            this.pos.y,
            GAMEIMGSIZE,
            GAMEIMGSIZE
          );
        } else if (this.name == "trap") {
          image(
            trapImages[this.frameIndex],
            this.pos.x,
            this.pos.y,
            GAMEIMGSIZE,
            GAMEIMGSIZE
          );
        } else if (this.name == "coin") {
          image(
            coinImages[this.frameIndex],
            this.pos.x,
            this.pos.y,
            GAMEIMGSIZE,
            GAMEIMGSIZE
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
          playSound(laserSound);
        }

        if (gunType === "flameThrower") {
          this.ammoImage = flameImages;
          playSound(flameSound);

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
              GAMEIMGSIZE,
              GAMEIMGSIZE
            );
          } else {
            image(
              this.ammoImage[this.frameIndex],
              this.pos.x,
              this.pos.y,
              GAMEIMGSIZE,
              GAMEIMGSIZE
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
        this.shockTraps = [];
        this.crushTraps = [];
        this.player = new playerObj(0, 0);
        this.gameCenter = new PVector(0, 0);
      }

      initGame() {
        for (var y = 0; y < tileMap.length; y++) {
          for (var x = 0; x < tileMap[y].length; x++) {
            switch (tileMap[y][x]) {
              case "w":
                this.objects.push(
                  new obj(x * GAMEIMGSIZE, y * GAMEIMGSIZE, "wall")
                );
                break;
              case "r":
                this.objects.push(
                  new obj(x * GAMEIMGSIZE, y * GAMEIMGSIZE, "stair")
                );
                break;
              case "b":
                this.objects.push(
                  new obj(x * GAMEIMGSIZE, y * GAMEIMGSIZE, "binary")
                );
                break;
              case "1":
                this.objects.push(
                  new obj(x * GAMEIMGSIZE, y * GAMEIMGSIZE, "miniGame1")
                );
                break;
              case "2":
                this.objects.push(
                  new obj(x * GAMEIMGSIZE, y * GAMEIMGSIZE, "miniGame2")
                );
                break;
              case "3":
                this.objects.push(
                  new obj(x * GAMEIMGSIZE, y * GAMEIMGSIZE, "miniGame3")
                );
                break;
              case "t":
                this.objects.push(
                  new obj(x * GAMEIMGSIZE, y * GAMEIMGSIZE, "trap")
                );
                break;
              case "c":
                this.objects.push(
                  new obj(x * GAMEIMGSIZE, y * GAMEIMGSIZE, "coin")
                );
                break;
              case "e":
                this.objects.push(
                  new obj(x * GAMEIMGSIZE, y * GAMEIMGSIZE, "energy")
                );
                break;
              case "f":
                this.objects.push(
                  new obj(x * GAMEIMGSIZE, y * GAMEIMGSIZE, "flameThrower")
                );
                break;
              case "n":
                this.objects.push(
                  new obj(x * GAMEIMGSIZE, y * GAMEIMGSIZE, "sniper")
                );
                break;
              case "m":
                this.monsters.push(
                  new monsterObj(x * GAMEIMGSIZE, y * GAMEIMGSIZE)
                );
                break;
              case "s":
                this.shockTraps.push(
                  new shockTrapObj(x * GAMEIMGSIZE, y * GAMEIMGSIZE)
                );
                break;
              case "=":
                this.crushTraps.push(
                  new crushTrapObj(x * GAMEIMGSIZE, y * GAMEIMGSIZE)
                );
                break;
              case "p":
                this.player.setPos(x * GAMEIMGSIZE, y * GAMEIMGSIZE);
                break;
            }
          }
        }
      }

      collisionCheck() {
        var playerBottom = this.player.pos.y + 25;
        var playerLeft = this.player.pos.x - 25;
        var playerRight = this.player.pos.x + 25;
        var playerTop = this.player.pos.y - 25;
        for (var i = 0; i < this.objects.length; i++) {
          var objBottom = this.objects[i].pos.y + 25;
          var objLeft = this.objects[i].pos.x - 25;
          var objRight = this.objects[i].pos.x + 25;
          var objTop = this.objects[i].pos.y - 25;
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
              this.player.updateGroundLv(this.objects[i].pos.y - GAMEIMGSIZE);
              break;
            } else {
              this.player.groundLv = 1000;
            }

            if (
              abs(objLeft - playerRight) <= 2 &&
              this.player.pos.y - 25 >= objTop &&
              this.player.pos.y - 25 < objBottom
            ) {
              this.player.pos.x -= 2;
            }

            if (
              abs(objRight - playerLeft) <= 2 &&
              this.player.pos.y - 25 >= objTop &&
              this.player.pos.y - 25 < objBottom
            ) {
              this.player.pos.x += 2;
            }
          } else if (this.objects[i].name === "flameThrower") {
            if (
              dist(
                this.objects[i].pos.x,
                this.objects[i].pos.y,
                this.player.pos.x,
                this.player.pos.y
              ) < 50
            ) {
              this.player.changeGun("flameThrower");
              this.objects[i].removeObj();
            }
          } else if (this.objects[i].name === "sniper") {
            if (
              dist(
                this.objects[i].pos.x,
                this.objects[i].pos.y,
                this.player.pos.x,
                this.player.pos.y
              ) < 50
            ) {
              this.player.changeGun("sniper");
              this.objects[i].removeObj();
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
              collectedItems.coins++;
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
          } else if (this.objects[i].name == "miniGame1") {
            if (
              dist(
                this.objects[i].pos.x,
                this.objects[i].pos.y,
                this.player.pos.x,
                this.player.pos.y
              ) < 50
            ) {
              changePage("MUTIPLECHOICE");
              this.objects[i].removeObj();
            }
          } else if (this.objects[i].name == "miniGame2") {
            if (
              dist(
                this.objects[i].pos.x,
                this.objects[i].pos.y,
                this.player.pos.x,
                this.player.pos.y
              ) < 50
            ) {
              changePage("ADDITION");
              this.objects[i].removeObj();
            }
          } else if (this.objects[i].name == "miniGame3") {
            if (
              dist(
                this.objects[i].pos.x,
                this.objects[i].pos.y,
                this.player.pos.x,
                this.player.pos.y
              ) < 50
            ) {
              changePage("THEMAZE");
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
             
              if(!this.monsters[i].die) {
                playSound(explosionSound);
              }
              this.monsters[i].deductHp();
            }
          }
        }

        for (var i = 0; i < this.shockTraps.length; i++) {
          if (
            dist(
              this.player.pos.x,
              this.player.pos.y,
              this.shockTraps[i].pos.x,
              this.shockTraps[i].pos.y
            ) < 40
          ) {
            this.shockTraps[i].activate();
            this.player.deductHp();
          }
        }

        for (var i = 0; i < this.crushTraps.length; i++) {
          if (
            dist(
              this.player.pos.x,
              this.player.pos.y,
              this.crushTraps[i].pos.x,
              this.crushTraps[i].pos.y
            ) < 40
          ) {
            this.crushTraps[i].activate();
            this.player.deductHp();
          }
        }
      }

      display() {
        playSound(gameSoundtrack);

        for (var i = 0; i < this.objects.length; i++) {
          this.objects[i].display();
        }
        for (i = 0; i < this.monsters.length; i++) {
          this.monsters[i].display(this.player.pos.x, this.player.pos.y);
        }
        this.player.display();
        this.player.keyPressed();

        for (var i = 0; i < this.shockTraps.length; i++) {
          this.shockTraps[i].display();
        }

        for (var i = 0; i < this.crushTraps.length; i++) {
          this.crushTraps[i].display();
        }

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

        this.curHpTime = millis();
        this.preHpTime = this.curHpTime;
        this.hp = 50;

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
        this.curHpTime = millis();
        this.changeFrameIndex();
        this.move(playerX, playerY);

        pushMatrix();
        if (this.direction.RIGHT) {
          scale(-1, 1);
          image(
            monsterImages[this.frameIndex],
            -this.pos.x,
            this.pos.y,
            GAMEIMGSIZE,
            GAMEIMGSIZE
          );
        } else {
          image(
            monsterImages[this.frameIndex],
            this.pos.x,
            this.pos.y,
            GAMEIMGSIZE,
            GAMEIMGSIZE
          );
        }
        popMatrix();

        this.displayHP();
      }

      displayHP() {
        fill(30, 144, 255);
        rectMode(CENTER);
        rect(this.pos.x, this.pos.y - 40, this.hp, 5);
      }

      deductHp() {
        if (this.curHpTime - this.preHpTime > 120 && this.hp > 0) {
          this.hp -= 10;
          this.preHpTime = this.curHpTime;
        }
        if (this.hp === 0) {
          this.killed();
          //TODO: Die animation
        }
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
        this.reloadDelay = 600;

        this.just_jumped = false;

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
        // rectMode(CENTER);
        // rect(this.pos.x, this.pos.y - 40, this.hp, 5);
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

      changeGun(gun) {
        this.gunType = gun;
        if (this.gunType === "sniper") {
          this.reloadDelay = 600;
        }
        if (this.guntype === "flameThrower") {
          this.reloadDelay = 100;
        }
      }

      idle(x) {
        if (this.state.IDLE && !this.state.JUMP) {
          image(
            playerImages.idle[this.frameIndex],
            x,
            this.pos.y,
            GAMEIMGSIZE,
            GAMEIMGSIZE
          );
        }
      }

      run(x) {
        if (this.state.RUN && !this.state.JUMP) {
          image(
            playerImages.run[this.frameIndex],
            x,
            this.pos.y,
            GAMEIMGSIZE,
            GAMEIMGSIZE
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

          if(this.just_jumped) {
            playSound(jumpSound);
            this.just_jumped = false;
          }
          image(
            playerImages.jump[this.frameIndex],
            x,
            this.pos.y,
            GAMEIMGSIZE,
            GAMEIMGSIZE
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
            this.just_jumped = true;
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

        stopSound(gameSoundtrack);
        playSound(gameOverSoundtrack);

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
          GAMEIMGSIZE * 3,
          GAMEIMGSIZE * 3
        );
        popMatrix();
      }
    }

    //############################################### SHOCK TRAP OBJECT ##################################

    class shockTrapObj extends obj {
      constructor(x, y) {
        super();
        this.pos = new PVector(x, y);

        this.switchImages = shockTrapImages["trap_switch"];
        this.shockImages = shockTrapImages["shock"];

        this.frameIndex = 0;
        this.size = GAMEIMGSIZE;

        this.curTime = millis();
        this.preTime = this.curTime;

        this.state = "TRAP SWITCH";

        this.is_activated = false;
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

      executeSwitchChange() {
        image(
          this.switchImages[this.frameIndex],
          this.pos.x,
          this.pos.y,
          this.size * 2,
          this.size
        );
        this.changeFrameIndex();
        if (this.frameIndex == 3) {
          this.state = "SHOCK";
        }
      }

      activate() {
        this.is_activated = true;
      }

      executeShock() {
        image(
          this.switchImages[3],
          this.pos.x,
          this.pos.y,
          this.size * 2,
          this.size
        );
        image(
          this.shockImages[this.frameIndex],
          this.pos.x,
          this.pos.y,
          this.size * 2,
          this.size
        );

        this.changeFrameIndex();
      }

      display() {
        pushMatrix();
        imageMode(CENTER);

        if (this.is_activated) {
          switch (this.state) {
            case "TRAP SWITCH":
              this.executeSwitchChange();
              break;

            case "SHOCK":
              this.executeShock();
              break;
          }
          this.curFrame = frameCount;
        } else {
          image(
            this.switchImages[0],
            this.pos.x,
            this.pos.y,
            this.size * 2,
            this.size
          );
        }

        popMatrix();
      }
    }

    //############################################### CRUSH TRAP OBJECT ##################################

    class crushTrapObj extends obj {
      constructor(x, y) {
        super();
        this.pos = new PVector(x, y);

        this.crushImages = crushTrapImages;

        this.frameIndex = 0;
        this.size = GAMEIMGSIZE * 1.5;

        this.curTime = millis();
        this.preTime = this.curTime;

        this.is_activated = false;
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

      activate() {
        this.is_activated = true;
      }

      display() {
        pushMatrix();
        imageMode(CENTER);

        if (this.is_activated) {

          // if(this.frameIndex == 3) {
          //   //playSound(clangSound);
          // }
          image(
            this.crushImages[this.frameIndex],
            this.pos.x,
            this.pos.y,
            this.size,
            this.size
          );

          scale(-1, -1);
          image(
            this.crushImages[this.frameIndex],
            -this.pos.x,
            -this.pos.y,
            this.size,
            this.size
          );

          this.changeFrameIndex();
          this.curFrame = frameCount;
        } else {
          image(
            this.crushImages[0],
            this.pos.x,
            this.pos.y,
            this.size,
            this.size
          );
        }

        popMatrix();
      }
    }

    //############################################### PARALLAX OBJECT ##################################

    class parallaxObj {
      constructor(image, game, x, y, w, h, loop_condition) {
        this.pos = new PVector(x, y);
        this.image = image;
        this.game = game;

        this.loop_condition = loop_condition;

        this.w = w;
        this.h = h;
      }

      display(rate) {
        if (this.game.player.state["RUN"]) {
          if (this.game.player.direction["RIGHT"]) {
            this.pos.x -= rate;
          } else if (this.game.player.direction["LEFT"]) {
            this.pos.x += rate;
          }

          if (this.loop_condition) {
            if (this.pos.x < -150) {
              this.pos.x = 6000;
              this.pos.y = random(0, 700);
            }

            if (this.pos.x > 6000) {
              this.pos.x = -150;
              this.pos.y = random(0, 700);
            }
          }
        }

        image(this.image, this.pos.x, this.pos.y, this.w, this.h);
      }

      move(rate) {
        this.pos.x += rate;
      }
    }

    //############################################### MULTIPLE CHOICE MINI GAME SCREEN  ######################################

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

        if (
          this.is_question == false &&
          mouseX >= this.x &&
          mouseX <= this.x + this.w &&
          mouseY >= this.y &&
          mouseY <= this.y + this.h
        ) {
          fill(155, 155, 0);
        } else {
          fill(0, 0, 0);
        }

        if (!this.is_question && this.is_clicked) {
          fill(255, 0, 0);
        }

        rect(this.x, this.y, this.w, this.h);

        fill(255);

        textFont(gameFont, 20);

        textAlign(CENTER, CENTER);
        text(this.str, this.x + this.w / 2, this.y + this.h / 2);
      }

      setText(str) {
        this.str = str;
      }

      reset() {
        this.is_clicked = false;
      }
    }

    //                                          _______ MULITPLE CHOICE MINI GAME OBJECT__________
    class multipleChoiceMiniGameObj {
      constructor() {
        this.question_box = new textBoxObj(
          "Calculate the following: 4A6 + 1B3 =",
          50,
          50,
          700,
          150,
          true
        );

        this.top_left_box = new textBoxObj("659", 50, 250, 300, 100, false);
        this.top_right_box = new textBoxObj("123", 450, 250, 300, 100, false);
        this.bottom_left_box = new textBoxObj("7C2", 50, 450, 300, 100, false);
        this.bottom_right_box = new textBoxObj(
          "H45",
          450,
          450,
          300,
          100,
          false
        );

        this.answer = "";
        this.actual_answer = "659";

        this.is_correct = false;
        this.is_clicked = false;
      }

      getClickStatus() {
        return this.is_clicked;
      }

      setClickStatus(bool_value) {
        this.is_clicked = bool_value;
      }

      selectOption(text_box) {
        this.answer = text_box.str;
        text_box.is_clicked = true;
        this.clickedTime = millis();

        this.is_correct = this.answer == this.actual_answer;
        if (this.is_correct) {
          changePage("GAME");
          stopSound(multipleChoiceMiniGameSoundtrack);
          collectedItems.key++;
          this.reset();
        }
      }

      display() {
        stopSound(gameSoundtrack);
        playSound(multipleChoiceMiniGameSoundtrack);

        image(miniGameBackgroundImage1, 400, 400, 800, 800);
        this.currentTime = millis();

        this.question_box.display();

        this.top_left_box.display();
        this.top_right_box.display();
        this.bottom_left_box.display();
        this.bottom_right_box.display();

        if (this.is_clicked) {
          textFont(gameFont, 20);
          if (this.is_correct) {
            fill(0, 255, 0);
            text("CORRECT", 400, 650);
          } else {
            fill(255, 0, 0);
            text("WRONG", 400, 650);

            if (this.currentTime - this.clickedTime >= 100) {
              this.reset();
            }
          }
        }

        fill(255, 255, 255);
        textFont(gameFont, 10);
        text("Good Luck", 400, 700);
      }

      reset() {
        //this.selected_box = null;
        this.currentTime = 0;
        this.is_clicked = false;
        this.is_correct = false;

        this.top_left_box.reset();
        this.top_right_box.reset();
        this.bottom_left_box.reset();
        this.bottom_right_box.reset();

        this.answer = "";
      }
    }
    //############################################### MINI GAME ADDITION SCREENS  ######################################

    //                                       _______ USER INPUT BOX OBJECT__________
    class userInputBoxObj {
      constructor(x, y, w, h) {
        this.x = x;
        this.y = y;
        this.w = w;
        this.h = h;
        this.initialText = "Enter: ";
        this.input = "";
        this.is_clicked = false;
      }

      setClickStatus(bool_value) {
        this.is_clicked = bool_value;
      }

      checkClickStatus() {
        return this.is_clicked;
      }

      clearInitialText() {
        this.initialText = "";
      }

      storeInput(input) {
        this.input = input;
      }

      display(time) {
        rect(this.x, this.y, this.w, this.h);

        fill(0, 0, 0);
        textAlign(CENTER, CENTER);

        if (time > 0) {
          if (this.is_clicked) {
            if (frameCount % 30 != 0) {
              text(this.input + "|", this.x + this.w / 2, this.y + this.h / 2);
            } else {
              text(this.input + " ", this.x + this.w / 2, this.y + this.h / 2);
            }
          } else {
            text(this.initialText, this.x + this.w / 2, this.y + this.h / 2);
          }
        }
      }

      reset() {
        this.input = "";
        this.initialText = "Enter: ";
        this.is_clicked = false;
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
        if (this.current_sec > 0 && !this.is_paused) {
          this.current_sec -= 1 / 60;
        }
      }

      display() {
        this.countDown();

        if (this.current_sec > this.limit * (2 / 3)) {
          fill(0, 255, 0);
        } else if (this.current_sec > this.limit * (1 / 3)) {
          fill(255, 255, 0);
        } else {
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

    //                                       _______ ADDITION MINI GAME OBJECT__________
    class additionMiniGameObj {
      constructor() {
        this.timer = new timerObj(10, 700, 50);
        this.num1 = round(random(10, 50));
        this.num2 = round(random(10, 50));
        this.question_box = new textBoxObj(
          "Calculate the following: " + this.num1 + " + " + this.num2 + " =",
          50,
          150,
          700,
          150,
          true
        );
        this.input_box = new userInputBoxObj(50, 400, 700, 150);
        this.answer = "";

        this.userInput = "";

        this.actual_answer = str(this.num1 + this.num2);

        this.is_correct = false;
        this.is_enter_pressed = false;
      }

      checkInputBoxClickStatus() {
        return this.input_box.checkClickStatus();
      }

      setInputBoxClickStatus(bool_value) {
        this.input_box.setClickStatus(bool_value);
      }

      getTime() {
        return this.timer.getTime();
      }

      getEnterStatus() {
        return this.is_enter_pressed;
      }
      setEnterStatus(bool_value) {
        this.is_enter_pressed = bool_value;
      }

      storeCurrentInput() {
        this.input_box.storeInput(this.userInput);
      }

      checkActualAnswer() {
        this.answer = this.input_box.input;
        this.is_correct = this.answer == this.actual_answer ? true : false;
      }

      display() {
        stopSound(gameSoundtrack);
        playSound(additionMiniGameSoundtrack);

        image(miniGameBackgroundImage2, 400, 400, 800, 800);

        this.question_box.display();
        this.input_box.display(this.timer.getTime());

        this.timer.display();

        fill(255, 255, 255);
        textFont(gameFont, 10);
        text("Press left arrow to delete", 400, 700);
        text("Press r to reset the game", 400, 720);

        if (this.is_enter_pressed) {
          this.timer.pauseTime();

          textFont(gameFont, 20);
          if (this.is_correct) {
            fill(0, 255, 0);
            text("CORRECT", 400, 650);
            changePage("GAME");
            stopSound(additionMiniGameSoundtrack);
            collectedItems.key++;
            this.reset();
          } else {
            fill(255, 0, 0);
            text("WRONG", 400, 650);
          }
        }
      }

      reset() {
        this.num1 = round(random(10, 50));
        this.num2 = round(random(10, 50));
        this.actual_answer = str(this.num1 + this.num2);

        this.timer.reset();

        this.input_box.reset();
        this.question_box.setText(
          "Calculate the following: " + this.num1 + " + " + this.num2 + " ="
        );

        this.is_correct = false;
        this.is_enter_pressed = false;

        this.userInput = "";
      }
    }

    //############################################### MINI GAME THE MAZE SCREEN  ######################

    class player_obj {
      constructor(x, y, image) {
        this.pos = new PVector(x, y);
        this.image = image;

        this.left_collision_occurred = false;
        this.right_collision_occurred = false;
        this.top_collision_occurred = false;
        this.bottom_collision_occurred = false;
      }

      update(walls, enemies, destinations) {
        image(this.image, this.pos.x, this.pos.y);

        //textSize(50);

        for (var i = 0; i < walls.length; i++) {
          fill(255, 255, 255);

          if (
            dist(
              this.pos.x + 5,
              this.pos.y,
              walls[i].pos.x,
              walls[i].pos.y + 10
            ) < 15
          ) {
            this.top_collision_occurred = true;
            //text("TOP HIT", 200, 200);
          }

          if (
            dist(this.pos.x, this.pos.y + 10, walls[i].pos.x, walls[i].pos.y) <
            15
          ) {
            this.bottom_collision_occurred = true;
            //text("BOTTOM HIT", 200, 200);
          }

          if (
            dist(this.pos.x, this.pos.y, walls[i].pos.x + 10, walls[i].pos.y) <
            15
          ) {
            this.left_collision_occurred = true;
            //text("LEFT HIT", 200, 200);
          }

          if (
            dist(this.pos.x + 10, this.pos.y, walls[i].pos.x, walls[i].pos.y) <
            15
          ) {
            this.right_collision_occurred = true;
            //text("RIGHT HIT", 200, 200);
          }
        }

        for (var i = 0; i < enemies.length; i++) {
          if (
            dist(this.pos.x, this.pos.y, enemies[i].pos.x, enemies[i].pos.y) <
            20
          ) {
            theMazeMiniGameScreen.game_over = true;
          }
        }

        for (var i = 0; i < destinations.length; i++) {
          if (
            dist(
              this.pos.x,
              this.pos.y,
              destinations[i].pos.x,
              destinations[i].pos.y
            ) < 20
          ) {
            theMazeMiniGameScreen.game_won = true;
          }
        }
      }

      reset() {
        this.pos.x = 20;
        this.pos.y = 360;
      }
    }

    class enemy_obj {
      constructor(x, y, image) {
        this.pos = new PVector(x, y);
        this.target = new PVector(0, 0);
        this.image = image;
        this.surrounding_nodes = new HashMap(); // Contains coordinates and costs of travelling to those coordinates
        this.next_potential_pos = [0, 0];
      }

      get_surrounding_nodes(walls) {
        this.surrounding_nodes.clear();

        var add_top_node = true;
        var add_bottom_node = true;
        var add_left_node = true;
        var add_right_node = true;

        for (var i = 0; i < walls.length; i++) {
          if (
            this.pos.x == walls[i].pos.x &&
            this.pos.y - 20 == walls[i].pos.y
          ) {
            add_top_node = false; // TOP
          }

          if (
            this.pos.x - 20 == walls[i].pos.x &&
            this.pos.y == walls[i].pos.y
          ) {
            add_left_node = false; // LEFT
          }

          if (
            this.pos.x + 20 == walls[i].pos.x &&
            this.pos.y == walls[i].pos.y
          ) {
            add_right_node = false; // RIGHT
          }

          if (
            this.pos.x == walls[i].pos.x &&
            this.pos.y + 20 == walls[i].pos.y
          ) {
            add_bottom_node = false; // MIDDLE
          }
        }

        if (add_top_node) {
          this.surrounding_nodes.put([this.pos.x, this.pos.y - 20], 0);
        }

        if (add_bottom_node) {
          this.surrounding_nodes.put([this.pos.x, this.pos.y + 20], 0);
        }

        if (add_left_node) {
          this.surrounding_nodes.put([this.pos.x - 20, this.pos.y], 0);
        }

        if (add_right_node) {
          this.surrounding_nodes.put([this.pos.x + 20, this.pos.y], 0);
        }
      }

      calculate_costs() {
        var g_cost = 0;
        var h_cost = 0;

        var i = this.surrounding_nodes.entrySet().iterator();

        while (i.hasNext()) {
          var current_node_location = i.next().getKey();
          g_cost = dist(
            this.pos.x,
            this.pos.y,
            current_node_location[0],
            current_node_location[1]
          );
          h_cost = dist(
            this.target.x,
            this.target.y,
            current_node_location[0],
            current_node_location[1]
          );
          this.surrounding_nodes.put(current_node_location, g_cost + h_cost);
        }
      }

      get_key_from_value(value) {
        var i = this.surrounding_nodes.entrySet().iterator();
        while (i.hasNext()) {
          var current_node = i.next();

          if (current_node.getValue() == value) {
            return current_node.getKey();
          }
        }
      }

      remove_element(arr, element) {
        var index = 0;
        var array_without_element = [];
        for (var i = 0; i < arr.length; i++) {
          if (arr[i] != element) {
            array_without_element.push(arr[i]);
          }
        }

        return array_without_element;
      }

      select_new_pos() {
        var costs = [];

        var i = this.surrounding_nodes.entrySet().iterator();
        while (i.hasNext()) {
          var curr = i.next();
          costs.push(curr.getValue());
        }

        this.next_potential_pos = this.get_key_from_value(min(costs));
      }

      chase_player(walls) {
        if (this.pos.x % 20 == 0 && this.pos.y % 20 == 0) {
          this.get_surrounding_nodes(walls);
          this.calculate_costs();
          this.select_new_pos();
        }
      }

      update(x, y, walls) {
        this.target.x = x;
        this.target.y = y;

        image(this.image, this.pos.x, this.pos.y);

        this.chase_player(walls);

        if (this.pos.x < this.next_potential_pos[0]) {
          this.pos.x += 0.25;
        } else if (this.pos.x > this.next_potential_pos[0]) {
          this.pos.x -= 0.25;
        }

        if (this.pos.y < this.next_potential_pos[1]) {
          this.pos.y += 0.25;
        } else if (this.pos.y > this.next_potential_pos[1]) {
          this.pos.y -= 0.25;
        }
      }
    }

    class wall_obj {
      constructor(x, y, image) {
        this.pos = new PVector(x, y);
        this.image = image;
      }

      display() {
        image(this.image, this.pos.x, this.pos.y);
      }
    }

    class dest_obj {
      constructor(x, y) {
        this.pos = new PVector(x, y);
      }

      display() {
        fill(57, 255, 20);
        rect(this.pos.x, this.pos.y, 20, 20);
      }
    }

    class maze_game_obj {
      constructor() {
        this.player = new player_obj(20, 360, player_image);
        this.enemies = [];
        this.destinations = [];

        this.game_won = false;
        this.game_over = false;

        this.tilemap = [
          "wwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwww",
          "wd--------------e--------------------dww",
          "w-wwwwwwwwwwwwwww--wwww-wwwww-wwwww-wwww",
          "w---------------w---------wwwww---w-w--w",
          "wwwwwwwww-wwwwwwwwwwwwwwwww-------w---ww",
          "w-----w----ww----------------wwwwwww---w",
          "w-w-wwwwww----w--ww----wwww----w-----www",
          "www-ww-----wwww-www-------www--w-wwwwwww",
          "www-wwwwww-wwww-w-------www----w-------w",
          "w----------ww--------wwwwww----www-wwwww",
          "w-w-ww-www----w--ww----w----ww--ww-----w",
          "w-w-ww-----ww-w www----w--w------w-----w",
          "www-wwwww--ww-wwwwwwww-w--wwwwwwwww-w--w",
          "w----------ww--------w-w---w--------w--w",
          "w-wwwwwwww----w--ww--w-w---w-wwwwwwwww-w",
          "w--www-----wwww www--------w---w---w-w-w",
          "ww-wwwwww-wwww---wwwwwwwwwww-www---w-w-w",
          "w--ww------ww-----e------------w---w---w",
          "w-----wwww----w--ww-wwwwwwwwwwww-------w",
          "w----------ww-------w-----e-------w-wwww",
          "w-wwwwwwww----w--ww-wwwww-w-ww-w-ww-wwww",
          "w-wwww-----wwww-www-w---w-w-w----------w",
          "wwwwwwwww-wwwww-www-----w---w--wwwwwww-w",
          "w-----w----ww--------wwwwww-w---ww-www-w",
          "w-w-wwwwww----w--ww----ww----------w---w",
          "www-ww-----wwww-wwwwwwwwwwwwwe-wwwwww-ww",
          "www-wwwwww-wwww--ww------w----------w--w",
          "w----------ww--------w---w-------w--w--w",
          "w-w-ww-www----w--ww--w---w-------w-ww--w",
          "w-w-ww-----ww-w www--w---w--wwwwwwwww--w",
          "www-wwwww--ww-wwwww--w------w----wwww---w",
          "w----------ww--------wwwww--w-------w--w",
          "w-wwwwwwww----w--ww----w----wwwwwwwww--w",
          "w--www-----wwww www----ww-------------ew",
          "ww-wwwwww--www---ww----wwwwwww---wwwww-w",
          "w--ww------ww-----e--www--------www----w",
          "w-----wwww----w--ww---www---www---w----w",
          "w---------wwww----------wwwwwww---w----w",
          "wd-------------e---------------e------dw",
          "wwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwww"
        ];

        this.walls = [];
        for (var i = 0; i < this.tilemap.length; i++) {
          for (var j = 0; j < this.tilemap[i].length; j++) {
            switch (this.tilemap[i][j]) {
              case "w":
                this.walls.push(new wall_obj(j * 20, i * 20, wall_image));

                break;

              case "e":
                this.enemies.push(new enemy_obj(j * 20, i * 20, enemy_image));

                break;

              case "d":
                this.destinations.push(new dest_obj(j * 20, i * 20));

                break;
            }
          }
        }
      }

      display() {
        stopSound(gameSoundtrack);
        playSound(mazeMiniGameSoundtrack);
        if (!this.game_won && !this.game_over) {
          this.currentTime = millis();

          background(139, 0, 139);

          for (var i = 0; i < this.walls.length; i++) {
            this.walls[i].display();
          }

          for (var i = 0; i < this.destinations.length; i++) {
            this.destinations[i].display();
          }

          for (var i = 0; i < this.enemies.length; i++) {
            this.enemies[i].update(
              this.player.pos.x,
              this.player.pos.y,
              this.walls
            );
          }

          this.player.update(this.walls, this.enemies, this.destinations);
        } else if (this.game_won) {
          fill(57, 255, 20);
          textSize(50);
          text("GAME WON", 250, 400);
          changePage("GAME");
          stopSound(mazeMiniGameSoundtrack);
          collectedItems.key++;
          this.reset();
          // Add ChangePage here
        } else {
          this.gameOverTime = millis();
          fill(255, 0, 0);
          textSize(50);
          text("GAME OVER", 250, 400);

          textSize(20);
          text("TRY AGAIN", 350, 450);

          if (this.gameOverTime - this.currentTime >= 1000) {
            this.reset();
          }
        }
      }

      reset() {
        this.game_won = false;
        this.game_over = false;

        this.walls.length = 0;
        this.enemies.length = 0;
        this.destinations.length = 0;

        this.player.reset();

        for (var i = 0; i < this.tilemap.length; i++) {
          for (var j = 0; j < this.tilemap[i].length; j++) {
            switch (this.tilemap[i][j]) {
              case "w":
                this.walls.push(new wall_obj(j * 20, i * 20, wall_image));
                break;

              case "e":
                this.enemies.push(new enemy_obj(j * 20, i * 20, enemy_image));
                break;

              case "d":
                this.destinations.push(new dest_obj(j * 20, i * 20));
                break;
            }
          }
        }
      }
    }

    //############################################### KEYPRESSED ######################################

    var keyPressed = function() {
      if (STATE.THEMAZE) {
        if (
          key.toString() == "d" &&
          !theMazeMiniGameScreen.player.right_collision_occurred
        ) {
          theMazeMiniGameScreen.player.pos.x += 5;
        }

        if (
          key.toString() == "a" &&
          !theMazeMiniGameScreen.player.left_collision_occurred
        ) {
          theMazeMiniGameScreen.player.pos.x -= 5;
        }

        if (
          key.toString() == "w" &&
          !theMazeMiniGameScreen.player.top_collision_occurred
        ) {
          theMazeMiniGameScreen.player.pos.y -= 5;
        }

        if (
          key.toString() == "s" &&
          !theMazeMiniGameScreen.player.bottom_collision_occurred
        ) {
          theMazeMiniGameScreen.player.pos.y += 5;
        }
      }

      if (STATE.GAME) {
        keyArray[keyCode] = 1;
      }

      if (STATE.ADDITION) {
        if (keyCode === 82) {
          additionMiniGameScreen.reset();
        }

        if (key.toString() == "\n") {
          additionMiniGameScreen.setEnterStatus(true);
          additionMiniGameScreen.checkActualAnswer();
        } else if (
          additionMiniGameScreen.getTime() > 0 &&
          !additionMiniGameScreen.getEnterStatus() &&
          additionMiniGameScreen.checkInputBoxClickStatus()
        ) {
          if (!isNaN(key.toString())) {
            additionMiniGameScreen.userInput += key.toString();
          }

          if (keyCode === LEFT && additionMiniGameScreen.userInput.length > 0) {
            additionMiniGameScreen.userInput = additionMiniGameScreen.userInput.substring(
              0,
              additionMiniGameScreen.userInput.length - 1
            );
          }

          additionMiniGameScreen.storeCurrentInput();
        }
      }
    };

    var keyReleased = function() {
      keyArray[keyCode] = 0;

      if (STATE.THEMAZE) {
        theMazeMiniGameScreen.player.top_collision_occurred = false;
        theMazeMiniGameScreen.player.bottom_collision_occurred = false;
        theMazeMiniGameScreen.player.left_collision_occurred = false;
        theMazeMiniGameScreen.player.right_collision_occurred = false;
      }
    };

    //############################################### MOUSE CLICKED ######################################
    var mouseClicked = function() {
      if (STATE.ADDITION) {
        additionMiniGameScreen.setInputBoxClickStatus(true);
      }

      if (STATE.MUTIPLECHOICE) {
        if (!multipleChoiceMiniGameScreen.getClickStatus()) {
          var top_left_box = multipleChoiceMiniGameScreen.top_left_box;
          var top_right_box = multipleChoiceMiniGameScreen.top_right_box;
          var bottom_left_box = multipleChoiceMiniGameScreen.bottom_left_box;
          var bottom_right_box = multipleChoiceMiniGameScreen.bottom_right_box;

          if (
            mouseX >= top_left_box.getX() &&
            mouseX <= top_left_box.getX() + top_left_box.getWidth() &&
            mouseY >= top_left_box.getY() &&
            mouseY <= top_left_box.getY() + top_left_box.getHeight()
          ) {
            multipleChoiceMiniGameScreen.selectOption(top_left_box);
            multipleChoiceMiniGameScreen.setClickStatus(true);
          }

          if (
            mouseX >= top_right_box.getX() &&
            mouseX <= top_right_box.getX() + top_right_box.getWidth() &&
            mouseY >= top_right_box.getY() &&
            mouseY <= top_right_box.getY() + top_right_box.getHeight()
          ) {
            multipleChoiceMiniGameScreen.selectOption(top_right_box);
            multipleChoiceMiniGameScreen.setClickStatus(true);
          }

          if (
            mouseX >= bottom_left_box.getX() &&
            mouseX <= bottom_left_box.getX() + bottom_left_box.getWidth() &&
            mouseY >= bottom_left_box.getY() &&
            mouseY <= bottom_left_box.getY() + bottom_left_box.getHeight()
          ) {
            multipleChoiceMiniGameScreen.selectOption(bottom_left_box);
            multipleChoiceMiniGameScreen.setClickStatus(true);
          }

          if (
            mouseX >= bottom_right_box.getX() &&
            mouseX <= bottom_right_box.getX() + bottom_right_box.getWidth() &&
            mouseY >= bottom_right_box.getY() &&
            mouseY <= bottom_right_box.getY() + bottom_right_box.getHeight()
          ) {
            multipleChoiceMiniGameScreen.selectOption(bottom_right_box);
            multipleChoiceMiniGameScreen.setClickStatus(true);
          }
        }
      }
    };

    //############################################### CREATE OBJECT ######################################

    var game = new gameObj();
    var gameOver = new gameOverObj(400, 500);
    var multipleChoiceMiniGameScreen = new multipleChoiceMiniGameObj();
    var additionMiniGameScreen = new additionMiniGameObj();
    var theMazeMiniGameScreen = new maze_game_obj();
    game.initGame();

    //############################################### CREATE PARALLAX LAYERS ######################################

    var parallaxSpaceLayer = new parallaxObj(
      parallaxImages[0],
      game,
      0,
      200,
      2400,
      1300,
      false
    );
    var parallaxFarStarsLayer = new parallaxObj(
      parallaxImages[1],
      game,
      0,
      200,
      2400,
      1300,
      false
    );
    var parallaxStation1Layer = new parallaxObj(
      parallaxImages[2],
      game,
      600,
      200,
      300,
      300,
      true
    );

    //############################################### EXECUTION ######################################
    var draw = function() {
      // background(50, 72, 81);
      if (STATE.GAME) {
        parallaxSpaceLayer.display(0.05);
        parallaxFarStarsLayer.display(0.07);
        parallaxStation1Layer.display(0.2);

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

        for (let i = 0; i < collectedItems.key; i++) {
          image(keyImage, 637 + 30 * i, 25, 30, 30);
        }

        fill(0, 0, 0, 100);
        textFont(gameFont, 15);
        textAlign(CENTER, CENTER);
        text(collectedItems.coins, 430, 25);
      } else if (STATE.MUTIPLECHOICE) {
        multipleChoiceMiniGameScreen.display();
      } else if (STATE.ADDITION) {
        additionMiniGameScreen.display();
      } else if (STATE.THEMAZE) {
        imageMode(CORNERS);
        theMazeMiniGameScreen.display();
        imageMode(CENTER);
      } else if (STATE.GAMEOVER) {
        gameOver.display();
      }
    };

    //######################################################################################################
    //##############################################END HERE##############################################
    //######################################################################################################
  }
};