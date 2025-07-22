// --- Overlay, Difficulty, Pause, Victory, Home, Back, and High Score Logic ---
const overlay = document.getElementById('overlay');
const screens = Array.from(document.querySelectorAll('.screen'));
let currentScreen = 0;
let selectedDifficulty = "medium";
let aiSpeed = 7, aiReact = 0.25;
let playing = false, matchOver = false, paused = false;

const pauseBtn = document.getElementById('pause-btn');
const resetBtnHud = document.getElementById('reset-btn-hud');
const resumeBtn = document.getElementById('resume-btn');
const resetBtnPause = document.getElementById('reset-btn');
const restartBtn = document.getElementById('restart-btn');

// Navigation
const homeBtns = document.querySelectorAll('.home-btn');
const backBtns = document.querySelectorAll('.back-btn');
const nextBtns = document.querySelectorAll('.next-btn');
const startGameBtn = document.querySelector('.start-game-btn');
const startBtn = document.getElementById('start-btn');

// High Score
const highScoreMain = document.getElementById('high-score-main');
const highScoreVictory = document.getElementById('high-score-victory');
let highScore = parseInt(localStorage.getItem('warrior_pong_highscore')) || 0;

function setHighScore(score) {
    if (score > highScore) {
        highScore = score;
        localStorage.setItem('warrior_pong_highscore', highScore);
    }
    if (highScoreMain) highScoreMain.textContent = highScore;
    if (highScoreVictory) highScoreVictory.textContent = highScore;
}
setHighScore(highScore);

// Overlay screen logic
function showScreenById(id) {
    screens.forEach(scr => scr.style.display = 'none');
    let s = document.getElementById(id);
    if (s) s.style.display = 'block';
}

function showScreen(idx) {
    screens.forEach((scr, i) => scr.style.display = (i === idx ? 'block' : 'none'));
}
function showVictory() {
    overlay.style.display = 'flex';
    screens.forEach(scr => scr.style.display = 'none');
    document.getElementById('victory-screen').style.display = 'block';
    setHighScore(playerScore);
    matchOver = true;
    playing = false;
}
function hideOverlay() {
    overlay.style.display = 'none';
    screens.forEach(scr => scr.style.display = 'none');
}
function showPause() {
    overlay.style.display = 'flex';
    screens.forEach(scr => scr.style.display = 'none');
    document.getElementById('pause-screen').style.display = 'block';
    paused = true;
    playing = false;
}
function hidePause() {
    overlay.style.display = 'none';
    screens.forEach(scr => scr.style.display = 'none');
    paused = false;
    if (!matchOver) playing = true;
}
function gotoHome() {
    overlay.style.display = 'flex';
    showScreenById('home-screen');
    playing = false;
    paused = false;
    matchOver = false;
    setHighScore(playerScore);
}
function nextScreen() {
    // Determine flow based on currentScreen index or id
    if (currentScreen === 0) {
        showScreenById('home-screen');
        currentScreen = -1;
    } else if (currentScreen === -1) {
        showScreenById('screen1');
        currentScreen = 1;
    } else if (currentScreen === 1) {
        showScreenById('screen2');
        currentScreen = 2;
    } else if (currentScreen === 2) {
        showScreenById('screen3');
        currentScreen = 3;
    }
}

// Navigation events
homeBtns.forEach(btn => btn.onclick = gotoHome);
backBtns.forEach(btn => {
    btn.onclick = function() {
        // Go to previous tutorial or difficulty/home as appropriate
        if (currentScreen === 1) {
            showScreenById('home-screen');
            currentScreen = -1;
        } else if (currentScreen === 2) {
            showScreenById('screen1');
            currentScreen = 1;
        } else if (currentScreen === 3) {
            showScreenById('screen2');
            currentScreen = 2;
        }
    };
});
nextBtns.forEach(btn => {
    btn.onclick = function() {
        nextScreen();
    };
});
if (startGameBtn) startGameBtn.onclick = startMatch;
if (startBtn) startBtn.onclick = function() {
    showScreenById('difficulty-screen');
    currentScreen = 0;
};
function startMatch() {
    overlay.style.display = 'none';
    screens.forEach(scr => scr.style.display = 'none');
    resetGame();
    playing = true;
}

