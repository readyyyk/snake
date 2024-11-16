console.info("## to enable debug use .../?debug\n## to enable debug use .../?auto");
const urlParams = new URLSearchParams(window.location.search);
const debugParam = urlParams.has('debug');
const autoPlayParam = urlParams.has('auto');

const DEBUG = debugParam;
console.deb = (...args) => { if( DEBUG ) console.log( ...args ); }
document.addEventListener('keydown', e => { if(e.key===' ') debugger; } )

const cvs = document.querySelector('#cvs'),
    ctx = cvs.getContext('2d');

ctx.imageSmoothingEnabled = true;
ctx.imageSmoothingQuality = 'high';

const autoPlay = autoPlayParam ;

const box = {
    size: 0,
    cnt: {
        border: [2, 1, 1, 1],
        inner: [20, 20],
        x: 1 + 1 + 20,
        y: 2 + 1 + 20,
    },
}
const text = {
    score: {
        fz: 48,
        ff: `sans-serif `,
        pos: [0,0],
    },
    maxScore: {
        fz: 24,
        ff: `sans-serif `,
        pos: [0,0], // symbols: 5 + 2
    }
}
const food = {
    cnt: 3,
    gap: 0.025,
    img: new Image(),
    array: []
}
food.img.src = 'food.png'

/*
snake body element type
    0 - head
    1 - body
    2 - tail
*/
let snake = {
    body: [],
    gap: 0.03   // percent of box size
},
score = 0,
maxScore = score




// init
const initFood = (x, y) => {
    let tempFood = [Math.floor(Math.random()*x), Math.floor(Math.random()*y)]

    for(el of food.array)
        if(tempFood[0] === el[0] && tempFood[1] === el[1])
            tempFood = initFood(x, y)
    for(el of snake.body)
        if(tempFood[0] === el.pos[0] && tempFood[1] === el.pos[1])
            tempFood = initFood(x, y)

    return tempFood
}

let interval = null
const initGame = (e)=> {
    clearInterval(interval)
    interval = setInterval( main, 130 )
    document.removeEventListener('keydown', initGame)
    document.removeEventListener('touchmove', initGame)
}
const init = () => {
    const yCenter = Math.ceil(box.cnt.inner[1]/2)-1
    snake.body = [
        {
            pos: [3, yCenter],
            dir: 1,
            type: 0,
        },
        {
            pos: [2, yCenter],
            dir: 1,
            type: 1,
        },
        {
            pos: [1, yCenter],
            dir: 1,
            type: 2,
        },
    ]

    food.array = []
    for(let i=0; i<food.cnt;i++){
        food.array.push(initFood( box.cnt.inner[0], box.cnt.inner[1] ))
    }

    score = 0
    dir = 1

    drawStatic()

    if(autoPlay){
        findWay()
    }

    document.addEventListener('keydown', initGame)
    document.addEventListener('touchmove', initGame)
}
//  game keys control (not snake movement) 
document.addEventListener( 'keydown', (e)=>{
    if(e.key === 'r') init()                // refresh snake and food
    if(e.key === 'c') changeColors()        // update color set
} )
const updateSizes = (e)=>{
    (window.innerWidth > window.innerHeight) 
        ? box.size = window.innerHeight / box.cnt.y 
        : box.size = window.innerWidth / box.cnt.x

    cvs.width = box.size * box.cnt.x
    cvs.height = box.size * box.cnt.y

    text.score.pos[0] = box.size*1.5
    text.score.pos[1] = text.score.fz + (box.size*box.cnt.border[0]- text.score.fz )/2

    text.maxScore.pos[0] = cvs.width - box.size - text.maxScore.fz * 5
    text.maxScore.pos[1] = text.maxScore.fz + (box.size*box.cnt.border[0]-text.maxScore.fz )/2

    init()
}
window.addEventListener( 'load',  updateSizes)
window.addEventListener( 'resize',  updateSizes)




