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
  
        reset() {
          this.is_clicked = false;
        }
      }
  
      //                                          _______ MULITPLE CHOICE MINI GAME OBJECT__________
      class multipleChoiceMiniGameObj {
  
        constructor() {
          
          this.question_box = new textBoxObj("Calculate the following: 4A6 + 1B3 =", 50, 50, 700, 150, true);
  
          this.top_left_box = new textBoxObj("659", 50, 250, 300, 100, false);
          this.top_right_box = new textBoxObj("123", 450, 250, 300, 100, false);
          this.bottom_left_box = new textBoxObj("7C2", 50, 450, 300, 100, false);
          this.bottom_right_box = new textBoxObj("H45", 450, 450, 300, 100, false);
  
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
          this.is_correct = (this.answer == this.actual_answer) ? true : false;
            
        }
  
        display() {
  
          image(miniGameBackgroundImage1, 0, 0, 800, 800);
          
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
  
  
      //############################################### CREATE VARIABLES ######################################
  
      var multipleChoiceMiniGameScreen = new multipleChoiceMiniGameObj();
  
      //############################################### INPUT CONTROL ######################################
  
      var keyPressed = function () {
  
        if (keyCode === 192) {
            multipleChoiceMiniGameScreen.reset();        
        }
  
      };
  
      var mouseClicked = function () {
  
        if (!multipleChoiceMiniGameScreen.getClickStatus()) {
  
          var top_left_box = multipleChoiceMiniGameScreen.top_left_box;
          var top_right_box = multipleChoiceMiniGameScreen.top_right_box;
          var bottom_left_box = multipleChoiceMiniGameScreen.bottom_left_box;
          var bottom_right_box = multipleChoiceMiniGameScreen.bottom_right_box;
  
          if(mouseX >= top_left_box.getX() && mouseX <= top_left_box.getX() + top_left_box.getWidth() &&
             mouseY >= top_left_box.getY() && mouseY <= top_left_box.getY() + top_left_box.getHeight()) {
  
              multipleChoiceMiniGameScreen.selectOption(top_left_box);
              multipleChoiceMiniGameScreen.setClickStatus(true);
          }
  
          if(mouseX >= top_right_box.getX() && mouseX <= top_right_box.getX() + top_right_box.getWidth() &&
            mouseY >= top_right_box.getY() && mouseY <= top_right_box.getY() + top_right_box.getHeight()) {
  
              multipleChoiceMiniGameScreen.selectOption(top_right_box);
              multipleChoiceMiniGameScreen.setClickStatus(true);
            
          }
  
          if(mouseX >= bottom_left_box.getX() && mouseX <= bottom_left_box.getX() + bottom_left_box.getWidth() &&
            mouseY >= bottom_left_box.getY() && mouseY <= bottom_left_box.getY() + bottom_left_box.getHeight()) {
             
              multipleChoiceMiniGameScreen.selectOption(bottom_left_box);
              multipleChoiceMiniGameScreen.setClickStatus(true);           
  
          }
  
          if(mouseX >= bottom_right_box.getX() && mouseX <= bottom_right_box.getX() + bottom_right_box.getWidth() &&
            mouseY >= bottom_right_box.getY() && mouseY <= bottom_right_box.getY() + bottom_right_box.getHeight()) {
  
              multipleChoiceMiniGameScreen.selectOption(bottom_right_box);
              multipleChoiceMiniGameScreen.setClickStatus(true);
          }
  
        }
      
      };
  
      
  
      //############################################### EXECUTION ######################################
      background(245, 222, 179);
      var draw = function () {
        
         
        multipleChoiceMiniGameScreen.display();         
        
      };
  
      //######################################################################################################
      //##############################################END HERE##############################################
      //######################################################################################################
    }
  };
  function screenShake() { }
  