// Difficulty selection
document.querySelectorAll('.diff-btn').forEach(btn => {
    btn.onclick = function() {
        selectedDifficulty = btn.dataset.diff;
        if(selectedDifficulty === "easy") {
            aiSpeed = 4.5; aiReact = 0.5;
        } else if(selectedDifficulty === "medium") {
            aiSpeed = 7; aiReact = 0.25;
        } else if(selectedDifficulty === "hard") {
            aiSpeed = 10; aiReact = 0.10;
        }
        showScreenById('screen1');
        currentScreen = 1;
    };
});
restartBtn.onclick = startMatch;
resetBtnPause.onclick = resetGame;
resetBtnHud.onclick = resetGame;
resumeBtn.onclick = () => hidePause();
pauseBtn.onclick = () => { if (!paused && !matchOver && overlay.style.display === "none") showPause(); };

function resetGame() {
    playerScore = 0;
    aiScore = 0;
    matchOver = false;
    paused = false;
    resetBall();
    setHighScore(playerScore);
    overlay.style.display = 'none';
    screens.forEach(scr => scr.style.display = 'none');
    playing = true;
}

// Keyboard controls
window.addEventListener('keydown', function(e) {
    if ((overlay.style.display !== "none" && e.code === "Space") ||
        (overlay.style.display !== "none" && e.key === " ")) {
        if (currentScreen >= 0 && currentScreen <= 3) nextScreen();
    }
    if (e.key.toLowerCase() === 'p' && !matchOver && overlay.style.display === "none") {
        if (!paused) showPause();
        else hidePause();
    }
    if (e.key.toLowerCase() === 'r' && !matchOver && overlay.style.display === "none") {
        resetGame();
    }
});

// --- Warrior Pong Game Logic ---
const canvas = document.getElementById('pong');
const ctx = canvas.getContext('2d');
const scoreAnimate = document.getElementById('score-animate');

const paddleWidth = 28, paddleHeight = 144;
const ballRadius = 19;
const canvasWidth = canvas.width, canvasHeight = canvas.height;

// State
let playerY = (canvasHeight - paddleHeight) / 2;
let aiY = (canvasHeight - paddleHeight) / 2;
let ballX = canvasWidth / 2, ballY = canvasHeight / 2;
let ballSpeedX = 9 * (Math.random() > 0.5 ? 1 : -1);
let ballSpeedY = 6 * (Math.random() * 2 - 1);
let ballTrail = [];
let ballSpeedMult = 1.0;
let playerScore = 0, aiScore = 0;
let playerColor = "#ffb700", aiColor = "#e84118";
let playerFlash = 0, aiFlash = 0;
let impossibleAI = false;

// Slash/spark effect
let slashes = [];
function spawnSlash(x, y, side) {
    for(let i=0; i<10; i++) {
        slashes.push({
            x, y,
            vx: (side === "left" ? 2 + Math.random()*7 : -2-Math.random()*7) + (Math.random()-0.5)*1.8,
            vy: (Math.random()-0.5)*8,
            alpha: 1.0,
            color: side === "left" ? "#ffb700" : "#e84118",
            size: 22+Math.random()*9
        });
    }
}
function drawSlashes() {
    for (let s of slashes) {
        ctx.save();
        ctx.globalAlpha = s.alpha * 0.85;
        ctx.strokeStyle = s.color;
        ctx.lineWidth = 3.6 + Math.random()*2.4;
        ctx.shadowColor = s.color;
        ctx.shadowBlur = 16 + Math.random()*10;
        ctx.beginPath();
        ctx.moveTo(s.x, s.y);
        ctx.lineTo(s.x + s.vx*2.3, s.y + s.vy*2.3);
        ctx.stroke();
        ctx.restore();
        s.x += s.vx;
        s.y += s.vy;
        s.alpha *= 0.83;
    }
    slashes = slashes.filter(s => s.alpha > 0.05);
}

// Energy ball trail
function pushTrail() {
    ballTrail.push({x: ballX, y: ballY, r: ballRadius, alpha: 1.0});
    if (ballTrail.length > 16) ballTrail.shift();
}
function drawTrail() {
    for (let i = 0; i < ballTrail.length; i++) {
        const t = ballTrail[i];
        ctx.save();
        ctx.globalAlpha = t.alpha * 0.23;
        ctx.shadowBlur = 30;
        ctx.shadowColor = "#fff";
        ctx.beginPath();
        ctx.arc(t.x, t.y, t.r + 3, 0, Math.PI * 2);
        ctx.fillStyle = "#ffb700";
        ctx.fill();
        ctx.restore();
        t.alpha *= 0.77;
    }
}

