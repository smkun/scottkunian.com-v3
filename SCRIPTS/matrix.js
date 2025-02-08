const canvas = document.getElementById("matrixCanvas");
const ctx = canvas.getContext("2d");

// Fullscreen Canvas
canvas.width = window.innerWidth;
canvas.height = window.innerHeight;

// Matrix Characters
const matrixChars = "アァカサタナハマヤラワ0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZ";
const fontSize = 16;
const columns = canvas.width / fontSize;
const drops = Array(Math.floor(columns)).fill(1);

// Function to get matrix color from CSS
function getMatrixColor() {
    return getComputedStyle(document.body).getPropertyValue('--matrix-color').trim() || '#9d4edd';
}

// Draw Function
function drawMatrix() {
    ctx.fillStyle = "rgba(0, 0, 0, 0.05)";
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    ctx.fillStyle = getMatrixColor(); // Dynamic color
    ctx.font = `${fontSize}px monospace`;

    drops.forEach((y, index) => {
        const text = matrixChars.charAt(Math.floor(Math.random() * matrixChars.length));
        const x = index * fontSize;

        ctx.fillText(text, x, y * fontSize);

        drops[index] = y * fontSize > canvas.height && Math.random() > 0.975 ? 0 : y + 1;
    });
}

// Redraw every 50ms
setInterval(drawMatrix, 50);

// Adjust Canvas on Resize
window.addEventListener("resize", () => {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
});
