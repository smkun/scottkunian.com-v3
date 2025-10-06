// Asia Trip Photo Gallery JavaScript - Clean Version
class PhotoGallery {
    constructor() {
        this.photos = [];
        this.currentPhotoIndex = 0;
        this.currentLocationPhotos = [];
        this.currentLocationIndex = 0;
        this.init();
    }

    async init() {
        console.log("🌏 Initializing Asia Trip Photo Gallery...");

        try {
            await this.loadPhotoData();
            this.renderGallery();
            this.setupModal();
            console.log("✨ Gallery loaded successfully!");
        } catch (error) {
            console.error("❌ Error loading gallery:", error);
            this.showError(
                "Failed to load photo gallery. Please refresh the page."
            );
        }
    }

    async loadPhotoData() {
        const response = await fetch("photo_data.json");
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        const data = await response.json();

        // Convert data structure for easier handling
        this.photos = [];
        Object.entries(data).forEach(([location, locationData]) => {
            const photos = Array.isArray(locationData)
                ? locationData
                : locationData.images;
            photos.forEach((photo) => {
                const filename =
                    typeof photo === "string" ? photo : photo.filename;
                this.photos.push({
                    src: `images/${location}/${filename}`,
                    location: location,
                    filename: filename,
                });
            });
        });

        return data;
    }

    renderGallery() {
        fetch("photo_data.json")
            .then((response) => response.json())
            .then((data) => {
                const container = document.querySelector(".container");
                const errorDiv = document.getElementById("error-message");
                if (errorDiv) errorDiv.style.display = "none";

                let html = this.generateStatsHTML(data);
                html += '<div class="locations-grid">';

                Object.entries(data).forEach(
                    ([location, locationData], index) => {
                        const photos = Array.isArray(locationData)
                            ? locationData
                            : locationData.images;
                        html += this.generateLocationCardHTML(
                            location,
                            locationData,
                            photos,
                            index
                        );
                    }
                );

                html += "</div>";
                container.innerHTML = html;
                this.setupPhotoClicks();
            })
            .catch((error) => {
                console.error("Error rendering gallery:", error);
                this.showError(
                    "Failed to render photo gallery. Please check that the server is running."
                );
            });
    }

    generateStatsHTML(data) {
        const totalLocations = Object.keys(data).length;
        const totalPhotos = Object.values(data).reduce((sum, locationData) => {
            const photos = Array.isArray(locationData)
                ? locationData
                : locationData.images;
            return sum + photos.length;
        }, 0);

        // Extract countries and count locations per country
        const countryCounts = new Map();
        Object.entries(data).forEach(([location, locationData]) => {
            const displayName = locationData.display_name || location;

            if (displayName.includes("Japan") || displayName.includes("日本")) {
                countryCounts.set(
                    "Japan",
                    (countryCounts.get("Japan") || 0) + 1
                );
            }
            if (displayName.includes("China") || displayName.includes("中国")) {
                countryCounts.set(
                    "China",
                    (countryCounts.get("China") || 0) + 1
                );
            }
            if (
                displayName.includes("United-States") ||
                displayName.includes("United States")
            ) {
                countryCounts.set("USA", (countryCounts.get("USA") || 0) + 1);
            }
        });

        const countryBreakdown = Array.from(countryCounts.entries())
            .map(([country, count]) => `${country}: ${count} locations`)
            .join("<br>");

        return `
            <div class="stats">
                <h2>📊 Trip Statistics</h2>
                <div class="stats-grid">
                    <div class="stat-item">
                        <div class="stat-number">${totalLocations}</div>
                        <div>Locations Visited</div>
                    </div>
                    <div class="stat-item">
                        <div class="stat-number">${totalPhotos}</div>
                        <div>Photos Captured</div>
                    </div>
                    <div class="stat-item">
                        <div class="stat-number">${countryCounts.size}</div>
                        <div>Countries Explored</div>
                        <div class="emoji-content" style="font-size: 0.8rem; margin-top: 0.5rem; line-height: 1.3;">${
                            countryBreakdown || "🌏 Loading..."
                        }</div>
                    </div>
                </div>
            </div>
        `;
    }

    generateLocationCardHTML(location, locationData, photos, index) {
        // Use display_name if available (contains Asian characters), otherwise fallback to processed location name
        const displayName = locationData.display_name
            ? locationData.display_name
                  .replace(/202503_/g, "")
                  .replace(/_/g, " ")
            : location.replace(/202503_/g, "").replace(/_/g, " ");
        const photosToShow = photos.slice(0, 4);
        const remainingCount = photos.length - photosToShow.length;

        return `
            <div class="location-card" data-location="${location}">
                <div class="location-header">
                    <h3>${displayName}</h3>
                    <span class="photo-count">${photos.length} photos</span>
                </div>
                <div class="photo-preview">
                    ${photosToShow
                        .map((photo, photoIndex) => {
                            const filename =
                                typeof photo === "string"
                                    ? photo
                                    : photo.filename;
                            return `
                            <div class="preview-photo" onclick="window.photoGallery.openModal('images/${location}/${filename}', '${displayName}', ${photoIndex}, '${location}')">
                                <img src="images/${location}/${filename}" alt="${displayName}" loading="lazy" onerror="this.style.display='none'">
                                <div class="photo-overlay">
                                    <span>👁️</span>
                                </div>
                            </div>
                        `;
                        })
                        .join("")}
                    ${
                        remainingCount > 0
                            ? `
                        <div class="more-photos" onclick="window.photoGallery.showAllPhotos('${location}', '${displayName}')">
                            <span>+${remainingCount} more</span>
                        </div>
                    `
                            : ""
                    }
                </div>
            </div>
        `;
    }

