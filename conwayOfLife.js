const { createCanvas } = require('canvas');
const fs = require('fs');
const path = require('path');

const cellSize = 28;  // You can modify this to control the cell size doesn't work very well with all values

//The lines after these are color palettes that I picked which they are not the best I am not an artist

//const deadColor = 'rgb(0, 0, 0)'; 
//const aliveColor = 'rgb(235, 211, 248)'; 

const deadColor = 'rgb(17, 17, 17)'; 
const aliveColor = 'rgb(122, 28, 172)'; 

//const deadColor = 'rgb(18, 48, 174)'; 
//const aliveColor = 'rgb(255, 247, 247)'; 

//const aliveColor = 'rgb(102, 67, 67)'; 
//const deadColor = 'rgb(59, 48, 48)';

//const deadColor = 'rgb(102, 67, 67)'; 
//const aliveColor = 'rgb(59, 48, 48)';

const screenWidth = 1920; //your screen resolution
const screenHeight = 1080; 

const width = Math.floor(screenWidth / cellSize) * cellSize; // this was an attempt to make every value 
const height = Math.floor(screenHeight / cellSize) * cellSize; // for cell size to work with screen size

const canvas = createCanvas(width, height);
const ctx = canvas.getContext('2d');

// rows and columns based on adjusted canvas size
const rows = Math.floor(height / cellSize);
const cols = Math.floor(width / cellSize);

let grid = createGrid();
let gameStarted = true; //will implement these later
let gamePaused = false;
let frame = 0;
let resetTime=100; //after hundreds of iterations game might become stale so this value creates a brand new canvas
                    //with 500 milliseconds intervals every 50 seconds a new grid is created newCycle=resetTime*intervalTime
let currentTime=0;

// Create a grid with random alive (1) and dead (0) cells
function createGrid() {
    const aliveProbability = 0.3; // Adjust the probability of alive cells (0.3 = 30% alive)
    return new Array(rows).fill(null).map(() => 
        new Array(cols).fill(null).map(() => Math.random() < aliveProbability ? 1 : 0)
    );
}

// Function to draw the grid and cells
function drawGrid() {
    for (let row = 0; row < rows; row++) {
        for (let col = 0; col < cols; col++) {
            ctx.beginPath();
            ctx.rect(col * cellSize, row * cellSize, cellSize, cellSize);
            ctx.fillStyle = grid[row][col] ? aliveColor : deadColor;
            ctx.fill();
            ctx.stroke();
        }
    }
}

//update the grid based on the Game of Life rules that you can find in the Readme.md
function updateGrid() {
    let newGrid = createGrid();

    for (let row = 0; row < rows; row++) {
        for (let col = 0; col < cols; col++) {
            const neighbors = countNeighbors(grid, row, col);
            if (grid[row][col] === 1 && (neighbors < 2 || neighbors > 3)) {
                newGrid[row][col] = 0;
            } else if (grid[row][col] === 0 && neighbors === 3) {
                newGrid[row][col] = 1;
            } else {
                newGrid[row][col] = grid[row][col];
            }
        }
    }

    grid = newGrid;
}

//count neighbors for each cell
function countNeighbors(grid, row, col) {
    const directions = [
        [-1, 0], [1, 0], [0, -1], [0, 1],
        [-1, -1], [-1, 1], [1, -1], [1, 1]
    ];

    return directions.reduce((acc, [x, y]) => {
        const newRow = row + x;
        const newCol = col + y;

        if (newRow >= 0 && newRow < rows && newCol >= 0 && newCol < cols) {
            acc += grid[newRow][newCol];
        }
        return acc;
    }, 0);
}

//save the current canvas state as a PNG file
function saveAsPNG() {
    const buffer = canvas.toBuffer('image/png');
    const filePath = path.join(process.env.HOME, 
        'Desktop', 'deneme', 'desktopBackgroundConway', 'gameBackground', `game_frame_0.png`); //change it according to your PATH
    fs.writeFileSync(filePath, buffer);
    if(currentTime==resetTime){
        currentTime=0;
        grid=createGrid();
    }
    //console.log(currentTime)
   /*  this was an earlier idea before I realiased you can do all this with 1 image
    if(frame==20){
        frame=0;
    }*/
}

function gameLoop() {
    if (!gamePaused) { //will find a way to pause the state in the future. Possible, maybe
        drawGrid();
        updateGrid();
        saveAsPNG();
       // frame++;
       currentTime++; 
    }
}

setInterval(gameLoop, 500);  // adjust the interval in milliseconds
