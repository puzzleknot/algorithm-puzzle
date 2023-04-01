const minNumber = 1;
const maxNumber = 1000;
const questionCount = 15;

let x;  // the hidden number
let questionNum;

// --- functions for displaying info ---

function showRemainingQuestions() {
    $('#remaining-questions').text(Math.max(0, questionCount - questionNum + 1));
}

function showResponse(res) {
    $('#error-message').text('');
    $('#response').text(res);
}

function showErrorMessage(msg) {
    $('#response').text('');
    $('#error-message').text(msg);
}

function appendHistory(num, guess, res) {
    let row = $('<tr>').append($('<td>').text(num))
        .append($('<td>').text(guess))
        .append($('<td>').text(res));
    $('#history').find('tbody').append(row);
}

// --- functions for game play ---

function startGame() {
    x = Math.floor(Math.random() * (maxNumber - minNumber + 1)) + minNumber;
    questionNum = 1;
}

function finishGame(success) {
    if (success) {
        $('#AC').show();
        $('#message').text('正解です！おめでとうございます！やり直すにはリロードして下さい．');
    } else {
        $('#WA').show();
        $('#message').text('規定の質問回数を超えました．やり直すにはリロードして下さい．');
    }
}

function ask() {
    let y = parseInt($('#guess').val());
    let res;

    if (isNaN(y) || y < minNumber || y > maxNumber) {
        showErrorMessage('1 以上 1000 以下の数字を入力してください');
        return;
    }

    if (x < y) {
        res = '\\(x < y\\)';
    } else if (x > y) {
        res = '\\(x > y\\)';
    } else {
        res = '\\(x = y\\)';
    }

    showResponse(res);
    appendHistory(questionNum, y, res);
    questionNum++;
    showRemainingQuestions();

    MathJax.typeset()

    if (questionNum >= questionCount) {
        finishGame(false);
        return;
    }

    if (res === '\\(x = y\\)') {
        finishGame(true);
        return;
    }
}



$(document).ready(function () {
    startGame();
});
