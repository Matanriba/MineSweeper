// Global vars - init
var gGame = {};
var gLevel = { size: 4, mines: 2 };
var gLives = 1;
var gBoard;
var gMinesAdded;
var gSmiley = document.querySelector('.smiley')
var gTimerInterval;
var gCurrDifficulty = 1;
var gSafeClicks;


// Global vars - main
const MINE = '🚨';
const MARKED = '🚩';
const WIN = '😎';
const LOSE = '💀';
const NORMAL = '😀';
var gIsRightMouse = false;

// Init functions

function init() {
    clearInterval(gTimerInterval);
    document.querySelector('.timer span').innerText = 0;
    document.querySelector('.lives span').innerText = gCurrDifficulty;
    gSafeClicks = 3;
    document.querySelector('.safe-btn span').innerText = gSafeClicks;
    gLives = gCurrDifficulty;
    gGame.hasStarted = false;
    gGame.isOn = true;
    gGame.shownCount = 0;
    gGame.markedCount = 0;
    gGame.secsPassed = 1;
    gMinesAdded = 0;
    gSmiley.innerText = NORMAL;
    gBoard = createBoard(gLevel.size);
    renderBoard(gBoard, '.board-container');
}

function createBoard(size) {
    var board = [];
    for (var i = 0; i < size; i++) {
        var row = [];
        for (var j = 0; j < size; j++) {
            row.push(createCell());
        }
        board.push(row);
    }
    return board;
}

function createCell() {
    var cell = {
        minesAroundCount: 0,
        isShown: false,
        isMine: false,
        isMarked: false
    };
    return cell;
}
function setGameStart(pos) {
    gGame.hasStarted = true;
    // TODO: start timer
    gTimerInterval = setInterval(function () {
        var timer = document.querySelector('.timer span');
        timer.innerText = gGame.secsPassed;
        gGame.secsPassed++;
    }, 1000);
    while (gMinesAdded < gLevel.mines) {
        setMines(pos);
    }
    setMinesNegsCount();
}

function setMines(pos) {
    var randomI = getRandomInt(0, gLevel.size);
    var randomJ = getRandomInt(0, gLevel.size);
    var currCell = gBoard[randomI][randomJ];
    if ((randomI === pos.i && randomJ === pos.j) || currCell.isMine) return;
    if (gLevel.size > 4) {
        // In order for user to first click empty spot
        if ((randomI >= pos.i - 1 && randomI <= pos.i + 1) && (randomJ >= pos.j - 1 && randomJ <= pos.j + 1)) return;
    }
    currCell.isMine = true;
    gMinesAdded++;
}

function setMinesNegsCount() {
    for (var i = 0; i < gLevel.size; i++) {
        for (var j = 0; j < gLevel.size; j++) {
            var cell = gBoard[i][j];
            cell.minesAroundCount = getMinesNegsCount({ i, j });
        }
    }
}

function getMinesNegsCount(pos) {
    var counter = 0;
    for (var i = pos.i - 1; i <= pos.i + 1; i++) {
        if (i < 0 || i >= gLevel.size) continue;
        for (var j = pos.j - 1; j <= pos.j + 1; j++) {
            if (j < 0 || j >= gLevel.size) continue;
            if (i === pos.i && j === pos.j) continue;
            if (gBoard[i][j].isMine) counter++;
        }
    }
    return counter;
}

function setLevel(level) {
    if (level === 1) {
        gLevel.size = 4;
        gLevel.mines = 2;
        gCurrDifficulty = 1;
        gLives = 1;
    } else if (level === 2) {
        gLevel.size = 8;
        gLevel.mines = 12;
        gCurrDifficulty = 3;
        gLives = 3;
    } else {
        gLevel.size = 12;
        gLevel.mines = 30;
        gCurrDifficulty = 3;
        gLives = 3;
    }

    init();
}

// main functions

function cellClicked(cellI, cellJ) {
    if (!gGame.isOn) return;
    var currCell = gBoard[cellI][cellJ];
    var currPos = { i: cellI, j: cellJ };
    if (!gGame.hasStarted) setGameStart(currPos);
    else if (currCell.isMarked) return;
    else if (currCell.isShown && currCell.minesAroundCount && gIsRightMouse) {
        expandShown(currPos);
        gIsRightMouse = false;
        return;
    }
    if (currCell.isMine) {
        showCell(currPos);
        gLives--;
        document.querySelector('.lives span').innerText = gLives;
        if (gLives === 0) {
            gameIsOver('Lose');
            return;
        }
    } else if (!currCell.minesAroundCount) {
        expandShown(currPos);
    } else showCell(currPos);
    checkIfGameOver();
}



function expandShown(pos) {
    showCell(pos);

    for (var i = pos.i - 1; i <= pos.i + 1; i++) {
        if (i < 0 || i >= gLevel.size) continue;
        for (var j = pos.j - 1; j <= pos.j + 1; j++) {
            if (j < 0 || j >= gLevel.size) continue;
            if (i === pos.i && j === pos.j) continue;
            var currCell = gBoard[i][j];
            if (currCell.isShown || currCell.isMarked) continue;
            var currPos = { i, j };
            if (currCell.isMine) gameIsOver('Lose');
            else if (currCell.minesAroundCount !== 0) showCell(currPos);
            else expandShown(currPos);
        }
    }
}

// game-over functions

function checkIfGameOver() {
    if (gGame.shownCount === gLevel.size ** 2 - gLevel.mines) {
        if (gGame.markedCount < gLevel.mines) {
            gameIsOver('Win');
        } else if (gGame.markedCount === gLevel.mines) gameIsOver('Win');
    }
}

function gameIsOver(str) {
    gGame.isOn = false;

    // stop timer
    if (str === 'Lose') {

        showAllMines();
    } else if (str === 'Win') {
        gSmiley.innerText = WIN;
        flagAllUnmarked();
    }
}

function showAllMines() {
    clearInterval(gTimerInterval);
    for (var i = 0; i < gLevel.size; i++) {
        for (var j = 0; j < gLevel.size; j++) {
            var currCell = gBoard[i][j];
            if (currCell.isMine && !currCell.isMarked) currCell.isShown = true;
        }
    }
    gSmiley.innerText = LOSE;
    renderBoard();
}

function flagAllUnmarked() {
    clearInterval(gTimerInterval);
    for (var i = 0; i < gLevel.size; i++) {
        for (var j = 0; j < gLevel.size; j++) {
            var currCell = gBoard[i][j];
            if (currCell.isMine && !currCell.isMarked) {
                currCell.isShown = true;
                // currCell.isMarked = true;
            }
        }
    }
    gSmiley.innerText = WIN;
    renderBoard();
}

function findEmptyCellPos() {
    var emptyPoss = [];
    for (var i = 0; i < gLevel.size; i++) {
        for (var j = 0; j < gLevel.size; j++) {
            currCell = gBoard[i][j];
            if (!currCell.isMine && !currCell.isShown && !currCell.isMarked) {
                emptyPoss.push({ i, j });
            }
        }
    }
    return emptyPoss[getRandomInt(0, emptyPoss.length)];
}

function safeClick() {
    if (gSafeClicks > 0) {
        var currSafeCellPos = findEmptyCellPos();
        var currSafeElCell = document.querySelector(`[data-cell="${currSafeCellPos.i}-${currSafeCellPos.j}"]`);
        currSafeElCell.classList.add('safe-click');
        setTimeout(function () { currSafeElCell.classList.remove('safe-click') }, 1000);
        gSafeClicks--;
        document.querySelector('.safe-btn span').innerText = gSafeClicks;
    }
}