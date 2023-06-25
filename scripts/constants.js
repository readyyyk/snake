const cvs = document.querySelector('canvas');
const ctx = cvs.getContext('2d');

// game colors
const COLORS = {
    border: '#578a34',
    field:  ['#aad751', '#a2d149'],
    text:   '#fff',
    snake:  ['#1c469d', '#4876ec'],
};


// constants for field size
const TILE = 55;
const FIELD_SIZE = {
    w: 12,
    h: 13,
};
const BORDERS = [2, 1, 1, 1];
FIELD_SIZE.full = {
    w: FIELD_SIZE.w + BORDERS[1] + BORDERS[3],
    h: FIELD_SIZE.h + BORDERS[0] + BORDERS[1]
};

// update canvas sizes
cvs.width  = TILE * FIELD_SIZE.full.w;
cvs.height = TILE * FIELD_SIZE.full.h;


// constants for snake
const SNAKE_INIT_LENGTH = 3;
const SNAKE_ELEMENTS_GAP = 0.04;


// constants for food
const FOOD_IMAGE = new Image();
FOOD_IMAGE.src   = "./assets/food.png";

const FOOD_CNT = 3;
