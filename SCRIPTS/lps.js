// Play game and display results
function playGame(playerChoice) {
    const choices = ["lapis", "papyrus", "scalpellus"];
    const computerChoice = choices[Math.floor(Math.random() * choices.length)];
    let resultMessage = "";

    console.log("Player choice:", playerChoice);
    console.log("Computer choice:", computerChoice);

    document.getElementById(
        "anubisChoiceMessage"
    ).innerText = `Anubis has chosen ${computerChoice}`;

    const choiceImageMap = {
        lapis: "../ASSETS/IMAGES/lapis.png",
        papyrus: "../ASSETS/IMAGES/papyrus.png",
        scalpellus: "../ASSETS/IMAGES/scalpellus.png",
    };

    document.getElementById(
        "anubisChoiceImage"
    ).innerHTML = `<img src="${choiceImageMap[computerChoice]}" alt="${computerChoice}" class="computer-choice-image">`;

    if (playerChoice === computerChoice) {
        resultMessage = "It's a tie!";
    } else if (
        (playerChoice === "lapis" && computerChoice === "scalpellus") ||
        (playerChoice === "papyrus" && computerChoice === "lapis") ||
        (playerChoice === "scalpellus" && computerChoice === "papyrus")
    ) {
        resultMessage = "You win!";
    } else {
        resultMessage = "Anubis wins!";
    }

    const outcomeImageMap = {
        "You win!": "../ASSETS/IMAGES/AnubisAngry.png",
        "It's a tie!": "../ASSETS/IMAGES/AnubisSad.png",
        "Anubis wins!": "../ASSETS/IMAGES/AnubisHappy.png",
    };

    document.getElementById("result").innerText = resultMessage;
    document.getElementById(
        "outcomeImage"
    ).innerHTML = `<img src="${outcomeImageMap[resultMessage]}" alt="Outcome Image" class="anubis-outcome-image">`;
    document.getElementById("outcomeText").innerText = resultMessage.includes(
        "win"
    )
        ? "Anubis ANGRY!!"
        : resultMessage.includes("tie")
        ? "Anubis sad."
        : "Anubis HAPPY!!";
}

["lapis", "papyrus", "scalpellus"].forEach((choice) => {
    document
        .getElementById(choice)
        .addEventListener("click", () => playGame(choice));
});
