








document.addEventListener("DOMContentLoaded", async () => {
    const urlParams = new URLSearchParams(window.location.search);
    const productId = urlParams.get("id");

    if (!productId) {
        alert("No product ID provided!");
        return;
    }

    try {
        const response = await fetch(`/productDetail/${productId}`);
        const product = await response.json();

        // Update product details
        document.getElementById("productName").textContent = product.name;
        document.getElementById("addToCartButton").setAttribute("data-product-id", productId);

        // Image Slider
        const imageSlider = document.getElementById("imageSlider");
        const sliderDots = document.getElementById("sliderDots");
        product.images.forEach((img, index) => {
            const slide = document.createElement("div");
            slide.classList.add("slide");
            slide.innerHTML = `<img src="${img}" class="w-full rounded-lg zoomable" id="productImage">`;
            imageSlider.appendChild(slide);

            const dot = document.createElement("span");
            dot.classList.add("dot");
            if (index === 0) dot.classList.add("active");
            dot.addEventListener("click", () => showSlide(index));
            sliderDots.appendChild(dot);
        });

        // Features List
        const featuresList = document.getElementById("featuresList");
        product.features.forEach(feature => {
            const li = document.createElement("li");
            li.textContent = feature;
            featuresList.appendChild(li);
        });

        // Variant Selection
        const variantContainer = document.getElementById("variantContainer");
        product.variants.forEach((variant, index) => {
            const variantButton = document.createElement("button");
            variantButton.classList.add("variant-btn");
            variantButton.textContent = variant.size;

            if (index === 0) {
                variantButton.classList.add("selected");
                document.getElementById("productPrice").textContent = `₹${variant.price}`;
            }

            variantButton.addEventListener("click", () => {
                document.querySelectorAll(".variant-btn").forEach(btn => btn.classList.remove("selected"));
                variantButton.classList.add("selected");
                document.getElementById("productPrice").textContent = `₹${variant.price}`;
            });
            variantContainer.appendChild(variantButton);
        });

        // Attach Event Listener to Add to Cart Button
        const addToCartButton = document.getElementById("addToCartButton");
        addToCartButton.addEventListener("click", () => {
            const selectedVariant = document.querySelector(".variant-btn.selected");
            if (!selectedVariant) {
                alert("Please select a size before adding to cart!");
                return;
            }

            addToCart(
                productId,
                product.name,
                selectedVariant.textContent,
                parseFloat(document.getElementById("productPrice").textContent.replace("₹", "")),
                document.getElementById("productImage").src

            );
        });

        // Initialize the slider
        setTimeout(() => {
            showSlide(0);  
        }, 100);

    } catch (error) {
        console.error("Error loading product details:", error);
        alert("Failed to load product details. Please try again later.");
    }
});

// Quantity Adjustment Functions
function increaseQuantity() {
    let quantityInput = document.getElementById("quantity");
    let currentValue = parseInt(quantityInput.value);
    quantityInput.value = currentValue + 1;
}

function decreaseQuantity() {
    let quantityInput = document.getElementById("quantity");
    let currentValue = parseInt(quantityInput.value);
    if (currentValue > 1) {
        quantityInput.value = currentValue - 1;
    }
}

// Image Slider Logic
let currentSlideIndex = 0;
function showSlide(index) {
    const slides = document.querySelectorAll(".slide");
    const totalSlides = slides.length;

    if (index >= totalSlides) {
        currentSlideIndex = 0;
    } else if (index < 0) {
        currentSlideIndex = totalSlides - 1;
    } else {
        currentSlideIndex = index;
    }

    const offset = -(currentSlideIndex * 100);
    document.querySelector(".slides").style.transform = `translateX(${offset}%)`;

    // Update dots
    const dots = document.querySelectorAll(".dot");
    dots.forEach(dot => dot.classList.remove("active"));
    dots[currentSlideIndex].classList.add("active");
}

// Image Zoom Logic
let zoomModal, zoomedImg;
function openImageZoom(src) {
    if (!zoomModal) {
        zoomModal = document.createElement("div");
        zoomModal.classList.add("image-zoom-modal");

        zoomedImg = document.createElement("img");
        zoomModal.appendChild(zoomedImg);

        const closeBtn = document.createElement("span");
        closeBtn.classList.add("close-zoom");
        closeBtn.innerHTML = "&times;";
        closeBtn.onclick = closeImageZoom;
        zoomModal.appendChild(closeBtn);

        document.body.appendChild(zoomModal);
    }

    zoomedImg.src = src;
    zoomModal.style.display = "flex";
}

function closeImageZoom() {
    zoomModal.style.display = "none";
}

// Function to Add Product to Cart
function addToCart(id, name, variant, price, image) {
    let cart = JSON.parse(localStorage.getItem("cart")) || [];
    let quantity = parseInt(document.getElementById("quantity").value);

    // Check if item already exists in cart
    let existingItem = cart.find(item => item.id === id && item.variant === variant);
    if (existingItem) {
        // existingItem.quantity += 1;
        existingItem.quantity = quantity;
    } else {
        cart.push({ id, name, variant, price, quantity, image });
    }

    localStorage.setItem("cart", JSON.stringify(cart));
    alert("Item added to cart!");
}
