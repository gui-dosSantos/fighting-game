const canvas = document.querySelector('canvas'); 
const c = canvas.getContext('2d');
const gravity = 0.7;

canvas.width = 1024;
canvas.height = 576;

c.fillRect(0, 0, canvas.width, canvas.height) //paints the background

class Sprite {
    constructor({position, velocity, color = 'red'}) {
        this.position = position //stores the players position on the x and y axes
        this.velocity = velocity  // players velocity on the x and y axes
        this.height = 150; 
        this.width = 50;
        this.attackBox = { //determines the attackbox`s position and size
            position: {
                x: this.position.x,
                y: this.position.y
            },
            offset: {
                x: 0,
                y: 0
            },
            width: 100,
            height: 50
        }
        this.color = color; 
        this.isAttacking
        this.health = 100;
        this.canJump 
        this.canAttack = true
        // this.lastKey
    }

    draw() {
        //draws the player
        c.fillStyle = this.color;
        c.fillRect(this.position.x, this.position.y, this.width, this.height);
        //draw the attackbox
        if(this.isAttacking){
            c.fillStyle = 'green'
            c.fillRect(this.attackBox.position.x, this.attackBox.position.y, this.attackBox.width, this.attackBox.height)
        }
    }

    update() {
        this.draw();
        this.attackBox.position.x = this.position.x + this.attackBox.offset.x;
        this.attackBox.position.y = this.position.y;
        this.position.y += this.velocity.y;

        //deals with horizontal movement and prevents the player from going out of bounds on the x-axis
        if(this.position.x + this.velocity.x <= 0){
            this.velocity.x = 0;
            this.position.x = 0;
        } else if(this.position.x + this.velocity.x + this.width >= canvas.width) {
            this.velocity.x = 0;
            this.position.x = canvas.width - this.width;
        } else if(horizontalPlayerCollision()){
            this.velocity.x = 0; 
        } else {
            this.position.x += this.velocity.x
        }

        //deals with vertical movement and prevents the player from going out of bounds on the y-axis
        if(this.position.y + this.height + this.velocity.y >= canvas.height){
            this.velocity.y = 0;
            this.position.y = canvas.height - this.height;
        } else if(verticalPlayerCollision()){
            this.position.y -= this.velocity.y
            this.velocity.y = 0
        } else {
            this.velocity.y += gravity;
        }
    }

    jump() {
        //if statement prevents mid-air jumps
        if(this.canJump){
            this.velocity.y = -20;
        }
    }

    attack() {
        //if statement prevents multiple attacks in sequence, preventing them from stacking an absurd amount of damage
        if(this.canAttack) {
            this.isAttacking = true;
            this.canAttack = false;
            setTimeout(() => {
            this.isAttacking = false;
            }, 100)
            setTimeout(() => {
            this.canAttack = true;
            }, 500);
        }
    }
}

//maps the keys being pressed
const keys = {
    a: {
        pressed: false
    },
    d: {
        pressed: false
    },
    arrowLeft: {
        pressed: false
    },
    arrowRight: {
        pressed: false
    }
}

//creates the player
const player = new Sprite({
    position: {
        x: 200,
        y: 0
    },
    velocity: {
        x: 0,
        y: 0
    }
});

//creates the enemy
const enemy = new Sprite({
    position: {
        x: 800,
        y: 0
    },
    velocity: {
        x: 0,
        y: 0
    },
    color: 'blue'
});

//detects atackbox collision with opponent`s hitbox
function rectangularCollision({rectangle1, rectangle2}) {
    return rectangle1.attackBox.position.x + rectangle1.attackBox.width >= rectangle2.position.x &&
    rectangle1.attackBox.position.x <= rectangle2.position.x + rectangle2.width &&
    rectangle1.attackBox.position.y + rectangle1.attackBox.height >= rectangle2.position.y &&
    rectangle1.attackBox.position.y <= rectangle2.position.y + rectangle2.height;
}

//detects wheter to player passed as rectangle 1 is about to collide on the left side of the player passed as rectangle2
function leftToRightCollision(rectangle1, rectangle2){
    return rectangle1.position.x + rectangle1.width + rectangle1.velocity.x >= rectangle2.position.x && 
    rectangle1.position.x <= rectangle2.position.x && 
    rectangle1.position.y + rectangle1.height >= rectangle2.position.y && 
    rectangle1.position.y <= rectangle2.position.y + rectangle2.height;
}

//detects wheter to player passed as rectangle 1 is about to collide on the right side of the player passed as rectangle2
function rightToLeftCollision(rectangle1, rectangle2){
    return rectangle1.position.x + rectangle1.velocity.x <= rectangle2.position.x + rectangle2.width && 
    rectangle1.position.x >= rectangle2.position.x && 
    rectangle1.position.y + rectangle1.height >= rectangle2.position.y && 
    rectangle1.position.y <= rectangle2.position.y + rectangle2.height
}

//detects whether any form of horizontal collision is about to happen between the players
function horizontalPlayerCollision() {
    return leftToRightCollision(player, enemy) || leftToRightCollision(enemy, player) || rightToLeftCollision(player, enemy) || rightToLeftCollision(enemy, player); 
}

