class Score {
    x; y;
    counter;

    constructor(x, y, initState){
        this.x = x;
        this.y = y;

        this.counter = initState;
    }

    increment(){
        this.counter++;
    }

    draw() {
        ctx.fillStyle = SCORE_FONT_COLOR;
        ctx.font = `${SCORE_FONT_SIZE}px ${SCORE_FONT_FAMILY}`;
        ctx.textBaseline = 'top';

        ctx.fillText(
            `Score: ${this.counter}`,
            this.x, this.y
        );
    }
}

const score = new Score(TILE + 10, TILE/2, 0);
