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
    for (let i = 0; i < 2; i++) {
        $(`#remaining-stones-${i + 1}`).text(heaps[i]);
        $(`#heap-${i + 1}`).empty();
        for (let j = 0; j < heaps[i]; j++) {
            $(`#heap-${i + 1}`).append($(`<input type="checkbox" class="btn-check m-1 large-checkbox" id="btn-check-outlined" name="heap-${i + 1}" autocomplete="off">`));
        }
    }
    $('#error-message').text('');
}

function showErrorMessage(msg) {
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

    let cnt = [0, 0];
    for (let i = 0; i < 2; i++) {
        cnt[i] = $(`input[name="heap-${i + 1}"]:checked`).length;
    }

    if (cnt[0] > 0 && cnt[1] > 0) {
        showErrorMessage('2 つ以上の山から選ぶことはできません');
        return;
    }

    if (cnt[0] == 0 && cnt[1] == 0) {
        showErrorMessage('石を 1 つ以上選択してください');
        return;
    }

    for (let i = 0; i < 2; i++) {
        heaps[i] -= cnt[i];
    }

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
