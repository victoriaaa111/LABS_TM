const canvas = document.getElementById('canvas');
const context = canvas.getContext("2d");
const gridSize = 100;
const cellSize = 5;
canvas.width = gridSize * cellSize;
canvas.height = canvas.width;

let grid = createEmptyGrid();
let running = false;
let animationId = null;
let generationDelay = 250; 
let lastUpdateTime = 0;

function createEmptyGrid() {
    return Array.from({ length: gridSize }, () => Array(gridSize).fill(0));
}

function createRandomGrid() {
    return Array.from({ length: gridSize }, () =>
        Array(gridSize).fill(0).map(() =>
            (Math.random() > 0.5 ? 1 : 0)));
}

function drawGrid() {
    context.clearRect(0, 0, canvas.width, canvas.height);
    for (let i = 0; i < gridSize; i++){
        for (let j = 0; j < gridSize; j++){
            if (grid[i][j]===1) {
                context.fillStyle = '#a80f4f';
                context.fillRect(j * cellSize, i * cellSize, cellSize, cellSize);
            } else {
                context.fillStyle = '#ffedf5';
                context.fillRect(j * cellSize, i * cellSize, cellSize, cellSize);
            }
        }
    }
}

function updateGrid() {
    const newGrid = createEmptyGrid();
    for (let i = 0; i < gridSize; i++){
        for (let j = 0; j < gridSize; j++){
            const neighbors = countNeighbors(i, j);
            if (grid[i][j] === 1 && (neighbors < 2 || neighbors > 3)) {
                newGrid[i][j] = 0; //cell dies, because live cell has fewer than 2 or more than 3 neighbors
            } else if (grid[i][j] === 0 && neighbors === 3) {
                newGrid[i][j] = 1; //cell comes to life if has 3 alive neighbors
            } else {
                newGrid[i][j] = grid[i][j]; //rest remain unchanged
            }

        }
    }
    grid = newGrid;
}

function countNeighbors(y, x) {
    let counter = 0;
    for (let i = -1; i <= 1; i++){
        for (let j = -1; j <= 1; j++){
            if (i === 0 && j === 0) continue; //continue bc it represents the cell we are counting neighbors for
            let neighbory = y + i;
            let neighborx = x + j;
            if (neighbory >= 0 && neighbory < gridSize && neighborx >= 0 && neighborx < gridSize) {
                counter += grid[neighbory][neighborx];
            }
        }
    }
    return counter;
}

function gameLoop(timestamp) {
    const timeElapsed = timestamp - lastUpdateTime;
    if (timeElapsed >= generationDelay) {
        updateGrid();
        drawGrid();
        lastUpdateTime = timestamp; 
    }
    if (running) {
        animationId = requestAnimationFrame(gameLoop);
    }
}

function enableButtons(patternSelected = false) {
    document.getElementById('startButton').disabled = !patternSelected;
    document.getElementById('pauseButton').disabled = !running;
    document.getElementById('breakButton').disabled = !running;
    document.getElementById('randomButton').disabled = running;
    document.getElementById('gliderButton').disabled = running;
    document.getElementById('stillButton').disabled = running;
    document.getElementById('deadButton').disabled = running;
}

document.getElementById('randomButton').addEventListener('click', () => {
    grid = createRandomGrid();
    drawGrid();
    enableButtons(true); //enable start after selecting pattern
});

document.getElementById('deadButton').addEventListener('click', () => {
    grid = createEmptyGrid();
    grid[50][50] = 1;
    grid[51][50] = 1;
    grid[52][50] = 1;
    grid[52][49] = 1;
    grid[51][48] = 1;
    drawGrid();
    enableButtons(true);
});

document.getElementById('stillButton').addEventListener('click', () => {
    grid = createEmptyGrid();
    grid[49][50] = 1;
    grid[50][49] = 1;
    grid[50][51] = 1;
    grid[51][50] = 1;
    drawGrid();
    enableButtons(true);
});

document.getElementById('gliderButton').addEventListener('click', () => {
    grid = createEmptyGrid();
    grid[1][0] = 1;
    grid[2][1] = 1;
    grid[0][2] = 1;
    grid[1][2] = 1;
    grid[2][2] = 1;
    drawGrid();
    enableButtons(true);
});

document.getElementById('startButton').addEventListener('click', (event) => {
    if (!running) {
        running = true;
        gameLoop();
        enableButtons(false);//disable buttons after start
    }
})

document.getElementById('pauseButton').addEventListener('click', () => {
    if (running) {
        running = false;
        cancelAnimationFrame(animationId);
        document.getElementById('pauseButton').innerText = "Continue";
    } else {
        running = true;
        gameLoop();
        document.getElementById('pauseButton').innerText = "Pause";
    }
});


document.getElementById('breakButton').addEventListener('click', () => {
    running = false;
    cancelAnimationFrame(animationId);
    grid = createEmptyGrid();
    drawGrid();
    enableButtons(false); 
});

drawGrid();
enableButtons(false); 

