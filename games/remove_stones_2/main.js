const minStones = 5;
const maxStones = 10;

let heaps = [];
let turn;  // 0: player, 1: computer
let questionNum = 1;

// --- functions for displaying info ---

function getTurn(turn) {
    return turn == 0 ? 'あなた' : 'コンピュータ';
}

function showTurnAndHeaps() {
    $('#turn').text(getTurn(turn));
    $('#remaining-stones-1').text('o '.repeat(heaps[0]));
    $('#remaining-stones-2').text('o '.repeat(heaps[1]));
    $('#error-message').text('');
}

function showErrorMessage(msg) {
    $('#response').text('');
    $('#error-message').text(msg);
}

function appendHistory(num, turn, heaps) {
    let row = $('<tr>').append($('<td>').text(num))
        .append($('<td>').text(getTurn(turn)))
        .append($('<td>').text(heaps));
    $('#history').find('tbody').append(row);
}

// --- functions for game play ---

function startGame() {
    while (true) {
        let a = Math.floor(Math.random() * (maxStones - minStones + 1) + minStones);
        let b = Math.floor(Math.random() * (maxStones - minStones + 1) + minStones);
        if (a == b) continue;
        heaps = [a, b];
        break;
    }
    turn = 0;
    showTurnAndHeaps();
}

function finishGame(success) {
    showTurnAndHeaps();
    if (success) {
        $('#AC').show();
        $('#message').text('あなたの勝ちです！おめでとうございます！やり直すにはリロードして下さい．');
    } else {
        $('#WA').show();
        $('#message').text('あなたの負けです．やり直すにはリロードして下さい．');
    }
}

function finishMove() {
    questionNum++;
    turn ^= 1;
    showTurnAndHeaps();
}

function ask() {
    if (turn == 1) {
        return;
    }

    let heap = parseInt($('#heap option:selected').val()) - 1;

    if (isNaN(heap)) {
        showErrorMessage('山を選択してください');
        return;
    }
    if (heaps[heap] == 0) {
        showErrorMessage('石が1つ以上残っている山を選択してください');
        return;
    }

    let stone = parseInt($('#stones').val());

    console.log(stone);

    if (isNaN(stone) || stone < 1 || stone > heaps[heap]) {
        showErrorMessage(`1 以上 ${heaps[heap]} 以下の数字を入力してください`);
        return;
    }

    heaps[heap] -= stone;

    appendHistory(questionNum, turn, heaps);

    if (heaps[0] + heaps[1] == 0) {
        finishGame(true);
        return;
    }

    finishMove();

    setTimeout(computerPlay, 1000);
}

function computerPlay() {
    let heap, stone;

    if (heaps[0] == heaps[1]) {
        heap = Math.random() >= 0.5 ? 1 : 0;
        stone = Math.floor(Math.random() * heaps[heap] + 1);
    } else if (heaps[0] > heaps[1]) {
        heap = 0;
        stone = heaps[0] - heaps[1];
    } else {
        heap = 1;
        stone = heaps[1] - heaps[0];
    }

    heaps[heap] -= stone;

    appendHistory(questionNum, turn, heaps);

    if (heaps[0] + heaps[1] == 0) {
        finishGame(false);
        return;
    }

    finishMove();
}



$(document).ready(function () {
    startGame();
});
