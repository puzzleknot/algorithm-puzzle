const minNumber = 1;
const maxNumber = 9;
const size = 5;
const questionCount = 15;

let arr;  // the problem array
let ans;
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
    arr = [];
    let dp = []
    for (let i = 0; i < size; i++) {
      arr[i] = [];
      dp[i] = [];
      for (let j = 0; j < size; j++) {
        dp[i][j] = 1000;
        if ((i === 0 && j === 0) || (i === 4 && j === 4)) {
            arr[i][j] = 0;
        } else {
            arr[i][j] = Math.floor(Math.random() * (maxNumber - minNumber)) + minNumber;
            let t = document.getElementById(`t${i}${j}`);
            t.innerText = arr[i][j];
        }
      }
    }

    let sampleSum = `\\( ${arr[0][1]} +  ${arr[0][2]} + ${arr[0][3]} + ${arr[0][4]} + ${arr[1][4]} + ${arr[2][4]} + ${arr[3][4]} = ${arr[0][1] + arr[0][2] + arr[0][3] + arr[0][4] + arr[1][4] + arr[2][4] + arr[3][4]} \\)`;
    $('#sample-sum').text(sampleSum);
    
    MathJax.typeset()

    // // bit全探索
    // ans = 1000;
    // const n = 2 * (size - 1);
    // for (let bit = 0; bit < (1 << n); bit++) {
    //     let dist = 0;
    //     let flag = true;
    //     let nowi = 0;
    //     let nowj = 0;
    //     for (let k = 0; k < n; k++) {
    //       if (bit & (1 << k)) {
    //         nowi++;
    //       } else {
    //         nowj++;
    //       }

    //       if (nowi < size && nowj < size) {
    //         dist += arr[nowi][nowj];
    //       } else {
    //         flag = false
    //         break
    //       }
    //     }

    //     if (flag) {
    //         ans = Math.min(ans, dist);
    //     }
    // }
    // console.log(ans);    // デバッグ用答え出力

    // 動的計画法
    dp[0][0] = 0;
    for (let i=0; i < size; i++) {
        for (let j=0; j < size; j++) {
            if (i + 1 < size) {
                dp[i+1][j] = Math.min(dp[i+1][j], dp[i][j] + arr[i+1][j]);
            }
            if (j + 1 < size) {
                dp[i][j+1] = Math.min(dp[i][j+1], dp[i][j] + arr[i][j+1]);
            }
        }
    }
    // console.log(dp[size - 1][size - 1])    // デバッグ用答え出力

    questionNum = 1;
}

function finishGame(success) {
    if (success) {
        let wa = document.getElementById("WA");
        wa.style.display = "none";
        $('#AC').show();
        $('#message').text('正解です！おめでとうございます！やり直すにはリロードして下さい．');
    } else {
        let ac = document.getElementById("AC");
        ac.style.display = "none";
        $('#WA').show();
        $('#message').text('不正解です！引き続きチャレンジしましょう！やり直すにはリロードして下さい．');
    }
}

function ask() {
    let y = parseInt($('#guess').val());
    let res;

    if (isNaN(y) || y < 1 ) {
        showErrorMessage('1 以上の数字を入力してください');
        return;
    }

    if (ans !== y) {
        res = `\\(d \\neq ${y}\\)`;
    } else {
        res = `\\(d = ${y}\\)`;
    }

    showResponse(res);
    appendHistory(questionNum, y, res);
    questionNum++;
    showRemainingQuestions();

    MathJax.typeset()

    if (res === `\\(d = ${y}\\)`) {
        finishGame(true);
    } else {
        finishGame(false);
    }
    return;
}



$(document).ready(function () {
    startGame();
});
