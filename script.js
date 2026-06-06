/* ========================================
   ARAFAT.ME - INTERACTIVE JAVASCRIPT
   ======================================== */

// ========================================
// DOM ELEMENTS
// ========================================

const navToggle = document.querySelector('.nav-toggle');
const navMenu = document.getElementById('navMenu');
const navLinks = document.querySelectorAll('.nav-link');
const rotating3d = document.getElementById('rotating3d');
const contactForm = document.getElementById('contactForm');

// ========================================
// INITIALIZATION
// ========================================

document.addEventListener('DOMContentLoaded', () => {
    initializeEventListeners();
    initializeSmoothScroll();
    initializeScrollAnimations();
    updateActiveNavLink();
    console.log('🎨 Arafat.me Portfolio Loaded');
});

// ========================================
// NAVIGATION
// ========================================

function initializeEventListeners() {
    // Mobile menu toggle
    if (navToggle) {
        navToggle.addEventListener('click', toggleMobileMenu);
    }

    // Navigation links
    navLinks.forEach(link => {
        link.addEventListener('click', (e) => {
            e.preventDefault();
            const targetId = link.getAttribute('href').substring(1);
            navigateToSection(targetId);
        });
    });

    // Contact form
    if (contactForm) {
        contactForm.addEventListener('submit', handleContactSubmit);
    }

    // Scroll events
    window.addEventListener('scroll', updateActiveNavLink);
    window.addEventListener('scroll', handleScrollAnimations);
}

function toggleMobileMenu() {
    navMenu.classList.toggle('active');
    navToggle.classList.toggle('active');
}

function navigateToSection(sectionId) {
    const element = document.getElementById(sectionId);
    if (element) {
        element.scrollIntoView({ behavior: 'smooth' });
        navMenu.classList.remove('active');
        navToggle.classList.remove('active');
    }
}

// ========================================
// SMOOTH SCROLL
// ========================================

function initializeSmoothScroll() {
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            const href = this.getAttribute('href');
            if (href !== '#' && document.querySelector(href)) {
                e.preventDefault();
                document.querySelector(href).scrollIntoView({
                    behavior: 'smooth',
                    block: 'start'
                });
            }
        });
    });
}

// ========================================
// SCROLL ANIMATIONS
// ========================================

function initializeScrollAnimations() {
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.style.animation = `slideInUp 0.8s ease forwards`;
                entry.target.style.opacity = '1';
            }
        });
    }, {
        threshold: 0.1
    });

    document.querySelectorAll('[data-aos]').forEach(el => {
        el.style.opacity = '0';
        observer.observe(el);
    });
}

// ========================================
// ACTIVE NAV LINK
// ========================================

function updateActiveNavLink() {
    const scrollPosition = window.scrollY + 100;

    navLinks.forEach(link => {
        const href = link.getAttribute('href');
        const section = document.querySelector(href);

        if (section) {
            const sectionTop = section.offsetTop;
            const sectionHeight = section.offsetHeight;

            if (scrollPosition >= sectionTop && scrollPosition < sectionTop + sectionHeight) {
                navLinks.forEach(l => l.classList.remove('active'));
                link.classList.add('active');
            }
        }
    });
}

// ========================================
// SCROLL HANDLER
// ========================================

let scrollTimeout;
function handleScrollAnimations() {
    clearTimeout(scrollTimeout);
    
    scrollTimeout = setTimeout(() => {
        // Parallax effect
        const scrolled = window.scrollY;
        const hero = document.querySelector('.hero');
        if (hero) {
            hero.style.transform = `translateY(${scrolled * 0.5}px)`;
        }

        // Update scroll indicator
        const scrollIndicator = document.getElementById('scrollIndicator');
        if (scrollIndicator && scrolled > 100) {
            scrollIndicator.style.opacity = '0';
            scrollIndicator.style.pointerEvents = 'none';
        } else if (scrollIndicator) {
            scrollIndicator.style.opacity = '1';
            scrollIndicator.style.pointerEvents = 'auto';
        }
    }, 10);
}

// ========================================
// HERO TITLE ANIMATION
// ========================================

function animateHeroTitle() {
    const titleWords = document.querySelectorAll('.title-word');
    titleWords.forEach((word, index) => {
        word.style.animation = `wordPop 0.6s ease backwards`;
        word.style.animationDelay = `${index * 0.2 + 0.2}s`;
    });
}

// Call on load
window.addEventListener('load', animateHeroTitle);

// ========================================
// 3D ROTATION CONTROL
// ========================================

let mouseX = 0;
let mouseY = 0;

document.addEventListener('mousemove', (e) => {
    if (!rotating3d) return;

    mouseX = (e.clientX / window.innerWidth - 0.5) * 20;
    mouseY = (e.clientY / window.innerHeight - 0.5) * 20;

    rotating3d.style.transform = `
        rotateX(${mouseY}deg)
        rotateY(${mouseX}deg)
    `;
});

// Reset on mouse leave
document.addEventListener('mouseleave', () => {
    if (rotating3d) {
        rotating3d.style.transform = 'rotateX(0deg) rotateY(0deg)';
    }
});

// ========================================
// CONTACT FORM
// ========================================

function handleContactSubmit(e) {
    e.preventDefault();

    const formInputs = contactForm.querySelectorAll('input, textarea');
    const name = formInputs[0].value.trim();
    const email = formInputs[1].value.trim();
    const message = formInputs[2].value.trim();

    if (!name || !email || !message) {
        showNotification('Please fill all fields', 'error');
        return;
    }

    if (!validateEmail(email)) {
        showNotification('Invalid email address', 'error');
        return;
    }

    // Create mailto link
    const mailtoLink = `mailto:Aryanrifat1@gmail.com?subject=Portfolio Contact from ${name}&body=From: ${email}%0D%0A%0D%0A${message}`;
    window.location.href = mailtoLink;

    showNotification('Message sent! Opening email...', 'success');
    contactForm.reset();
}

