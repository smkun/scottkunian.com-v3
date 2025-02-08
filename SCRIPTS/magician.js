import imageList from "../SCRIPTS/imageList.js";

document.addEventListener("DOMContentLoaded", () => {
    const playerPickElement = document.getElementById("playerPick");
    const magicianPickElement = document.getElementById("magicianPick");

    window.pickACard = function () {
        document.querySelector("button").style.display = "none";

        if (!imageList.length) {
            console.error("No images available");
            return;
        }

        const playerCard = imageList[Math.floor(Math.random() * imageList.length)];
        playerPickElement.innerHTML = `<img src="../${playerCard}" alt="Player's Card">`;

        magicianPickElement.textContent = "Let me read your mind\nPlease wait...";

        setTimeout(() => {
            const magicianCard = Math.random() < 0.75 ? playerCard : imageList[Math.floor(Math.random() * imageList.length)];
            magicianPickElement.textContent = "";
            magicianPickElement.innerHTML = `<img src="../${magicianCard}" alt="Magician's Card">`;

            setTimeout(() => {
                document.querySelector("button").style.display = "block";
            }, 2000);
        }, 1000);
    };
});
