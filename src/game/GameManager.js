const TILE_STATS = {
    EMPTY: 'empty',
    NEW: 'new',
    MERGE: 'merge',
    UNCHANGE: 'UNCHANGE'
}

export const DIRECTION = {
    UP: 'up',
    DOWN: 'down',
    LEFT: 'left',
    RIGHT: 'right'
}

function initialGame(game) {
    game.over = false;
    game.emptyCell = game.gridSize * game.gridSize;
    game.score = 0;
    game.best = game.best? game.best: 0;
    initialGrid(game);
}

function initialGrid(game) {
    game.grid = new Array(game.gridSize).fill(null).map(() => new Array(game.gridSize).fill(null));
    setNextRandomCell(game);
    setNextRandomCell(game);
}

function setNextRandomCell(game) {
    if (game.emptyCell === 0) {
        return false;
    }

    // get next postion;
    let index = Math.floor(Math.random() * game.emptyCell);

    // get next vale;
    let val = ( Math.random() < 0.6) ? 2:4;

    let count = 0;
    for (let i = 0; i < game.gridSize; i++) {
        for (let j = 0; j < game.gridSize; j++ ) {
            if (game.grid[i][j] === null) {
                if (count === index) {
                    game.grid[i][j] = buildTile(i, j, val, TILE_STATS.NEW);
                    game.emptyCell--;
                    return true;
                }
                count++;
            }
        }
    }
}


function handleMove(grid, direction) {
    let nextState = {change: false, nextGrid: grid, points: 0, empty: 0}
    switch(direction) {
        case DIRECTION.DOWN:
        case DIRECTION.UP:
            return handleMoveCol(grid, direction);
        case DIRECTION.LEFT:
        case DIRECTION.RIGHT:
            return handleMoveRow(grid, direction);
        default:
            return nextState;
    }
}

function mergetTwoTile(firstTile, secondTile, row, col) {
    return buildTile(row, col, (firstTile.val + secondTile.val), TILE_STATS.MERGE);
}

/**
 * funtion to determine next view state, and retrun a summarize
 * @param {Array} row - the one row or col of grid cell in current state
 * @param {boolean} toRight - movement direction
 * @param {boolean} isRow - flag to indicate is movement horizontal or vertical   
 * @return {object} - the object to describe next state {change: false, next: row, points: 0, tiles: 0};
 */
function nextRowStat(row, toRight, isRow) {
    let afterMoveStat = {change: false, next: row, points: 0, tiles: 0};
    // get all current file
    let statChange = false;
    let score = 0;

    // filter get all current non-empty cell
    let tiles = row.filter(e => e!== null);
    if (!tiles.length) return afterMoveStat;
    let newTiles = [];
    let getNextTile = (toRight)? Array.prototype.pop:Array.prototype.shift;
    let firstTile = getNextTile.apply(tiles);
    let x = isRow? firstTile.pos.row: ((toRight)? (row.length - 1):0);
    let y = isRow? ((toRight)? (row.length - 1):0) : firstTile.pos.col;
    let step = (toRight)? -1:1;

    while (tiles.length) {
        let secondTile = getNextTile.apply(tiles);
        // merge if two cell have same val
        if (firstTile.val === secondTile.val) {
            statChange = true;
            score += (firstTile.val * 2);
            newTiles.push(mergetTwoTile(firstTile, secondTile, x, y));
            firstTile = getNextTile.apply(tiles);
        } else {
            if (firstTile.pos.col !== y || firstTile.pos.row !== x) statChange = true;
            newTiles.push(buildTile(x, y, firstTile.val, TILE_STATS.UNCHANGE));
            firstTile = secondTile;
        }
        if (isRow) {
            y += step;
        } else {
            x += step;
        }
        
    }
    if (firstTile !== undefined) {
        if (firstTile.pos.col !== y || firstTile.pos.row !== x) statChange = true;
        newTiles.push(buildTile(x, y, firstTile.val, TILE_STATS.UNCHANGE));
    }
    
    // fill empty cell to construct valid next state
    let tilesSize = newTiles.length;
    let size = row.length - newTiles.length;
    newTiles = newTiles.concat(new Array(size).fill(null));
    if (toRight) newTiles.reverse();
    afterMoveStat.change = statChange;
    afterMoveStat.next = newTiles;
    afterMoveStat.points = score;
    afterMoveStat.tiles = tilesSize;
    return afterMoveStat;
}

function handleMoveRow(grid, direction) {
    let nextState = {change: false, nextGrid: grid, points: 0, empty: 0};

    let toRight = true;
    switch(direction) {
        case DIRECTION.LEFT:
            toRight = false;
            break;
        case DIRECTION.RIGHT:
            toRight = true;
            break;
        default:
            return nextState;
    }
    let tilesSize = 0;
    for (let row = 0; row < grid.length; row++) {
        let rowTiles = grid[row];
        let afterMoveStat = nextRowStat(rowTiles, toRight, true);
        tilesSize += afterMoveStat.tiles;
        if (!afterMoveStat.change) continue;
        nextState.change = afterMoveStat.change;
        nextState.points += afterMoveStat.points;
        grid[row] = afterMoveStat.next;
    }

    nextState.empty = (grid.length *  grid.length) - tilesSize;
    return nextState;
}

function handleMoveCol(grid, direction) {
    let nextState = {change: false, nextGrid: grid, points: 0, empty: 0};

    let statChange = false;
    let toBottom = true;
    switch(direction) {
        case DIRECTION.UP:
            toBottom = false;
            break;
        case DIRECTION.DOWN:
            toBottom = true;
            break;
        default:
            return statChange;
    }

    let tilesSize = 0;
    for (let col = 0; col < grid.length; col++) {
        let colTiles = grid.map(row => row[col]);
        let afterMoveStat = nextRowStat(colTiles, toBottom, false);
        tilesSize += afterMoveStat.tiles;
        if (!afterMoveStat.change) continue;
        nextState.change = afterMoveStat.change;
        nextState.points += afterMoveStat.points;
        for (let row = 0; row < grid.length; row++) {
            grid[row][col] = afterMoveStat.next[row];
        }
    }

    nextState.empty = (grid.length *  grid.length) - tilesSize;
    return nextState;
}

function buildTile(row, col, val, stat) {
    return {pos: {row: row, col: col}, val: val, stat: stat};
}

export default class GameManager {

    constructor(gridSize = 4) {
        this.gridSize = gridSize;
        initialGame(this);
    }

    getCurrentState() {
        return {over: this.over, score: this.score, best: this.best, grid: this.grid};
    }

    resetGame() {
        initialGame(this);
    }

    updateGameWithMovement(direction) {
        // if game over, return fasle;
        if (this.over) return false;

        // try move in given direction, if no move do not generate next random;
        let nextGridStat = handleMove(this.grid, direction);
        if (!nextGridStat.change) return false;
        this.grid = nextGridStat.nextGrid;
        this.score += nextGridStat.points;
        this.emptyCell = nextGridStat.empty;

        if (this.best < this.score) this.best = this.score; 

        // get next random
        setNextRandomCell(this);

        // if no empty cell for next move check does game over 
        if (this.emptyCell === 0) {
            let copy_grid = this.grid.map(row => row.map(cell => Object.assign({}, cell)));
            if ( !handleMove(copy_grid, DIRECTION.UP).change && !handleMove(copy_grid, DIRECTION.DOWN).change &&
                 !handleMove(copy_grid, DIRECTION.RIGHT).change && !handleMove(copy_grid, DIRECTION.LEFT).change ) {
                    this.over = true;
                }
        }

        return true;
    }

}
