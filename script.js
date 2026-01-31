// Smooth scrolling for navigation links (only for non-dropdown links, and not on mobile dropdown sub-links)
document.querySelectorAll('a[href^="#"]').forEach((anchor) => {
    anchor.addEventListener("click", function (e) {
        // Skip dropdown triggers - they're handled separately
        if (this.classList.contains("nav-dropdown-trigger")) {
            return;
        }
        
        // Skip dropdown menu links on mobile - they're handled in DOMContentLoaded
        if (window.innerWidth <= 768 && this.closest(".nav-dropdown-menu")) {
            return;
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

    // Helper function to close hamburger menu
    const closeHamburgerMenu = () => {
        const hamburger = document.querySelector(".hamburger");
        const navMenu = document.querySelector(".nav-menu");
        if (hamburger && navMenu) {
            hamburger.classList.remove("active");
            navMenu.classList.remove("active");
            hamburger.setAttribute("aria-expanded", "false");
            // Close all dropdowns
            document.querySelectorAll(".nav-dropdown-menu.active").forEach((menu) => {
                menu.classList.remove("active");
            });
        }
    };

    // Hamburger menu toggle
    const hamburger = document.querySelector(".hamburger");
    const navMenu = document.querySelector(".nav-menu");

    if (hamburger && navMenu) {
        hamburger.addEventListener("click", (e) => {
            e.stopPropagation();
            hamburger.classList.toggle("active");
            navMenu.classList.toggle("active");
            const isExpanded = hamburger.classList.contains("active");
            hamburger.setAttribute("aria-expanded", isExpanded);
        });

        // Mobile dropdown toggle - handle BEFORE other click handlers
        const dropdownTriggers = document.querySelectorAll(".nav-dropdown-trigger");
        dropdownTriggers.forEach((trigger) => {
            trigger.addEventListener("click", (e) => {
                const isMobile = window.innerWidth <= 768;
                
                if (isMobile) {
                    e.preventDefault();
                    e.stopPropagation();
                    
                    const dropdown = trigger.closest(".nav-dropdown");
                    const dropdownMenu = dropdown ? dropdown.querySelector(".nav-dropdown-menu") : null;
                    
                    if (dropdownMenu) {
                        const isActive = dropdownMenu.classList.contains("active");
                        
                        // Close all other dropdowns
                        document.querySelectorAll(".nav-dropdown-menu.active").forEach((menu) => {
                            if (menu !== dropdownMenu) {
                                menu.classList.remove("active");
                            }
                        });
                        
                        // Toggle current dropdown
                        if (isActive) {
                            dropdownMenu.classList.remove("active");
                        } else {
                            dropdownMenu.classList.add("active");
                        }
                    }
                }
            }, true); // Capture phase - runs first
        });

        // Handle clicks on dropdown sub-links (scroll and close menu)
        const dropdownLinks = document.querySelectorAll(".nav-dropdown-menu a");
        dropdownLinks.forEach((link) => {
            link.addEventListener("click", (e) => {
                const isMobile = window.innerWidth <= 768;
                if (isMobile) {
                    const href = link.getAttribute("href");
                    if (href && href.startsWith("#")) {
                        e.preventDefault();
                        const target = document.querySelector(href);
                        if (target) {
                            const nav = document.querySelector(".navbar");
                            const navHeight = nav ? nav.offsetHeight : 0;
                            const targetPosition = target.offsetTop - navHeight;
                            
                            window.scrollTo({
                                top: targetPosition,
                                behavior: "smooth",
                            });
                        }
                    }
                    // Close hamburger menu after navigation
                    closeHamburgerMenu();
                }
            });
        });

        // Close menu when clicking on regular nav links (mobile)
        const regularNavLinks = document.querySelectorAll(".nav-menu > li > a:not(.nav-dropdown-trigger)");
        regularNavLinks.forEach((link) => {
            link.addEventListener("click", () => {
                if (window.innerWidth <= 768) {
                    closeHamburgerMenu();
                }
            });
        });

        // Close menu when clicking outside (mobile)
        document.addEventListener("click", (e) => {
            if (window.innerWidth <= 768) {
                const isClickInsideNav = navMenu.contains(e.target);
                const isClickOnHamburger = hamburger.contains(e.target);
                
                if (!isClickInsideNav && !isClickOnHamburger && navMenu.classList.contains("active")) {
                    closeHamburgerMenu();
                }
            }
        });
    }
});
