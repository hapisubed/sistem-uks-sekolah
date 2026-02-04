/**
 * API Communication Module untuk Sistem UKS Sekolah
 * Handles all HTTP requests to backend API endpoints
 */

class APIClient {
    constructor() {
        // Base URL untuk API - auto-detect environment
        this.baseURL = window.location.hostname === 'localhost' ? 'http://localhost:5000/api' : '/api';
        this.headers = {
            'Content-Type': 'application/json',
            'Accept': 'application/json'
        };
    }

    /**
     * Generic HTTP request method with enhanced error handling
     * @param {string} endpoint - API endpoint
     * @param {string} method - HTTP method (GET, POST, PUT, DELETE)
     * @param {Object} data - Request body data
     * @param {number} timeout - Request timeout in milliseconds
     * @returns {Promise} Response data
     */
    async request(endpoint, method = 'GET', data = null, timeout = 10000) {
        const url = `${this.baseURL}${endpoint}`;
        const config = {
            method: method,
            headers: this.headers,
            signal: AbortSignal.timeout(timeout)
        };

        if (data && (method === 'POST' || method === 'PUT')) {
            config.body = JSON.stringify(data);
        }

        try {
            const response = await fetch(url, config);
            
            if (!response.ok) {
                let errorMessage = `HTTP ${response.status}`;
                try {
                    const errorData = await response.json();
                    errorMessage = errorData.message || errorMessage;
                } catch (e) {
                    // If response is not JSON, use status text
                    errorMessage = response.statusText || errorMessage;
                }
                throw new Error(errorMessage);
            }
            
            const result = await response.json();
            return result;
        } catch (error) {
            console.error(`API request failed: ${method} ${endpoint}`, error);
            
            // Enhanced error messages for better UX
            if (error.name === 'AbortError') {
                throw new Error('Request timeout - periksa koneksi internet Anda');
            } else if (error.message.includes('Failed to fetch')) {
                throw new Error('Tidak dapat terhubung ke server - periksa koneksi internet');
            } else if (error.message.includes('NetworkError')) {
                throw new Error('Masalah jaringan - coba lagi dalam beberapa saat');
            }
            
            throw error;
        }
    }

    // ==================== OBAT API METHODS ====================

    /**
     * Get all obat from inventory
     * @returns {Promise<Array>} List of obat
     */
    async getAllObat() {
        return await this.request('/obat');
    }

    /**
     * Get obat by ID
     * @param {number} id - Obat ID
     * @returns {Promise<Object>} Obat data
     */
    async getObatById(id) {
        return await this.request(`/obat/${id}`);
    }

    /**
     * Add new obat to inventory
     * @param {Object} obatData - Obat data
     * @returns {Promise<Object>} Created obat
     */
    async addObat(obatData) {
        return await this.request('/obat', 'POST', obatData);
    }

    /**
     * Update existing obat
     * @param {number} id - Obat ID
     * @param {Object} obatData - Updated obat data
     * @returns {Promise<Object>} Updated obat
     */
    async updateObat(id, obatData) {
        return await this.request(`/obat/${id}`, 'PUT', obatData);
    }

    /**
     * Delete obat from inventory
     * @param {number} id - Obat ID
     * @returns {Promise<Object>} Deletion result
     */
    async deleteObat(id) {
        return await this.request(`/obat/${id}`, 'DELETE');
    }

    /**
     * Get obat with low stock (< 5 units)
     * @returns {Promise<Array>} List of obat with low stock
     */
    async getObatStokRendah() {
        return await this.request('/obat/stok-rendah');
    }

    /**
     * Get obat sorted by expiry date
     * @returns {Promise<Array>} List of obat sorted by expiry date
     */
    async getObatByExpiry() {
        return await this.request('/obat?sort=expiry');
    }

    // ==================== PASIEN API METHODS ====================

    /**
     * Get all pasien records
     * @returns {Promise<Array>} List of pasien
     */
    async getAllPasien() {
        return await this.request('/pasien');
    }

    /**
     * Get pasien by ID
     * @param {number} id - Pasien ID
     * @returns {Promise<Object>} Pasien data
     */
    async getPasienById(id) {
        return await this.request(`/pasien/${id}`);
    }

    /**
     * Add new pasien record
     * @param {Object} pasienData - Pasien data
     * @returns {Promise<Object>} Created pasien record
     */
    async addPasien(pasienData) {
        return await this.request('/pasien', 'POST', pasienData);
    }

