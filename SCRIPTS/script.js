// Sections for Navigation (if applicable)
const sections = {
  home: document.getElementById('home'),
  about: document.getElementById('about'),
  mystuff: document.getElementById('mystuff'),
  contact: document.getElementById('contact'),
  error: document.getElementById('error')
};

// Array of headshot images
const headshots = [
  'ASSETS/IMAGES/ScottHeadshot.jpeg',
  'ASSETS/IMAGES/ScottHeadshot2.jpeg',
  'ASSETS/IMAGES/ScottHeadshot3.jpeg',
  'ASSETS/IMAGES/ScottHeadshot4.jpeg'
];

let currentHeadshotIndex = 0;

function rotateHeadshot() {
  const profileImage = document.querySelector('.profile-image');
  if (profileImage) {
      currentHeadshotIndex = (currentHeadshotIndex + 1) % headshots.length;
      
      // Create new image to preload
      const newImage = new Image();
      newImage.onload = function() {
          // Fade out current image
          profileImage.style.transition = 'opacity 0.3s ease-out';
          profileImage.style.opacity = '0';
          
          setTimeout(() => {
              // Change source and fade in
              profileImage.src = headshots[currentHeadshotIndex];
              profileImage.style.opacity = '1';
          }, 300);
      };
      newImage.src = headshots[currentHeadshotIndex];
  }
}

// Simple Router (for SPA navigation)
function navigate() {
  const hash = window.location.hash.substring(1) || 'home';
  Object.values(sections).forEach(section => section?.classList.add('hidden'));
  if (sections[hash]) {
      sections[hash].classList.remove('hidden');
  } else {
      sections.error?.classList.remove('hidden');
  }
}

// Initial Load & Route Change
window.addEventListener('load', navigate);
window.addEventListener('hashchange', navigate);

// Highlight the current page in the navbar
document.addEventListener("DOMContentLoaded", () => {
  const path = window.location.pathname.split("/").pop();
  const navLinks = document.querySelectorAll(".nav-link");

  navLinks.forEach(link => {
      if (link.getAttribute("href") === path) {
          link.classList.add("active");
      }
  });
});

// === Theme Switcher Logic ===
const themeSelector = document.getElementById("themeSelector");
const themes = ["theme-purple", "theme-green", "theme-red", "theme-blue", "theme-light"];

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
  themes.forEach(theme => document.body.classList.remove(theme));
  
  // Apply new theme
  document.body.classList.add(selectedTheme);
  
  // Save preference
  localStorage.setItem("preferredTheme", selectedTheme);
  
  // Dispatch theme change event for the effects
  const event = new Event('themechange');
  window.dispatchEvent(event);
  
  // Rotate headshot
  rotateHeadshot();
});

// Effect change handler
document.getElementById("effectSelector")?.addEventListener("change", () => {
  rotateHeadshot();
});