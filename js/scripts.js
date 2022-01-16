let userScore = 0;
let computerScore = 0;
const btnOptions = document.querySelectorAll('.btn-options');
const resetGameButton = document.querySelector('#reset-game');
const user = 'user';
const computer = 'computer';
const maxScore = 5;
const options = [{ name: 'rock', win: 'scissors' },
                { name: 'scissors', win: 'paper' },
                { name: 'paper', win: 'rock' }];

function addButtonListeners() {
    btnOptions.forEach(option => option.addEventListener('click', game));
}

function computerPlay() {
    const index = Math.round(Math.random() * 2);
    return options[index];
}

function userPlay(choice) {
    for (let o of options) {
        if (o.name === choice) {
            return o;
        }
    }
}

function playRound(playerSelection, computerSelection) {
    let result;
    if (playerSelection.win === computerSelection.name) {
        result = user;
        userScore++;
    } else if (playerSelection.name === computerSelection.name) {
        result = '';
    } else {
        result = computer;
        computerScore++;
    }
    return result;
}

function game(event) {
    event.stopPropagation();
    removeButtonListeners();
    let result;
    let roundWinner;
    let gameEnded;
    const key = event.currentTarget.dataset.key;
    const userChoice = userPlay(key);
    const computerChoice = computerPlay();
    changeImageToChoice('rock', 'rock');//Force hands to change to 'rock' before starting the game
    shakeHands();
    roundWinner = playRound(userChoice, computerChoice);
    setTimeout(() => {
        changeImageToChoice(userChoice.name, computerChoice.name);
        if (roundWinner === user) {
            shakeLoserHeart(computer);
            updateHearts(computer);
        } else if (roundWinner === computer) {
            shakeLoserHeart(user);
            updateHearts(user);
        }
    }, 800);
    if (userScore === maxScore || computerScore === maxScore) {
        gameEnded = true;
        if (userScore > computerScore) {
            result = `Congratulations! You won this game ${userScore} to ${computerScore}`;
        } else {
            result = `Maybe next time! You lost this game ${userScore} to ${computerScore}`;
        }
        setTimeout(() => {
            endGame(result);
        }, 2000);
    }
    if (!gameEnded) {
        setTimeout(addButtonListeners, 1500);
    }
}

function removeButtonListeners() {
    btnOptions.forEach(option => option.removeEventListener('click', game));
}

function endGame(result) {
    const endGameDiv = document.querySelector('#end-game-blocker');
    const endGameResult = document.querySelector('#result');
    const endGameImage = document.querySelector('#end-game-image');
    endGameResult.textContent = result;
    if (userScore > computerScore) {
        confetti.start();
        changeEndGameColors('white', 'black');
        endGameImage.src = "assets/black-trophy.png";
        endGameImage.animate([
            { transform: 'translateY(0px)' },
            { transform: 'translateY(20px)' }
        ], {
            duration: 1000,
            iterations: Infinity,
            direction: 'alternate'
        });
    } else {
        endGameImage.src = "assets/troll-despair.png";
        changeEndGameColors('black', 'white');
    }
    endGameDiv.style.visibility = 'visible';
    endGameDiv.style.opacity = '1';
}

function resetGame() {
    const endGameDiv = document.querySelector('#end-game-blocker');
    const endGameImage = document.querySelector('#end-game-image');
    const imageAnimations = endGameImage.getAnimations();
    userScore = 0;
    computerScore = 0;
    resetHearts(user);
    resetHearts(computer);
    addButtonListeners();
    changeImageToChoice('rock', 'rock');//Force hands to change to 'rock' before starting the game
    confetti.stop();
    imageAnimations.forEach(anim => anim.cancel());
    endGameDiv.style.visibility = 'hidden';
    endGameDiv.style.opacity = '0';
}

function resetHearts(target) {
    const heartContainer = document.querySelector(`#${target}-heart-container`);
    const images = [document.createElement('img'),
        document.createElement('img'),
        document.createElement('img'),
        document.createElement('img'),
        document.createElement('img')];
    heartContainer.replaceChildren();
    images.forEach(image => {
        image.src = `assets/${target}-heart.svg`;
        image.alt = `Lifes remaining`;
        heartContainer.appendChild(image);
    });
}

function updateHearts(target) {
    const heartContainer = document.querySelector(`#${target}-heart-container`);
    heartContainer.removeChild(heartContainer.lastChild);
}

function changeEndGameColors(container, text) {
    const endGameMenu = document.querySelector('#end-game-menu');
    const endGameResult = document.querySelector('#result');
    const endGameButton = document.querySelector('#reset-game');
    endGameMenu.style.background = container;
    endGameResult.style.color = text;
    endGameButton.style.background = text;
    endGameButton.style.color = container;
}

function changeImageToChoice(userChoice, computerChoice) {
    const newUserChoice = document.querySelector('#user-hand');
    const newComputerChoice = document.querySelector('#computer-hand');
    newUserChoice.src = `assets/${userChoice}-user.png`;
    newComputerChoice.src = `assets/${computerChoice}-computer.png`;
}

function shakeHands() {
    const hands = document.querySelectorAll('.hands');
    hands.forEach(hand => {
        hand.animate([
            { transform: 'translateY(0px)' },
            { transform: 'translateY(20px)' }
          ], {
            duration: 200,
            iterations: 5,
            fill: 'both',
            direction: 'alternate'
        });
    });
}

function shakeLoserHeart(loser) {
    const loserDiv = document.querySelector(`#${loser}-heart-container`);
    loserDiv.animate([
        { transform: 'translate(1px, 1px) rotate(0deg)' },
        { transform: 'translate(-1px, -2px) rotate(-1deg)' },
        { transform: 'translate(-3px, 0px) rotate(1deg)' },
        { transform: 'translate(3px, 2px) rotate(0deg)' },
        { transform: 'translate(1px, -1px) rotate(1deg)' },
        { transform: 'translate(-1px, 2px) rotate(-1deg)' },
        { transform: 'translate(-3px, 1px) rotate(0deg)' },
        { transform: 'translate(3px, 1px) rotate(-1deg)' },
        { transform: 'translate(-1px, -1px) rotate(1deg)' },
        { transform: 'translate(1px, 2px) rotate(0deg)' },
        { transform: 'translate(1px, -2px) rotate(-1deg)'}
    ], {
        duration: 500,
    });
}

resetGameButton.addEventListener('click', resetGame);
addButtonListeners();
resetHearts(user);
resetHearts(computer);