// Bold paddle (English)
function drawPaddle(x, y, color, flash, label) {
    ctx.save();
    ctx.shadowColor = color;
    ctx.shadowBlur = 45 + flash * 60;
    ctx.fillStyle = color;
    ctx.fillRect(x, y, paddleWidth, paddleHeight);
    ctx.restore();

    // "Strength" / "Warrior"
    ctx.save();
    ctx.font = "38px 'Goldman', 'Bebas Neue', Arial, sans-serif";
    ctx.textAlign = "center";
    ctx.textBaseline = "middle";
    ctx.globalAlpha = 0.8 + 0.18 * Math.sin(Date.now()/210);
    ctx.fillStyle = "#191720";
    ctx.fillText(label, x + paddleWidth/2, y + paddleHeight/2 + 2);
    ctx.restore();
}

// Warrior ball
function drawBall(x, y, r) {
    ctx.save();
    ctx.shadowColor = "#fff";
    ctx.shadowBlur = 44;
    ctx.beginPath();
    ctx.arc(x, y, r, 0, Math.PI * 2);
    ctx.fillStyle = "#ffb700";
    ctx.fill();
    ctx.restore();

    // Energy core
    ctx.save();
    ctx.globalAlpha = 0.65;
    ctx.shadowColor = "#fff";
    ctx.shadowBlur = 12;
    ctx.beginPath();
    ctx.arc(x, y, r*0.5, 0, Math.PI * 2);
    ctx.fillStyle = "#fff";
    ctx.fill();
    ctx.restore();
}

// Draw net
function drawNet() {
    for (let i = 0; i < canvasHeight; i += 44) {
        ctx.save();
        ctx.shadowColor = "#fff";
        ctx.shadowBlur = 12;
        ctx.fillStyle = "#ffb700";
        ctx.fillRect(canvasWidth/2 - 2, i + 7, 4, 28);
        ctx.restore();
    }
}

// Draw score
function drawScore() {
    ctx.save();
    ctx.font = "66px 'Goldman', 'Bebas Neue', Arial, sans-serif";
    ctx.textAlign = "center";
    ctx.shadowBlur = 22;
    ctx.shadowColor = "#ffb700";
    ctx.fillStyle = "#ffb700";
    ctx.fillText(playerScore, canvasWidth/2 - 134, 78);
    ctx.shadowColor = "#e84118";
    ctx.fillStyle = "#e84118";
    ctx.fillText(aiScore, canvasWidth/2 + 134, 78);
    ctx.restore();
}

// Animate score
function animateScore(who) {
    scoreAnimate.textContent = who === "player" ? "Strength +1" : "Warrior +1";
    scoreAnimate.style.color = who === "player" ? "#ffb700" : "#e84118";
    scoreAnimate.style.textShadow = who === "player"
        ? "0 0 36px #ffb700, 0 0 120px #fff"
        : "0 0 36px #e84118, 0 0 120px #fff";
    scoreAnimate.style.opacity = 1;
    scoreAnimate.style.transform = "translateX(-50%) scale(1.3)";
    setTimeout(() => {
        scoreAnimate.style.opacity = 0;
        scoreAnimate.style.transform = "translateX(-50%) scale(0.8)";
    }, 850);
}

// Reset ball
function resetBall(who = null) {
    ballX = canvasWidth / 2;
    ballY = canvasHeight / 2;
    ballSpeedX = (9 + Math.random()*2.5) * (Math.random() > 0.5 ? 1 : -1);
    ballSpeedY = 6 * (Math.random() * 2 - 1);
    ballSpeedMult = 1.0;
    ballTrail = [];
    if (who) animateScore(who);
}

// Mouse control (mouse anywhere on window, paddle "sticks" to nearest edge)
window.addEventListener('mousemove', function(event) {
    if(!playing || matchOver || paused) return;
    let rect = canvas.getBoundingClientRect();
    let mouseY = event.clientY - rect.top;
    // If mouse is above canvas
    if (event.clientY < rect.top) playerY = 0;
    // If mouse is below canvas
    else if (event.clientY > rect.bottom) playerY = canvasHeight - paddleHeight;
    // If mouse is inside canvas
    else playerY = mouseY - paddleHeight / 2;

    // Clamp range
    if (playerY < 0) playerY = 0;
    if (playerY > canvasHeight - paddleHeight) playerY = canvasHeight - paddleHeight;
});

