var sketchProc = function (processingInstance) {
  with (processingInstance) {
    size(800, 800);
    frameRate(60);
    var gameFont = createFont("Bitstream Charter Bold");
    noStroke();
    //######################################################################################################
    //##############################################START HERE##############################################
    //######################################################################################################
   

    //############################################### LOAD IMAGES ######################################

    // When developing locally, set url = "."
    // otherwise, set url = "https://thepatriotvirus.s3.amazonaws.com"
    url = "."

    miniGameBackgroundImage1 = loadImage(url + "/images/digitalBackground.png");
    miniGameBackgroundImage2 = loadImage(url + "/images/digitalBackground2.png");


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
          textAlign(CENTER, CENTER);
          text(this.str, this.x + this.w/2, this.y + this.h/2);
          
        }

        setText(str) {
          this.str = str;
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

        if(time > 0) {

          if(this.is_clicked) {
            if(frameCount % 30 != 0) {
              text(this.input + "|", this.x + this.w/2, this.y + this.h/2);
            }
            else{
              text(this.input + " ", this.x + this.w/2, this.y + this.h/2);
            }
          }
          else {
            text(this.initialText,  this.x + this.w/2, this.y + this.h/2);
          }
      }
       
      }

      reset() {
        this.input = "";
        this.initialText = "Enter: "
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

    //                                       _______ ADDITION MINI GAME OBJECT__________
    class additionMiniGameObj {

        constructor() {
          
          this.timer = new timerObj(10, 700, 50);
          this.num1 = round(random(100, 999));
          this.num2 = round(random(100, 999));
          this.question_box = new textBoxObj("Calculate the following: " + this.num1 + " + " + this.num2 + " =", 50, 150, 700, 150, true);
          this.input_box = new userInputBoxObj(50, 400, 700, 150);
          this.answer = "";

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

        storeCurrentInput(input) {
          this.input_box.storeInput(input);
        }

        checkActualAnswer() {
          this.answer = this.input_box.input;
          this.is_correct = (this.answer == this.actual_answer) ? true : false;
        }
  
        display() {
          
          image(miniGameBackgroundImage2, 0, 0, 800, 800);
          
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

          this.num1 = round(random(100, 999));
          this.num2 = round(random(100, 999));
          this.actual_answer = str(this.num1 + this.num2);

          this.timer.reset();

          this.input_box.reset();
          this.question_box.setText("Calculate the following: " + this.num1 + " + " + this.num2 + " =");
         

          this.is_correct = false;
          this.is_enter_pressed = false;

        }
  
      
    }
  
    //############################################### CREATE VARIABLES ######################################
    var additionMiniGameScreen = new additionMiniGameObj();
    var userInput = "";

    //############################################### INPUT CONTROL ######################################

    var keyPressed = function () {

        if (keyCode === 192) {

            additionMiniGameScreen.reset();
            userInput = "";
            
        }

        if(key.toString() == "\n") {
          additionMiniGameScreen.setEnterStatus(true);
          additionMiniGameScreen.checkActualAnswer();
        }

        else if(additionMiniGameScreen.getTime() > 0 && !additionMiniGameScreen.getEnterStatus() && additionMiniGameScreen.checkInputBoxClickStatus()){
          
          if(!isNaN(key.toString())) {
          
              userInput += key.toString();
          }

          if(keyCode === LEFT && userInput.length > 0) {
              
              userInput = userInput.substring(0, userInput.length - 1);
          }

          additionMiniGameScreen.storeCurrentInput(userInput);
        }
      
    };

    var mouseClicked = function() {

      additionMiniGameScreen.setInputBoxClickStatus(true);
    }
    

    //############################################### EXECUTION ######################################
    background(245, 222, 179);
    var draw = function () {
     
        additionMiniGameScreen.display();                           
      
    };

    //######################################################################################################
    //##############################################END HERE##############################################
    //######################################################################################################
  }
};
function screenShake() { }
