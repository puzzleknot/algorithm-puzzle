const barLength = 20;
const antsCount = 8;

const canvasWidth = 800;
const canvasHeight = 200;
const barMargin = 50;
const barWidth = 700;
const barHeight = 10;
const barLeft = canvasWidth / 2 - barWidth / 2;

const imgSize = 20;

const FPS = 50;

let canvas, ctx;
let img, imgFlipped;

let position, direction, alive;
let time = 0;

let guess, ans;

// --- functions for displaying info ---

function showResponse(res) {
    $('#error-message').text('');
    $('#response').text(res);
}

function showErrorMessage(msg) {
    $('#response').text('');
    $('#error-message').text(msg);
}

// --- functions for simulation

function draw() {
    ctx.clearRect(0, 0, canvasWidth, canvasHeight);

    // draw the bar
    ctx.beginPath();
    ctx.fillStyle = '#909090';
    ctx.fillRect(canvasWidth / 2 - barWidth / 2, canvasHeight / 2, barWidth, barHeight);

    // draw ants
    for (let i = 0; i < antsCount; i++) {
        if (!alive[i]) continue;
        let x = barLeft + position[i] / barLength * barWidth;

        ctx.beginPath();
        ctx.drawImage((direction[i] === -1 ? img : imgFlipped), x - imgSize / 2, canvasHeight / 2 - imgSize, imgSize, imgSize);

        // draw position
        ctx.beginPath();
        ctx.font = '12px sans-serif'
        ctx.fillStyle = '#101010';
        ctx.textAligh = 'center';
        ctx.fillText(`${position[i].toFixed(1)}`, x - imgSize / 2, canvasHeight / 2 + 20);
    }

    // draw time
    ctx.beginPath();
    ctx.font = '15px sans-serif';
    ctx.fillStyle = '#101010';
    ctx.textAligh = 'center';
    ctx.fillText(`経過時間: ${time.toFixed(2)} 秒`, canvasWidth * 0.7, canvasHeight * 0.2);
}

function simulate() {
    const dt = 1 / FPS;

    time += dt;

    let allDead = true;

    for (let i = 0; i < antsCount; i++) {
        if (!alive[i]) continue;
        position[i] += direction[i] * dt;

        if (position[i] <= 0 || position[i] >= barLength) {
            alive[i] = false;
        }

        allDead = false;
    }

    if (allDead) {
        finishGame();
        return;
    }

    for (let i = 0; i < antsCount - 1; i++) {
        if (position[i] > position[i + 1]) {
            [position[i], position[i + 1]] = [position[i + 1], position[i]];
            [direction[i], direction[i + 1]] = [direction[i + 1], direction[i]];
        }
    }

    draw();

    setTimeout(simulate, 1000 / FPS);
}


// --- functions for game play ---

function shuffle(a) {
    for (let i = a.length - 1; i > 0; i--) {
        let j = Math.floor(Math.random() * (i + 1));
        [a[i], a[j]] = [a[j], a[i]];
    }
    return a;
}

async function startGame() {
    let nums = [];
    for (let i = 1; i < barLength; i++) {
        nums.push(i);
    }
    nums = shuffle(nums);

    position = new Array(antsCount);
    direction = new Array(antsCount);
    alive = new Array(antsCount);
    for (let i = 0; i < antsCount; i++) {
        position[i] = nums[i];
        // direction[i] = Math.floor(Math.random() * 2) * 2 - 1; // -1 or 1
        direction[i] = 2 * (1 - i % 2) - 1;
        alive[i] = true;
    }
    position.sort(function (a, b) { return a - b; });

    ans = 0;
    for (let i = 0; i < antsCount; i++) {
        if (direction[i] === -1) {
            ans = Math.max(ans, position[i]);
        } else {
            ans = Math.max(ans, barLength - position[i]);
        }
    }

    canvas = document.getElementById('canvas');
    canvas.width = canvasWidth;
    canvas.height = canvasHeight;
    ctx = canvas.getContext('2d');

    await new Promise(resolve => {
        img = new Image();
        img.onload = resolve;
        img.src = 'mushi_ari.png';

        imgFlipped = new Image();
        imgFlipped.onload = resolve;
        imgFlipped.src = 'mushi_ari_flipped.png';
    });

    draw();
}

function finishGame() {
    if (guess === ans) {
        $('#AC').show();
        $('#message').text('正解です！おめでとうございます！やり直すにはリロードして下さい．');
    } else {
        $('#WA').show();
        $('#message').text(`不正解です！正解は ${ans} 秒でした．やり直すにはリロードして下さい．`);
    }
}

function ask() {
    guess = parseInt($('#guess').val());

    if (isNaN(guess)) {
        showErrorMessage('数字を入力してください');
        return;
    }

    showResponse('シミュレーションで正解を確認してみましょう');

    simulate();
}



$(document).ready(function () {
    startGame();
});
