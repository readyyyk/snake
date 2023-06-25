class Snake {
    body = [];
    gap;
    isFed = false;
    
    constructor(initSize=3, gap=0.04){ 
        this.gap = gap;
        for(var i=0; i<initSize; i++)
            this.body.unshift({
                x: 1 + i,
                y: Math.floor(FIELD_SIZE.h/2),
            });
    }

    move(direction){
        if(!this.isFed)
            this.body.pop();

        this.isFed = false;

        // copy object
        let newElement = {...this.body[0]};
        switch(direction) {
            case 'up':
                newElement.y--;
                break;
            case 'right':
                newElement.x++;
                break;
            case 'down':
                newElement.y++;
                break;
            case 'left':
                newElement.x--;
                break;
        }

        this.body.unshift(newElement);
    }

    checkIsDeadCollision(){
        const isXBeyondBorders = this.body[0].x === -1 || this.body[0].x === FIELD_SIZE.w
        const isYBeyondBorders = this.body[0].y === -1 || this.body[0].y === FIELD_SIZE.h

        const isCollisionWithTail = this.body.reduce(
            (acc, el, i) => {
                if(i === 0)
                    return acc
                if(el.x === this.body[0].x && el.y === this.body[0].y)
                    return true
                return acc
            }, false)

        return isXBeyondBorders || isYBeyondBorders || isCollisionWithTail
    }
    
    checkEatCollision(food){
        for(let element of food){
            if(element.x === this.body[0].x && element.y === this.body[0].y){
                this.isFed = true
                return element
            }
        }

        return undefined
    }

    draw(){
        this.body.forEach((element, i) => {
            if(i===0)
                ctx.fillStyle = COLORS.snake[0] // head
            else
                ctx.fillStyle = COLORS.snake[1] // body

            ctx.fillRect((BORDERS[3] + element.x + this.gap)*TILE,  // border + pos.x + gap     * tile size
                (BORDERS[0] + element.y + this.gap)*TILE,           // border + pos.y + gap     * tile size
                (1 - this.gap*2)*TILE, (1 - this.gap*2)*TILE);      // 1 - 2*gap                * tile size
        })
    }
}

const snake = new Snake(SNAKE_INIT_LENGTH, SNAKE_ELEMENTS_GAP)
