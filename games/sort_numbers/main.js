const N = 8;

let answer; // the hidden array
let submission;
let questionNum;

$(function () {
    $("#sortable").sortable();
});

// --- functions for displaying info ---

function showRemainingQuestions() {
    $("#remaining-questions").text(questionNum);
}

function showResponse(res) {
    $("#response").text(res);
}

function appendHistory(num, res) {
    let row = $("<tr>").append($("<td>").text(num)).append($("<td>").text(res));
    $("#history").find("tbody").append(row);
}

// --- functions for game play ---

const shuffleArray = (array) => {
    const cloneArray = [...array];

    const result = cloneArray.reduce((_, cur, idx) => {
        let rand = Math.floor(Math.random() * (idx + 1));
        cloneArray[idx] = cloneArray[rand];
        cloneArray[rand] = cur;
        return cloneArray;
    });

    return result;
};

function startGame() {
    answer = [];
    for (let i = 0; i < N; i++) {
        answer.push("x" + (i + 1));
    }
    answer = shuffleArray(answer);
    questionNum = 0;
}

function finishGame() {
    let wa = document.getElementById("WA");
    wa.style.display = "none";
    $("#AC").show();
    $("#message").text(
        "正解です！おめでとうございます！やり直すにはリロードして下さい．"
    );
}

function continueGame() {
    let ac = document.getElementById("AC");
    ac.style.display = "none";
    $("#WA").show();
    $("#message").text(
        "不正解です！引き続きチャレンジしましょう！やり直すにはリロードして下さい．"
    );
}

function ask() {
    const ele1 = $("#element1").val();
    const ele2 = $("#element2").val();

    const idx1 = answer.indexOf(ele1);
    const idx2 = answer.indexOf(ele2);

    let res;
    if (idx1 < idx2) {
        res = "<";
    } else if (idx1 > idx2) {
        res = ">";
    } else {
        res = "=";
    }

    const expression = ele1 + " " + res + " " + ele2;
    showResponse(expression);
    appendHistory(questionNum, expression);

    questionNum++;
    showRemainingQuestions();
}

function submit() {
    submission = [];
    $("ul#sortable li").each(function () {
        submission.push($(this).text());
    });

    if (submission.toString() === answer.toString()) {
        finishGame();
        return;
    } else {
        continueGame();
    }
}

$(document).ready(function () {
    startGame();
});