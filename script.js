const SQUARE_SIDE = 10;

const canvas = document.querySelector("#canvas");
const button = document.querySelector("#button");
const width = canvas.width;
const height = canvas.height;
const ctx = canvas.getContext("2d");
const board = [];
let awayX = 0;
let awayY = 0;
let mousePosition = {x: 0, y: 0};
let limitX = 0;
let limitY = 0;
let setupDone = false;
let intervalID;


function renderCanvas() {
    for (let y = 0; y < board.length; y++) {
        for (let x = 0; x < board[y].length; x++) {
            if (board[y][x] === 1) {
                ctx.fillStyle = "black";
                ctx.fillRect(x*SQUARE_SIDE + awayX, y*SQUARE_SIDE + awayY, SQUARE_SIDE, SQUARE_SIDE);
            } else {
                ctx.fillStyle = "white";
                ctx.fillRect(x*SQUARE_SIDE + awayX, y*SQUARE_SIDE + awayY, SQUARE_SIDE, SQUARE_SIDE);
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
    intervalID = setInterval(update, 1000);
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
    let flag = 0;
    for (let y = 0; y < board.length; y++) {
        if (board[y][0] === 1) {
            for (let k = 0; k < board.length; k++) {
                board[k].unshift(0);
            }
            awayX-=SQUARE_SIDE;
            flag++;
            y++;
        }

        if (board[y][board[y].length-1] === 1) {
            for (let k = 0; k < board.length; k++) {
                board[k].push(0);
            }
            flag++;
        }

        if (flag===2) break;
    }

    flag = 0;

    for (let x = 0; x < board[0].length; x++) {
        if (board[0][x] === 1) {
            board.unshift(new Array(board[0].length));
            awayY-=SQUARE_SIDE;
            flag++;
            x++;
        }

        if (board[board.length-1][x] === 1) {
            board.push(new Array(board[0].length));
            flag++;
        }

        if (flag===2) break;
    }

    const boardCopy = structuredClone(board);

    
    for (let y = 0; y < boardCopy.length; y++) {
        for (let x = 0; x < boardCopy[y].length; x++) {
            //Update logic begins here
            let neighbours = countNeighbours(boardCopy, x, y);
            if (y=== 1 && x === 2) {
            }
            if (boardCopy[y][x] === 1) {
                if (neighbours < 2 || neighbours > 3) {
                    //Dies
                    board[y][x] = 0;
                }
            } else if (neighbours === 3) {
                //Becomes alive
                board[y][x] = 1;
            }
        }
    }
    console.log(board)
    renderCanvas();
}

function stop() {
    clearInterval(intervalID);
    button.removeEventListener("click", stop);
    button.addEventListener("click", start);
}

function endSetup() {
    canvas.removeEventListener("click", handleClick);
    button.removeEventListener("click", endSetup);
    setupDone = true;
    button.addEventListener("click", start);
    console.log(board);
}

canvas.addEventListener("click", handleClick);