document.addEventListener("DOMContentLoaded", function () {
    document.getElementById("easyBtn").addEventListener("click", function () {
        startGame("easy");
    });
    document.getElementById("normalBtn").addEventListener("click", function () {
        startGame("normal");
    });
    document.getElementById("hardBtn").addEventListener("click", function () {
        startGame("hard");
    });
});

const gameContainer = document.getElementById("game");
let maxGuesses;
let guessesMade = 0;
let cardElements = [];
let flippedCards = [];
let canFlip = true;
let guess;
let guessesLeft;

function startGame(difficulty) {
    // Set max guesses based on difficulty
    switch (difficulty) {
        case "easy":
            maxGuesses = 36;
            break;
        case "normal":
            maxGuesses = 27;
            break;
        case "hard":
            maxGuesses = 18;
            break;
        default:
            maxGuesses = 27; // Default to normal if something goes wrong
    }

    setupGame();

    guessesMade = 0;
    guessesLeft = maxGuesses; // Initialize guessesLeft based on difficulty
    document.getElementById("guessCounter").style.display = "block"; // Show guess counter
    updateGuessCounter(); // Update guess counter display
}

function setupGame() {
    // Reset game state
    gameContainer.innerHTML = "";
    cardElements = [];
    flippedCards = [];
    canFlip = true;
    guessesMade = 0;

    // 18 cards with pairs from 'A' to 'I'
    const cards = [
        "A",
        "A",
        "B",
        "B",
        "C",
        "C",
        "D",
        "D",
        "E",
        "E",
        "F",
        "F",
        "G",
        "G",
        "H",
        "H",
        "I",
        "I",
    ];

    // Shuffle and create card elements
    cards.sort(() => Math.random() - 0.5);
    cards.forEach((card) => {
        let div = document.createElement("div");
        div.classList.add("card", "hidden"); // Initially hidden
        div.setAttribute("data-card-value", card.toLowerCase());
        div.addEventListener("click", flipCard);
        gameContainer.appendChild(div);
        cardElements.push(div);
    });

    // Hide the difficulty selection and show the game container
    document.getElementById("difficulty").style.display = "none";
    document.getElementById("game").style.display = "flex";
    document.getElementById("guessCounter").style.display = "block"; // Show guess counter
    updateGuessCounter(); // Update guess counter display
}

function flipCard() {
    if (!canFlip || this.classList.contains("flipped")) return;
    this.classList.remove("hidden");
    this.classList.add("flipped"); // Mark card as flipped

    flippedCards.push(this);
    if (flippedCards.length === 2) {
        canFlip = false;
        setTimeout(checkMatch, 1000);
    }
}

function checkMatch() {
    // Determine if the flipped cards match
    const isMatch =
        flippedCards[0].getAttribute("data-card-value") ===
        flippedCards[1].getAttribute("data-card-value");

    if (isMatch) {
        // Cards match, so remove the event listener to prevent re-flipping
        flippedCards.forEach((card) =>
            card.removeEventListener("click", flipCard)
        );

        // Check for a win after every match
        if (cardElements.every((card) => card.classList.contains("flipped"))) {
            // If all cards are flipped, the player wins
            displayWinMessage();
            return; // Exit early as the game is won
        }
    } else {
        // Cards don't match, so hide them again
        flippedCards.forEach((card) => {
            card.classList.add("hidden");
            card.classList.remove("flipped");
        });
    }

    // Regardless of match, prepare for the next turn
    canFlip = true;
    flippedCards = [];

    // Adjust guesses left and update the counter
    guessesLeft--;
    updateGuessCounter();

    // Check if the game is lost due to running out of guesses
    if (guessesLeft <= 0) {
        // Only show the loss message if the game hasn't been won yet
        displayLossMessage();
    }
}

function updateGuessCounter() {
    document.getElementById("guessesLeft").textContent = guessesLeft;
}

function resetGame() {
    // Clear the game message area, potentially hiding or resetting its content
    document.getElementById("gameMessage").textContent = "";

    // Hide the game board and guess counter since we're going back to the initial state
    document.getElementById("game").style.display = "none";
    document.getElementById("guessCounter").style.display = "none";

    // Optionally, if you're allowing immediate difficulty selection for a new game,
    // Ensure the difficulty selection is visible again.
    document.getElementById("difficulty").style.display = "block";

    // Reset game state variables
    guessesMade = 0;
    guessesLeft = maxGuesses; // Consider if you want to keep the last difficulty setting or not
    canFlip = true;

    // Clear any existing cards from the game container to prepare for a new game setup
    gameContainer.innerHTML = "";

    // Since we're resetting, clear these arrays for a fresh start
    cardElements = [];
    flippedCards = [];
}

function displayLossMessage() {
    const gameMessage = document.getElementById("gameMessage");
    gameMessage.innerHTML =
        "You've lost! Try again. <button id='playAgainBtn'>Play Again</button>";

    // Attach the event listener directly to the new button
    document
        .getElementById("playAgainBtn")
        .addEventListener("click", function () {
            resetGame();
            // Optionally, automatically start a new game at the same difficulty.
            // startGame(currentDifficulty); // currentDifficulty would need to be tracked.
        });
}

function checkWin() {
    // Check if all cards are flipped
    const allMatched = cardElements.every((card) =>
        card.classList.contains("flipped")
    );
    if (allMatched) {
        displayWinMessage();
    }
}
function displayWinMessage() {
    const gameMessage = document.getElementById("gameMessage");
    gameMessage.innerHTML =
        "You Win! Congratulations! <button id='playAgainBtn'>Play Again</button>";

    document
        .getElementById("playAgainBtn")
        .addEventListener("click", function () {
            resetGame();
            // Optionally, you can call startGame with the last difficulty chosen
            // startGame(currentDifficulty); // Ensure currentDifficulty is tracked if you take this route
        });
}
