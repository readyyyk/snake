let DIRECTION = '';
let IS_GAME_STARTED = false;

let GAME_LOOP = null;

document.addEventListener('keydown', (event) => {
    const keyName = event.key.toLowerCase()
    if (DIRECTION !== 'down' && (keyName==='w' || keyName==='arrowup'))
        DIRECTION = 'up';
    else if(DIRECTION !== 'left' && (keyName==='d' || keyName==='arrowright'))
        DIRECTION = 'right';
    else if(DIRECTION !== 'up' && (keyName==='s' || keyName==='arrowdown'))
        DIRECTION = 'down';
    else if(DIRECTION !== 'right' && (keyName==='a' || keyName==='arrowleft'))
        DIRECTION = 'left';

    if(!IS_GAME_STARTED && DIRECTION!=='')
        GAME_LOOP = gameLoop()
});

const main = () => {
    snake.move(DIRECTION)

    if(snake.checkIsDeadCollision()){
        clearInterval(GAME_LOOP)
        alert('You lost')
        return
    }

    const eatedFood = snake.checkEatCollision(foodStack)
    if(eatedFood !== undefined)
        eatedFood.updatePosition([...snake.body, ...foodStack])

    drawFieldAndBorders()
    snake.draw()
    foodStack.forEach((food) => food.draw())
}

const gameLoop = () => setInterval(() => {
    IS_GAME_STARTED = true;
    main()
}, 170);

// initial actions
drawFieldAndBorders()
snake.draw()

FOOD_IMAGE.onload = () => {
    for (let i=0; i<FOOD_CNT; i++){
        const food = new Food([...snake.body, ...foodStack]);
        foodStack.push(food);
        food.draw();
    }
}
