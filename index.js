const cvs = document.querySelector('#cvs'),
    ctx = cvs.getContext('2d')

ctx.imageSmoothingEnabled = true;
ctx.imageSmoothingQuality = 'high';

const box = {
    size: 0,
    cnt: {
        border: [2, 1, 1, 1],
        inner: [12, 13],
        x: 1 + 1 + 12,
        y: 2 + 1 + 13,
    },
}
const text = {
    font: `48px sans-serif `,
    pos: [0,0],
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
score = 0




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

    document.addEventListener('keydown', initGame)
    document.addEventListener('touchmove', initGame)
}
//  game keys control (not snake movement) 
document.addEventListener( 'keydown', (e)=>{
    if(e.key === 'r') init()                // refresh snake and food
    if(e.key === 'c') changeColors()        // update color set
} )
const updateSizes = (e)=>{
    (window.innerWidth>window.innerHeight) ?
        box.size = window.innerHeight / box.cnt.y :
        box.size = window.innerWidth / box.cnt.x

    cvs.width = box.size * box.cnt.x
    cvs.height = box.size * box.cnt.y

    text.pos[0] = box.size*1.5
    text.pos[1] = 48 + (box.size*box.cnt.border[0]-48)/2

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
    ctx.font = text.font;
    ctx.fillStyle = colors.text
    ctx.fillText(`Score: ${n}`, text.pos[0], text.pos[1]);
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
        border: '#578a34',
        field: ['#aad751', '#a2d149'],
        text: '#fff',
        snake: ['#1c469d', '#4876ec', '#4876ec'],
    },
    {
        border: '#006000',
        field: ['#0fff00', '#00f000'],
        text: '#fff',
        snake: ['red', 'yellow', 'blue'],
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

const moveSnake = () => {
    const newHead = {
        pos: [snake.body[0].pos[0], snake.body[0].pos[1]],
        dir: dir,
        type: 0,
    }
    switch (dir) {
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
    if( head.pos[0] < 0 || head.pos[0] === box.cnt.inner[0] )                   // checking border collision
        return true
    if( head.pos[1] < 0 || head.pos[1] === box.cnt.inner[1] )
        return true

    for (el of snake.body)                                                      // checking snakes body collision
        if( el.type && el.pos[0]===head.pos[0] && head.pos[1]===el.pos[1] )     // snakes head type in body is 0
            return true                                                         //        what is equal to false
    
    return false
}
const eat = (head) => {
    for( i in food.array ) {
        const el = food.array[i]
        if( el[0]===head.pos[0] && head.pos[1]===el[1] ){
            score++
            food.array[i] = initFood(box.cnt.inner[0], box.cnt.inner[1])        // update eaten element position
            return true
        }
    }
    return false
}



const main = () => {
    document.removeEventListener('keydown', handleKey)
    document.addEventListener('keydown', handleKey)

    if( moveSnake() )
        drawStatic()
}