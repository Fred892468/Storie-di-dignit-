// ========================================
// STORIE DI DIGNITÀ - SLAY DOCUMENTARY
// Main JavaScript File
// ========================================

document.addEventListener('DOMContentLoaded', () => {
    // Initialize all modules
    initCursorGlow();
    initNavbar();
    initMobileMenu();
    initTabs();
    initScrollAnimations();
    initPledge();
    initSmoothScroll();
});

// ========================================
// CURSOR GLOW EFFECT
// ========================================
function initCursorGlow() {
    const cursor = document.querySelector('.cursor-glow');
    
    if (!cursor || window.matchMedia('(pointer: coarse)').matches) {
        // Hide cursor effect on touch devices
        if (cursor) cursor.style.display = 'none';
        return;
    }

    let mouseX = 0;
    let mouseY = 0;
    let cursorX = 0;
    let cursorY = 0;

    document.addEventListener('mousemove', (e) => {
        mouseX = e.clientX;
        mouseY = e.clientY;
    });

    // Smooth cursor follow with lerp
    function animateCursor() {
        const speed = 0.15;
        cursorX += (mouseX - cursorX) * speed;
        cursorY += (mouseY - cursorY) * speed;
        
        cursor.style.left = cursorX + 'px';
        cursor.style.top = cursorY + 'px';
        
        requestAnimationFrame(animateCursor);
    }

    animateCursor();
}

// ========================================
// NAVBAR SCROLL EFFECT
// ========================================
function initNavbar() {
    const navbar = document.querySelector('.navbar');
    let lastScroll = 0;
    
    window.addEventListener('scroll', () => {
        const currentScroll = window.pageYOffset;
        
        // Add/remove scrolled class
        if (currentScroll > 50) {
            navbar.classList.add('scrolled');
        } else {
            navbar.classList.remove('scrolled');
        }
        
        // Hide/show navbar on scroll direction (optional, currently disabled)
        // if (currentScroll > lastScroll && currentScroll > 300) {
        //     navbar.style.transform = 'translateY(-100%)';
        // } else {
        //     navbar.style.transform = 'translateY(0)';
        // }
        
        lastScroll = currentScroll;
    });
}

// ========================================
// MOBILE MENU
// ========================================
function initMobileMenu() {
    const toggle = document.querySelector('.nav-toggle');
    const navLinks = document.querySelector('.nav-links');
    const links = document.querySelectorAll('.nav-links a');
    
    if (!toggle || !navLinks) return;
    
    toggle.addEventListener('click', () => {
        toggle.classList.toggle('active');
        navLinks.classList.toggle('active');
        document.body.style.overflow = navLinks.classList.contains('active') ? 'hidden' : '';
    });
    
    // Close menu when clicking a link
    links.forEach(link => {
        link.addEventListener('click', () => {
            toggle.classList.remove('active');
            navLinks.classList.remove('active');
            document.body.style.overflow = '';
        });
    });
}

// ========================================
// TABS FUNCTIONALITY
// ========================================
function initTabs() {
    const tabButtons = document.querySelectorAll('.tab-btn');
    const tabContents = document.querySelectorAll('.tab-content');
    
    if (!tabButtons.length) return;
    
    tabButtons.forEach(button => {
        button.addEventListener('click', () => {
            const targetTab = button.dataset.tab;
            
            // Update button states
            tabButtons.forEach(btn => btn.classList.remove('active'));
            button.classList.add('active');
            
            // Update content visibility
            tabContents.forEach(content => {
                content.classList.remove('active');
                if (content.id === targetTab) {
                    content.classList.add('active');
                }
            });
        });
    });
}

// ========================================
// SCROLL ANIMATIONS
// ========================================
function initScrollAnimations() {
    const animatedElements = document.querySelectorAll(
        '.problema-card, .action-card, .alternative-card, .domanda-box, .habit-item, .material-item'
    );
    
    if (!animatedElements.length) return;
    
    const observerOptions = {
        root: null,
        rootMargin: '0px 0px -10% 0px',
        threshold: 0.1
    };
    
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('visible');
                // Optional: unobserve after animation
                // observer.unobserve(entry.target);
            }
        });
    }, observerOptions);
    
    animatedElements.forEach(element => {
        observer.observe(element);
    });

    // Add visible class for elements already in view
    setTimeout(() => {
        animatedElements.forEach(element => {
            const rect = element.getBoundingClientRect();
            if (rect.top < window.innerHeight * 0.9) {
                element.classList.add('visible');
            }
        });
    }, 100);
}

