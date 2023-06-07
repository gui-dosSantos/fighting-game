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
let gameRunning = false;
let gameState
function gameOver({player, enemy, timerId}) {
    gameRunning = false
    gameState = 'end'
    clearTimeout(timerId);
    buttonAnimations = setInterval(() => {
        b.clearRect(0, 0, backspace.width, backspace.height)
        backspaceBtn.update();
    }, 50)
    document.getElementById('gameOver').style.display = 'flex'
    if(player.health === enemy.health) {
        document.querySelector('#displayText').innerHTML = 'Tie'
    } else if(player.health > enemy.health) {
        document.querySelector('#displayText').innerHTML = 'Player 1 Wins'
    } else {
        document.querySelector('#displayText').innerHTML = 'Player 2 Wins'
    }
}

//controls the timer on the top of the screen and call gameOver if it runs out
let timer = 60;
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

//determines what is the right sprite for the players on each frame(probably not the ideal approach, but I cba changing the whole code to a "switchSprite" approach instead)
function determineSprite(player) {
    let currentFrame;
    if(player.faceRight) {
        currentFrame = player.sprites.right;
    } else {
        currentFrame = player.sprites.left;
    }

    if(player.isAlive){
        if(player.tookHit){
            currentFrame = currentFrame.takeHit
        } else if(player.isAttacking) {
                currentFrame = currentFrame.attack1; 
        } else if(player.canJump){
            if(player.velocity.x === 0) {
                currentFrame = currentFrame.idle; 
            } else {
                currentFrame = currentFrame.run; 
            }
        } else {
            if(player.velocity.y < 0){
                currentFrame = currentFrame.jump; 
            } else {
                currentFrame = currentFrame.fall; 
            }
        }
    } else {
        currentFrame = currentFrame.death
    }
    player.totalFrames = currentFrame.totalFrames;
    player.image = currentFrame.image
    if(player.frame >= currentFrame.totalFrames){
        player.frame = 0
    }
}