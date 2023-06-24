const formatString = (str, ...values) =>
    str.replace(/\${(\d+)}/g, (_, index) => values[index]);

class TextContent {
    x; y;
    fontSize;
    fontFamily;
    templateString;
    state;

    constructor(x, y, templateString, initState){
        this.x = x;
        this.y = y;

        this.templateString = templateString;
        this.state = initState;
    }

    increment(){
        this.state++;
    }

    draw() {
        ctx.fillStyle = SCORE_FONT_COLOR;
        ctx.font = `${SCORE_FONT_SIZE}px ${SCORE_FONT_FAMILY}`;
        ctx.textBaseline = 'top';

        ctx.fillText(
            formatString(this.templateString, this.state),
            this.x, this.y
        )
    }
}

const score = new TextContent(TILE + 10, TILE/2, "Score: ${0}", 0)