    setupPhotoClicks() {
        window.photoGallery = this;
    }

    openModal(src, locationName, index, location = null) {
        if (location) {
            this.currentLocation = location;
            this.currentLocationPhotos = this.photos.filter(
                (photo) => photo.location === location
            );
            this.currentLocationIndex = this.currentLocationPhotos.findIndex(
                (photo) => photo.src === src
            );
        }

        const modal = document.getElementById("modal");
        const modalImage = document.getElementById("modalImage");
        const modalTitle = document.getElementById("modalTitle");
        const modalLocation = document.getElementById("modalLocation");

        modal.style.display = "flex";
        modalImage.src = src;
        modalTitle.textContent = `Photo ${
            (this.currentLocationIndex || 0) + 1
        } of ${this.currentLocationPhotos?.length || 1}`;
        modalLocation.textContent = locationName;

        document.body.style.overflow = "hidden";
        modal.style.opacity = "1";
    }

    setupModal() {
        const modalHTML = `
            <div class="modal" id="modal">
                <div class="modal-content">
                    <span class="close" id="closeModal">&times;</span>
                    <div class="modal-nav">
                        <button class="nav-btn prev" id="prevBtn">&#10094;</button>
                        <button class="nav-btn next" id="nextBtn">&#10095;</button>
                    </div>
                    <img id="modalImage" src="" alt="">
                    <div class="modal-info">
                        <h3 id="modalTitle"></h3>
                        <p id="modalLocation"></p>
                    </div>
                </div>
            </div>
        `;

        document.body.insertAdjacentHTML("beforeend", modalHTML);

        const modal = document.getElementById("modal");
        const closeBtn = document.getElementById("closeModal");
        const prevBtn = document.getElementById("prevBtn");
        const nextBtn = document.getElementById("nextBtn");

        closeBtn.onclick = () => this.closeModal();
        prevBtn.onclick = () => this.prevPhoto();
        nextBtn.onclick = () => this.nextPhoto();
        modal.onclick = (e) => {
            if (e.target === modal) this.closeModal();
        };

        document.addEventListener("keydown", (e) => {
            if (modal.style.display === "flex") {
                if (e.key === "Escape") this.closeModal();
                else if (e.key === "ArrowLeft") this.prevPhoto();
                else if (e.key === "ArrowRight") this.nextPhoto();
            }
        });
    }

    closeModal() {
        const modal = document.getElementById("modal");
        modal.style.opacity = "0";
        setTimeout(() => {
            modal.style.display = "none";
            document.body.style.overflow = "auto";
        }, 300);
    }

    prevPhoto() {
        if (
            !this.currentLocationPhotos ||
            this.currentLocationPhotos.length === 0
        )
            return;

        this.currentLocationIndex =
            (this.currentLocationIndex -
                1 +
                this.currentLocationPhotos.length) %
            this.currentLocationPhotos.length;
        const photo = this.currentLocationPhotos[this.currentLocationIndex];

        const modalImage = document.getElementById("modalImage");
        const modalTitle = document.getElementById("modalTitle");

        modalImage.src = photo.src;
        modalTitle.textContent = `Photo ${this.currentLocationIndex + 1} of ${
            this.currentLocationPhotos.length
        }`;
    }

    nextPhoto() {
        if (
            !this.currentLocationPhotos ||
            this.currentLocationPhotos.length === 0
        )
            return;

        this.currentLocationIndex =
            (this.currentLocationIndex + 1) % this.currentLocationPhotos.length;
        const photo = this.currentLocationPhotos[this.currentLocationIndex];

        const modalImage = document.getElementById("modalImage");
        const modalTitle = document.getElementById("modalTitle");

        modalImage.src = photo.src;
        modalTitle.textContent = `Photo ${this.currentLocationIndex + 1} of ${
            this.currentLocationPhotos.length
        }`;
    }

    showAllPhotos(location, displayName) {
        const locationPhotos = this.photos.filter(
            (photo) => photo.location === location
        );
        if (locationPhotos.length === 0) return;
        this.openModal(locationPhotos[0].src, displayName, 0, location);
    }

    showError(message) {
        const container = document.querySelector(".container");
        const errorDiv =
            document.getElementById("error-message") ||
            document.createElement("div");
        errorDiv.id = "error-message";
        errorDiv.className = "error-message";
        errorDiv.textContent = message;
        errorDiv.style.cssText = `
            background: #fee2e2;
            border: 1px solid #fecaca;
            color: #dc2626;
            padding: 1rem;
            border-radius: 8px;
            margin: 1rem 0;
            text-align: center;
            display: block;
        `;

        if (container) {
            container.insertBefore(errorDiv, container.firstChild);
        }
    }
}

// Initialize the gallery when DOM is loaded
document.addEventListener("DOMContentLoaded", () => {
    new PhotoGallery();
});
