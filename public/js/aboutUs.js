document.addEventListener("DOMContentLoaded", function () {
    console.log("About Us page loaded successfully!");

    const revealElements = document.querySelectorAll(".reveal");

    function revealOnScroll() {
        revealElements.forEach(element => {
            const elementTop = element.getBoundingClientRect().top;
            if (elementTop < window.innerHeight - 100) {
                element.classList.add("visible");
            }
        });
    }

    window.addEventListener("scroll", revealOnScroll);
    revealOnScroll(); // Trigger animation if already in view
});
