// ========================================
// STORIE DI DIGNITÀ - SLAY DOCUMENTARY
// Main JavaScript File
// ========================================

// Run immediately when DOM is ready
document.addEventListener('DOMContentLoaded', () => {
    // Reset scroll position on page load for consistent experience
    if ('scrollRestoration' in history) {
        history.scrollRestoration = 'manual';
    }
    
    // Force scroll to top on fresh page load (not on hash navigation)
    if (!window.location.hash) {
        window.scrollTo(0, 0);
    }
    
    // Initialize all modules
    initCursorGlow();
    initNavbar();
    initMobileMenu();
    initTabs();
    initScrollAnimations();
    initPledge();
    initSmoothScroll();
});

// Also handle page show event (for back/forward navigation)
window.addEventListener('pageshow', (event) => {
    if (event.persisted) {
        // Page was restored from cache (back/forward)
        initScrollAnimations();
    }
});

// ========================================
// CURSOR GLOW EFFECT
// ========================================
function initCursorGlow() {
    const cursor = document.querySelector('.cursor-glow');
    
    if (!cursor) return;
    
    // Hide cursor effect on touch devices
    const isTouchDevice = window.matchMedia('(pointer: coarse)').matches || 
                          'ontouchstart' in window || 
                          navigator.maxTouchPoints > 0;
    
    if (isTouchDevice) {
        cursor.style.display = 'none';
        return;
    }

    let mouseX = 0;
    let mouseY = 0;
    let cursorX = 0;
    let cursorY = 0;
    let rafId = null;

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
        
        rafId = requestAnimationFrame(animateCursor);
    }

    animateCursor();
    
    // Cleanup on page hide
    document.addEventListener('visibilitychange', () => {
        if (document.hidden && rafId) {
            cancelAnimationFrame(rafId);
        } else if (!document.hidden) {
            animateCursor();
        }
    });
}

// ========================================
// NAVBAR SCROLL EFFECT
// ========================================
function initNavbar() {
    const navbar = document.querySelector('.navbar');
    if (!navbar) return;
    
    let ticking = false;
    
    // Check initial scroll position
    if (window.pageYOffset > 50) {
        navbar.classList.add('scrolled');
    }
    
    window.addEventListener('scroll', () => {
        if (!ticking) {
            requestAnimationFrame(() => {
                const currentScroll = window.pageYOffset || document.documentElement.scrollTop;
                
                if (currentScroll > 50) {
                    navbar.classList.add('scrolled');
                } else {
                    navbar.classList.remove('scrolled');
                }
                
                ticking = false;
            });
            ticking = true;
        }
    }, { passive: true });
}

// ========================================
// MOBILE MENU
// ========================================
function initMobileMenu() {
    const toggle = document.querySelector('.nav-toggle');
    const navLinks = document.querySelector('.nav-links');
    const links = document.querySelectorAll('.nav-links a');
    
    if (!toggle || !navLinks) return;
    
    function closeMenu() {
        toggle.classList.remove('active');
        navLinks.classList.remove('active');
        document.body.style.overflow = '';
    }
    
    toggle.addEventListener('click', () => {
        const isActive = navLinks.classList.contains('active');
        
        if (isActive) {
            closeMenu();
        } else {
            toggle.classList.add('active');
            navLinks.classList.add('active');
            document.body.style.overflow = 'hidden';
        }
    });
    
    // Close menu when clicking a link
    links.forEach(link => {
        link.addEventListener('click', closeMenu);
    });
    
    // Close menu on escape key
    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape' && navLinks.classList.contains('active')) {
            closeMenu();
        }
    });
    
    // Close menu when clicking outside
    document.addEventListener('click', (e) => {
        if (navLinks.classList.contains('active') && 
            !navLinks.contains(e.target) && 
            !toggle.contains(e.target)) {
            closeMenu();
        }
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
            
            // Update content visibility with animation
            tabContents.forEach(content => {
                if (content.id === targetTab) {
                    content.classList.add('active');
                    // Re-trigger animation for items inside
                    const items = content.querySelectorAll('.impact-list li');
                    items.forEach((item, i) => {
                        item.style.opacity = '0';
                        item.style.transform = 'translateX(-10px)';
                        setTimeout(() => {
                            item.style.transition = 'opacity 0.3s ease, transform 0.3s ease';
                            item.style.opacity = '1';
                            item.style.transform = 'translateX(0)';
                        }, i * 50);
                    });
                } else {
                    content.classList.remove('active');
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
    
    // Check if element is in viewport
    function isInViewport(element) {
        const rect = element.getBoundingClientRect();
        const windowHeight = window.innerHeight || document.documentElement.clientHeight;
        // Element is considered visible if any part of it is in the viewport
        return rect.top < windowHeight && rect.bottom > 0;
    }
    
    // Make element visible
    function makeVisible(element) {
        element.classList.add('visible');
    }
    
    // Immediately check all elements and make visible those already in viewport
    function checkAllElements() {
        animatedElements.forEach(element => {
            if (isInViewport(element)) {
                makeVisible(element);
            }
        });
    }
    
    // Run immediately on init
    checkAllElements();
    
    // Also run after a small delay to catch any late-loading elements
    requestAnimationFrame(() => {
        checkAllElements();
    });
    
    // Set up IntersectionObserver for future scroll
    if ('IntersectionObserver' in window) {
        const observerOptions = {
            root: null,
            rootMargin: '50px 0px',
            threshold: 0.1
        };
        
        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    makeVisible(entry.target);
                }
            });
        }, observerOptions);
        
        animatedElements.forEach(element => {
            // Only observe elements that aren't already visible
            if (!element.classList.contains('visible')) {
                observer.observe(element);
            }
        });
    } else {
        // Fallback for older browsers - make all elements visible
        animatedElements.forEach(element => {
            makeVisible(element);
        });
    }
    
    // Also check on scroll (fallback for any missed elements)
    let scrollTimeout;
    window.addEventListener('scroll', () => {
        if (scrollTimeout) clearTimeout(scrollTimeout);
        scrollTimeout = setTimeout(checkAllElements, 100);
    }, { passive: true });
}