// Impossible AI toggle: press "I"
window.addEventListener('keydown', function(e) {
    if (e.key.toLowerCase() === 'i' && overlay.style.display === "none" && !paused) {
        impossibleAI = !impossibleAI;
        aiColor = impossibleAI ? "#fff" : "#e84118";
    }
});

// Ball-Paddle collision
function checkPaddle(x, y, py) {
    return y > py && y < py + paddleHeight && Math.abs(x - (py === playerY ? paddleWidth : canvasWidth - paddleWidth)) < ballRadius + paddleWidth;
}

// Game loop
function gameLoop() {
    if(!playing || matchOver || paused) {
        requestAnimationFrame(gameLoop);
        return;
    }
    // Move ball
    ballX += ballSpeedX * ballSpeedMult;
    ballY += ballSpeedY * ballSpeedMult;
    pushTrail();

    // Wall bounce
    if (ballY - ballRadius < 0 || ballY + ballRadius > canvasHeight) {
        ballSpeedY = -ballSpeedY;
        ballY = Math.max(ballRadius, Math.min(canvasHeight - ballRadius, ballY));
        spawnSlash(ballX, ballY < canvasHeight/2 ? 26 : canvasHeight-26, "center");
    }

    // Player collision
    if (ballX - ballRadius < paddleWidth + 2) {
        if (checkPaddle(ballX - ballRadius, ballY, playerY)) {
            let hitPos = (ballY - (playerY + paddleHeight/2)) / (paddleHeight/2);
            ballSpeedY = hitPos * 10 + (Math.random()-0.5)*2;
            ballSpeedX = Math.abs(ballSpeedX) + 0.4 + Math.random()*0.7;
            ballSpeedX *= 1.1;
            ballSpeedMult *= 1.07;
            playerFlash = 1.0;
            spawnSlash(paddleWidth+ballRadius+3, ballY, "left");
        } else if (ballX < 0) {
            aiScore++;
            resetBall("Warrior");
        }
    }

    // AI collision
    if (ballX + ballRadius > canvasWidth - paddleWidth - 2) {
        if (checkPaddle(ballX + ballRadius, ballY, aiY)) {
            let hitPos = (ballY - (aiY + paddleHeight/2)) / (paddleHeight/2);
            ballSpeedY = hitPos * 10 + (Math.random()-0.5)*2;
            ballSpeedX = -Math.abs(ballSpeedX) - 0.4 - Math.random()*0.7;
            ballSpeedX *= 1.1;
            ballSpeedMult *= 1.07;
            aiFlash = 1.0;
            spawnSlash(canvasWidth-paddleWidth-ballRadius-3, ballY, "right");
        } else if (ballX > canvasWidth) {
            playerScore++;
            setHighScore(playerScore);
            resetBall("player");
        }
    }

    // AI Movement (difficulty)
    let aiTarget = ballY - paddleHeight/2;
    let aiFollowSpeed = impossibleAI ? 14 : aiSpeed;
    if (impossibleAI) {
        aiY = aiTarget;
    } else {
        if (Math.abs(aiY - aiTarget) > aiFollowSpeed) {
            aiY += (aiY < aiTarget ? aiFollowSpeed : -aiFollowSpeed) * (1 - aiReact);
        }
    }
    aiY = Math.max(0, Math.min(canvasHeight - paddleHeight, aiY));

    // Decay paddle flash
    if (playerFlash > 0) playerFlash *= 0.85;
    if (aiFlash > 0) aiFlash *= 0.85;

    // Draw
    ctx.clearRect(0, 0, canvasWidth, canvasHeight);
    drawNet();
    drawTrail();
    drawSlashes();
    drawPaddle(0, playerY, playerColor, playerFlash, "Strength");
    drawPaddle(canvasWidth - paddleWidth, aiY, aiColor, aiFlash, "Warrior");
    drawBall(ballX, ballY, ballRadius);
    drawScore();

    // Impossible AI label
    if (impossibleAI) {
        ctx.save();
        ctx.font = "25px 'Goldman', 'Bebas Neue', Arial, sans-serif";
        ctx.fillStyle = "#fff";
        ctx.textAlign = "center";
        ctx.globalAlpha = 0.89 + 0.11*Math.sin(Date.now()/200);
        ctx.fillText("LEGEND MODE", canvasWidth/2, canvasHeight-25);
        ctx.restore();
    }

    // WIN CONDITION
    if (playerScore >= 50) {
        setHighScore(playerScore);
        showVictory();
    }

    requestAnimationFrame(gameLoop);
}

// Start
gameLoop();