    /**
     * Search pasien by name or class
     * @param {string} query - Search query
     * @returns {Promise<Array>} Search results
     */
    async searchPasien(query) {
        return await this.request(`/pasien/search?q=${encodeURIComponent(query)}`);
    }

    /**
     * Get daily patient report
     * @param {string} date - Date in YYYY-MM-DD format
     * @returns {Promise<Array>} Daily patient report
     */
    async getDailyReport(date) {
        return await this.request(`/pasien/harian?date=${date}`);
    }

    /**
     * Record medicine distribution to patient
     * @param {Object} distributionData - Medicine distribution data
     * @returns {Promise<Object>} Distribution result
     */
    async recordMedicineDistribution(distributionData) {
        return await this.request('/pasien/obat', 'POST', distributionData);
    }

    // ==================== DASHBOARD API METHODS ====================

    /**
     * Get dashboard statistics
     * @returns {Promise<Object>} Dashboard stats
     */
    async getDashboardStats() {
        return await this.request('/dashboard/stats');
    }

    /**
     * Get recent notifications
     * @returns {Promise<Array>} List of notifications
     */
    async getNotifications() {
        return await this.request('/dashboard/notifications');
    }
}

// ==================== MOCK DATA SERVICE ====================
// Temporary mock data service untuk development frontend
// Akan dihapus setelah backend ready

class MockAPIService {
    constructor() {
        this.mockObat = [
            {
                id: 1,
                nama: 'Paracetamol',
                jenis: 'Tablet',
                stok: 50,
                tanggal_kadaluarsa: '2024-12-31',
                deskripsi: 'Obat penurun panas dan pereda nyeri',
                created_at: '2024-01-15T10:00:00Z',
                updated_at: '2024-01-15T10:00:00Z'
            },
            {
                id: 2,
                nama: 'Betadine',
                jenis: 'Cairan',
                stok: 3,
                tanggal_kadaluarsa: '2024-06-30',
                deskripsi: 'Antiseptik untuk luka',
                created_at: '2024-01-15T10:00:00Z',
                updated_at: '2024-01-15T10:00:00Z'
            },
            {
                id: 3,
                nama: 'Hansaplast',
                jenis: 'Plester',
                stok: 25,
                tanggal_kadaluarsa: '2025-03-15',
                deskripsi: 'Plester luka berbagai ukuran',
                created_at: '2024-01-15T10:00:00Z',
                updated_at: '2024-01-15T10:00:00Z'
            },
            {
                id: 4,
                nama: 'Ibuprofen',
                jenis: 'Tablet',
                stok: 2,
                tanggal_kadaluarsa: '2024-08-20',
                deskripsi: 'Anti-inflamasi dan pereda nyeri',
                created_at: '2024-01-15T10:00:00Z',
                updated_at: '2024-01-15T10:00:00Z'
            },
            {
                id: 5,
                nama: 'Alcohol 70%',
                jenis: 'Cairan',
                stok: 8,
                tanggal_kadaluarsa: '2025-01-10',
                deskripsi: 'Antiseptik pembersih luka',
                created_at: '2024-01-15T10:00:00Z',
                updated_at: '2024-01-15T10:00:00Z'
            },
            {
                id: 6,
                nama: 'Salep Luka',
                jenis: 'Salep',
                stok: 12,
                tanggal_kadaluarsa: '2024-11-30',
                deskripsi: 'Salep untuk penyembuhan luka ringan',
                created_at: '2024-01-15T10:00:00Z',
                updated_at: '2024-01-15T10:00:00Z'
            },
            {
                id: 7,
                nama: 'Vitamin C',
                jenis: 'Tablet',
                stok: 1,
                tanggal_kadaluarsa: '2024-05-15',
                deskripsi: 'Suplemen vitamin C untuk daya tahan tubuh',
                created_at: '2024-01-15T10:00:00Z',
                updated_at: '2024-01-15T10:00:00Z'
            }
        ];

        this.mockPasien = [
            {
                id: 1,
                nama: 'Ahmad Rizki',
                kelas_jabatan: 'Kelas 10A',
                keluhan: 'Sakit kepala',
                diagnosa: 'Tension headache',
                obat_diberikan: 'Paracetamol 1 tablet',
                tanggal_kunjungan: new Date().toISOString().split('T')[0], // Today's date
                waktu_kunjungan: '09:30',
                created_at: new Date().toISOString()
            },
            {
                id: 2,
                nama: 'Siti Nurhaliza',
                kelas_jabatan: 'Guru Matematika',
                keluhan: 'Luka lecet di tangan',
                diagnosa: 'Abrasio minor',
                obat_diberikan: 'Betadine + Hansaplast',
                tanggal_kunjungan: new Date().toISOString().split('T')[0], // Today's date
                waktu_kunjungan: '10:15',
                created_at: new Date().toISOString()
            },
            {
                id: 3,
                nama: 'Budi Santoso',
                kelas_jabatan: 'Kelas 11B',
                keluhan: 'Demam dan batuk',
                diagnosa: 'Common cold',
                obat_diberikan: 'Paracetamol 1 tablet',
                tanggal_kunjungan: new Date().toISOString().split('T')[0], // Today's date
                waktu_kunjungan: '11:45',
                created_at: new Date().toISOString()
            }
        ];
    }