// ========================================
// PLEDGE FUNCTIONALITY
// ========================================
function initPledge() {
    const pledgeButton = document.getElementById('savePledge');
    const pledgeOptions = document.querySelectorAll('.pledge-option input');
    
    if (!pledgeButton) return;
    
    // Load saved pledges from localStorage
    try {
        const savedPledges = JSON.parse(localStorage.getItem('slay-pledges') || '[]');
        
        pledgeOptions.forEach((option, index) => {
            if (savedPledges.includes(index)) {
                option.checked = true;
            }
        });
    } catch (e) {
        console.log('LocalStorage not available');
    }
    
    pledgeButton.addEventListener('click', () => {
        const selectedPledges = [];
        const pledgeTexts = [];
        
        pledgeOptions.forEach((option, index) => {
            if (option.checked) {
                selectedPledges.push(index);
                const text = option.parentElement.querySelector('.pledge-text');
                if (text) pledgeTexts.push(text.textContent);
            }
        });
        
        if (selectedPledges.length === 0) {
            // Shake animation for empty selection
            pledgeButton.style.animation = 'shake 0.5s ease';
            setTimeout(() => pledgeButton.style.animation = '', 500);
            return;
        }
        
        // Save to localStorage
        try {
            localStorage.setItem('slay-pledges', JSON.stringify(selectedPledges));
        } catch (e) {
            console.log('Could not save to localStorage');
        }
        
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
    
    // Add shake animation keyframes dynamically if not exists
    if (!document.querySelector('#shake-animation')) {
        const style = document.createElement('style');
        style.id = 'shake-animation';
        style.textContent = `
            @keyframes shake {
                0%, 100% { transform: translateX(0); }
                20%, 60% { transform: translateX(-5px); }
                40%, 80% { transform: translateX(5px); }
            }
        `;
        document.head.appendChild(style);
    }
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
            
            const target = document.querySelector(href);
            if (!target) return;
            
            e.preventDefault();
            
            const navbar = document.querySelector('.navbar');
            const navbarHeight = navbar ? navbar.offsetHeight : 0;
            const targetPosition = target.getBoundingClientRect().top + window.pageYOffset - navbarHeight - 20;
            
            // Use scrollTo with behavior smooth, with fallback
            if ('scrollBehavior' in document.documentElement.style) {
                window.scrollTo({
                    top: targetPosition,
                    behavior: 'smooth'
                });
            } else {
                // Fallback for older browsers
                smoothScrollTo(targetPosition, 500);
            }
        });
    });
}

// Smooth scroll fallback function
function smoothScrollTo(targetPosition, duration) {
    const startPosition = window.pageYOffset;
    const distance = targetPosition - startPosition;
    let startTime = null;
    
    function animation(currentTime) {
        if (startTime === null) startTime = currentTime;
        const timeElapsed = currentTime - startTime;
        const progress = Math.min(timeElapsed / duration, 1);
        
        // Easing function
        const ease = progress < 0.5 
            ? 2 * progress * progress 
            : 1 - Math.pow(-2 * progress + 2, 2) / 2;
        
        window.scrollTo(0, startPosition + distance * ease);
        
        if (timeElapsed < duration) {
            requestAnimationFrame(animation);
        }
    }
    
    requestAnimationFrame(animation);
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
// ACCESSIBILITY ENHANCEMENTS
// ========================================
// Respect user's motion preferences
if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
    document.documentElement.style.setProperty('--transition-slow', '0.01s');
    document.documentElement.style.setProperty('--transition-medium', '0.01s');
    
    // Make all animated elements visible immediately
    document.addEventListener('DOMContentLoaded', () => {
        const animatedElements = document.querySelectorAll(
            '.problema-card, .action-card, .alternative-card, .domanda-box, .habit-item, .material-item'
        );
        animatedElements.forEach(el => el.classList.add('visible'));
    });
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
console.log('%c🌿 Slay Documentary - Storie di Dignità', 
    'font-size: 20px; font-weight: bold; color: #c9a227;');
console.log('%cLa moda etica è possibile. Fai la tua parte!', 
    'font-size: 14px; color: #2d5a27;');
