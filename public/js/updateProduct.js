document.addEventListener("DOMContentLoaded", async () => {
    const tableBody = document.getElementById("productTable");

    // Fetch products
    const response = await fetch("/products/all");
    const products = await response.json();

    // Display products
    products.forEach(product => {
        const row = document.createElement("tr");
        row.classList.add("border-b");

        row.innerHTML = `
            <td class="p-2 text-center">${product.productId}</td>
            <td class="p-2">
                <input type="text" value="${product.name}" class="border p-1 w-full name-input">
            </td>
            <td class="p-2">
                <div class="image-container">
                    ${product.images.map(img => `
                        <img src="${img}" class="w-16 h-16 inline-block border rounded">
                        <button class="text-red-500 remove-image" data-img="${img}" data-id="${product._id}">X</button>
                    `).join('')}
                </div>
                <input type="file" class="border p-1 new-image" data-id="${product._id}">
            </td>
            <td class="p-2">
                <ul class="feature-list">
                    ${product.features.map(feature => `
                        <li>
                            <input type="text" value="${feature}" class="border p-1 w-full feature-input">
                            <button class="text-red-500 remove-feature">X</button>
                        </li>
                    `).join('')}
                </ul>
                <button class="bg-blue-500 text-white p-1 add-feature">+ Add</button>
            </td>
            <td class="p-2">
                <ul class="variant-list">
                    ${product.variants.map(v => `
                        <li class="border p-1">
                            Size: <input type="text" value="${v.size}" class="border p-1 w-12 size-input">
                            Price: <input type="number" value="${v.price}" class="border p-1 w-16 price-input">
                            Qty: <input type="number" value="${v.quantity}" class="border p-1 w-12 qty-input">
                            <button class="text-red-500 remove-variant">X</button>
                        </li>
                    `).join('')}
                </ul>
                <button class="bg-green-500 text-white p-1 add-variant">+ Add</button>
            </td>
            <td class="p-2">
                <button class="bg-yellow-500 text-white p-1 save-btn" data-id="${product._id}">Save</button>
                <button class="bg-red-500 text-white p-1 delete-btn" data-id="${product._id}">Delete</button>
            </td>
        `;

        tableBody.appendChild(row);
    });

    // Event listeners for editing, deleting, updating
    document.querySelectorAll(".save-btn").forEach(btn => {
        btn.addEventListener("click", async (event) => {
            const id = event.target.dataset.id;
            const row = event.target.closest("tr");

            const updatedProduct = {
                name: row.querySelector(".name-input").value,
                features: [...row.querySelectorAll(".feature-input")].map(f => f.value),
                variants: [...row.querySelectorAll(".variant-list li")].map(v => ({
                    size: v.querySelector(".size-input").value,
                    price: parseFloat(v.querySelector(".price-input").value),
                    quantity: parseInt(v.querySelector(".qty-input").value)
                }))
            };

            const res = await fetch(`/update-product/${id}`, {
                method: "PUT",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(updatedProduct)
            });

            const data = await res.json();
            alert(data.message);
        });
    });

    document.querySelectorAll(".delete-btn").forEach(btn => {
        btn.addEventListener("click", async (event) => {
            const id = event.target.dataset.id;
            if (confirm("Are you sure?")) {
                await fetch(`/delete-product/${id}`, { method: "DELETE" });
                location.reload();
            }
        });
    });
});