// draw methods
const drawField = () => {
    ctx.fillStyle = colors.field[0]; 
    ctx.beginPath(); ctx.rect(0,0,cvs.width, cvs.height); ctx.fill(); ctx.closePath();  // fill all canvas with field 0 color
    for(let i=0; i<box.cnt.inner[0]; i++){                                              // fill some boxes of canvas with field 1 color
        for(let j=i%2; j<box.cnt.inner[1]; j+=2){
            ctx.fillStyle = colors.field[1]
            ctx.beginPath();
            ctx.rect(
                i*box.size + box.cnt.border[3]*box.size,
                j*box.size + box.cnt.border[0]*box.size,
                box.size, box.size); ctx.fill();
            ctx.closePath();
        }
    }
    ctx.fillStyle = colors.border;                                                      // fill borders
    ctx.beginPath(); ctx.rect(0,0, cvs.width, box.cnt.border[0]*box.size); ctx.fill(); ctx.closePath();
    ctx.beginPath(); ctx.rect(0,cvs.height-box.cnt.border[2]*box.size, cvs.width, box.cnt.border[2]*box.size); ctx.fill(); ctx.closePath();
    ctx.beginPath(); ctx.rect(0,0, box.cnt.border[3]*box.size, cvs.height); ctx.fill(); ctx.closePath();
    ctx.beginPath(); ctx.rect(cvs.width-box.cnt.border[1]*box.size, 0, box.cnt.border[1]*box.size, cvs.height); ctx.fill(); ctx.closePath();
}

const drawScore = (n) => {

    ctx.font = `${text.score.fz}px ${text.score.ff}`;
    ctx.fillStyle = colors.text
    ctx.fillText(`Score: ${n}`, text.score.pos[0], text.score.pos[1]);

    ctx.font = `${text.maxScore.fz}px ${text.maxScore.ff}`;
    ctx.fillText( `max: ${maxScore}`, text.maxScore.pos[0], text.maxScore.pos[1] )
}

const drawSnake = () => {
    snake.body.forEach( el => {
        ctx.beginPath();
            ctx.fillStyle = colors.snake[el.type]
            ctx.rect( el.pos[0]*box.size + box.size*snake.gap + box.cnt.border[3]*box.size,     // pos.x + gap + border
                el.pos[1]*box.size + box.size*snake.gap + box.cnt.border[0]*box.size,           // pos.y + gap + border
                box.size - snake.gap*box.size*2, box.size - snake.gap*box.size*2); ctx.fill()   // gap size gap
        ctx.closePath();
    } )
}

const drawFood = () => {
    food.array.forEach( el => {
        ctx.drawImage( food.img,
            el[0]*box.size + box.size*food.gap + box.cnt.border[3]*box.size,                    // same as snake
            el[1]*box.size + box.size*food.gap + box.cnt.border[0]*box.size,
            box.size-box.size*food.gap*2, box.size-box.size*food.gap*2);
    } )
}
const drawStatic = () => {
    ctx.clearRect(0,0,cvs.width,cvs.height)
    drawField()
    drawScore(score)
    drawSnake()
    drawFood()
}




const colorSets = [
    {
        border: '#006000',
        field: ['#0fff00', '#00f000'],
        text: '#fff',
        snake: ['red', 'yellow', 'blue'],
    },
    {
        border: '#578a34',
        field: ['#aad751', '#a2d149'],
        text: '#fff',
        snake: ['#1c469d', '#4876ec', '#4876ec'],
    }
]
let colors = {}
const changeColors = () => {
    colors = colorSets.pop()
    colorSets.unshift(colors)
    
    drawStatic()
}
changeColors()




let dir = 1
const keys = {          // e.key - dir
    'w': 0,
    'd': 1,
    's': 2,
    'a': 3,

    'ArrowUp': 0,
    'ArrowRight': 1,
    'ArrowDown': 2,
    'ArrowLeft': 3,
}
const handleKey = e => {
    if(keys[e.key]!==undefined && dir%2!==keys[e.key]%2)
        dir = keys[e.key]
    document.removeEventListener('keydown', handleKey)
}

