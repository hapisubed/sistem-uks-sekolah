/**
 * Navigation Enhancement Script for Sistem UKS Sekolah
 * Handles responsive navigation behavior and active state management
 */

document.addEventListener('DOMContentLoaded', function() {
    // Initialize navigation
    initializeNavigation();
    
    // Handle responsive behavior
    handleResponsiveNavigation();
    
    // Add accessibility features
    enhanceAccessibility();
});

/**
 * Initialize navigation functionality
 */
function initializeNavigation() {
    // Get current page from URL
    const currentPage = getCurrentPage();
    
    // Update active states
    updateActiveStates(currentPage);
    
    // Add click handlers for smooth transitions
    addNavigationHandlers();
}

/**
 * Get current page name from URL
 */
function getCurrentPage() {
    const path = window.location.pathname;
    const page = path.split('/').pop() || 'index.html';
    return page;
}

/**
 * Update active states for navigation links
 */
function updateActiveStates(currentPage) {
    // Remove all active classes
    document.querySelectorAll('.nav-link').forEach(link => {
        link.classList.remove('active');
        link.removeAttribute('aria-current');
    });
    
    // Add active class to current page links
    const currentLinks = document.querySelectorAll(`a[href="${currentPage}"], a[href="./${currentPage}"]`);
    currentLinks.forEach(link => {
        link.classList.add('active');
        link.setAttribute('aria-current', 'page');
    });
    
    // Update badges
    updateNavigationBadges(currentPage);
}

/**
 * Update navigation badges based on current page
 */
function updateNavigationBadges(currentPage) {
    // Remove all existing badges
    document.querySelectorAll('.sidebar .badge').forEach(badge => {
        badge.remove();
    });
    
    // Add appropriate badge to current page
    const sidebarLinks = document.querySelectorAll('.sidebar .nav-link.active');
    sidebarLinks.forEach(link => {
        const badge = document.createElement('span');
        badge.className = 'badge bg-primary ms-auto';
        badge.textContent = 'Active';
        link.appendChild(badge);
    });
    
    // Special case for dashboard
    if (currentPage === 'index.html') {
        const dashboardLink = document.querySelector('.sidebar a[href="index.html"]');
        if (dashboardLink && dashboardLink.classList.contains('active')) {
            const badge = dashboardLink.querySelector('.badge');
            if (badge) {
                badge.textContent = 'Home';
            }
        }
    }
}

/**
 * Add navigation click handlers
 */
function addNavigationHandlers() {
    document.querySelectorAll('.nav-link').forEach(link => {
        link.addEventListener('click', function(e) {
            // Add loading state
            if (!this.classList.contains('active')) {
                this.style.opacity = '0.7';
                
                // Add loading indicator
                const icon = this.querySelector('i');
                if (icon) {
                    icon.className = 'bi bi-arrow-clockwise me-2 loading';
                }
            }
        });
    });
}

/**
 * Handle responsive navigation behavior
 */
function handleResponsiveNavigation() {
    const navbar = document.querySelector('.navbar');
    const navbarToggler = document.querySelector('.navbar-toggler');
    const navbarCollapse = document.querySelector('.navbar-collapse');
    
    if (navbarToggler && navbarCollapse) {
        // Close mobile menu when clicking on a link
        document.querySelectorAll('.navbar-nav .nav-link').forEach(link => {
            link.addEventListener('click', () => {
                if (window.innerWidth < 992) {
                    const bsCollapse = new bootstrap.Collapse(navbarCollapse, {
                        toggle: false
                    });
                    bsCollapse.hide();
                }
            });
        });
        
        // Handle navbar collapse state
        navbarCollapse.addEventListener('show.bs.collapse', function() {
            navbarToggler.setAttribute('aria-expanded', 'true');
        });
        
        navbarCollapse.addEventListener('hide.bs.collapse', function() {
            navbarToggler.setAttribute('aria-expanded', 'false');
        });
    }
    
    // Handle window resize
    window.addEventListener('resize', debounce(function() {
        if (window.innerWidth >= 992 && navbarCollapse) {
            navbarCollapse.classList.remove('show');
            navbarToggler.setAttribute('aria-expanded', 'false');
        }
    }, 250));
}

/**
 * Enhance accessibility features
 */
function enhanceAccessibility() {
    // Add keyboard navigation
    document.querySelectorAll('.nav-link').forEach(link => {
        link.addEventListener('keydown', function(e) {
            if (e.key === 'Enter' || e.key === ' ') {
                e.preventDefault();
                this.click();
            }
        });
    });
    
    // Add focus indicators
    document.querySelectorAll('.nav-link').forEach(link => {
        link.addEventListener('focus', function() {
            this.style.outline = '2px solid var(--health-primary)';
            this.style.outlineOffset = '2px';
        });
        
        link.addEventListener('blur', function() {
            this.style.outline = '';
            this.style.outlineOffset = '';
        });
    });
    
    // Add ARIA labels for better screen reader support
    const navbarBrand = document.querySelector('.navbar-brand');
    if (navbarBrand) {
        navbarBrand.setAttribute('aria-label', 'Sistem UKS Sekolah - Kembali ke Dashboard');
    }
    
    // Add role and aria-label to sidebar
    const sidebar = document.querySelector('.sidebar');
    if (sidebar) {
        sidebar.setAttribute('role', 'navigation');
        sidebar.setAttribute('aria-label', 'Menu navigasi utama');
    }
}

/**
 * Debounce function for performance optimization
 */
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

/**
 * Show loading state for navigation
 */
function showNavigationLoading(element) {
    element.style.opacity = '0.7';
    const icon = element.querySelector('i');
    if (icon) {
        icon.className = 'bi bi-arrow-clockwise me-2';
        icon.style.animation = 'spin 1s linear infinite';
    }
}

/**
 * Hide loading state for navigation
 */
function hideNavigationLoading(element) {
    element.style.opacity = '1';
    const icon = element.querySelector('i');
    if (icon) {
        icon.style.animation = '';
    }
}

// Add CSS for loading animation
const style = document.createElement('style');
style.textContent = `
    @keyframes spin {
        from { transform: rotate(0deg); }
        to { transform: rotate(360deg); }
    }
    
    .loading {
        animation: spin 1s linear infinite;
    }
`;
document.head.appendChild(style);