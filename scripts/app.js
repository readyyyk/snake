let DIRECTION = '';
let IS_GAME_STARTED = false;

let GAME_LOOP = null;

function handleKeyDown(event) {
    document.removeEventListener('keydown', handleKeyDown);

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
        GAME_LOOP = setInterval(() => {
                IS_GAME_STARTED = true;
                main();
            }, 170);
}

document.addEventListener('keydown', handleKeyDown);


const main = () => {
    document.removeEventListener('keydown', handleKeyDown);
    document.addEventListener('keydown', handleKeyDown);
    
    snake.move(DIRECTION)

    if(snake.checkIsDeadCollision()){
        clearInterval(GAME_LOOP)
        alert('You lost')
        return
    }

    drawFieldAndBorders()
    snake.draw()
}

// initial actions
drawFieldAndBorders()
snake.draw()
