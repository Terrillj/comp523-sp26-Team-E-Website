// Smooth scrolling for navigation links
document.querySelectorAll('a[href^="#"]').forEach((anchor) => {
    anchor.addEventListener("click", function (e) {
        // Don't prevent default for dropdown triggers on mobile - let the dropdown handler manage it
        if (window.innerWidth <= 768 && this.classList.contains("nav-dropdown-trigger")) {
            return; // Let the dropdown handler in DOMContentLoaded manage this
        }
        
        e.preventDefault();
        const target = document.querySelector(this.getAttribute("href"));
        if (target) {
            const nav = document.querySelector(".navbar");
            const navHeight = nav ? nav.offsetHeight : 0;
            const targetPosition = target.offsetTop - navHeight;

            window.scrollTo({
                top: targetPosition,
                behavior: "smooth",
            });
        }
    });
});

// Add active class to navigation items on scroll
window.addEventListener("scroll", () => {
    let current = "";
    const sections = document.querySelectorAll("section[id], .hero");
    const navLinks = document.querySelectorAll(".nav-menu a");

    sections.forEach((section) => {
        const sectionTop = section.offsetTop;
        if (pageYOffset >= sectionTop - 200) {
            current = section.getAttribute("id");
        }
    });

    navLinks.forEach((link) => {
        link.classList.remove("active");
        if (current && link.getAttribute("href") === `#${current}`) {
            link.classList.add("active");
        }
    });
});

// Fade-in animation for cards
const observerOptions = {
    threshold: 0.1,
    rootMargin: "0px 0px -100px 0px",
};

const observer = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
        if (entry.isIntersecting) {
            entry.target.style.opacity = "1";
            entry.target.style.transform = "translateY(0)";
        }
    });
}, observerOptions);

document.addEventListener("DOMContentLoaded", () => {
    const cards = document.querySelectorAll(
        ".person-card, .schedule-card, .rules-card, .deliverable-card"
    );

    cards.forEach((card) => {
        card.style.opacity = "0";
        card.style.transform = "translateY(20px)";
        card.style.transition = "opacity 0.6s ease, transform 0.6s ease";
        observer.observe(card);
    });

    // Hamburger menu toggle
    const hamburger = document.querySelector(".hamburger");
    const navMenu = document.querySelector(".nav-menu");

    if (hamburger && navMenu) {
        hamburger.addEventListener("click", () => {
            hamburger.classList.toggle("active");
            navMenu.classList.toggle("active");
            const isExpanded = hamburger.classList.contains("active");
            hamburger.setAttribute("aria-expanded", isExpanded);
        });

        // Close menu when clicking on a link (mobile)
        const navLinks = document.querySelectorAll(".nav-menu a");
        navLinks.forEach((link) => {
            link.addEventListener("click", () => {
                // Only close if it's not a dropdown trigger
                if (!link.classList.contains("nav-dropdown-trigger")) {
                    hamburger.classList.remove("active");
                    navMenu.classList.remove("active");
                    hamburger.setAttribute("aria-expanded", "false");
                }
            });
        });

        // Close menu when clicking outside (mobile)
        document.addEventListener("click", (e) => {
            const isClickInsideNav = navMenu.contains(e.target);
            const isClickOnHamburger = hamburger.contains(e.target);
            
            if (!isClickInsideNav && !isClickOnHamburger && navMenu.classList.contains("active")) {
                hamburger.classList.remove("active");
                navMenu.classList.remove("active");
                hamburger.setAttribute("aria-expanded", "false");
            }
        });
    }

    // Mobile dropdown toggle
    const dropdownTriggers = document.querySelectorAll(".nav-dropdown-trigger");
    dropdownTriggers.forEach((trigger) => {
        trigger.addEventListener("click", (e) => {
            // Only handle on mobile (screen width <= 768px)
            if (window.innerWidth <= 768) {
                e.preventDefault();
                const dropdown = trigger.closest(".nav-dropdown");
                const dropdownMenu = dropdown.querySelector(".nav-dropdown-menu");
                
                if (dropdownMenu) {
                    dropdownMenu.classList.toggle("active");
                }
            }
        });
    });
});
