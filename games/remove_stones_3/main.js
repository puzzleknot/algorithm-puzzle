const minStones = 5;
const maxStones = 10;
const heapCount = 3;

let heaps = new Array(heapCount);
let turn = 0;  // 0: player, 1: computer
let questionNum = 1;

// --- functions for displaying info ---

function getTurn(turn) {
    return turn == 0 ? 'あなた' : 'コンピュータ';
}

function showTurnAndHeaps() {
    $('#turn').text(getTurn(turn));
    for (let i = 0; i < heapCount; i++) {
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
        let xor = 0;
        for (let i = 0; i < heapCount; i++) {
            heaps[i] = Math.floor(Math.random() * (maxStones - minStones + 1) + minStones);
            xor ^= heaps[i];
        }
        if (xor !== 0) break;
    }
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

    let cnt = new Array(heapCount);
    let cntHeap = 0;
    for (let i = 0; i < heapCount; i++) {
        cnt[i] = $(`input[name="heap-${i + 1}"]:checked`).length;
        if (cnt[i] > 0) {
            cntHeap++;
        }
    }

    if (cntHeap > 1) {
        showErrorMessage('2 つ以上の山から選ぶことはできません');
        return;
    }
    if (cntHeap === 0) {
        showErrorMessage('石を 1 つ以上選択してください');
        return;
    }

    let remainingStones = 0;
    for (let i = 0; i < heapCount; i++) {
        heaps[i] -= cnt[i];
        remainingStones += heaps[i];
    }

    appendHistory(questionNum, turn, heaps);

    if (remainingStones === 0) {
        finishGame(true);
        return;
    }

    finishMove();

    setTimeout(computerPlay, 1000);
}

function computerPlay() {
    let heap, stone;

    let xor = 0;
    let remainingHeaps = [];
    for (let i = 0; i < heapCount; i++) {
        xor ^= heaps[i];
        if (heaps[i] > 0) {
            remainingHeaps.push(i);
        }
    }

    if (xor === 0) {
        heap = remainingHeaps[Math.floor(Math.random() * remainingHeaps.length)];
        stone = Math.floor(Math.random() * heaps[heap] + 1);
    } else {
        for (let i = 0; i < heapCount; i++) {
            if ((xor ^ heaps[i]) < heaps[i]) {
                heap = i;
                stone = heaps[i] - (xor ^ heaps[i]);
                break;
            }
        }
    }

    heaps[heap] -= stone;

    appendHistory(questionNum, turn, heaps);

    let remainingStones = 0;
    for (let i = 0; i < heapCount; i++) {
        remainingStones += heaps[i];
    }

    if (remainingStones === 0) {
        finishGame(false);
        return;
    }

    finishMove();
}



$(document).ready(function () {
    startGame();
});
