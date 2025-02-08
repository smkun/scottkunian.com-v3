// Sections for Navigation (if applicable)
const sections = {
    home: document.getElementById("home"),
    about: document.getElementById("about"),
    mystuff: document.getElementById("mystuff"),
    contact: document.getElementById("contact"),
    error: document.getElementById("error"),
};
// === Custom Glowing Cursor ===
const customCursor = document.createElement("div");
customCursor.classList.add("custom-cursor");
document.body.appendChild(customCursor);

// Cursor movement
document.addEventListener("mousemove", (e) => {
    customCursor.style.transform = `translate(${e.clientX}px, ${e.clientY}px)`;
});

// Change cursor color when theme changes
window.addEventListener("themechange", () => {
    const accentColor = getComputedStyle(document.body)
        .getPropertyValue("--accent-color")
        .trim();
    customCursor.style.background = accentColor;
    customCursor.style.boxShadow = `0 0 10px ${accentColor}, 0 0 20px ${accentColor}`;
});

// Array of headshot images
const headshots = [
    "ASSETS/IMAGES/ScottHeadshot.jpeg",
    "ASSETS/IMAGES/ScottHeadshot2.jpeg",
    "ASSETS/IMAGES/ScottHeadshot3.jpeg",
    "ASSETS/IMAGES/ScottHeadshot4.jpeg",
];

let currentHeadshotIndex = 0;

function rotateHeadshot() {
    const profileImage = document.querySelector(".profile-image");
    if (profileImage) {
        currentHeadshotIndex = (currentHeadshotIndex + 1) % headshots.length;

        // Create new image to preload
        const newImage = new Image();
        newImage.onload = function () {
            profileImage.style.transition = "opacity 0.3s ease-out";
            profileImage.style.opacity = "0";

            setTimeout(() => {
                profileImage.src = headshots[currentHeadshotIndex];
                profileImage.style.opacity = "1";
            }, 300);
        };
        newImage.src = headshots[currentHeadshotIndex];

        // ✅ Save the current headshot index to localStorage
        localStorage.setItem("currentHeadshotIndex", currentHeadshotIndex);
    }
}

// Simple Router (for SPA navigation)
function navigate() {
    const hash = window.location.hash.substring(1) || "home";
    Object.values(sections).forEach((section) =>
        section?.classList.add("hidden")
    );
    if (sections[hash]) {
        sections[hash].classList.remove("hidden");
    } else {
        sections.error?.classList.remove("hidden");
        S;
    }
}

// Initial Load & Route Change
window.addEventListener("load", navigate);
window.addEventListener("hashchange", navigate);

// Highlight the current page in the navbar
window.addEventListener("DOMContentLoaded", () => {
    const savedTheme = localStorage.getItem("preferredTheme") || "theme-purple"; // Default Theme if not set
    document.body.classList.add(savedTheme);

    const themeSelector = document.getElementById("themeSelector");
    if (themeSelector) {
        themeSelector.value = savedTheme; // Sync dropdown with the saved theme
    }
});
window.addEventListener("DOMContentLoaded", () => {
    const savedHeadshotIndex = localStorage.getItem("currentHeadshotIndex");
    const profileImage = document.querySelector(".profile-image");

    if (profileImage && savedHeadshotIndex !== null) {
        currentHeadshotIndex = parseInt(savedHeadshotIndex, 10); // Convert to integer
        profileImage.src = headshots[currentHeadshotIndex]; // Load the saved headshot
    }
});

// === Theme Switcher Logic ===
const themeSelector = document.getElementById("themeSelector");
const themes = [
    "theme-purple",
    "theme-green",
    "theme-red",
    "theme-blue",
    "theme-light",
];

// Apply saved theme on page load
window.addEventListener("DOMContentLoaded", () => {
    const savedTheme = localStorage.getItem("preferredTheme");
    if (savedTheme) {
        document.body.classList.add(savedTheme);
    } else {
        document.body.classList.add("theme-purple"); // Default Theme
    }
});

// Theme change handler
themeSelector?.addEventListener("change", (e) => {
    const selectedTheme = e.target.value;

    // Remove previous theme
    themes.forEach((theme) => document.body.classList.remove(theme));

    // Apply new theme
    document.body.classList.add(selectedTheme);

    // Save preference
    localStorage.setItem("preferredTheme", selectedTheme);

    // Dispatch theme change event for the effects
    const event = new Event("themechange");
    window.dispatchEvent(event);

    // Rotate headshot
    rotateHeadshot();
});
window.addEventListener("themechange", () => {
    // Restart the current effect to update its colors
    startEffect(localStorage.getItem("currentEffect") || "matrix");
});

// Effect change handler
document.getElementById("effectSelector")?.addEventListener("change", () => {
    rotateHeadshot();
});
