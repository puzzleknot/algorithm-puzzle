const minNumber = 1;
const maxNumber = 1000;
const questionCount = 10;

let x;  // the hidden number
let questionNum;

// --- functions for displaying info ---

function showRemainingQuestions() {
    $('#remaining-questions').text(questionCount - questionNum + 1);
}

function showResponse(res) {
    $('#response').text(res);
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
    if (x < y) {
        res = '<';
    } else if (x > y) {
        res = '>';
    } else {
        res = 'Correct!';
    }

    showResponse(res);
    appendHistory(questionNum, y, res);

    if (res === 'Correct!') {
        finishGame(true);
        return;
    }

    if (questionNum == questionCount) {
        finishGame(false);
        return;
    }

    questionNum++;
    showRemainingQuestions();
}



$(document).ready(function () {
    startGame();
});
