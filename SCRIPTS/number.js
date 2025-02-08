// Variables
let randomNumber = Math.floor(Math.random() * 100) + 1; 
let guesses = document.querySelector('.guesses');
let lastResult = document.querySelector('.lastResult');
let lowOrHi = document.querySelector('.lowOrHi');
let guessSubmit = document.querySelector('.guessSubmit');
let guess = document.querySelector('.guess');
let guessCount = 1;
let resetButton;


// Functions
function checkGuess() {
    let userGuess = Number(guess.value);
    if(isNaN(userGuess) || userGuess === 0) {
        lastResult.textContent = "Please enter a valid number greater than 0.";
        lastResult.style.backgroundColor = 'red';
        guess.value = ''; // Clear the input field
        guess.focus(); // Bring focus back to the input field
        return; // Exit the function early
    }
    if(guessCount === 1) {
        guesses.textContent = 'Previous Guesses: ';
    }
    guesses.textContent += userGuess + ", ";
    if(userGuess === randomNumber) {
        lastResult.textContent = 'You Won! Congrats';
        lastResult.style.backgroundColor = 'green';
        lowOrHi.textContent = " ";
        setGameOver();
    } else if(guessCount === 10) {
        lastResult.textContent = '!!! Game Over !!!';
        setGameOver();
    } else {
        lastResult.textContent = 'Wrong! Try Again!';
        lastResult.style.backgroundColor = 'red';
        if(userGuess < randomNumber) {
            lowOrHi.textContent = 'Too low!';
        } else if(userGuess > randomNumber) {
            lowOrHi.textContent = 'Too high!';
        }
    }
    guessCount ++ 
    guess.value = "";
    guess.focus();
}

guessSubmit.addEventListener('click', checkGuess)

function resetGame() {
    guessCount = 1;
    let inputs = document.querySelectorAll('.inputs p');
    for(let i = 0; i < inputs.length; i++) {
        inputs[i].textContent = '';
    }
    resetButton.parentNode.removeChild(resetButton);
    guess.disabled = false;
    guessSubmit.disabled = false;
    //guesses.value = '';
    guesses.setAttribute('value', '');
    lastResult.style.backgroundColor = 'white';
    let guessHistory = document.querySelector('.results');
    guessHistory.innerHTML = '';
    randomNumber = Math.floor(Math.random() * 100) + 1;
    guess.focus();
}
function setGameOver() {
    guess.disabled = true;
    guessSubmit.disabled = true;
    resetButton = document.createElement('button');
    resetButton.textContent = "Play Again";
    resetButton.classList.add('play-again-btn');
    // let resetButtonDiv = document.getElementById('.resetButtonDiv');
    document.body.append(resetButton);
    // resetButton.appendChild(resetButton);
    
    resetButton.addEventListener('click', reload);
}
function reload() {
    location.reload()
}