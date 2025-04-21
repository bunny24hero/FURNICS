
document.addEventListener("DOMContentLoaded", () => {
    const productContainer = document.getElementById("productContainer");
    const categoryButtons = document.querySelectorAll(".category-btn");
    let previewBox = null;
    let hidePreviewTimeout;
    let magnifier = null;
    
    // Fetch products from the server by category
    async function fetchProducts(category) {
        try {
            const response = await fetch(`/products/${category}`);
            const products = await response.json();
            displayProducts(products);
        } catch (error) {
            console.error("Error fetching products:", error);
        }
    }

    // Display products in the container
    function displayProducts(products) {
        productContainer.innerHTML = "";

        products.forEach(product => {
            const productCard = document.createElement("div");
            productCard.classList.add("product-card", "fade-in", "p-4");
            productCard.dataset.productId = product._id;

            // Create variant buttons
            let variantsHTML = product.variants.map(variant => `
                <button class="variant-btn">${variant.size} cm - $${variant.price}</button>
            `).join("");

            productCard.innerHTML = `
                <img src="${product.images[0] || 'https://via.placeholder.com/300x200'}" alt="${product.name}" class="product-img">
                <div class="product-info">
                    <h3 class="product-name">${product.name}</h3>
                    <p class="product-price">Starting from ₹${product.variants[0]?.price || 'N/A'}</p>
                    <div class="variant-container">${variantsHTML}</div>
                    <button class="add-to-cart-btn"><i class="fas fa-shopping-cart"></i> Add to Cart</button>
                </div>
            `;

            // Attach event listeners for hover preview
            productCard.addEventListener("mouseenter", () => showPreview(product, productCard));
            productCard.addEventListener("mouseleave", hidePreview);
            productCard.addEventListener("click", () => {
                window.location.href = `/productDetail?id=${product._id}`;
            });

            productContainer.appendChild(productCard);
        });

        // Enable variant button toggling
        document.querySelectorAll(".variant-btn").forEach(button => {
            button.addEventListener("click", function(e) {
                e.stopPropagation();
                const container = this.parentElement;
                container.querySelectorAll(".variant-btn").forEach(btn => btn.classList.remove("selected"));
                this.classList.add("selected");
            });
        });
    }

    // Show preview with image slider and magnifier
    function showPreview(product, cardElement) {
        clearTimeout(hidePreviewTimeout);

        if (previewBox) previewBox.remove();
        if (magnifier) magnifier.remove();

        // Create preview box
        previewBox = document.createElement("div");
        previewBox.classList.add("preview-box");

        let sliderHTML = `
            <div class="preview-slider">
                ${product.images.map((img, index) => `
                    <img src="${img}" class="slider-img" ${index === 0 ? 'style="display:block;"' : ''}>
                `).join("")}
                <button class="prev">❮</button>
                <button class="next">❯</button>
            </div>
        `;

        previewBox.innerHTML = sliderHTML;
        document.body.appendChild(previewBox);

        // Position preview box
        const cardRect = cardElement.getBoundingClientRect();
        previewBox.style.top = `${cardRect.top + window.scrollY + 50}px`;
        previewBox.style.left = `${cardRect.left + window.scrollX + 50}px`;
        previewBox.style.display = "flex";

        // Create magnifier box
        magnifier = document.createElement("div");
        magnifier.classList.add("magnifier");
        const magnifierInner = document.createElement("div");
        magnifierInner.classList.add("magnifier-inner");
        magnifierInner.style.backgroundImage = `url('${product.images[0]}')`;
        magnifier.appendChild(magnifierInner);
        document.body.appendChild(magnifier);

        const previewRect = previewBox.getBoundingClientRect();
        magnifier.style.top = `${previewRect.top}px`;
        magnifier.style.left = `${previewRect.right + 20}px`;
        magnifier.style.display = "block";

        // Magnifier Effect
        const sliderImages = previewBox.querySelectorAll(".slider-img");
        sliderImages.forEach((img) => {
            img.addEventListener("mousemove", (e) => {
                const rect = img.getBoundingClientRect();
                const x = e.clientX - rect.left;
                const y = e.clientY - rect.top;
                const xPercent = (x / rect.width) * 100;
                const yPercent = (y / rect.height) * 100;
                magnifierInner.style.backgroundPosition = `${xPercent}% ${yPercent}%`;
            });
        });

        // Slider functionality
        let currentIndex = 0;
        const images = previewBox.querySelectorAll(".slider-img");

        function showSlide(index) {
            images.forEach(img => img.style.display = "none");
            images[index].style.display = "block";
            magnifierInner.style.backgroundImage = `url('${images[index].src}')`;
        }

        previewBox.querySelector(".prev").addEventListener("click", () => {
            currentIndex = (currentIndex > 0) ? currentIndex - 1 : images.length - 1;
            showSlide(currentIndex);
        });

        previewBox.querySelector(".next").addEventListener("click", () => {
            currentIndex = (currentIndex < images.length - 1) ? currentIndex + 1 : 0;
            showSlide(currentIndex);
        });

        previewBox.addEventListener("mouseenter", () => clearTimeout(hidePreviewTimeout));
        previewBox.addEventListener("mouseleave", hidePreview);
        magnifier.addEventListener("mouseenter", () => clearTimeout(hidePreviewTimeout));
        magnifier.addEventListener("mouseleave", hidePreview);
    }

    // Hide preview with delay
    function hidePreview() {
        hidePreviewTimeout = setTimeout(() => {
            if (previewBox) {
                previewBox.remove();
                previewBox = null;
            }
            if (magnifier) {
                magnifier.remove();
                magnifier = null;
            }
        }, 200);
    }

    // Category filtering: fetch products for selected category
    categoryButtons.forEach(button => {
        button.addEventListener("click", () => {
            fetchProducts(button.dataset.category);
        });
    });

    // Load all products initially
    fetchProducts("all");


});






