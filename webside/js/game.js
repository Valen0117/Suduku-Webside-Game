let board = Array(9).fill().map(() => Array(9).fill(0));
let solution = Array(9).fill().map(() => Array(9).fill(0));
let timer;
let seconds = 0;
let selectedCell = null;
let initialBoard = Array(9).fill().map(() => Array(9).fill(0));

let bgMusic = document.getElementById('bgMusic');
let musicIcon = document.getElementById('musicIcon');
let isMusicPlaying = false;

function toggleMusic() {
    if (isMusicPlaying) {
        bgMusic.pause();
        musicIcon.className = 'fas fa-music';
    } else {
        bgMusic.play();
        musicIcon.className = 'fas fa-pause';
    }
    isMusicPlaying = !isMusicPlaying;
}

function updateTimer() {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    document.getElementById('timer').textContent = 
        `${minutes.toString().padStart(2, '0')}:${remainingSeconds.toString().padStart(2, '0')}`;
    seconds++;
}

function startTimer() {
    clearInterval(timer);
    seconds = 0;
    timer = setInterval(updateTimer, 1000);
}

function selectNumber(num) {
    if (selectedCell) {
        const [row, col] = selectedCell;
        if (initialBoard[row][col] === 0) {
            board[row][col] = num;
            createBoard();
            highlightCell(row, col);
        }
    }
}

function clearCell() {
    if (selectedCell) {
        const [row, col] = selectedCell;
        if (initialBoard[row][col] === 0) {
            board[row][col] = 0;
            createBoard();
            highlightCell(row, col);
        }
    }
}

function highlightCell(row, col) {
    const cells = document.querySelectorAll('.sudoku-cell');
    cells.forEach(cell => cell.classList.remove('selected'));
    
    const cell = document.querySelector(`[data-row="${row}"][data-col="${col}"]`);
    if (cell) {
        cell.classList.add('selected');
    }
}

function createBoard() {
    const sudokuBoard = document.getElementById('sudokuBoard');
    sudokuBoard.innerHTML = '';
    
    for (let i = 0; i < 9; i++) {
        const row = document.createElement('div');
        row.className = 'sudoku-row';
        
        for (let j = 0; j < 9; j++) {
            const cell = document.createElement('div');
            cell.className = 'sudoku-cell';
            cell.dataset.row = i;
            cell.dataset.col = j;
            
            if (board[i][j] !== 0) {
                cell.textContent = board[i][j];
            }
            
            if (initialBoard[i][j] !== 0) {
                cell.classList.add('fixed');
            }
            
            cell.addEventListener('click', function() {
                if (initialBoard[i][j] === 0) {
                    selectedCell = [i, j];
                    highlightCell(i, j);
                }
            });
            
            row.appendChild(cell);
        }
        sudokuBoard.appendChild(row);
    }
}

function generateSudoku(difficulty) {
    let newBoard = Array(9).fill().map(() => Array(9).fill(0));
    solveSudoku(newBoard);
    
    solution = JSON.parse(JSON.stringify(newBoard));
    
    let cellsToRemove;
    switch(difficulty) {
        case 'easy': cellsToRemove = 40; break;
        case 'medium': cellsToRemove = 50; break;
        case 'hard': cellsToRemove = 60; break;
        default: cellsToRemove = 40;
    }
    
    while (cellsToRemove > 0) {
        let row = Math.floor(Math.random() * 9);
        let col = Math.floor(Math.random() * 9);
        if (newBoard[row][col] !== 0) {
            newBoard[row][col] = 0;
            cellsToRemove--;
        }
    }
    
    initialBoard = JSON.parse(JSON.stringify(newBoard));
    return newBoard;
}

function isValid(board, row, col, num) {
    for (let x = 0; x < 9; x++) {
        if (board[row][x] === num) return false;
    }
    
    for (let x = 0; x < 9; x++) {
        if (board[x][col] === num) return false;
    }
    
    let startRow = row - row % 3;
    let startCol = col - col % 3;
    for (let i = 0; i < 3; i++) {
        for (let j = 0; j < 3; j++) {
            if (board[i + startRow][j + startCol] === num) return false;
        }
    }
    
    return true;
}

function solveSudoku(board) {
    for (let row = 0; row < 9; row++) {
        for (let col = 0; col < 9; col++) {
            if (board[row][col] === 0) {
                for (let num = 1; num <= 9; num++) {
                    if (isValid(board, row, col, num)) {
                        board[row][col] = num;
                        if (solveSudoku(board)) return true;
                        board[row][col] = 0;
                    }
                }
                return false;
            }
        }
    }
    return true;
}

function startNewGame() {
    const difficulty = document.getElementById('difficultySelect').value;
    board = generateSudoku(difficulty);
    selectedCell = null;
    createBoard();
    startTimer();
    
    if (!isMusicPlaying) {
        bgMusic.play().catch(error => {
            console.log("Auto-play was prevented");
        });
        musicIcon.className = 'fas fa-pause';
        isMusicPlaying = true;
    }
}

function checkSolution() {
    let isComplete = true;
    let isCorrect = true;
    
    for (let i = 0; i < 9; i++) {
        for (let j = 0; j < 9; j++) {
            if (board[i][j] === 0) {
                isComplete = false;
            } else if (board[i][j] !== solution[i][j]) {
                isCorrect = false;
            }
        }
    }
    
    if (!isComplete) {
        alert('请填完所有空格！');
    } else if (!isCorrect) {
        alert('答案有误，请继续尝试！');
    } else {
        clearInterval(timer);
        alert('恭喜你，答案正确！');
    }
}

// 初始化游戏
startNewGame(); 