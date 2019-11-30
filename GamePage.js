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
      OPEN: true,
      GAME: false,
      INSTRUCTION: false,
      SCORE: false,
      ACHIEVEMENT: false
    };
    const IMAGESIZE = 50;
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
      dying: [
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

    monsterImages = [
      loadImage(url + "/testImages/monsterf1.png"),
      loadImage(url + "/testImages/monsterf2.png"),
      loadImage(url + "/testImages/monsterf3.png"),
      loadImage(url + "/testImages/monsterf4.png")
    ];

    lightningTrapImages = [
      loadImage(url + "/images/trapf1.png"),
      loadImage(url + "/images/trapf2.png"),
      loadImage(url + "/images/trapf3.png"),
      loadImage(url + "/images/trapf4.png")
    ];

    directory = "/images/";

    shockTrapImages = {
      trap_switch: [
        loadImage(url + directory + "switchf1.png"),
        loadImage(url + directory + "switchf2.png"),
        loadImage(url + directory + "switchf3.png"),
        loadImage(url + directory + "switchf4.png")
      ],

      shock:  [
        loadImage(url + directory + "shockf1.png"),
        loadImage(url + directory + "shockf2.png"),
        loadImage(url + directory + "shockf3.png"),
        loadImage(url + directory + "shockf4.png")
      ]
    }

    crushTrapImages = [
      loadImage(url + directory + "springf1.png"),
      loadImage(url + directory + "springf2.png"),
      loadImage(url + directory + "springf3.png"),
      loadImage(url + directory + "springf4.png")
    ]
    

    parallaxImages = [

      loadImage(url + directory + "purpleSpaceBackground.png"),
      loadImage(url + directory + "purpleFarStars.png"),
      loadImage(url + directory + "spaceStation1.png")
    ]


    coinImages = [
      loadImage(url + "/images/coinf1.png"),
      loadImage(url + "/images/coinf2.png"),
      loadImage(url + "/images/coinf3.png"),
      loadImage(url + "/images/coinf4.png")
    ];

   
    flDiskImage = loadImage(url + "/images/floppyDisk.png");
    binaryImage = loadImage(url + "/images/binary.png");
    wireImage = loadImage(url + "/images/wire.png");
    ramImage = loadImage(url + "/images/ram.png");
    mbImage = loadImage(url + "/images/motherboard.png");

    //############################################### LOAD SOUNDS ######################################

    laserSound = new Audio(url + "/sounds/laser.mp3");
    mainMenuSoundtrack = new Audio(url + "/sounds/mainMenuSoundtrack.mp3");
    gameSoundtrack = new Audio(url + "/sounds/gameSoundtrack.mp3");
    gameSoundtrack.volume = 0.2;

    var playSound = function(sound) {
      sound.play();
    }

    var stopSound = function(sound) {
      sound.pause();
      sound.currentTime = 0;
    }

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
        } else if (this.name === "ram") {
          image(ramImage, this.pos.x, this.pos.y, IMAGESIZE, IMAGESIZE);
        } else if (this.name === "binary") {
          image(binaryImage, this.pos.x, this.pos.y, IMAGESIZE, IMAGESIZE);
        } else if (this.name == "trap") {
          image(
            lightningTrapImages[this.frameIndex],
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

          if(this.frameIndex == 0) {
            playSound(laserSound);
          }

          this.changeFrameIndex();
          pushMatrix();
          if (this.direction === "LEFT") {
            console.log(this.direction.LEFT);
            scale(-1, 1);
            image(
              bulletImages[this.frameIndex],
              -this.pos.x,
              this.pos.y,
              IMAGESIZE,
              IMAGESIZE
            );
          } else {
            image(
              bulletImages[this.frameIndex],
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
                  new obj(x * IMAGESIZE, y * IMAGESIZE, "wall")
                );
                break;
              case "r":
                this.objects.push(new obj(x * IMAGESIZE, y * IMAGESIZE, "ram"));
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
              case "s":
                this.shockTraps.push(
                  new shockTrapObj(x * IMAGESIZE, y * IMAGESIZE)
                )
                break;
              case "d":
                this.crushTraps.push(
                  new crushTrapObj(x * IMAGESIZE, y * IMAGESIZE)
                )
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
            this.objects[i].name === "ram" ||
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
              changePage("SCORE");
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
            this.player.deductHp();
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
        for (var i = 0; i < this.monsters.length; i++) {
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
        this.curTime = millis();
        this.preTime = this.curTime;
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
        if (!this.die) {
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

          this.displayHP();
        }
      }

      displayHP() {
        fill(30,144,255);
        rectMode(CENTER);
        rect(this.pos.x, this.pos.y - 40, this.hp, 5);
      }

      deductHp() {
        if (this.curHpTime - this.preHpTime > 120 && this.hp > 0) {
          this.hp-=10;
          this.preHpTime = this.curHpTime;
        }
        if (this.hp === 0){
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
    var LEFTFORCE = new PVector(-0.01, 0);
    var RIGHTFORCE = new PVector(0.01, 0);
    var JUMPFORCE = new PVector(0, -7);

    class playerObj extends obj {
      constructor(x, y) {
        super();
        this.pos = new PVector(x, y);
        this.velocity = new PVector(0, 0);
        this.acceleration = new PVector(0, 0);
        this.force = new PVector(0, 0);

        this.curTime = millis();
        this.preTime = this.curTime;

        this.curBulletTime = millis();
        this.preBulletTime = this.curBulletTime;

        this.curHpTime = millis();
        this.preHpTime = this.curHpTime;
        this.hp = 50;

        this.frameIndex = 0;
        this.groundLv = y;

        this.bulletIndex = 0;
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
        fill(89, 216, 163);
        rectMode(CENTER);
        rect(this.pos.x, this.pos.y - 40, this.hp, 5);
      }

      deductHp() {
        if (this.curHpTime - this.preHpTime > 120 && this.hp > 0) {
          this.hp--;
          this.preHpTime = this.curHpTime;
        }
        if (this.hp === 0){
          //TODO: Die animation
        }
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
        if (this.curBulletTime - this.preBulletTime > 200) {
          if (this.direction.RIGHT) {
            bullets[this.bulletIndex].fire(this.pos.x, this.pos.y - 5, "RIGHT");
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
    }

    //############################################### SHOCK TRAP OBJECT ##################################

    class shockTrapObj extends obj {

      constructor(x, y) {  
        
        super();
        this.pos = new PVector(x, y);
        
        this.switchImages = shockTrapImages["trap_switch"];
        this.shockImages = shockTrapImages["shock"];

        this.frameIndex = 0;
        this.size = IMAGESIZE;

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

          image(this.switchImages[this.frameIndex], this.pos.x, this.pos.y, this.size * 2, this.size);
          this.changeFrameIndex();
          if(this.frameIndex == 3) {
            this.state = "SHOCK";  
          }
      }
      
      activate() {
        this.is_activated = true;
      }

      executeShock() {

          image(this.switchImages[3], this.pos.x, this.pos.y, this.size * 2, this.size);
          image(this.shockImages[this.frameIndex], this.pos.x, this.pos.y, this.size * 2, this.size);
            
          this.changeFrameIndex();
      }
    
      display() {
        
        pushMatrix();
        imageMode(CENTER);

        if(this.is_activated) {
          switch(this.state) {

            case "TRAP SWITCH":
                this.executeSwitchChange();
              break;

            case "SHOCK":
                this.executeShock();
              break;

          }
          this.curFrame = frameCount;
        }
        else {
          image(this.switchImages[0], this.pos.x, this.pos.y, this.size * 2, this.size);
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
        this.size = IMAGESIZE * 1.5;

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

        if(this.is_activated) {
          image(this.crushImages[this.frameIndex], this.pos.x, this.pos.y, this.size, this.size);

          scale(-1, -1);
          image(this.crushImages[this.frameIndex], -this.pos.x, -this.pos.y, this.size, this.size);

          this.changeFrameIndex();
          this.curFrame = frameCount;
        }
        else {
          image(this.crushImages[0], this.pos.x, this.pos.y, this.size, this.size);
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

        this.loop_condition = loop_condition

        this.w = w;
        this.h = h;
      }

      display(rate) {

        if(this.game.player.state["RUN"]) {
          
          if(this.game.player.direction["RIGHT"]) {
            this.pos.x-=rate;
          }
          else if(this.game.player.direction["LEFT"]) {
            this.pos.x+=rate;
          }

          if(this.loop_condition) {
            if(this.pos.x < -150) {
              this.pos.x = 6000;
              this.pos.y = random(0, 700);
            }

            if(this.pos.x > 6000) {
              this.pos.x = -150;
              this.pos.y = random(0, 700);
            }
          }
        }

        image(this.image, this.pos.x, this.pos.y, this.w, this.h);
        
      }

      move(rate) {
        this.pos.x+=rate;
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

    var game = new gameObj();
    game.initGame();

    //############################################### CREATE PARALLAX LAYERS ######################################

    var parallaxSpaceLayer = new parallaxObj(parallaxImages[0], game, 0, 200, 2400, 1300, false);
    var parallaxFarStarsLayer = new parallaxObj(parallaxImages[1], game, 0, 200, 2400, 1300, false);
    var parallaxStation1Layer = new parallaxObj(parallaxImages[2], game, 600, 200, 300, 300, true);

    //############################################### EXECUTION ######################################
    var draw = function() {
      
      parallaxSpaceLayer.display(0.05);
      parallaxFarStarsLayer.display(0.07);
      parallaxStation1Layer.display(0.2);
      
      pushMatrix();
      translate(-game.player.pos.x + 400, -game.player.pos.y + 400);
    
      game.display();
      popMatrix();

      //text(game.player.pos.x, 300, 300);
    };

    //######################################################################################################
    //##############################################END HERE##############################################
    //######################################################################################################
  }
};
