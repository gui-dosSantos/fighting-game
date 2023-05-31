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

function determineSprite(player) {
    if(!player.canJump){
        if(player.velocity.y < 0){
            player.totalFrames = player.sprites.jump.totalFrames
            if(player.frame >= player.sprites.jump.totalFrames){
                player.frame = 0
            }
            player.image = player.sprites.jump.image
        } else {
            player.totalFrames = player.sprites.fall.totalFrames
            if(player.frame >= player.sprites.fall.totalFrames){
                player.frame = 0
            }
            player.image = player.sprites.fall.image
        }
    } else {
        if(player.velocity.x === 0) {
            player.totalFrames = player.sprites.idle.totalFrames
            player.image = player.sprites.idle.image
        } else {
            player.totalFrames = player.sprites.run.totalFrames
            player.image = player.sprites.run.image
        }
    }
}