    // Mock methods that simulate API calls
    async getAllObat() {
        await this.delay(500); // Simulate network delay
        return {
            success: true,
            data: this.mockObat,
            message: 'Data obat berhasil diambil'
        };
    }

    async getAllPasien() {
        await this.delay(500);
        return {
            success: true,
            data: this.mockPasien,
            message: 'Data pasien berhasil diambil'
        };
    }

    async getDashboardStats() {
        await this.delay(300);
        const today = new Date().toISOString().split('T')[0];
        
        const totalObat = this.mockObat.length;
        const pasienHariIni = this.mockPasien.filter(p => 
            p.tanggal_kunjungan === today
        ).length;
        const stokRendah = this.mockObat.filter(o => o.stok < 5).length;
        const obatKadaluarsa = this.mockObat.filter(o => 
            new Date(o.tanggal_kadaluarsa) < new Date()
        ).length;

        return {
            success: true,
            data: {
                totalObat,
                pasienHariIni,
                stokRendah,
                obatKadaluarsa
            },
            message: 'Statistik dashboard berhasil diambil'
        };
    }

    async getNotifications() {
        await this.delay(200);
        const notifications = [];
        
        // Check for low stock
        const lowStock = this.mockObat.filter(o => o.stok < 5);
        lowStock.forEach(obat => {
            notifications.push({
                type: 'warning',
                message: `Stok ${obat.nama} tinggal ${obat.stok} unit`,
                timestamp: new Date().toISOString()
            });
        });

        // Check for expired medicines
        const expired = this.mockObat.filter(o => 
            new Date(o.tanggal_kadaluarsa) < new Date()
        );
        expired.forEach(obat => {
            notifications.push({
                type: 'danger',
                message: `${obat.nama} sudah kadaluarsa`,
                timestamp: new Date().toISOString()
            });
        });

        if (notifications.length === 0) {
            notifications.push({
                type: 'success',
                message: 'Semua sistem berjalan normal',
                timestamp: new Date().toISOString()
            });
        }

        return {
            success: true,
            data: notifications,
            message: 'Notifikasi berhasil diambil'
        };
    }

    // Utility method to simulate network delay
    delay(ms) {
        return new Promise(resolve => setTimeout(resolve, ms));
    }
}

// ==================== API CLIENT INITIALIZATION ====================

// Configuration for API mode
const API_CONFIG = {
    USE_REAL_API: true, // Set to false to use mock data
    BASE_URL: window.location.hostname === 'localhost' ? 'http://localhost:5000/api' : '/api'
};

// Initialize API client
const apiClient = new APIClient();
const mockAPI = new MockAPIService();

