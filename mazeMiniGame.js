var sketchProc=function(processingInstance){ with (processingInstance){
    size(800, 800); 
    frameRate(60);
	

    //==========================================================
    // Images

    player_image = loadImage("./images/astronaut.png");
    enemy_image = loadImage("./images/alien.png");
    wall_image = loadImage("./images/sciFiWall.png");

    //==========================================================


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

            for (var i=0; i < walls.length; i++) {

                fill(255, 255, 255);

                if (dist(this.pos.x + 5, this.pos.y, walls[i].pos.x, walls[i].pos.y + 10) < 15) {
                   
                    this.top_collision_occurred = true;
                    //text("TOP HIT", 200, 200);
                }
               
                if(dist(this.pos.x, this.pos.y + 10, walls[i].pos.x, walls[i].pos.y) < 15) {
    
                    this.bottom_collision_occurred = true;
                    //text("BOTTOM HIT", 200, 200);
                }
               
                if(dist(this.pos.x, this.pos.y, walls[i].pos.x + 10, walls[i].pos.y) < 15) {

                    this.left_collision_occurred = true;
                    //text("LEFT HIT", 200, 200);
                }
               

                if(dist(this.pos.x + 10, this.pos.y, walls[i].pos.x, walls[i].pos.y) < 15) {

                    this.right_collision_occurred = true;
                    //text("RIGHT HIT", 200, 200);
                }
                
            }
    
            for(var i = 0; i < enemies.length; i++) {
    
                if(dist(this.pos.x, this.pos.y, enemies[i].pos.x, enemies[i].pos.y) < 20) {
                    GAME.game_over = true;
                }
            }

            for(var i = 0; i < destinations.length; i++) {
    
                if(dist(this.pos.x, this.pos.y, destinations[i].pos.x, destinations[i].pos.y) < 20) {
                    GAME.game_won = true;
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
            this.surrounding_nodes = new HashMap();     // Contains coordinates and costs of travelling to those coordinates
            this.next_potential_pos = [0, 0];
        }

        get_surrounding_nodes(walls) {

            this.surrounding_nodes.clear();

            var add_top_node = true;
            var add_bottom_node = true;
            var add_left_node = true;
            var add_right_node = true;

            for(var i = 0; i < walls.length; i++) {

                if(this.pos.x == walls[i].pos.x && this.pos.y - 20 == walls[i].pos.y) {
                    add_top_node = false;               // TOP
                }

                if(this.pos.x - 20 == walls[i].pos.x && this.pos.y == walls[i].pos.y) {
                    add_left_node = false;              // LEFT
                }

                if(this.pos.x + 20 == walls[i].pos.x && this.pos.y == walls[i].pos.y) {
                    add_right_node = false;             // RIGHT
                }
                        
                if(this.pos.x == walls[i].pos.x && this.pos.y + 20 == walls[i].pos.y) {   
                    add_bottom_node = false;            // MIDDLE
                }
            }

            if(add_top_node) {
                this.surrounding_nodes.put([this.pos.x, this.pos.y - 20], 0);
            }

            if(add_bottom_node) {
                this.surrounding_nodes.put([this.pos.x, this.pos.y + 20], 0);
            }

            if(add_left_node) {
                this.surrounding_nodes.put([this.pos.x - 20, this.pos.y], 0); 
            }

            if(add_right_node) {
                this.surrounding_nodes.put([this.pos.x + 20, this.pos.y], 0);
            }
            
        }

        calculate_costs() {

            var g_cost = 0;
            var h_cost = 0;

            var i = this.surrounding_nodes.entrySet().iterator();

            while(i.hasNext()) {
           
                var current_node_location = i.next().getKey();
                g_cost = dist(this.pos.x, this.pos.y, current_node_location[0], current_node_location[1]);
                h_cost = dist(this.target.x, this.target.y, current_node_location[0], current_node_location[1]);
                this.surrounding_nodes.put(current_node_location, g_cost + h_cost);
            }

        }

        get_key_from_value(value) {

            var i = this.surrounding_nodes.entrySet().iterator();
            while(i.hasNext()) {
                var current_node = i.next();

                if(current_node.getValue() == value) {
                    return current_node.getKey();
                }
                
            } 
        }

        remove_element(arr, element) {

            var index = 0;
            var array_without_element = [];
            for(var i = 0; i < arr.length; i++) {

                if(arr[i] != element) {
                    array_without_element.push(arr[i]);
                }
            }

            return array_without_element;

        }

        select_new_pos() {

            var costs = [];
            
            var i = this.surrounding_nodes.entrySet().iterator();
            while(i.hasNext()) {
                var curr = i.next();
                costs.push(curr.getValue());
            }
            
            this.next_potential_pos = this.get_key_from_value(min(costs));
        }

        chase_player(walls) {

            if(this.pos.x % 20 == 0 && this.pos.y % 20 == 0) {
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

            
            if(this.pos.x < this.next_potential_pos[0]) {
                this.pos.x+=0.5;
            }

            else if(this.pos.x > this.next_potential_pos[0]) {
                this.pos.x-=0.5;
            }

            if(this.pos.y < this.next_potential_pos[1]) {
                this.pos.y+=0.5;
            }

            else if(this.pos.y > this.next_potential_pos[1]) {
                this.pos.y-=0.5;
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
            this.pos = new PVector(x, y)
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
                            "wwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwww",
                            
            ];

            
            this.walls = [];
            for (var i = 0; i < this.tilemap.length; i++) {
                
                for (var j = 0; j < this.tilemap[i].length; j++) {
                    
                    switch (this.tilemap[i][j]) {
                        
                        case 'w': 

                            this.walls.push(new wall_obj(j*20, i*20, wall_image));
                                
                        break;

                        case 'e': 

                            this.enemies.push(new enemy_obj(j*20, i*20, enemy_image));
                                
                        break;

                        case 'd': 

                            this.destinations.push(new dest_obj(j*20, i*20));
                                
                        break;



                    }
                }
            }
        
        }

        display() {

          
            if(!this.game_won && !this.game_over) {
                this.currentTime = millis();
                
                background(139, 0, 139);

                for (var i = 0; i < this.walls.length; i++) {
        
                    this.walls[i].display();
                    
                }

                for (var i = 0; i < this.destinations.length; i++) {

                    this.destinations[i].display();
                }

                for (var i = 0; i < this.enemies.length; i++) {

                    this.enemies[i].update(this.player.pos.x, this.player.pos.y, this.walls);
                }

                this.player.update(this.walls, this.enemies, this.destinations);

            }

            else if(this.game_won) {
                fill(57, 255, 20);
                textSize(50);
                text("GAME WON", 250, 400);

                // Add ChangePage here
            }

            else {
                this.gameOverTime = millis();
                fill(255, 0, 0);
                textSize(50);
                text("GAME OVER", 250, 400);

                textSize(20);
                text("TRY AGAIN", 350, 450);

                console.log("CT: " + this.currentTime);
                console.log("GT: " + this.gameOverTime);

                if(this.gameOverTime - this.currentTime >= 1000) {
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

            for (var i = 0; i< this.tilemap.length; i++) {
                
                for (var j = 0; j < this.tilemap[i].length; j++) {
                    
                    switch (this.tilemap[i][j]) {

                        case 'w':
                            
                            this.walls.push(new wall_obj(j*20, i*20, wall_image));
                        break;

                        case 'e': 
                            this.enemies.push(new enemy_obj(j*20, i*20, enemy_image));
                        break;

                        case 'd': 
                            this.destinations.push(new dest_obj(j*20, i*20));
                        break;

                    }
                }
            }

        
        }
    }

    var GAME = new maze_game_obj();

    var keyPressed = function() {

        if(keyCode == RIGHT && !GAME.player.right_collision_occurred) {
            GAME.player.pos.x += 5;
        }
        
        if(keyCode == LEFT && !GAME.player.left_collision_occurred) {
            GAME.player.pos.x -= 5;
        }
        
        if(keyCode === UP && !GAME.player.top_collision_occurred) {   
            GAME.player.pos.y -= 5;   
        }

        if(keyCode == DOWN && !GAME.player.bottom_collision_occurred) {
            GAME.player.pos.y += 5;
        }

    }

    var keyReleased = function() {
        
        GAME.player.top_collision_occurred = false;
        GAME.player.bottom_collision_occurred = false;
        GAME.player.left_collision_occurred = false;
        GAME.player.right_collision_occurred = false;
    }

    var draw = function() {

        GAME.display();

    };

}};

