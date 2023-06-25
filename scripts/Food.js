let foodStack = []

class Food {
    x; y;
    img = FOOD_IMAGE;

    constructor(collidable) {
        this.updatePosition(collidable)
    }

    generatePosition(collidable) {
        let position = {
            x: Math.floor(Math.random() * FIELD_SIZE.w),
            y: Math.floor(Math.random() * FIELD_SIZE.h),
        }
        collidable.forEach(el => {
            if(position.x === el.x && position.y === el.y)
                position = this.generatePosition(collidable)
        });

        return position
    }

    updatePosition(collidable) {
        const position = this.generatePosition(collidable)
        this.x = position.x
        this.y = position.y
    }

    draw() {
        ctx.drawImage(this.img,
            (this.x + BORDERS[3]) * TILE, (this.y + BORDERS[0]) * TILE,
            TILE, TILE)
    }
}
