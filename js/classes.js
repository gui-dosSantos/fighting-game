class Sprite {
    constructor({position, imageSrc, scale = 1, totalFrames = 1, offset = { x: 0, y: 0 }}) {
        this.position = position //stores the players position on the x and y axes
        this.image = new Image();
        this.image.src = imageSrc;
        this.scale = scale
        this.totalFrames = totalFrames
        this.frame = 0
        this.framesElapsed = 0
        this.framesHold = 10
        this.offset = offset
    }

    animateFrames() {
        if(this.framesElapsed % this.framesHold === 0 && !this.isAttacking){
            if(this.frame < this.totalFrames - 1){
                this.frame++
            } else {
                this.frame = 0;
            }
        }
        this.framesElapsed++ 
    }

    draw() {
        c.drawImage(
            this.image,                                             //the image
            (this.image.width / this.totalFrames) * this.frame,     //determines the x-axis point of the cut
            0,                                                      //y-axis cut
            this.image.width / this.totalFrames,                    //x-axis size of the cut
            this.image.height,                                      //height of the cut
            this.position.x - this.offset.x,                        //position of the drawn image on the x-axis
            this.position.y - this.offset.y,                        // y-axis
            (this.image.width / this.totalFrames) * this.scale,     //size on the x-axis
            this.image.height * this.scale)                         //size on the y-axis
    }

    update() {
        this.draw();
        this.animateFrames();
    }
}

class Fighter extends Sprite {
    constructor({ position, velocity, color = 'red', imageSrc, scale = 1, totalFrames = 1, offset = { x: 0, y: 0 }, sprites }) {
        super({
            position,
            imageSrc,
            scale,
            totalFrames,
            offset
        })
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
        this.canHit = true
        this.frame = 0
        this.framesElapsed = 0
        this.framesHold = 10
        this.sprites = sprites
        this.faceRight = true
        

        for(const sprite in this.sprites.right){
            this.sprites.right[sprite].image = new Image();
            this.sprites.right[sprite].image.src = this.sprites.right[sprite].imageSrc
        }
        for(const sprite in this.sprites.left){
            this.sprites.left[sprite].image = new Image();
            this.sprites.left[sprite].image.src = this.sprites.left[sprite].imageSrc
        }

        // this.lastKey
    }

    // draw() {
    //     //draws the player
    //     c.fillStyle = this.color;
    //     c.fillRect(this.position.x, this.position.y, this.width, this.height);
    //     //draw the attackbox
    //     if(this.isAttacking){
    //         c.fillStyle = 'green'
    //         c.fillRect(this.attackBox.position.x, this.attackBox.position.y, this.attackBox.width, this.attackBox.height)
    //     }
    // }

    update() {
        this.draw();
        this.animateFrames();
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
        if(this.position.y + this.height + this.velocity.y >= floor){
            this.velocity.y = 0;
            this.position.y = floor - this.height;
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
            this.totalFrames = this.faceRight ? this.sprites.right.attack1.totalFrames : this.sprites.left.attack1.totalFrames
            this.isAttacking = true;
            this.canAttack = false;
            this.frame = 0;
            let animationInterval = setInterval(() => {
                this.frame++;
            }, 150/this.totalFrames)
            setTimeout(() => {
            this.isAttacking = false;
            clearInterval(animationInterval)
            }, 150)
            setTimeout(() => {
            this.canAttack = true;
            this.canHit = true
            }, 400);
        }
    }
}
