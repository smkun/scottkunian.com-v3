// Global animation tracking variables
let matrixInterval;
let particlesAnimation;
let wavesAnimation;

// === Matrix Effect ===
function loadMatrixEffect() {
    const canvas = document.getElementById("effectCanvas");
    if (!canvas) return;

    const ctx = canvas.getContext("2d");
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;

    const letters =
        "アァカサタナハマヤラワ0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZ";
    const fontSize = 16;
    const columns = canvas.width / fontSize;
    const drops = Array(Math.floor(columns)).fill(1);

    function drawMatrix() {
        ctx.fillStyle = "rgba(0, 0, 0, 0.05)";
        ctx.fillRect(0, 0, canvas.width, canvas.height);

        ctx.fillStyle = getMatrixColor();
        ctx.font = `${fontSize}px monospace`;

        drops.forEach((y, index) => {
            const text = letters.charAt(
                Math.floor(Math.random() * letters.length)
            );
            const x = index * fontSize;
            ctx.fillText(text, x, y * fontSize);

            drops[index] =
                y * fontSize > canvas.height && Math.random() > 0.975
                    ? 0
                    : y + 1;
        });
    }

    // Clear any existing interval
    clearInterval(matrixInterval);
    // Start new interval
    matrixInterval = setInterval(drawMatrix, 50);
}

// === Particles Effect ===
function loadParticlesEffect() {
    const canvas = document.getElementById("effectCanvas");
    if (!canvas) return;

    const ctx = canvas.getContext("2d");
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;

    const particles = Array(300)
        .fill()
        .map(() => ({
            x: Math.random() * canvas.width,
            y: Math.random() * canvas.height,
            size: Math.random() * 4 + 1,
            dx: Math.random() * 4 - 2,
            dy: Math.random() * 4 - 2,
        }));

    let mouse = { x: null, y: null };

    // Track mouse movement
    window.addEventListener("mousemove", (event) => {
        mouse.x = event.clientX;
        mouse.y = event.clientY;
    });

    window.addEventListener("mouseleave", () => {
        mouse.x = null;
        mouse.y = null;
    });

    function drawParticles() {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        ctx.fillStyle = getMatrixColor();

        particles.forEach((p) => {
            // Repel effect
            if (mouse.x && mouse.y) {
                const dx = p.x - mouse.x;
                const dy = p.y - mouse.y;
                const distance = Math.sqrt(dx * dx + dy * dy);
                const maxDistance = 100;

                if (distance < maxDistance) {
                    const angle = Math.atan2(dy, dx);
                    const force = (maxDistance - distance) / maxDistance;

                    p.dx += Math.cos(angle) * force;
                    p.dy += Math.sin(angle) * force;
                }
            }

            // Move particle
            p.x += p.dx;
            p.y += p.dy;

            // Boundary checks
            if (p.x < 0 || p.x > canvas.width) p.dx *= -1;
            if (p.y < 0 || p.y > canvas.height) p.dy *= -1;

            // Draw particle
            ctx.beginPath();
            ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
            ctx.fill();
        });

        particlesAnimation = requestAnimationFrame(drawParticles);
    }

    drawParticles();
}

// === Waves Effect ===
function loadWavesEffect() {
    const canvas = document.getElementById("effectCanvas");
    if (!canvas) return;

    const ctx = canvas.getContext("2d");

    function resizeCanvas() {
        canvas.width = window.innerWidth;
        canvas.height = window.innerHeight;
    }

    resizeCanvas();
    window.addEventListener("resize", resizeCanvas);

    let time = 0;

    function drawWaves() {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        const color = getMatrixColor();

        // Create multiple waves with better motion parameters
        const waves = [
            {
                amplitude: 40,
                frequency: 0.005,
                speed: 1,
                y: canvas.height * 0.2,
            },
            {
                amplitude: 30,
                frequency: 0.007,
                speed: 0.8,
                y: canvas.height * 0.4,
            },
            {
                amplitude: 50,
                frequency: 0.003,
                speed: 1.2,
                y: canvas.height * 0.6,
            },
            {
                amplitude: 35,
                frequency: 0.006,
                speed: 0.9,
                y: canvas.height * 0.8,
            },
        ];

        waves.forEach((wave, index) => {
            ctx.beginPath();
            ctx.strokeStyle = color;
            ctx.lineWidth = 2;

            // Add slight transparency for layered effect
            ctx.globalAlpha = 0.5;

            for (let x = 0; x <= canvas.width; x++) {
                const y =
                    wave.y +
                    Math.sin(x * wave.frequency + time * wave.speed) *
                        wave.amplitude;
                if (x === 0) {
                    ctx.moveTo(x, y);
                } else {
                    ctx.lineTo(x, y);
                }
            }
            ctx.stroke();
        });

        ctx.globalAlpha = 1; // Reset alpha
        time += 0.015;
        wavesAnimation = requestAnimationFrame(drawWaves);
    }

    drawWaves();
}

// === Helper Function ===
function getMatrixColor() {
    return getComputedStyle(document.body)
        .getPropertyValue("--matrix-color")
        .trim();
}

// === Effect Management ===
let currentEffect = "matrix"; // Default effect

function startEffect(effectName) {
    stopCurrentEffect();
    currentEffect = effectName;
    // Save the current effect to localStorage
    localStorage.setItem("currentEffect", effectName);

    switch (effectName) {
        case "matrix":
            loadMatrixEffect();
            break;
        case "particles":
            loadParticlesEffect();
            break;
        case "waves":
            loadWavesEffect();
            break;
    }
}

function stopCurrentEffect() {
    const canvas = document.getElementById("effectCanvas");
    if (canvas) {
        const ctx = canvas.getContext("2d");
        ctx.clearRect(0, 0, canvas.width, canvas.height);

        // Clear all running animations
        clearInterval(matrixInterval);
        if (particlesAnimation) {
            cancelAnimationFrame(particlesAnimation);
        }
        if (wavesAnimation) {
            cancelAnimationFrame(wavesAnimation);
        }
    }
}

// === Initialize Effect Selector ===
document.addEventListener("DOMContentLoaded", () => {
    const effectSelector = document.getElementById("effectSelector");
    if (effectSelector) {
        // Get saved effect from localStorage or default to matrix
        const savedEffect = localStorage.getItem("currentEffect") || "matrix";
        effectSelector.value = savedEffect;

        effectSelector.addEventListener("change", (e) => {
            startEffect(e.target.value);
        });
    }

    // Start saved effect or default
    startEffect(localStorage.getItem("currentEffect") || "matrix");
});

// === Handle Window Events ===
window.addEventListener("load", () => {
    startEffect(currentEffect);
});

window.addEventListener("resize", () => {
    const canvas = document.getElementById("effectCanvas");
    if (canvas) {
        canvas.width = window.innerWidth;
        canvas.height = window.innerHeight;
        startEffect(currentEffect);
    }
});

// === Dynamic Theme Updates ===
window.addEventListener("themechange", () => {
    startEffect(currentEffect);
});
