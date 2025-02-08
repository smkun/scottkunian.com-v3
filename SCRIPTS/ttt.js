// Listen for the DOM to be fully loaded and parsed
document.addEventListener("DOMContentLoaded", () => {
    // Select all elements with the class "cell"
    const cells = document.querySelectorAll(".cell");
    // Get the restart button by its ID
    const restartButton = document.getElementById("restartButton");
    // Get the game message display element by its ID
    const gameMessage = document.getElementById("gameMessage");
    // Select all player mode buttons
    const playerModeButtons = document.querySelectorAll(".player-mode");
    // Get the mode indicator element
    const modeIndicator = document.querySelector(".mode-indicator");
    // Get the background music element by its ID
    const bgMusic = document.getElementById("bgMusic");
    // Set the initial game mode to human
    let gameMode = "human";
    // Set the initial turn to Coconut's
    let coconutTurn = true;

    // Define all possible winning combinations
    const WINNING_COMBINATIONS = [
        [0, 1, 2],
        [3, 4, 5],
        [6, 7, 8],
        [0, 3, 6],
        [1, 4, 7],
        [2, 5, 8],
        [0, 4, 8],
        [2, 4, 6],
    ];

    // Set the volume of the background music
    bgMusic.volume = 0.2;

    // Function to play music on first user interaction
    function playMusic() {
        if (bgMusic.paused) {
            bgMusic
                .play()
                .catch((e) => console.error("Error playing music:", e));
            // Remove the event listener after playing music to avoid repeated triggers
            document.removeEventListener("click", playMusic);
        }
    }
    // Add event listener to play music on any click event
    document.addEventListener("click", playMusic);

    // Function to start or restart the game
    function startGame() {
        // Iterate over each cell to reset the game state
        cells.forEach((cell) => {
            cell.classList.remove("coconut", "starfish"); // Remove marks from previous game
            cell.removeEventListener("click", handleClick); // Remove existing event listeners to prevent duplicates
            cell.addEventListener("click", handleClick, { once: true }); // Add a new click event listener to each cell
        });
        gameMessage.textContent = ""; // Clear any previous game messages
        coconutTurn = true; // Reset the turn to Coconut's
        updateModeIndicator(); // Update the mode indicator based on the current game mode
    }

    // Function to handle cell clicks
    function handleClick(e) {
        const cell = e.target;
        const currentClass = coconutTurn ? "coconut" : "starfish"; // Determine whose turn it is
        placeMark(cell, currentClass); // Mark the cell

        if (checkWin(currentClass)) {
            // ✅ Check for win BEFORE swapping turns
            endGame(false, currentClass); // Pass the current player to endGame
        } else if (isDraw()) {
            endGame(true);
        } else {
            swapTurns();
            if (gameMode === "computer" && !coconutTurn) {
                setTimeout(makeComputerMove, 500);
            }
        }
    }

    // Function to end the game
    function endGame(draw, winner = null) {
        if (draw) {
            gameMessage.textContent = "Draw! 🤝";
        } else {
            gameMessage.textContent = `${
                winner === "coconut" ? "Coconut 🥥" : "Starfish ⭐"
            } Wins! 🎉`;
        }
        setTimeout(startGame, 3000);
    }

    // Function to check if the current player has won
    function checkWin(currentClass) {
        return WINNING_COMBINATIONS.some((combination) =>
            combination.every((index) =>
                cells[index].classList.contains(currentClass)
            )
        );
    }

    // Function to check for a draw
    function isDraw() {
        return [...cells].every(
            (cell) =>
                cell.classList.contains("coconut") ||
                cell.classList.contains("starfish")
        );
    }

    // Function to mark a cell
    function placeMark(cell, currentClass) {
        cell.classList.add(currentClass);
    }

    // Function to swap turns
    function swapTurns() {
        coconutTurn = !coconutTurn;
    }

    // Function to check if the current player has won
    function checkWin(currentClass) {
        return WINNING_COMBINATIONS.some((combination) =>
            combination.every((index) =>
                cells[index].classList.contains(currentClass)
            )
        );
    }

    // Computer's strategy to make its move
    function makeComputerMove() {
        // Attempt to win the game or block the opponent's win
        if (!tryToWin() && !blockOpponent() && !takeCenter() && !takeCorner()) {
            makeRandomMove(); // Make a random move if no strategic move is possible
        }

        let win = checkWin("starfish");
        let draw = isDraw();
        if (win) {
            endGame(false);
            return;
        } else if (draw) {
            endGame(true);
            return;
        }
        swapTurns(); // Swap turns after the computer's move
    }

    // Strategy functions for the computer's moves
    function tryToWin() {
        return tryMove("starfish");
    }

    function blockOpponent() {
        return tryMove("coconut");
    }

    // Function to attempt a strategic move
    function tryMove(playerClass) {
        for (let [a, b, c] of WINNING_COMBINATIONS) {
            // Check for a winning move or a move to block the opponent
            if (
                cells[a].classList.contains(playerClass) &&
                cells[b].classList.contains(playerClass) &&
                !cells[c].classList.contains("coconut") &&
                !cells[c].classList.contains("starfish")
            ) {
                cells[c].classList.add("starfish");
                return true;
            }
            // Repeated checks for all combinations
            if (
                cells[a].classList.contains(playerClass) &&
                !cells[b].classList.contains("coconut") &&
                !cells[b].classList.contains("starfish") &&
                cells[c].classList.contains(playerClass)
            ) {
                cells[b].classList.add("starfish");
                return true;
            }
            if (
                !cells[a].classList.contains("coconut") &&
                !cells[a].classList.contains("starfish") &&
                cells[b].classList.contains(playerClass) &&
                cells[c].classList.contains(playerClass)
            ) {
                cells[a].classList.add("starfish");
                return true;
            }
        }
        return false;
    }

    // Strategies for taking the center and corners
    function takeCenter() {
        if (
            !cells[4].classList.contains("coconut") &&
            !cells[4].classList.contains("starfish")
        ) {
            cells[4].classList.add("starfish");
            return true;
        }
        return false;
    }

    function takeCorner() {
        const corners = [0, 2, 6, 8];
        for (let index of corners) {
            if (
                !cells[index].classList.contains("coconut") &&
                !cells[index].classList.contains("starfish")
            ) {
                cells[index].classList.add("starfish");
                return true;
            }
        }
        return false;
    }

    // Function to make a random move
    function makeRandomMove() {
        const emptyCells = Array.from(cells).filter(
            (cell) =>
                !cell.classList.contains("coconut") &&
                !cell.classList.contains("starfish")
        );
        if (emptyCells.length > 0) {
            const randomCell =
                emptyCells[Math.floor(Math.random() * emptyCells.length)];
            randomCell.classList.add("starfish");
            return true;
        }
        return false;
    }

    // Event listener for player mode buttons to change the game mode
    playerModeButtons.forEach((button) => {
        button.addEventListener("click", (e) => {
            gameMode = e.target.getAttribute("data-mode"); // Change the game mode based on button click
            if (gameMode === "computer") {
                document.addEventListener("click", playMusic, { once: true }); // Play music when mode is changed to computer
            }
            startGame(); // Start a new game whenever the mode is changed
        });
    });

    // Function to update the mode indicator based on the current game mode
    function updateModeIndicator() {
        modeIndicator.textContent = `Current Mode: ${
            gameMode === "human" ? "kanaka vs kanaka" : "kanaka vs Pele"
        }`;
    }

    // Event listener to restart the game
    restartButton.addEventListener("click", startGame);

    // Event listener for the mute button to toggle game music
    document
        .getElementById("muteButton")
        .addEventListener("click", function () {
            bgMusic.muted = !bgMusic.muted; // Toggle the muted state of the background music
            this.textContent = bgMusic.muted ? "Unmute" : "Mute"; // Update button text based on muted state
        });

    // Call startGame to initialize the game
    startGame();
});
