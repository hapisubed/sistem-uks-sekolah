/**
 * Dashboard JavaScript Module
 * Handles dashboard functionality and data display
 */

document.addEventListener('DOMContentLoaded', function() {
    initializeDashboard();
});

/**
 * Initialize dashboard with enhanced loading
 */
async function initializeDashboard() {
    try {
        // Show page loading overlay
        showPageLoading('Memuat dashboard...');
        
        // Show skeleton loading for cards
        showSkeletonLoading();
        
        // Load dashboard statistics
        await loadDashboardStats();
        
        // Load notifications
        await loadNotifications();
        
        // Hide page loading
        hidePageLoading();
        
        // Show success toast
        showToast('Dashboard berhasil dimuat', 'success', 2000);
        
        // Set up auto-refresh (every 5 minutes)
        setInterval(async () => {
            try {
                await loadDashboardStats();
                await loadNotifications();
            } catch (error) {
                console.error('Auto-refresh failed:', error);
            }
        }, 5 * 60 * 1000);
        
    } catch (error) {
        console.error('Error initializing dashboard:', error);
        hidePageLoading();
        showToast('Gagal memuat dashboard', 'error');
        showAlert('Gagal memuat data dashboard. Silakan refresh halaman.', 'danger', 'notifikasi');
    }
}

/**
 * Show skeleton loading for dashboard cards
 */
function showSkeletonLoading() {
    const statCards = ['totalObat', 'pasienHariIni', 'stokRendah', 'obatKadaluarsa'];
    
    statCards.forEach(cardId => {
        const element = document.getElementById(cardId);
        if (element) {
            element.innerHTML = `
                <div class="skeleton skeleton-text" style="width: 60px; height: 2rem;"></div>
            `;
        }
    });
    
    // Show skeleton for notifications
    const notifikasiContainer = document.getElementById('notifikasi');
    if (notifikasiContainer) {
        notifikasiContainer.innerHTML = `
            <div class="skeleton skeleton-text"></div>
            <div class="skeleton skeleton-text"></div>
            <div class="skeleton skeleton-text" style="width: 70%;"></div>
        `;
    }
}

/**
 * Load dashboard statistics
 */
async function loadDashboardStats() {
    try {
        // Use API wrapper that switches between real and mock API
        const response = await api.getDashboardStats();
        
        if (response.success) {
            const stats = response.data;
            
            // Update statistics cards
            updateStatCard('totalObat', stats.totalObat);
            updateStatCard('pasienHariIni', stats.pasienHariIni);
            updateStatCard('stokRendah', stats.stokRendah);
            updateStatCard('obatKadaluarsa', stats.obatKadaluarsa);
            
        } else {
            throw new Error(response.message || 'Gagal memuat statistik');
        }
        
    } catch (error) {
        console.error('Error loading dashboard stats:', error);
        
        // Show error in stat cards
        updateStatCard('totalObat', 'Error');
        updateStatCard('pasienHariIni', 'Error');
        updateStatCard('stokRendah', 'Error');
        updateStatCard('obatKadaluarsa', 'Error');
        
        showAlert('Gagal memuat statistik dashboard', 'danger', 'notifikasi');
    }
}

/**
 * Update statistics card with animation
 * @param {string} cardId - Card element ID
 * @param {number|string} value - Value to display
 */
function updateStatCard(cardId, value) {
    const element = document.getElementById(cardId);
    if (element) {
        hideLoading(cardId);
        
        // Add counter animation for numbers
        if (typeof value === 'number') {
            animateCounter(element, 0, value, 1000);
        } else {
            element.textContent = value;
        }
        
        // Add pulse animation effect
        element.parentElement.parentElement.parentElement.style.transform = 'scale(1.02)';
        setTimeout(() => {
            element.parentElement.parentElement.parentElement.style.transform = 'scale(1)';
        }, 300);
    }
}

/**
 * Animate counter from start to end value
 * @param {HTMLElement} element - Element to animate
 * @param {number} start - Start value
 * @param {number} end - End value
 * @param {number} duration - Animation duration in ms
 */
function animateCounter(element, start, end, duration) {
    const startTime = performance.now();
    const difference = end - start;
    
    function updateCounter(currentTime) {
        const elapsed = currentTime - startTime;
        const progress = Math.min(elapsed / duration, 1);
        
        // Use easing function for smooth animation
        const easeOutQuart = 1 - Math.pow(1 - progress, 4);
        const currentValue = Math.floor(start + (difference * easeOutQuart));
        
        element.textContent = currentValue;
        
        if (progress < 1) {
            requestAnimationFrame(updateCounter);
        } else {
            element.textContent = end; // Ensure final value is exact
        }
    }
    
    requestAnimationFrame(updateCounter);
}

/**
 * Load notifications
 */
async function loadNotifications() {
    try {
        // Use API wrapper that switches between real and mock API
        const response = await api.getNotifications();
        
        if (response.success) {
            const notifications = response.data;
            displayNotifications(notifications);
        } else {
            throw new Error(response.message || 'Gagal memuat notifikasi');
        }
        
    } catch (error) {
        console.error('Error loading notifications:', error);
        
        const notifikasiContainer = document.getElementById('notifikasi');
        if (notifikasiContainer) {
            notifikasiContainer.innerHTML = `
                <div class="alert alert-danger" role="alert">
                    <i class="bi bi-exclamation-triangle me-2"></i>
                    Gagal memuat notifikasi sistem
                </div>
            `;
        }
    }
}

