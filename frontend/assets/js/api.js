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
     * Generic HTTP request method
     * @param {string} endpoint - API endpoint
     * @param {string} method - HTTP method (GET, POST, PUT, DELETE)
     * @param {Object} data - Request body data
     * @returns {Promise} Response data
     */
    async request(endpoint, method = 'GET', data = null) {
        const url = `${this.baseURL}${endpoint}`;
        const config = {
            method: method,
            headers: this.headers
        };

        if (data && (method === 'POST' || method === 'PUT')) {
            config.body = JSON.stringify(data);
        }

        try {
            const response = await fetch(url, config);
            
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }
            
            const result = await response.json();
            return result;
        } catch (error) {
            console.error(`API request failed: ${method} ${endpoint}`, error);
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
 * Show loading state
 * @param {string} elementId - Element ID to show loading
 */
function showLoading(elementId) {
    const element = document.getElementById(elementId);
    if (element) {
        element.innerHTML = '<div class="spinner-border spinner-border-sm" role="status"><span class="visually-hidden">Loading...</span></div>';
        element.classList.add('loading');
    }
}

/**
 * Hide loading state
 * @param {string} elementId - Element ID to hide loading
 */
function hideLoading(elementId) {
    const element = document.getElementById(elementId);
    if (element) {
        element.classList.remove('loading');
    }
}

/**
 * Show alert message
 * @param {string} message - Alert message
 * @param {string} type - Alert type (success, warning, danger, info)
 * @param {string} containerId - Container element ID
 */
function showAlert(message, type = 'info', containerId = 'alerts') {
    const container = document.getElementById(containerId);
    if (!container) return;

    const alertDiv = document.createElement('div');
    alertDiv.className = `alert alert-${type} alert-dismissible fade show`;
    alertDiv.innerHTML = `
        ${message}
        <button type="button" class="btn-close" data-bs-dismiss="alert"></button>
    `;

    container.appendChild(alertDiv);

    // Auto remove after 5 seconds
    setTimeout(() => {
        if (alertDiv.parentNode) {
            alertDiv.remove();
        }
    }, 5000);
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
 * Validate form data
 * @param {Object} data - Form data to validate
 * @param {Array} requiredFields - Required field names
 * @returns {Object} Validation result
 */
function validateFormData(data, requiredFields) {
    const errors = [];
    
    requiredFields.forEach(field => {
        if (!data[field] || data[field].toString().trim() === '') {
            errors.push(`${field} harus diisi`);
        }
    });

    return {
        isValid: errors.length === 0,
        errors: errors
    };
}

// Export utility functions
window.showLoading = showLoading;
window.hideLoading = hideLoading;
window.showAlert = showAlert;
window.formatDate = formatDate;
window.formatTime = formatTime;
window.validateFormData = validateFormData;