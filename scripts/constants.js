const cvs = document.querySelector('canvas');
const ctx = cvs.getContext('2d');

const COLORS = {
    border: '#578a34',
    field: ['#aad751', '#a2d149'],
    text: '#fff',
    snake: ['#1c469d', '#4876ec', '#4876ec'],
}

const TILE = 55;
const FIELD_SIZE = {
    w: 12,
    h: 13,
}
const BORDERS = [2, 1, 1, 1]
FIELD_SIZE.full = {
    w: FIELD_SIZE.w + BORDERS[1] + BORDERS[3],
    h: FIELD_SIZE.h + BORDERS[0] + BORDERS[1]
}

cvs.width = TILE*FIELD_SIZE.full.w;
cvs.height = TILE*FIELD_SIZE.full.h;

const FOOD_IMAGE = new Image();
FOOD_IMAGE.src = "./assets/food.png";

const FOOD_CNT = 3


const SNAKE_INIT_SIZE = 3
const SNAKE_ELEMENTS_GAP = 0.04
