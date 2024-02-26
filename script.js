const SQUARE_SIDE = 10;

const canvas = document.querySelector("#canvas");
const button = document.querySelector("#button");
const width = canvas.width;
const height = canvas.height;
const ctx = canvas.getContext("2d");
//const boardCoord = [500, 100];
const board = [];
let awayX = 0;
let awayY = 0;
let mousePosition = {x: 0, y: 0};
let limitX = 0;
let limitY = 0;
let setupDone = false;


function renderCanvas() {
    for (let y = 0; y < board.length; y++) {
        for (let x = 0; x < board[y].length; x++) {
            if (board[y][x] === 1) {
                ctx.fillRect(x*SQUARE_SIDE, y*SQUARE_SIDE, SQUARE_SIDE, SQUARE_SIDE);
            }
        }
    }
}

function input(coordX, coordY) {
    coordX = Math.floor(coordX/SQUARE_SIDE);
    coordY = Math.floor(coordY/SQUARE_SIDE);

    if (!board[coordY]) board[coordY] = [];
    if (board[coordY][coordX] === 1) {
        board[coordY][coordX] = 0;
        console.log("Erased " + coordX + ", " + coordY);
    } else {
        board[coordY][coordX] = 1;
        //Populate array behind with zeroes to avoid undefined
        for (let y = coordY-1; y >= limitY; y--) {
            if (!board[y]) board[y] = [];
            for (let x = coordX-1; x >= limitX; x--) {
                if (!board[y][x]) {
                    board[y][x] = 0;
                }
            }
        }
        console.log("Added " + coordX + ", " + coordY);
        limitX = coordX;
        limitY = coordY;
        if (!setupDone) {
            ctx.fillRect(coordX*SQUARE_SIDE, coordY*SQUARE_SIDE, SQUARE_SIDE, SQUARE_SIDE);
        }
    }
}

function handleClick(event) {
    input(event.offsetX + awayX, event.offsetY + awayY);
}

function start() {
    button.removeEventListener("click", start);
    button.addEventListener("click", stop);

    setInterval(update, 1000);
}

function countNeighbours(array, posX, posY) {
    let counter = 0;

    if (posX !== 0) {
        //Left
        if (array[posY][posX-1] === 1) counter++;
        //Upper left
        if (posY !== 0) {
            if (array[posY-1][posX-1] === 1) counter++;
        }
        //Bottom left
        if (posY !== array.length-1) {
            if (array[posY+1][posX-1] === 1) counter++;
        }
    }

    if (posY !== 0) {
        //Up
        if (array[posY-1][posX] === 1) counter++;
    }
    if (posY !== array.length-1) {
        //Down
        if (array[posY+1][posX] === 1) counter++;
    }

    if (posX !== array[posY].length) {
        //Right
        if (array[posY][posX+1] === 1) counter++;
        //Upper right
        if (posY !== 0) {
            if (array[posY-1][posX+1] === 1) counter++;
        }
        //Bottom right
        if (posY !== array.length-1) {
            if (array[posY+1][posX+1] === 1) counter++;
        }
    }

    return counter;
}

function update() {
    const boardCopy = new Array(board.length).fill([]);


    for (let y = 0; y < board.length; y++) {
        for (let x = 0; x < board[y].length; x++) {
            if (board[y][x] === 1) {
                boardCopy[y][x] = 1;
            }
        }
    }

    for (let y = 0; y < boardCopy.length; y++) {
        for (let x = 0; x < boardCopy[y].length; x++) {
            //Update logic begins here
            if (boardCopy[y][x] === 1) {
                let neighbours = countNeighbours(boardCopy, x, y);
            }
        }
    }
}

function stop() {
    button.removeEventListener("click", stop);
    button.addEventListener("click", start);
}

function endSetup() {
    canvas.removeEventListener("click", handleClick);
    button.removeEventListener("click", endSetup);
    setupDone = true;
    button.addEventListener("click", start);
}

canvas.addEventListener("click", handleClick);