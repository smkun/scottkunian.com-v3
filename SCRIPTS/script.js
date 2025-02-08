// Sections for Navigation (if applicable)
const sections = {
  home: document.getElementById('home'),
  about: document.getElementById('about'),
  mystuff: document.getElementById('mystuff'),
  contact: document.getElementById('contact'),
  error: document.getElementById('error')
};

// Simple Router (for SPA navigation)
function navigate() {
  const hash = window.location.hash.substring(1) || 'home';

  // Hide all sections
  Object.values(sections).forEach(section => section?.classList.add('hidden'));

  // Show the current section
  if (sections[hash]) {
      sections[hash].classList.remove('hidden');
  } else {
      sections.error?.classList.remove('hidden');
  }
}

// Contact Form Handling
document.getElementById('contactForm')?.addEventListener('submit', function (e) {
  e.preventDefault();
  document.getElementById('confirmationMessage').style.display = 'block';
  this.reset();
});

// Initial Load & Route Change
window.addEventListener('load', navigate);
window.addEventListener('hashchange', navigate);

// Smooth Scroll Navigation
document.querySelectorAll('nav a').forEach(link => {
  link.addEventListener('click', function (e) {
      e.preventDefault();
      const target = this.getAttribute('href');
      window.location.href = target;
  });
});

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

// === Theme Selector Logic ===
const themeSelector = document.getElementById("themeSelector");
const themes = ["theme-purple", "theme-green", "theme-red", "theme-blue"];

// Apply saved theme on page load
window.addEventListener("DOMContentLoaded", () => {
  const savedTheme = localStorage.getItem("preferredTheme") || "theme-purple";
  document.body.classList.add(savedTheme);
  if (themeSelector) {
      themeSelector.value = savedTheme;
  }
});

// Theme selection functionality
themeSelector?.addEventListener("change", () => {
  const selectedTheme = themeSelector.value;

  // Remove all themes
  themes.forEach(theme => document.body.classList.remove(theme));

  // Apply the selected theme
  document.body.classList.add(selectedTheme);

  // Save preference to localStorage
  localStorage.setItem("preferredTheme", selectedTheme);

  // Refresh Matrix Effect color
  setTimeout(() => {
      const event = new Event('resize');
      window.dispatchEvent(event);
  }, 100);
});
