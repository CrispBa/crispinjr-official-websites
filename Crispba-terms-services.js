// Terms of Service Application JavaScript

document.addEventListener('DOMContentLoaded', () => {
    // DOM Elements
    const header = document.getElementById('header');
    const tocSidebar = document.getElementById('tocSidebar');
    const tocToggle = document.getElementById('tocToggle');
    const mainContent = document.getElementById('mainContent');
    const backToTop = document.getElementById('backToTop');
    const readingProgress = document.getElementById('readingProgress');
    const tocLinks = document.querySelectorAll('.toc-link');
    const sections = document.querySelectorAll('.terms-section');

    // Header scroll effect
    let lastScroll = 0;
    window.addEventListener('scroll', () => {
        const currentScroll = window.pageYOffset;
        
        if (currentScroll > 100) {
            header.classList.add('scrolled');
        } else {
            header.classList.remove('scrolled');
        }

        lastScroll = currentScroll;

        // Back to top button visibility
        if (currentScroll > 500) {
            backToTop.classList.add('visible');
        } else {
            backToTop.classList.remove('visible');
        }

        // Update reading progress
        updateReadingProgress();

        // Update active TOC link
        updateActiveTocLink();

        // Animate sections on scroll
        animateSectionsOnScroll();
    });

    // TOC Toggle functionality
    tocToggle.addEventListener('click', () => {
        tocSidebar.classList.toggle('show');
        tocSidebar.classList.toggle('hidden');
        mainContent.classList.toggle('full-width');
        
        // Update icon
        const icon = tocToggle.querySelector('i');
        if (tocSidebar.classList.contains('show')) {
            icon.classList.remove('fa-bars');
            icon.classList.add('fa-times');
        } else {
            icon.classList.remove('fa-times');
            icon.classList.add('fa-bars');
        }
    });

    // Smooth scroll for TOC links
    tocLinks.forEach(link => {
        link.addEventListener('click', (e) => {
            e.preventDefault();
            const targetId = link.getAttribute('href');
            const targetSection = document.querySelector(targetId);
            
            if (targetSection) {
                const offsetTop = targetSection.offsetTop - 100;
                window.scrollTo({
                    top: offsetTop,
                    behavior: 'smooth'
                });

                // Close mobile TOC
                if (window.innerWidth <= 1023) {
                    tocSidebar.classList.remove('show');
                    tocSidebar.classList.add('hidden');
                    mainContent.classList.add('full-width');
                    const icon = tocToggle.querySelector('i');
                    icon.classList.remove('fa-times');
                    icon.classList.add('fa-bars');
                }
            }
        });
    });

    // Back to top functionality
    backToTop.addEventListener('click', () => {
        window.scrollTo({
            top: 0,
            behavior: 'smooth'
        });
    });

    // Update reading progress
    function updateReadingProgress() {
        const windowHeight = window.innerHeight;
        const documentHeight = document.documentElement.scrollHeight - windowHeight;
        const scrolled = window.pageYOffset;
        const progress = (scrolled / documentHeight) * 100;
        readingProgress.style.width = progress + '%';
    }

    // Update active TOC link based on scroll position
    function updateActiveTocLink() {
        let currentSection = '';
        
        sections.forEach(section => {
            const sectionTop = section.offsetTop - 150;
            const sectionHeight = section.offsetHeight;
            const scrollPosition = window.pageYOffset;
            
            if (scrollPosition >= sectionTop && scrollPosition < sectionTop + sectionHeight) {
                currentSection = section.getAttribute('id');
            }
        });

        tocLinks.forEach(link => {
            link.classList.remove('active');
            if (link.getAttribute('href') === '#' + currentSection) {
                link.classList.add('active');
            }
        });
    }

    // Animate sections on scroll
    function animateSectionsOnScroll() {
        sections.forEach(section => {
            const sectionTop = section.getBoundingClientRect().top;
            const windowHeight = window.innerHeight;
            
            if (sectionTop < windowHeight * 0.8) {
                section.classList.add('visible');
            }
        });
    }

    // Initialize on page load
    function initialize() {
        // Initial reading progress
        updateReadingProgress();
        
        // Initial active TOC link
        updateActiveTocLink();
        
        // Initial section visibility check
        animateSectionsOnScroll();

        // Set first TOC link as active initially
        if (tocLinks.length > 0 && window.pageYOffset === 0) {
            tocLinks[0].classList.add('active');
        }
    }

    // Run initialization
    initialize();

    // Handle window resize
    let resizeTimer;
    window.addEventListener('resize', () => {
        clearTimeout(resizeTimer);
        resizeTimer = setTimeout(() => {
            // Reset TOC sidebar on desktop
            if (window.innerWidth > 1023) {
                tocSidebar.classList.remove('show', 'hidden');
                mainContent.classList.remove('full-width');
                const icon = tocToggle.querySelector('i');
                icon.classList.remove('fa-times');
                icon.classList.add('fa-bars');
            } else {
                // Ensure TOC is hidden on mobile
                if (!tocSidebar.classList.contains('show')) {
                    tocSidebar.classList.add('hidden');
                    mainContent.classList.add('full-width');
                }
            }
        }, 250);
    });

    // Add hover effects to definition items with stagger
    const definitionItems = document.querySelectorAll('.definition-item');
    definitionItems.forEach((item, index) => {
        item.style.animationDelay = `${index * 0.1}s`;
    });

    // Add parallax effect to hero section
    const hero = document.querySelector('.hero');
    if (hero) {
        window.addEventListener('scroll', () => {
            const scrolled = window.pageYOffset;
            hero.style.transform = `translateY(${scrolled * 0.5}px)`;
        });
    }

    // Add shimmer effect to section cards on hover
    const sectionCards = document.querySelectorAll('.section-card');
    sectionCards.forEach(card => {
        card.addEventListener('mouseenter', () => {
            const icon = card.querySelector('.section-icon');
            if (icon) {
                icon.style.animation = 'bounce 1s ease-in-out infinite';
            }
        });
        
        card.addEventListener('mouseleave', () => {
            const icon = card.querySelector('.section-icon');
            if (icon) {
                icon.style.animation = '';
            }
        });
    });

    // Social link animations
    const socialLinks = document.querySelectorAll('.social-link');
    socialLinks.forEach(link => {
        link.addEventListener('mouseenter', () => {
            link.style.animation = 'bounce 0.5s ease';
        });
        
        link.addEventListener('mouseleave', () => {
            setTimeout(() => {
                link.style.animation = '';
            }, 500);
        });
    });

    // Add ripple effect on button clicks
    function createRipple(event) {
        const button = event.currentTarget;
        const ripple = document.createElement('span');
        const rect = button.getBoundingClientRect();
        const size = Math.max(rect.width, rect.height);
        const x = event.clientX - rect.left - size / 2;
        const y = event.clientY - rect.top - size / 2;

        ripple.style.width = ripple.style.height = size + 'px';
        ripple.style.left = x + 'px';
        ripple.style.top = y + 'px';
        ripple.classList.add('ripple');

        button.appendChild(ripple);

        setTimeout(() => {
            ripple.remove();
        }, 600);
    }

    // Add ripple to back to top button
    backToTop.addEventListener('click', createRipple);

    // Keyboard navigation for TOC
    document.addEventListener('keydown', (e) => {
        // Press 'T' to toggle TOC
        if (e.key === 't' || e.key === 'T') {
            if (window.innerWidth <= 1023) {
                tocToggle.click();
            }
        }
        
        // Press 'Escape' to close TOC on mobile
        if (e.key === 'Escape') {
            if (window.innerWidth <= 1023 && tocSidebar.classList.contains('show')) {
                tocToggle.click();
            }
        }
    });

    // Close TOC when clicking outside on mobile
    document.addEventListener('click', (e) => {
        if (window.innerWidth <= 1023) {
            if (tocSidebar.classList.contains('show') && 
                !tocSidebar.contains(e.target) && 
                !tocToggle.contains(e.target)) {
                tocToggle.click();
            }
        }
    });

    // Add loading animation completion
    window.addEventListener('load', () => {
        document.body.classList.add('loaded');
        
        // Trigger initial animations
        setTimeout(() => {
            animateSectionsOnScroll();
        }, 100);
    });

    // Print functionality
    window.addEventListener('beforeprint', () => {
        // Expand all sections for printing
        sections.forEach(section => {
            section.classList.add('visible');
        });
    });

    // Performance optimization: Throttle scroll events
    function throttle(func, wait) {
        let timeout;
        return function executedFunction(...args) {
            const later = () => {
                clearTimeout(timeout);
                func(...args);
            };
            clearTimeout(timeout);
            timeout = setTimeout(later, wait);
        };
    }

    // Apply throttling to scroll-heavy functions
    const throttledScroll = throttle(() => {
        updateReadingProgress();
        updateActiveTocLink();
        animateSectionsOnScroll();
    }, 50);

    window.addEventListener('scroll', throttledScroll);

    console.log('CrispBa Terms of Service - Premium Edition Loaded ✨');
});