/**
 * Display notifications with enhanced styling
 * @param {Array} notifications - Array of notification objects
 */
function displayNotifications(notifications) {
    const container = document.getElementById('notifikasi');
    if (!container) return;
    
    container.innerHTML = '';
    
    if (notifications.length === 0) {
        container.innerHTML = `
            <div class="alert alert-success d-flex align-items-center" role="alert">
                <i class="bi bi-check-circle-fill me-2"></i>
                <div>
                    <strong>Sistem Normal</strong><br>
                    <small>Tidak ada notifikasi penting saat ini</small>
                </div>
            </div>
        `;
        return;
    }
    
    // Group notifications by type
    const groupedNotifications = {
        danger: notifications.filter(n => n.type === 'danger'),
        warning: notifications.filter(n => n.type === 'warning'),
        info: notifications.filter(n => n.type === 'info'),
        success: notifications.filter(n => n.type === 'success')
    };
    
    // Display critical notifications first
    ['danger', 'warning', 'info', 'success'].forEach(type => {
        if (groupedNotifications[type].length > 0) {
            groupedNotifications[type].forEach((notification, index) => {
                const alertDiv = document.createElement('div');
                alertDiv.className = `alert alert-${notification.type} d-flex align-items-start mb-2`;
                alertDiv.style.animationDelay = `${index * 100}ms`;
                alertDiv.classList.add('fade-in');
                
                let icon = 'bi-info-circle-fill';
                let title = 'Informasi';
                
                switch (notification.type) {
                    case 'success':
                        icon = 'bi-check-circle-fill';
                        title = 'Berhasil';
                        break;
                    case 'warning':
                        icon = 'bi-exclamation-triangle-fill';
                        title = 'Peringatan';
                        break;
                    case 'danger':
                        icon = 'bi-x-circle-fill';
                        title = 'Penting';
                        break;
                    default:
                        icon = 'bi-info-circle-fill';
                        title = 'Informasi';
                }
                
                alertDiv.innerHTML = `
                    <i class="bi ${icon} me-2 mt-1"></i>
                    <div class="flex-grow-1">
                        <strong>${title}</strong><br>
                        ${notification.message}
                        <small class="d-block mt-1 opacity-75">
                            ${formatNotificationTime(notification.timestamp)}
                        </small>
                    </div>
                `;
                
                container.appendChild(alertDiv);
            });
        }
    });
}

/**
 * Format notification timestamp
 * @param {string} timestamp - ISO timestamp string
 * @returns {string} Formatted time
 */
function formatNotificationTime(timestamp) {
    const date = new Date(timestamp);
    const now = new Date();
    const diffMs = now - date;
    const diffMins = Math.floor(diffMs / 60000);
    
    if (diffMins < 1) {
        return 'Baru saja';
    } else if (diffMins < 60) {
        return `${diffMins} menit yang lalu`;
    } else if (diffMins < 1440) {
        const diffHours = Math.floor(diffMins / 60);
        return `${diffHours} jam yang lalu`;
    } else {
        return date.toLocaleDateString('id-ID', {
            day: 'numeric',
            month: 'short',
            hour: '2-digit',
            minute: '2-digit'
        });
    }
}

/**
 * Refresh dashboard data
 */
async function refreshDashboard() {
    const refreshBtn = document.querySelector('.btn-outline-secondary');
    if (refreshBtn) {
        refreshBtn.disabled = true;
        refreshBtn.innerHTML = '<i class="bi bi-arrow-clockwise me-1"></i> Memuat...';
    }
    
    try {
        await loadDashboardStats();
        await loadNotifications();
        
        showAlert('Data dashboard berhasil diperbarui', 'success', 'notifikasi');
        
    } catch (error) {
        console.error('Error refreshing dashboard:', error);
        showAlert('Gagal memperbarui data dashboard', 'danger', 'notifikasi');
    } finally {
        if (refreshBtn) {
            refreshBtn.disabled = false;
            refreshBtn.innerHTML = '<i class="bi bi-calendar3 me-1"></i> Hari ini';
        }
    }
}

/**
 * Navigate to specific page
 * @param {string} page - Page to navigate to
 */
function navigateToPage(page) {
    window.location.href = page;
}

/**
 * Quick action handlers
 */
function handleQuickAddObat() {
    navigateToPage('inventaris.html');
}

function handleQuickAddPasien() {
    navigateToPage('pasien.html');
}

// Event listeners for quick actions
document.addEventListener('DOMContentLoaded', function() {
    // Add event listener for refresh button
    const refreshBtn = document.querySelector('.btn-outline-secondary');
    if (refreshBtn) {
        refreshBtn.addEventListener('click', refreshDashboard);
    }
    
    // Add event listeners for quick action buttons
    const addObatBtn = document.querySelector('button[onclick*="inventaris.html"]');
    if (addObatBtn) {
        addObatBtn.addEventListener('click', handleQuickAddObat);
    }
    
    const addPasienBtn = document.querySelector('button[onclick*="pasien.html"]');
    if (addPasienBtn) {
        addPasienBtn.addEventListener('click', handleQuickAddPasien);
    }
});

// Export functions for global access
window.refreshDashboard = refreshDashboard;
window.navigateToPage = navigateToPage;
window.handleQuickAddObat = handleQuickAddObat;
window.handleQuickAddPasien = handleQuickAddPasien;