//detects whether rectangle1 is on top of rectangle2
function topDownCollision(rectangle1, rectangle2) {
    return rectangle1.position.y + rectangle1.height + rectangle1.velocity.y >= rectangle2.position.y &&
    rectangle1.position.y <= rectangle2.position.y &&
    rectangle1.position.x <= rectangle2.position.x + rectangle2.width &&
    rectangle1.position.x + rectangle1.width >= rectangle2.position.x
}

//detects whether a player is on top of the other
function verticalPlayerCollision() {
    return topDownCollision(player, enemy) || topDownCollision(enemy, player);
}

//triggers gameover by time expiration
let gameRunning = true;
function gameOver({player, enemy, timerId}) {
    gameRunning = false
    clearTimeout(timerId);
    if(player.health === enemy.health) {
        document.querySelector('#displayText').innerHTML = 'Tie'
    } else if(player.health > enemy.health) {
        document.querySelector('#displayText').innerHTML = 'Player 1 Wins'
    } else {
        document.querySelector('#displayText').innerHTML = 'Player 2 Wins'
    }
}

//controls the timer on the top of the screen
let timer = 7;
let timerId;
function decreaseTimer() {
    if(timer > 0) {
        timerId = setTimeout(decreaseTimer, 1000);
        timer--;
        document.querySelector('#timer').innerHTML = timer + 1;
    } else {
        document.querySelector('#timer').innerHTML = timer
        gameOver({player, enemy, timerId})
    }
}

decreaseTimer();

//makes the game run
function animate() {
    window.requestAnimationFrame(animate);//makes the function call itself
    c.fillStyle = 'black'
    c.fillRect(0, 0, canvas.width, canvas.height); //re-renders the canvas background
    player.update(); //renders the player
    enemy.update(); //renders the enemy

    //player movement
    if((keys.a.pressed && keys.d.pressed) || (!keys.a.pressed && !keys.d.pressed)){
        player.velocity.x = 0;
    } else if(keys.d.pressed){
        player.velocity.x = 5;
    } else if(keys.a.pressed) {
        player.velocity.x = -5;
    }

    //enemy movement
    if((keys.arrowLeft.pressed && keys.arrowRight.pressed) || (!keys.arrowLeft.pressed && !keys.arrowRight.pressed)){
        enemy.velocity.x = 0;
    } else if(keys.arrowRight.pressed){
        enemy.velocity.x = 5;
    } else if(keys.arrowLeft.pressed) {
        enemy.velocity.x = -5;
    }

    //player attack collision
    if(rectangularCollision({rectangle1: player, rectangle2: enemy}) && player.isAttacking) {  
        player.isAttacking = false;
        if(gameRunning){
            enemy.health -= 10;
            document.querySelector('#enemyHealth').style.width = `${enemy.health}%`
        }
    }

    //enemy attack collision
    if(rectangularCollision({rectangle1: enemy, rectangle2: player}) && enemy.isAttacking) {
            enemy.isAttacking = false;
            if(gameRunning){
                player.health -= 10;
                document.querySelector('#playerHealth').style.width = `${player.health}%`
            }
    }

    //decides whether the players can jump or not
    if((verticalPlayerCollision() && player.position.y + player.height <= enemy.position.y) || player.position.y + player.height >= canvas.height) {
        player.canJump = true
    } else if(player.velocity.y < 0) {
        player.canJump = false
    }
    if((verticalPlayerCollision() && enemy.position.y + enemy.height <= player.position.y) || enemy.position.y + enemy.height >= canvas.height) {
        enemy.canJump = true
    } else if(enemy.velocity.y < 0) {
        enemy.canJump = false
    }

    //decides the position of the attackboxes according to the players` location
    if(player.position.x > enemy.position.x) {
        player.attackBox.offset.x = -50;
        enemy.attackBox.offset.x = 0;
    } else {
        player.attackBox.offset.x = 0;
        enemy.attackBox.offset.x = -50;
    }

    //game over by health reaching 0
    if(player.health === 0 || enemy.health === 0){
        if(gameRunning){
            gameOver({player, enemy, timerId});
        }
    }
}

animate();

window.addEventListener('keydown', (event) => {
    switch(event.key) {
        case 'd':
            keys.d.pressed = true;
            break;
        case 'a':
            keys.a.pressed = true;
            break;
        case 'w':
            player.jump()
            break;
        case ' ':
            player.attack();
            break;
        case 'ArrowRight':
            keys.arrowRight.pressed = true;
            break;
        case 'ArrowLeft':
            keys.arrowLeft.pressed = true;
            break;
        case 'ArrowUp':
            enemy.jump()
            break;
        case 'Control':
            enemy.attack();
            break;
    }
})
window.addEventListener('keyup', (event) => {
    switch(event.key) {
        case 'd':
            keys.d.pressed = false;
            break;
        case 'a':
            keys.a.pressed = false;
            break;
        case 'ArrowRight':
            keys.arrowRight.pressed = false;
            break;
        case 'ArrowLeft':
            keys.arrowLeft.pressed = false;
            break;
    }
})