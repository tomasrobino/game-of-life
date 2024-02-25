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


function input(coordX, coordY) {
    coordX = Math.round(coordX/10);
    coordY = Math.round(coordY/10);

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
    }
}

function handleClick(event) {
    input(event.offsetX, event.offsetY);
}

function endSetup() {
    canvas.removeEventListener("click", handleClick);
    button.removeEventListener("click", endSetup);
}

canvas.addEventListener("click", handleClick);