const minDiff = 20      // between touches
const touch = {
    start: {
        time: new Date(),
        pos: [],
    }
}
document.addEventListener('touchstart', e=>{
    touch.start.pos = [e.touches[0].clientX, e.touches[0].clientY]
    touch.start.time = new Date()
}, {passive: true})
document.addEventListener('touchmove', e=>{
    if(new Date() - touch.start.time > 80){
        const currentMaxDiff = {
            dir: Math.abs(touch.start.pos[0]-e.touches[0].clientX)>Math.abs(touch.start.pos[1]-e.touches[0].clientY)
                ? 0         // for X direction
                : 1,        // for Y direction
            diff: Math.abs(touch.start.pos[0]-e.touches[0].clientX)>Math.abs(touch.start.pos[1]-e.touches[0].clientY)
                ? touch.start.pos[0]-e.touches[0].clientX
                : touch.start.pos[1]-e.touches[0].clientY
        }
        touch.start = {
            pos: [e.touches[0].clientX, e.touches[0].clientY],
            time: new Date()
        }
        if( Math.abs(currentMaxDiff.diff) > minDiff ) {
            currentMaxDiff.dir
                ? currentMaxDiff.diff > minDiff             // direction y
                        ? dir!==2 ? dir = 0 : dir = 2           // handle returning straight back
                        : dir!==0 ? dir = 2 : dir = 0           // same
                : currentMaxDiff.diff > minDiff             // direction x
                        ? dir!==1 ? dir = 3 : dir = 1           // same as for y
                        : dir!==3 ? dir = 1 : dir = 3           // same as for y
        }
    }
}, {passive: true})

const moveSnake = (currentDir) => {
    const newHead = {
        pos: [snake.body[0].pos[0], snake.body[0].pos[1]],
        dir: currentDir,
        type: 0,
    }
    switch (currentDir) {
        case 0:                 // y-
            newHead.pos[1]--
            break
        case 1:                 // x+
            newHead.pos[0]++
            break
        case 2:                 // y+
            newHead.pos[1]++
            break
        case 3:                 // x-
            newHead.pos[0]--
            break
    }
    

    if(collision(newHead)){
        clearInterval(interval)
        return false
    }

    snake.body.unshift(newHead)
    snake.body[1].type = 1
    
    if(!eat(newHead)){          // if nothing was eaten reduce last element of snakes body
        snake.body.pop()
        snake.body[snake.body.length-1].type = 2
    }

    return true
}




const collision = (head) => {
    if( head.pos[0] < 0 || head.pos[0] === box.cnt.inner[0] ){                   // checking border collision
        return true
    }
    if( head.pos[1] < 0 || head.pos[1] === box.cnt.inner[1] ){
        return true
    }
        

    for (el of snake.body){                                                     // checking snakes body collision
        if( el.type && el.pos[0]===head.pos[0] && head.pos[1]===el.pos[1] ){    // snakes head type in body is 0
            return true                                                         //        what is equal to false
        }
    }
    
    return false
}
const eat = (head) => {
    for( i in food.array ) {
        const el = food.array[i]
        if( el[0]===head.pos[0] && head.pos[1]===el[1] ){
            score++
            maxScore = Math.max( score, maxScore )
            food.array[i] = initFood(box.cnt.inner[0], box.cnt.inner[1])        // update eaten element position

            if(autoPlay) {
                findWay();
            }

            return true
        }
    }
    return false
}


