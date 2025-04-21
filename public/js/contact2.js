document.getElementById("contact-form").addEventListener("submit", function(event) {
    event.preventDefault();

    // Get form values
    let name = document.getElementById("name").value.trim();
    let email = document.getElementById("email").value.trim();
    let message = document.getElementById("message").value.trim();

    // Simple validation
    if (!name || !email || !message) {
        document.getElementById("form-message").innerText = "⚠️ Please fill all fields.";
        return;
    }

    // Simulate a form submission (Replace with actual backend API call)
    setTimeout(() => {
        document.getElementById("form-message").innerText = "✅ Message sent successfully!";
        document.getElementById("contact-form").reset();
    }, 1000);
});
