const N = 8;

let selected;
let answer; // the hidden array
let submission;
let questionNum;

function syncSelected(num) {
    const idx1 = parseInt($("#element1").val()[1]);
    const idx2 = parseInt($("#element2").val()[1]);
    for (let i=1; i<=2; i++) {
        for (let j=1; j<=8; j++) {
            document.getElementById("op" + i + j).disabled = false;
        }
    }
    document.getElementById("op" + 2 + idx1).disabled = true;
    document.getElementById("op" + 1 + idx2).disabled = true;

    if (!selected || selected.includes(num)) {
        return;
    } else {
        let diselected = selected[0]
        let diselectedItem = document.getElementById("li" + (diselected));
        if (diselectedItem.classList.contains("active")) {
            diselectedItem.classList.remove("active");
        }

        selected = [selected[1], num];
        for (idx of selected) {
            let selectedItem = document.getElementById("li" + (idx));
            if (!selectedItem.classList.contains("active")) {
                selectedItem.classList.add("active");
            }
        }

        if (idx1 === diselected) {
            if (idx2 === selected[0]) {
                $("#element1").val("x" + selected[1]);
            } else if (idx2 === selected[1]) {
                $("#element1").val("x" + selected[0]);
            }
        } else if (idx2 === diselected) {
            if (idx1 === selected[0]) {
                $("#element2").val("x" + selected[1]);
            } else if (idx1 === selected[1]) {
                $("#element2").val("x" + selected[0]);
            }
        }
        return;
    }
}

$(function () {
    $("#sortable").sortable();
    $("#sortable li").on('click', '', function () {
        syncSelected(parseInt($(this).text()[1]))
    });
});

// --- functions for displaying info ---

function showRemainingQuestions() {
    $("#questions-count").text(questionNum);
}

function showResponse(res) {
    $("#response").text(res);
}

function appendHistory(num, res) {
    let row = $("<tr>").append($("<td>").text(num+1)).append($("<td>").text(res));
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

    selected = [1, 2];
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