//
let dirStack = []
let wanted = {
    way: box.cnt.inner[0]+box.cnt.inner[1],
    pos: [],
}
const findWay = () => {
    let DROP_CNT = 0; const DROP_MAX = 1e3 //(box.cnt.inner[0]+box.cnt.inner[1])*7

    let head = [...snake.body[0].pos]

    dirStack = []

    let tempSnake = JSON.parse(JSON.stringify(snake));

    console.deb('head start', head)

    const checkX = () => {
        return food.array
                .some( foodEl => ( head[0] === foodEl[0] &&
                    // !tempSnake.body
                    !snake.body
                        .filter( snakeEl => ( snakeEl.type && snakeEl.pos[0] === foodEl[0] ) )
                        .some( snakeEl =>
                            (( head[1] > snakeEl.pos[1] && head[1] > foodEl[1] && snakeEl.pos[1] > foodEl[1] ) || 
                            ( head[1] < snakeEl.pos[1] && head[1] < foodEl[1] && snakeEl.pos[1] < foodEl[1] ))
                        )
                )
        )
    }
    const checkY = () => {
        return food.array
                .some( foodEl => ( head[1] === foodEl[1] &&
                    // !tempSnake.body
                    !snake.body
                        .filter( snakeEl => ( snakeEl.type && snakeEl.pos[1] === foodEl[1] ) )
                        .some( snakeEl =>
                            (( head[0] > snakeEl.pos[0] && head[0] > foodEl[0] && snakeEl.pos[0] > foodEl[0] ) || 
                            ( head[0] < snakeEl.pos[0] && head[0] < foodEl[0] && snakeEl.pos[0] < foodEl[0] ))
                        )
                )
        )
    }

    let searchXAxis = true
    while( 1 ){
        if( checkX() ){
            searchXAxis = true
            break
        } else if( checkY() ){
            searchXAxis = false
            break
        }

        DROP_CNT++; if(DROP_CNT >= DROP_MAX){ if(DEBUG) { console.deb('dirs:', dirStack); debugger; } else { init(); initGame(); console.warn("ne zaciklivaisya na odnom") } }

        // console.deb('currentDirs:', dirStack )

        switch( dir ) {
            case 0:
                head[1]--
                break
            case 1:
                head[0]++
                break
            case 2:
                head[1]++
                break
            case 3:
                head[0]--
                break
        }
        
        const hitBody = /*tempSnake*/snake.body.some( snakeEl => (snakeEl.pos[0]===head[0] && snakeEl.pos[1]===head[1]) )

        if( head[0] >= box.cnt.inner[0] || head[0] < 0) {
            dir = Number(Math.max( head[1], box.cnt.inner[1]-head[1]-1) !== head[1])*2
            head[0] = (head[0] < 0 ? 0 : box.cnt.inner[0]-1)
            console.deb("turn from X", dir, dirStack)
            continue
        } else if ( head[1] >= box.cnt.inner[1] || head[1] < 0) {
            dir = Number(Math.max( head[0], box.cnt.inner[0]-head[0]-1) === head[0])*2 + 1
            head[1] = (head[1] < 0 ? 0 : box.cnt.inner[1]-1)
            console.deb("turn from Y", dir, dirStack)
            continue
        } else if(hitBody){
            switch (dir) {
                case 0 || 2:
                    dir = Number(Math.max( head[0], box.cnt.inner[0]-head[0]-1) === head[0])*2 + 1
                    head[1] += dir ? 1 : -1
                    break
                case 1 || 3:
                    dir = Number(Math.max( head[1], box.cnt.inner[1]-head[1]-1) !== head[1])*2
                    head[0] += dir===3 ? 1 : -1
                    break
            }
            continue
        }

        // tempSnake.body.unshift({pos: head, type: 0});
        // tempSnake.body[1].type = 1; tempSnake.body[tempSnake.body.length-1].type = 2;

        dirStack.push(dir)
    }
    
    if(searchXAxis)
        wanted.pos = food.array.sort(el=>el[1]-head[1]).find( el => el[0]===head[0] )
    else
        wanted.pos = food.array.sort(el=>el[0]-head[0]).find( el => el[1]===head[1] )

    console.deb('head:', head)
    console.deb('wanted:', wanted.pos)
    console.deb('dirs:', dirStack)


    if( head[0] === wanted.pos[0] ){
        while( head[1] !== wanted.pos[1] ){
            const temp = (head[1] < wanted.pos[1])*2
            temp===2
                ? head[1]++
                : head[1]--
            // moveSnake(temp);
            dirStack.push(temp);
        }
    } else if( head[1] === wanted.pos[1] ) {
        while( head[0] !== wanted.pos[0] ){
            const temp = (head[0] > wanted.pos[0])*2+1
            temp===1
                ? head[0]++
                : head[0]--
            // moveSnake(temp);
            dirStack.push(temp)
        }
    }

    
    console.deb("-----------");
    // snake = oldSnake
}
//


const main = () => {
    document.removeEventListener('keydown', handleKey)
    document.addEventListener('keydown', handleKey)

    if( autoPlay ){
        dir = dirStack.shift()
        if(typeof(dir) == 'number')
            if( moveSnake(dir) )
                drawStatic()
            else {
                console.deb('dirs:', dirStack)
                console.warn( "cant move snake" )
                if( !DEBUG ) {
                    init()
                    initGame()
                }
            }
        else  {
            console.warn( typeof dir )
            if( !DEBUG ){
                init()
                initGame()
            }
        }
                
    } else {
        if( moveSnake( dir ) )
            drawStatic()
    }
}
