// Useful functions to use

function copyMat(mat) {
    var newMat = [];
    for (var i = 0; i < mat.length; i++) {
        newMat[i] = [];
        for (var j = 0; j < mat[0].length; j++) {
            newMat[i][j] = mat[i][j];
        }
    }
    return newMat;
}


function getRandomColor() {
    var letters = '0123456789ABCDEF';
    var color = '#';
    for (var i = 0; i < 6; i++) {
        color += letters[Math.floor(Math.random() * 16)];
    }
    return color;
}

function createNums(length) {
    var nums = [];
    for (var i = 1; i <= length; i++) {
        nums.push(i);
    }
    return nums;
}

function drawNum() {
    var idx = getRandomInt(0, gNums.length)
    var num = gNums[idx]
    gNums.splice(idx, 1)
    return num
}

function getRandomInt(min, max) {
    return Math.floor(Math.random() * (max - min)) + min;
}


function sumPrimaryDiagonal(mat) {
    var sum = 0;
    for (var d = 0; d < mat.length; d++) {
        sum += mat[d][d];
    }
    return sum;
}

function sumSecondaryDiagonal(mat) {
    var sum = 0;
    for (var d = 0; d < mat.length; d++) {
        sum += mat[d][mat.length - 1 - d];
    }
    return sum;
}

function sumRow(mat , rowIdx) {
    var sum = 0;
    for (var i = 0; i < mat.length; i++) {
        sum += mat[rowIdx][i];
    }
    return sum;
}

function sumCol(mat, colIdx) {
    var sum = 0;
    for (var i = 0; i < mat.length; i++) {
        sum += mat[i][colIdx];
    }
    return sum;
}



function countNeighbors(mat, rowIdx, colIdx) {
    var counter = 0;
    for (var i = rowIdx - 1; i <= rowIdx + 1; i++) {
        if (i < 0 || i > mat.length - 1) continue
        for (var j = colIdx - 1; j <= colIdx + 1; j++) {
            if (j < 0 || j > mat[0].length - 1) continue
            if (i === rowIdx && j === colIdx) continue
            // console.log('hi')
            var cell = mat[i][j];
            if (cell === gSymbol) counter++
        }
    }
    return counter
}


function renderCell(location, value) {
	var cellSelector = '.' + getClassName(location) // .cell-i-j
	var elCell = document.querySelector(cellSelector);
	elCell.innerHTML = value;
}