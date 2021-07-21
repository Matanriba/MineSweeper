'use strict'
const MINE = '🚨';
const MARKED = '🚩'

var gGame = {
    isOn: false,
    shownCount: 0,
    markedCount: 0,
    secsPassed: 0
}
var gBoard;

var gLevel = {
    size: 4,
    mines: 2
}

function init() {
    var gBoard = createBoard();
    setMines(gBoard);
    // console.log(gBoard);
    renderBoard(gBoard, '.board-container');

}

function cellClicked(elCell, i, j) {
    console.log(elCell)
    if (elCell.innerText !== MINE) {
        elCell.classList.add('clicked');
        gGame.shownCount++;
        console.log(gGame.shownCount)
        expandShown(gBoard, i, j);
    }
    checkGameOver();
}

function expandShown(elCell, posI, posJ) {
    for (var i = posI - 1; i <= posI + 1; i++) {
        if (i < 0 || i > gLevel.size - 1) continue;
        for (var j = posJ - 1; j <= posJ + 1; j++) {
            if (j < 0 || j > gLevel.size - 1) continue;
            if (i === posI && j === posJ) continue;
            elCell.classList.add('clicked');

            // if (!board[i][j].isMine) {
            //     console.log(i, j)
            // }
        }
    }
}

function renderCell(posI, posJ, value) {
    var cellSelector = '.' + getClassName(posI, posJ)
    var elCell = document.querySelector(cellSelector);
    elCell.innerHTML = value;
}

function getClassName(posI, posJ) {
    var cellClass = 'cell-' + posI + '-' + posJ;
    return cellClass;
}

function setMines(board) {
    // Create MANUAL mines!!
    board[1][1].isMine = true;
    board[2][3].isMine = true;

    for (var i = 0; i < board.length; i++) {
        for (var j = 0; j < board.length; j++) {
            setMinesNegsCount(board, i, j);
        }
    }
}

function setMinesNegsCount(board, rowIdx, colIdx) {
    var counter = 0;
    for (var i = rowIdx - 1; i <= rowIdx + 1; i++) {
        if (i < 0 || i > board.length - 1) continue
        for (var j = colIdx - 1; j <= colIdx + 1; j++) {
            if (j < 0 || j > board[0].length - 1) continue
            if (i === rowIdx && j === colIdx) continue
            var cell = board[i][j];
            if (cell.isMine) counter++;
        }
    }
    // if (counter === 0) board[rowIdx][colIdx].minesAroundCount = 0;
    board[rowIdx][colIdx].minesAroundCount = counter;
}

function createBoard() {
    var board = [];
    for (var i = 0; i < gLevel.size; i++) {
        board[i] = [];
        for (var j = 0; j < gLevel.size; j++) {
            var cell = {
                minesAroundCount: null,
                isShown: false,
                isMine: false,
                isMarked: false,
                location: { i: i, j: j }
            }
            board[i][j] = cell;
        }
    }
    return board;
}

function renderBoard(board, selector) {
    var strHTML = `<table border="0"><tbody>\n`
    for (var i = 0; i < board.length; i++) {
        strHTML += `\t<tr>\n`;
        for (var j = 0; j < board.length; j++) {
            var cell = board[i][j];
            var className = `cell cell-${i}-${j}`;
            strHTML += `\t<td onclick="cellClicked(this, ${i}, ${j})" class="${className}"><span>${renderCell(cell)}</span></td>\n`;
        }
        strHTML += `\t</tr>\n`;
    }
    strHTML += `</tbody></table>`;
    var elContainer = document.querySelector(selector);
    elContainer.innerHTML = strHTML;
    // console.log(strHTML)
}


function renderCell(cell) {
    return (cell.isMine) ? MINE : cell.minesAroundCount;
}

function handleMouse(event) {
    var mouseClick = event.which;
    switch (mouseClick) {
        case '1':

    }
}

function checkGameOver() {
    // TODO: Game ends when all mines are marked, and all the other cells are shown

}