// API wrapper that switches between real and mock API
const api = {
    async getAllObat() {
        if (API_CONFIG.USE_REAL_API) {
            return await apiClient.getAllObat();
        } else {
            return await mockAPI.getAllObat();
        }
    },
    
    async getAllPasien() {
        if (API_CONFIG.USE_REAL_API) {
            return await apiClient.getAllPasien();
        } else {
            return await mockAPI.getAllPasien();
        }
    },
    
    async getDashboardStats() {
        if (API_CONFIG.USE_REAL_API) {
            return await apiClient.getDashboardStats();
        } else {
            return await mockAPI.getDashboardStats();
        }
    },
    
    async getNotifications() {
        if (API_CONFIG.USE_REAL_API) {
            return await apiClient.getNotifications();
        } else {
            return await mockAPI.getNotifications();
        }
    },
    
    async addObat(obatData) {
        if (API_CONFIG.USE_REAL_API) {
            return await apiClient.addObat(obatData);
        } else {
            // Simulate API call for mock
            await mockAPI.delay(1000);
            const newObat = {
                id: Date.now(),
                ...obatData,
                created_at: new Date().toISOString(),
                updated_at: new Date().toISOString()
            };
            mockAPI.mockObat.push(newObat);
            return {
                success: true,
                data: newObat,
                message: 'Obat berhasil ditambahkan'
            };
        }
    },
    
    async updateObat(id, obatData) {
        if (API_CONFIG.USE_REAL_API) {
            return await apiClient.updateObat(id, obatData);
        } else {
            // Simulate API call for mock
            await mockAPI.delay(1000);
            const index = mockAPI.mockObat.findIndex(o => o.id === id);
            if (index !== -1) {
                mockAPI.mockObat[index] = {
                    ...mockAPI.mockObat[index],
                    ...obatData,
                    updated_at: new Date().toISOString()
                };
                return {
                    success: true,
                    data: mockAPI.mockObat[index],
                    message: 'Obat berhasil diupdate'
                };
            }
            throw new Error('Obat tidak ditemukan');
        }
    },
    
    async deleteObat(id) {
        if (API_CONFIG.USE_REAL_API) {
            return await apiClient.deleteObat(id);
        } else {
            // Simulate API call for mock
            await mockAPI.delay(1000);
            const index = mockAPI.mockObat.findIndex(o => o.id === id);
            if (index !== -1) {
                mockAPI.mockObat.splice(index, 1);
                return {
                    success: true,
                    message: 'Obat berhasil dihapus'
                };
            }
            throw new Error('Obat tidak ditemukan');
        }
    },
    
    async addPasien(pasienData) {
        if (API_CONFIG.USE_REAL_API) {
            return await apiClient.addPasien(pasienData);
        } else {
            // Simulate API call for mock
            await mockAPI.delay(1000);
            const newPasien = {
                id: Date.now(),
                ...pasienData,
                created_at: new Date().toISOString()
            };
            mockAPI.mockPasien.push(newPasien);
            return {
                success: true,
                data: newPasien,
                message: 'Kunjungan pasien berhasil dicatat'
            };
        }
    }
};

// Export untuk digunakan di file lain
window.APIClient = APIClient;
window.MockAPIService = MockAPIService;
window.apiClient = apiClient;
window.mockAPI = mockAPI;
window.api = api;

// ==================== UTILITY FUNCTIONS ====================

/**
 * Enhanced loading state management
 * @param {string} elementId - Element ID to show loading
 * @param {string} message - Loading message
 */
function showLoading(elementId, message = 'Memuat...') {
    const element = document.getElementById(elementId);
    if (element) {
        element.innerHTML = `
            <div class="d-flex align-items-center justify-content-center">
                <div class="spinner-border spinner-border-sm me-2" role="status">
                    <span class="visually-hidden">Loading...</span>
                </div>
                <span>${message}</span>
            </div>
        `;
        element.classList.add('loading');
    }
}

/**
 * Show full page loading overlay
 */
function showPageLoading(message = 'Memuat data...') {
    let overlay = document.getElementById('pageLoadingOverlay');
    if (!overlay) {
        overlay = document.createElement('div');
        overlay.id = 'pageLoadingOverlay';
        overlay.className = 'position-fixed top-0 start-0 w-100 h-100 d-flex align-items-center justify-content-center';
        overlay.style.cssText = 'background: rgba(255,255,255,0.9); z-index: 9999; backdrop-filter: blur(2px);';
        overlay.innerHTML = `
            <div class="text-center">
                <div class="spinner-border text-primary mb-3" role="status">
                    <span class="visually-hidden">Loading...</span>
                </div>
                <div class="fw-bold text-primary">${message}</div>
            </div>
        `;
        document.body.appendChild(overlay);
    }
    overlay.style.display = 'flex';
}

/**
 * Hide full page loading overlay
 */
function hidePageLoading() {
    const overlay = document.getElementById('pageLoadingOverlay');
    if (overlay) {
        overlay.style.display = 'none';
    }
}

/**
 * Enhanced toast notification system
 * @param {string} message - Toast message
 * @param {string} type - Toast type (success, error, warning, info)
 * @param {number} duration - Duration in milliseconds
 */
