document.addEventListener('DOMContentLoaded', () => {
    const clickButton = document.getElementById('click-button');
    const startButton = document.getElementById('start-button');
    const timeLeftSpan = document.getElementById('time-left');
    const scoreSpan = document.getElementById('score');
    
    let timeLeft = 60;
    let score = 0;
    let gameInterval;
    
    startButton.addEventListener('click', startGame);
    clickButton.addEventListener('click', incrementScore);
    
    function startGame() {
        timeLeft = 60;
        score = 0;
        timeLeftSpan.textContent = timeLeft;
        scoreSpan.textContent = score;
        clickButton.style.display = 'inline-block';
        startButton.disabled = true;
        
        gameInterval = setInterval(() => {
            timeLeft--;
            timeLeftSpan.textContent = timeLeft;
            
            if (timeLeft === 0) {
                clearInterval(gameInterval);
                endGame();
            }
        }, 1000);
    }
    
    function incrementScore() {
        score++;
        scoreSpan.textContent = score;
    }
    
    function endGame() {
        clickButton.style.display = 'none';
        startButton.disabled = false;
        alert(`Timed Out! Your score is ${score}`);
    }
});