// ========================================
// PLEDGE FUNCTIONALITY
// ========================================
function initPledge() {
    const pledgeButton = document.getElementById('savePledge');
    const pledgeOptions = document.querySelectorAll('.pledge-option input');
    
    if (!pledgeButton) return;
    
    // Load saved pledges from localStorage
    const savedPledges = JSON.parse(localStorage.getItem('slay-pledges') || '[]');
    
    pledgeOptions.forEach((option, index) => {
        if (savedPledges.includes(index)) {
            option.checked = true;
        }
    });
    
    pledgeButton.addEventListener('click', () => {
        const selectedPledges = [];
        const pledgeTexts = [];
        
        pledgeOptions.forEach((option, index) => {
            if (option.checked) {
                selectedPledges.push(index);
                const text = option.parentElement.querySelector('.pledge-text').textContent;
                pledgeTexts.push(text);
            }
        });
        
        if (selectedPledges.length === 0) {
            // Shake animation for empty selection
            pledgeButton.style.animation = 'shake 0.5s ease';
            setTimeout(() => pledgeButton.style.animation = '', 500);
            return;
        }
        
        // Save to localStorage
        localStorage.setItem('slay-pledges', JSON.stringify(selectedPledges));
        
        // Visual feedback
        const originalText = pledgeButton.innerHTML;
        pledgeButton.innerHTML = '<span>Impegno salvato! ✓</span>';
        pledgeButton.classList.add('success');
        
        setTimeout(() => {
            pledgeButton.innerHTML = originalText;
            pledgeButton.classList.remove('success');
        }, 2000);
        
        // Console log for demonstration
        console.log('Impegni salvati:', pledgeTexts);
    });
    
    // Add shake animation keyframes dynamically
    const style = document.createElement('style');
    style.textContent = `
        @keyframes shake {
            0%, 100% { transform: translateX(0); }
            20%, 60% { transform: translateX(-5px); }
            40%, 80% { transform: translateX(5px); }
        }
    `;
    document.head.appendChild(style);
}

// ========================================
// SMOOTH SCROLL
// ========================================
function initSmoothScroll() {
    const links = document.querySelectorAll('a[href^="#"]');
    
    links.forEach(link => {
        link.addEventListener('click', (e) => {
            const href = link.getAttribute('href');
            
            if (href === '#') return;
            
            e.preventDefault();
            
            const target = document.querySelector(href);
            if (!target) return;
            
            const navbarHeight = document.querySelector('.navbar').offsetHeight;
            const targetPosition = target.getBoundingClientRect().top + window.pageYOffset - navbarHeight;
            
            window.scrollTo({
                top: targetPosition,
                behavior: 'smooth'
            });
        });
    });
}

// ========================================
// COUNTER ANIMATION (Bonus)
// ========================================
function animateCounter(element, target, duration = 2000) {
    const start = 0;
    const increment = target / (duration / 16);
    let current = start;
    
    const timer = setInterval(() => {
        current += increment;
        if (current >= target) {
            element.textContent = formatNumber(target);
            clearInterval(timer);
        } else {
            element.textContent = formatNumber(Math.floor(current));
        }
    }, 16);
}

function formatNumber(num) {
    if (num >= 1000000000) {
        return (num / 1000000000).toFixed(1) + 'B';
    }
    if (num >= 1000000) {
        return (num / 1000000).toFixed(1) + 'M';
    }
    if (num >= 1000) {
        return (num / 1000).toFixed(1) + 'K';
    }
    return num.toString();
}

// ========================================
// PARALLAX EFFECT (Optional enhancement)
// ========================================
function initParallax() {
    const hero = document.querySelector('.hero-bg');
    
    if (!hero || window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
    
    window.addEventListener('scroll', () => {
        const scrolled = window.pageYOffset;
        const rate = scrolled * 0.5;
        
        hero.style.transform = `translateY(${rate}px)`;
    });
}

// ========================================
// ACCESSIBILITY ENHANCEMENTS
// ========================================
// Respect user's motion preferences
if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
    document.documentElement.style.setProperty('--transition-slow', '0s');
    document.documentElement.style.setProperty('--transition-medium', '0s');
    
    // Disable animations
    const style = document.createElement('style');
    style.textContent = `
        *, *::before, *::after {
            animation-duration: 0.01ms !important;
            animation-iteration-count: 1 !important;
            transition-duration: 0.01ms !important;
        }
    `;
    document.head.appendChild(style);
}

// Keyboard navigation for tabs
document.addEventListener('keydown', (e) => {
    if (e.target.classList.contains('tab-btn')) {
        const tabs = Array.from(document.querySelectorAll('.tab-btn'));
        const currentIndex = tabs.indexOf(e.target);
        
        if (e.key === 'ArrowRight' || e.key === 'ArrowDown') {
            e.preventDefault();
            const nextIndex = (currentIndex + 1) % tabs.length;
            tabs[nextIndex].focus();
            tabs[nextIndex].click();
        }
        
        if (e.key === 'ArrowLeft' || e.key === 'ArrowUp') {
            e.preventDefault();
            const prevIndex = (currentIndex - 1 + tabs.length) % tabs.length;
            tabs[prevIndex].focus();
            tabs[prevIndex].click();
        }
    }
});

// ========================================
// DEBUG / DEV HELPERS
// ========================================
// Uncomment to log scroll position
// window.addEventListener('scroll', () => console.log(window.pageYOffset));

console.log('%c🌿 Slay Documentary - Storie di Dignità', 
    'font-size: 20px; font-weight: bold; color: #c9a227;');
console.log('%cLa moda etica è possibile. Fai la tua parte!', 
    'font-size: 14px; color: #2d5a27;');