function showToast(message, type = 'info', duration = 4000) {
    // Create toast container if it doesn't exist
    let toastContainer = document.getElementById('toastContainer');
    if (!toastContainer) {
        toastContainer = document.createElement('div');
        toastContainer.id = 'toastContainer';
        toastContainer.className = 'toast-container position-fixed top-0 end-0 p-3';
        toastContainer.style.zIndex = '9999';
        document.body.appendChild(toastContainer);
    }

    // Create toast element
    const toastId = 'toast_' + Date.now();
    const toastElement = document.createElement('div');
    toastElement.id = toastId;
    toastElement.className = 'toast align-items-center border-0';
    
    // Set toast color based on type
    let bgClass = 'bg-primary';
    let icon = 'bi-info-circle-fill';
    
    switch (type) {
        case 'success':
            bgClass = 'bg-success';
            icon = 'bi-check-circle-fill';
            break;
        case 'error':
        case 'danger':
            bgClass = 'bg-danger';
            icon = 'bi-x-circle-fill';
            break;
        case 'warning':
            bgClass = 'bg-warning';
            icon = 'bi-exclamation-triangle-fill';
            break;
        default:
            bgClass = 'bg-info';
            icon = 'bi-info-circle-fill';
    }
    
    toastElement.className += ` ${bgClass} text-white`;
    toastElement.innerHTML = `
        <div class="d-flex">
            <div class="toast-body d-flex align-items-center">
                <i class="bi ${icon} me-2"></i>
                ${message}
            </div>
            <button type="button" class="btn-close btn-close-white me-2 m-auto" data-bs-dismiss="toast"></button>
        </div>
    `;

    toastContainer.appendChild(toastElement);

    // Initialize and show toast
    const toast = new bootstrap.Toast(toastElement, {
        autohide: true,
        delay: duration
    });
    
    toast.show();

    // Remove toast element after it's hidden
    toastElement.addEventListener('hidden.bs.toast', () => {
        toastElement.remove();
    });
}

/**
 * Enhanced alert with better styling and auto-dismiss
 * @param {string} message - Alert message
 * @param {string} type - Alert type (success, warning, danger, info)
 * @param {string} containerId - Container element ID
 * @param {boolean} autoDismiss - Auto dismiss after timeout
 */
function showAlert(message, type = 'info', containerId = 'alerts', autoDismiss = true) {
    // Use toast for better UX
    showToast(message, type);
    
    // Also show in container if specified
    const container = document.getElementById(containerId);
    if (!container) return;

    const alertDiv = document.createElement('div');
    alertDiv.className = `alert alert-${type} alert-dismissible fade show`;
    
    let icon = 'bi-info-circle-fill';
    switch (type) {
        case 'success':
            icon = 'bi-check-circle-fill';
            break;
        case 'warning':
            icon = 'bi-exclamation-triangle-fill';
            break;
        case 'danger':
            icon = 'bi-x-circle-fill';
            break;
    }
    
    alertDiv.innerHTML = `
        <div class="d-flex align-items-center">
            <i class="bi ${icon} me-2"></i>
            <div>${message}</div>
        </div>
        <button type="button" class="btn-close" data-bs-dismiss="alert"></button>
    `;

    container.appendChild(alertDiv);

    // Auto remove after timeout
    if (autoDismiss) {
        setTimeout(() => {
            if (alertDiv.parentNode) {
                alertDiv.remove();
            }
        }, 5000);
    }
}

/**
 * Format date to Indonesian format
 * @param {string} dateString - Date string
 * @returns {string} Formatted date
 */
function formatDate(dateString) {
    const date = new Date(dateString);
    return date.toLocaleDateString('id-ID', {
        year: 'numeric',
        month: 'long',
        day: 'numeric'
    });
}

/**
 * Format time to Indonesian format
 * @param {string} timeString - Time string
 * @returns {string} Formatted time
 */
function formatTime(timeString) {
    return timeString.substring(0, 5); // HH:MM format
}

/**
 * Enhanced form validation with real-time feedback
 * @param {Object} data - Form data to validate
 * @param {Array} requiredFields - Required field names with validation rules
 * @returns {Object} Validation result
 */
