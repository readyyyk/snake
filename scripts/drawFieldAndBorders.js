function drawFieldAndBorders(){
    // draw the field
    for (let i = 0; i < FIELD_SIZE.full.w; i++) {
        for (let j=0; j<FIELD_SIZE.full.h; j++) {
            ctx.fillStyle = (i%2===j%2 ? COLORS.field[0] : COLORS.field[1])
            ctx.fillRect(i * TILE, j * TILE, TILE, TILE)
        }
    }

    // for top border
    for (let i=0; i<FIELD_SIZE.full.w; i++) {
        for(let j = 0; j < BORDERS[0]; j++) {
            ctx.fillStyle = COLORS.border
            ctx.fillRect(i * TILE, j * TILE, TILE, TILE)
        }
    }
    
    // for right border
    for (let i = 0; i < BORDERS[1]; i++) {
        for(let j = 0; j < FIELD_SIZE.full.h; j++) {
            ctx.fillStyle = COLORS.border
            ctx.fillRect((FIELD_SIZE.full.w - i - 1) * TILE, j * TILE, TILE, TILE)
        }
    }
    
    // for bottom border
    for (let i=0; i<FIELD_SIZE.full.w; i++) {
        for (let j=0; j<BORDERS[2]; j++) {
            ctx.fillStyle = COLORS.border
            ctx.fillRect(i * TILE, (FIELD_SIZE.full.h - j - 1) * TILE, TILE, TILE)
        }
    }

    // for left border
    for (let i = 0; i < BORDERS[3]; i++) {
        for(let j = 0; j < FIELD_SIZE.full.h; j++) {
            ctx.fillStyle = COLORS.border
            ctx.fillRect(i * TILE, j * TILE, TILE, TILE)
        }
    }
}