function validateEmail(email) {
    const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return regex.test(email);
}

// ========================================
// NOTIFICATIONS
// ========================================

function showNotification(message, type = 'info') {
    const notification = document.createElement('div');
    notification.className = `notification notification-${type}`;
    notification.textContent = message;
    notification.style.cssText = `
        position: fixed;
        bottom: 20px;
        right: 20px;
        padding: 1rem 1.5rem;
        background: ${type === 'success' ? '#00ff00' : '#ff0000'};
        color: #000;
        border-radius: 4px;
        font-weight: 600;
        z-index: 9999;
        animation: slideInUp 0.4s ease;
    `;

    document.body.appendChild(notification);

    setTimeout(() => {
        notification.style.animation = 'slideOutDown 0.4s ease';
        setTimeout(() => notification.remove(), 400);
    }, 3000);
}

// ========================================
// SKILL BARS ANIMATION
// ========================================

function animateSkillBars() {
    const skillFills = document.querySelectorAll('.skill-fill');
    
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.style.animation = 'fillBar 1.5s ease-out forwards';
                observer.unobserve(entry.target);
            }
        });
    }, { threshold: 0.5 });

    skillFills.forEach(fill => observer.observe(fill));
}

window.addEventListener('load', animateSkillBars);

// ========================================
// PARALLAX EFFECT
// ========================================

function updateParallax() {
    const scrolled = window.scrollY;
    
    document.querySelectorAll('[data-parallax]').forEach(element => {
        const speed = element.getAttribute('data-parallax') || 0.5;
        element.style.transform = `translateY(${scrolled * speed}px)`;
    });
}

window.addEventListener('scroll', () => {
    requestAnimationFrame(updateParallax);
}, { passive: true });

// ========================================
// BUTTON INTERACTIONS
// ========================================

document.querySelectorAll('.btn-primary, .btn-secondary, .btn-outline').forEach(button => {
    button.addEventListener('mouseenter', function() {
        this.style.transform = 'scale(1.05)';
    });

    button.addEventListener('mouseleave', function() {
        this.style.transform = 'scale(1)';
    });
});

// ========================================
// CARD HOVER EFFECTS
// ========================================

document.querySelectorAll('.service-card, .work-card').forEach(card => {
    card.addEventListener('mouseenter', function() {
        this.style.transform = 'translateY(-10px)';
    });

    card.addEventListener('mouseleave', function() {
        this.style.transform = 'translateY(0)';
    });
});

// ========================================
// DYNAMIC TEXT EFFECTS
// ========================================

function typeWriterEffect(element, text, speed = 50) {
    let index = 0;
    element.textContent = '';

    function type() {
        if (index < text.length) {
            element.textContent += text.charAt(index);
            index++;
            setTimeout(type, speed);
        }
    }

    type();
}

// ========================================
// UTILITY FUNCTIONS
// ========================================

function debounce(func, wait) {
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

function throttle(func, limit) {
    let inThrottle;
    return function(...args) {
        if (!inThrottle) {
            func.apply(this, args);
            inThrottle = true;
            setTimeout(() => inThrottle = false, limit);
        }
    };
}

// ========================================
// LOCAL STORAGE
// ========================================

function saveToLocalStorage(key, value) {
    try {
        localStorage.setItem(key, JSON.stringify(value));
        return true;
    } catch (error) {
        console.error('Storage error:', error);
        return false;
    }
}

function getFromLocalStorage(key) {
    try {
        return JSON.parse(localStorage.getItem(key));
    } catch (error) {
        console.error('Storage error:', error);
        return null;
    }
}

// ========================================
// PAGE VISIBILITY
// ========================================

document.addEventListener('visibilitychange', () => {
    if (document.hidden) {
        console.log('Page hidden');
    } else {
        console.log('Page visible');
    }
});

// ========================================
// PERFORMANCE MONITORING
// ========================================

window.addEventListener('load', () => {
    if (window.performance) {
        const perfData = window.performance.timing;
        const pageLoadTime = perfData.loadEventEnd - perfData.navigationStart;
        console.log(`Page load time: ${pageLoadTime}ms`);
    }
});

// ========================================
// KEYBOARD SHORTCUTS
// ========================================

document.addEventListener('keydown', (e) => {
    // Escape to close mobile menu
    if (e.key === 'Escape' && navMenu.classList.contains('active')) {
        navMenu.classList.remove('active');
        navToggle.classList.remove('active');
    }

    // / to search (example)
    if (e.key === '/') {
        e.preventDefault();
        console.log('Search triggered');
    }
});

// ========================================
// ACCESSIBILITY
// ========================================

// Focus visible styles
document.addEventListener('keydown', (e) => {
    if (e.key === 'Tab') {
        document.body.classList.add('keyboard-nav');
    }
});

document.addEventListener('mousedown', () => {
    document.body.classList.remove('keyboard-nav');
});

// ========================================
// BROWSER COMPATIBILITY
// ========================================

if (!document.querySelector('.glass')) {
    console.warn('Glass morphism may not be supported in this browser');
}

// ========================================
// INITIALIZATION COMPLETE
// ========================================

console.log('✨ All interactive features initialized');
console.log('🎨 Ready for awesomeness!');
