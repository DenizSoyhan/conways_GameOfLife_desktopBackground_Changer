const { createCanvas } = require('canvas');
const fs = require('fs');
const path = require('path');

const smth = 15;  // You can modify this to control the cell size
const cellSize = smth; // Cell size should match the smth value

function getRandomIntInRange(min, max) {
return Math.floor(Math.random() * (max - min + 1)) + min;
}
var allThePallets=[
    ['rgb(17, 17, 17)' , 'rgb(122, 28, 172)'] ,     //0-blackPurple main
    ['rgb(0, 0, 0)', 'rgb(235, 211, 248)'],         //1 blackWhite
    ['rgb(18, 48, 174)', 'rgb(255, 247, 247)'],     //2 blueWhite
    ['rgb(59, 48, 48)', 'rgb(102, 67, 67)'],        //3 diarrhea
    ['rgb(102, 67, 67)' , 'rgb(59, 48, 48)'],       //4 reverse diarrhea
    ['rgb(0,0,0)' , 'rgb(175, 30, 0)']              //5 blackRed
]



//var decidedColor=getRandomIntInRange(0,allThePallets.length-1); //UNCOMMENT TO ACTIVATE RANDOMIZE 
var decidedColor=0;                                              // COMMENT OUT THIS LINE AFTER ACTIVATING RANDOMIZER

var deadColor = allThePallets[decidedColor][0]; 
var aliveColor = allThePallets[decidedColor][1]; 



const screenWidth = 1920; 
const screenHeight = 1080; 

const width = Math.floor(screenWidth / cellSize) * cellSize; // this was an attempt to make every value 
const height = Math.floor(screenHeight / cellSize) * cellSize; // for cell size to work with screen size

const canvas = createCanvas(width, height);
const ctx = canvas.getContext('2d');

// rows and columns based on adjusted canvas size
const rows = Math.floor(height / cellSize);
const cols = Math.floor(width / cellSize);

let grid = createGrid();


let resetTime=2000;  //after hundreds of iterations game might become stale so this value creates a brand new canvas
let currentTime=0;  //with 500 milliseconds intervals every 50 seconds a new grid is created newCycle=resetTime*intervalTime


// Create a grid with random alive (1) and dead (0) cells
function createGrid() {
    const aliveProbability = 0.4; // Adjust the probability of alive cells (0.3 = 30% alive)
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

// Function to update the grid based on the Game of Life rules
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

// Function to count neighbors for each cell
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

// Save the current canvas state as a PNG file
function saveAsPNG() {
    const buffer = canvas.toBuffer('image/png');
    const filePath = path.join(process.env.HOME, 
        'Desktop', 'background' , `game_frame_0.png`); //YOUR BACKGROUND PATH
    fs.writeFileSync(filePath, buffer);
    if(currentTime==resetTime){
        currentTime=0;
        grid=createGrid();
    }

}

// Main game loop
function gameLoop() {
    
        drawGrid();
        updateGrid();
        saveAsPNG();
       currentTime++;
    
}

// Set interval to update and save PNGs
setInterval(gameLoop, 500);  // Adjust the interval (1000ms = 1 second)
