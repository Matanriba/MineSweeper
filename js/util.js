'use strict'

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

function renderBoard() {
    var strHTML = '<table><tbody>\n';
    for (var i = 0; i < gBoard.length; i++) {
        strHTML += '\t<tr>\n';
        for (var j = 0; j < gBoard[0].length; j++) {
            var currCell = gBoard[i][j];
            var cellCont = '';
            var ifClickedClass = '';
            if (currCell.isShown) {
                ifClickedClass = ' clicked';
                if (currCell.isMine) cellCont = MINE;
                else if (!currCell.isMine && currCell.minesAroundCount === 0) cellCont = '';
                else if (!currCell.isMine && currCell.minesAroundCount !== 0) cellCont = currCell.minesAroundCount;
            } if (currCell.isMarked) cellCont = MARKED;

            strHTML += `\t\t<td data-cell="${i}-${j}" class="cell${ifClickedClass}" onclick="cellClicked(${i}, ${j})" oncontextmenu="markCell(event,this,${i},${j})">${cellCont}</td>\n`;
        }
        strHTML += '\t</tr>\n';
    }
    strHTML += '</tbody></table>';

    var elContainer = document.querySelector('.board-container');
    elContainer.innerHTML = strHTML;
}

function showCell(pos) {
    var cell = gBoard[pos.i][pos.j];
    if (cell.isShown) return;
    cell.isShown = true;
    gGame.shownCount++;
    var elCell = document.querySelector(`[data-cell="${pos.i}-${pos.j}"]`);
    if (cell.isMine) {
        elCell.classList.add('clicked-mine');
        elCell.innerText = MINE;
    }
    else if (cell.minesAroundCount !== 0) elCell.innerText = cell.minesAroundCount;
    else if (cell.minesAroundCount === 0) elCell.innerText = '';
    elCell.classList.add('clicked');
}


function markCell(event, elCell, cellI, cellJ) {
    event.preventDefault();
    gIsRightMouse = true;
    var cell = gBoard[cellI][cellJ];
    if (!gGame.isOn || cell.isShown) return;
    if (cell.isMarked) {
        gGame.markedCount--;
        elCell.innerText = '';
    } else {
        gGame.markedCount++;
        elCell.innerText = MARKED;
    }
    gIsRightMouse = false;
    cell.isMarked = !cell.isMarked;
}

function getRandomInt(min, max) {
    return Math.floor(Math.random() * (max - min) + min);
}