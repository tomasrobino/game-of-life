const canvas = document.querySelector("#canvas");
const width = canvas.width;
const height = canvas.height;
const ctx = canvas.getContext("2d");
//const boardCoord = [500, 100];
const board = [];
let mousePosition = {x: 0, y: 0};
const limitX = 0;
const limitY = 0;

function place(coordX, coordY) {
    if (board[coordY][coordX] === 1) {
        board[coordY][coordX] = 0;
    } else {
        board[coordY][coordX] = 1;
        //Populate array behind with zeroes to avoid undefined
        for (let y = coordY-1; y >= limitY; y--) {
            for (let x = coordX-1; x >= limitX; x--) {
                if (!board[y][x]) {
                    board[y][x] = 0;
                }
            }
        }
        limitX = coordX;
        limitY = coordY;
    }
}

function setup() {
}