function validateFormData(data, requiredFields) {
    const errors = [];
    const warnings = [];
    
    requiredFields.forEach(field => {
        const fieldName = typeof field === 'string' ? field : field.name;
        const rules = typeof field === 'object' ? field.rules : {};
        const value = data[fieldName];
        
        // Required validation
        if (!value || value.toString().trim() === '') {
            errors.push(`${fieldName} harus diisi`);
            return;
        }
        
        // Apply specific validation rules
        if (rules.minLength && value.length < rules.minLength) {
            errors.push(`${fieldName} minimal ${rules.minLength} karakter`);
        }
        
        if (rules.maxLength && value.length > rules.maxLength) {
            errors.push(`${fieldName} maksimal ${rules.maxLength} karakter`);
        }
        
        if (rules.pattern && !rules.pattern.test(value)) {
            errors.push(`Format ${fieldName} tidak valid`);
        }
        
        if (rules.min && parseFloat(value) < rules.min) {
            errors.push(`${fieldName} minimal ${rules.min}`);
        }
        
        if (rules.max && parseFloat(value) > rules.max) {
            errors.push(`${fieldName} maksimal ${rules.max}`);
        }
        
        // Date validations
        if (rules.dateNotFuture && new Date(value) > new Date()) {
            errors.push(`${fieldName} tidak boleh di masa depan`);
        }
        
        if (rules.dateNotPast && new Date(value) < new Date()) {
            errors.push(`${fieldName} tidak boleh di masa lalu`);
        }
        
        // Warnings for potential issues
        if (rules.warnIfLow && parseFloat(value) < rules.warnIfLow) {
            warnings.push(`${fieldName} sangat rendah (${value})`);
        }
        
        if (rules.warnIfExpiringSoon) {
            const expiryDate = new Date(value);
            const daysUntilExpiry = Math.ceil((expiryDate - new Date()) / (1000 * 60 * 60 * 24));
            if (daysUntilExpiry <= 30 && daysUntilExpiry > 0) {
                warnings.push(`${fieldName} akan kadaluarsa dalam ${daysUntilExpiry} hari`);
            }
        }
    });

    return {
        isValid: errors.length === 0,
        errors: errors,
        warnings: warnings,
        hasWarnings: warnings.length > 0
    };
}

/**
 * Setup real-time form validation
 * @param {string} formId - Form element ID
 * @param {Object} validationRules - Validation rules for each field
 */
function setupRealtimeValidation(formId, validationRules) {
    const form = document.getElementById(formId);
    if (!form) return;
    
    Object.keys(validationRules).forEach(fieldName => {
        const field = form.querySelector(`[name="${fieldName}"], #${fieldName}`);
        if (!field) return;
        
        const rules = validationRules[fieldName];
        
        // Create feedback element
        let feedback = field.parentNode.querySelector('.invalid-feedback');
        if (!feedback) {
            feedback = document.createElement('div');
            feedback.className = 'invalid-feedback';
            field.parentNode.appendChild(feedback);
        }
        
        // Add validation on input/change
        field.addEventListener('input', function() {
            validateField(this, rules, feedback);
        });
        
        field.addEventListener('blur', function() {
            validateField(this, rules, feedback);
        });
    });
}

/**
 * Validate individual field
 * @param {HTMLElement} field - Form field element
 * @param {Object} rules - Validation rules
 * @param {HTMLElement} feedback - Feedback element
 */
function validateField(field, rules, feedback) {
    const value = field.value.trim();
    let isValid = true;
    let message = '';
    
    // Required validation
    if (rules.required && !value) {
        isValid = false;
        message = `${rules.label || field.name} harus diisi`;
    }
    
    // Length validations
    if (value && rules.minLength && value.length < rules.minLength) {
        isValid = false;
        message = `Minimal ${rules.minLength} karakter`;
    }
    
    if (value && rules.maxLength && value.length > rules.maxLength) {
        isValid = false;
        message = `Maksimal ${rules.maxLength} karakter`;
    }
    
    // Pattern validation
    if (value && rules.pattern && !rules.pattern.test(value)) {
        isValid = false;
        message = rules.patternMessage || 'Format tidak valid';
    }
    
    // Number validations
    if (value && rules.min !== undefined && parseFloat(value) < rules.min) {
        isValid = false;
        message = `Minimal ${rules.min}`;
    }
    
    if (value && rules.max !== undefined && parseFloat(value) > rules.max) {
        isValid = false;
        message = `Maksimal ${rules.max}`;
    }
    
    // Update field appearance
    if (isValid) {
        field.classList.remove('is-invalid');
        field.classList.add('is-valid');
        feedback.textContent = '';
    } else {
        field.classList.remove('is-valid');
        field.classList.add('is-invalid');
        feedback.textContent = message;
    }
    
    return isValid;
}

// Export utility functions
window.showLoading = showLoading;
window.hideLoading = hideLoading;
window.showPageLoading = showPageLoading;
window.hidePageLoading = hidePageLoading;
window.showAlert = showAlert;
window.showToast = showToast;
window.formatDate = formatDate;
window.formatTime = formatTime;
window.validateFormData = validateFormData;
window.setupRealtimeValidation = setupRealtimeValidation;
window.validateField = validateField;