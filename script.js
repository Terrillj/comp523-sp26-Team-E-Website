// Smooth scrolling for navigation links
document.querySelectorAll('a[href^="#"]').forEach((anchor) => {
    anchor.addEventListener("click", function (e) {
        // Skip dropdown triggers entirely - they're handled separately
        if (this.classList.contains("nav-dropdown-trigger")) {
            return; // Let the dropdown handler manage this
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

        // Close menu when clicking on a link (mobile) - but not dropdown triggers
        const navLinks = document.querySelectorAll(".nav-menu a:not(.nav-dropdown-trigger)");
        navLinks.forEach((link) => {
            link.addEventListener("click", () => {
                // Only close on mobile
                if (window.innerWidth <= 768) {
                    hamburger.classList.remove("active");
                    navMenu.classList.remove("active");
                    hamburger.setAttribute("aria-expanded", "false");
                }
            });
        });

        // Close menu when clicking outside (mobile)
        document.addEventListener("click", (e) => {
            // Only handle on mobile
            if (window.innerWidth <= 768) {
                const isClickInsideNav = navMenu.contains(e.target);
                const isClickOnHamburger = hamburger.contains(e.target);
                const isClickOnDropdown = e.target.closest(".nav-dropdown");
                
                // Don't close if clicking inside nav menu, hamburger, or dropdown
                if (!isClickInsideNav && !isClickOnHamburger && !isClickOnDropdown && navMenu.classList.contains("active")) {
                    hamburger.classList.remove("active");
                    navMenu.classList.remove("active");
                    hamburger.setAttribute("aria-expanded", "false");
                    // Also close any open dropdowns
                    document.querySelectorAll(".nav-dropdown-menu.active").forEach((menu) => {
                        menu.classList.remove("active");
                    });
                }
            }
        });
    }

    // Mobile dropdown toggle - handle both mobile and desktop
    const dropdownTriggers = document.querySelectorAll(".nav-dropdown-trigger");
    dropdownTriggers.forEach((trigger) => {
        trigger.addEventListener("click", (e) => {
            // Check if we're on mobile
            const isMobile = window.innerWidth <= 768;
            
            if (isMobile) {
                e.preventDefault();
                e.stopPropagation(); // Prevent event from bubbling up
                
                const dropdown = trigger.closest(".nav-dropdown");
                const dropdownMenu = dropdown ? dropdown.querySelector(".nav-dropdown-menu") : null;
                
                if (dropdownMenu) {
                    const isActive = dropdownMenu.classList.contains("active");
                    
                    // Close all dropdowns first
                    document.querySelectorAll(".nav-dropdown-menu.active").forEach((menu) => {
                        menu.classList.remove("active");
                    });
                    
                    // Toggle current dropdown (open if it was closed, close if it was open)
                    if (!isActive) {
                        dropdownMenu.classList.add("active");
                    }
                }
            }
            // On desktop, let the hover behavior handle it (don't prevent default)
        }, true); // Use capture phase to ensure this runs first
    });

    // Prevent dropdown menu clicks from closing the main menu
    const dropdownMenus = document.querySelectorAll(".nav-dropdown-menu");
    dropdownMenus.forEach((menu) => {
        menu.addEventListener("click", (e) => {
            e.stopPropagation(); // Prevent click from bubbling to document
        });
    });
});
