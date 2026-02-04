/**
 * Pasien JavaScript Module
 * Handles patient data management functionality
 */

// Global variables
let pasienData = [];
let filteredData = [];

document.addEventListener('DOMContentLoaded', function() {
    initializePasien();
});

/**
 * Initialize pasien page
 */
async function initializePasien() {
    try {
        // Load pasien data
        await loadPasienData();
        
        // Setup event listeners
        setupEventListeners();
        
        // Setup form validation
        setupFormValidation();
        
        // Set default date and time
        setDefaultDateTime();
        
    } catch (error) {
        console.error('Error initializing pasien:', error);
        showAlert('Gagal memuat data pasien', 'danger');
    }
}

/**
 * Load pasien data from API
 */
async function loadPasienData() {
    try {
        showTableLoading();
        
        // Use API wrapper that switches between real and mock API
        const response = await api.getAllPasien();
        
        if (response.success) {
            pasienData = response.data;
            filteredData = [...pasienData];
            renderPasienTable();
        } else {
            throw new Error(response.message || 'Gagal memuat data pasien');
        }
        
    } catch (error) {
        console.error('Error loading pasien data:', error);
        showTableError('Gagal memuat data pasien');
        showAlert('Gagal memuat data pasien', 'danger');
    }
}

/**
 * Render pasien table
 */
function renderPasienTable() {
    const tableBody = document.getElementById('pasienTableBody');
    if (!tableBody) return;
    
    if (filteredData.length === 0) {
        tableBody.innerHTML = `
            <tr>
                <td colspan="7" class="text-center text-muted">
                    <i class="bi bi-info-circle me-2"></i>
                    Tidak ada data kunjungan pasien yang ditemukan
                </td>
            </tr>
        `;
        return;
    }
    
    // Sort by date and time (newest first)
    const sortedData = [...filteredData].sort((a, b) => {
        const dateTimeA = new Date(`${a.tanggal_kunjungan}T${a.waktu_kunjungan}`);
        const dateTimeB = new Date(`${b.tanggal_kunjungan}T${b.waktu_kunjungan}`);
        return dateTimeB - dateTimeA;
    });
    
    tableBody.innerHTML = sortedData.map(pasien => {
        const isToday = pasien.tanggal_kunjungan === new Date().toISOString().split('T')[0];
        
        return `
            <tr class="${isToday ? 'table-info' : ''}">
                <td>
                    <div class="d-flex align-items-center">
                        <i class="bi bi-calendar3 me-2 text-primary"></i>
                        <div>
                            <div class="fw-bold">${formatDate(pasien.tanggal_kunjungan)}</div>
                            ${isToday ? '<small class="text-info"><i class="bi bi-star-fill me-1"></i>Hari ini</small>' : ''}
                        </div>
                    </div>
                </td>
                <td>
                    <span class="badge bg-secondary">${formatTime(pasien.waktu_kunjungan)}</span>
                </td>
                <td>
                    <div class="d-flex align-items-center">
                        <i class="bi bi-person-circle me-2 text-success"></i>
                        <div class="fw-bold">${pasien.nama}</div>
                    </div>
                </td>
                <td>
                    <span class="badge ${getKelasJabatanBadge(pasien.kelas_jabatan)}">${pasien.kelas_jabatan}</span>
                </td>
                <td>
                    <div class="text-truncate" style="max-width: 200px;" title="${pasien.keluhan}">
                        ${pasien.keluhan}
                    </div>
                </td>
                <td>
                    <div class="text-truncate" style="max-width: 150px;" title="${pasien.diagnosa}">
                        ${pasien.diagnosa || '-'}
                    </div>
                </td>
                <td>
                    <div class="text-truncate" style="max-width: 150px;" title="${pasien.obat_diberikan}">
                        ${pasien.obat_diberikan || '-'}
                    </div>
                </td>
            </tr>
        `;
    }).join('');
}

/**
 * Get badge class for kelas/jabatan
 */
function getKelasJabatanBadge(kelasJabatan) {
    if (kelasJabatan.toLowerCase().includes('guru')) {
        return 'bg-primary';
    } else if (kelasJabatan.toLowerCase().includes('staff')) {
        return 'bg-info';
    } else if (kelasJabatan.toLowerCase().includes('kelas')) {
        return 'bg-success';
    }
    return 'bg-secondary';
}

/**
 * Setup event listeners
 */
function setupEventListeners() {
    // Search functionality
    const searchInput = document.getElementById('searchPasien');
    if (searchInput) {
        searchInput.addEventListener('input', handleSearch);
    }
    
    // Filter functionality
    const filterTanggal = document.getElementById('filterTanggal');
    if (filterTanggal) {
        filterTanggal.addEventListener('change', handleFilter);
    }
    
    const filterKelas = document.getElementById('filterKelas');
    if (filterKelas) {
        filterKelas.addEventListener('change', handleFilter);
    }
    
    // Add pasien form
    const addPasienForm = document.getElementById('addPasienForm');
    if (addPasienForm) {
        addPasienForm.addEventListener('submit', handleAddPasien);
    }
}

/**
 * Handle search functionality
 */
function handleSearch() {
    const searchTerm = document.getElementById('searchPasien').value.toLowerCase();
    applyFilters(searchTerm);
}

/**
 * Handle filter functionality
 */
function handleFilter() {
    const searchTerm = document.getElementById('searchPasien').value.toLowerCase();
    applyFilters(searchTerm);
}

/**
 * Apply search and filters
 */
function applyFilters(searchTerm = '') {
    const tanggalFilter = document.getElementById('filterTanggal').value;
    const kelasFilter = document.getElementById('filterKelas').value;
    
    filteredData = pasienData.filter(pasien => {
        // Search filter
        const matchesSearch = searchTerm === '' || 
            pasien.nama.toLowerCase().includes(searchTerm) ||
            pasien.kelas_jabatan.toLowerCase().includes(searchTerm) ||
            pasien.keluhan.toLowerCase().includes(searchTerm) ||
            (pasien.diagnosa && pasien.diagnosa.toLowerCase().includes(searchTerm));
        
        // Date filter
        const matchesDate = tanggalFilter === '' || pasien.tanggal_kunjungan === tanggalFilter;
        
        // Kelas filter
        const matchesKelas = kelasFilter === '' || pasien.kelas_jabatan.toLowerCase().includes(kelasFilter.toLowerCase());
        
        return matchesSearch && matchesDate && matchesKelas;
    });
    
    renderPasienTable();
}

/**
 * Clear all filters
 */
function clearFilters() {
    document.getElementById('searchPasien').value = '';
    document.getElementById('filterTanggal').value = '';
    document.getElementById('filterKelas').value = '';
    
    filteredData = [...pasienData];
    renderPasienTable();
    
    showAlert('Filter berhasil direset', 'info');
}

/**
 * Handle add pasien form submission
 */
async function handleAddPasien(event) {
    event.preventDefault();
    
    const formData = {
        nama: document.getElementById('namaPasien').value.trim(),
        kelas_jabatan: document.getElementById('kelasJabatan').value.trim(),
        tanggal_kunjungan: document.getElementById('tanggalKunjungan').value,
        waktu_kunjungan: document.getElementById('waktuKunjungan').value,
        keluhan: document.getElementById('keluhan').value.trim(),
        diagnosa: document.getElementById('diagnosa').value.trim(),
        obat_diberikan: document.getElementById('obatDiberikan').value.trim()
    };
    
    // Validate form
    const validation = validatePasienForm(formData);
    if (!validation.isValid) {
        showAlert(validation.errors.join('<br>'), 'danger');
        return;
    }
    
    try {
        // Show loading state
        const submitBtn = event.target.querySelector('button[type="submit"]');
        const originalText = submitBtn.innerHTML;
        submitBtn.disabled = true;
        submitBtn.innerHTML = '<span class="spinner-border spinner-border-sm me-2"></span>Menyimpan...';
        
        // Use API wrapper
        const response = await api.addPasien(formData);
        
        if (response.success) {
            // Add to local data
            pasienData.push(response.data);
            
            // Refresh table
            applyFilters();
            
            // Close modal and reset form
            const modal = bootstrap.Modal.getInstance(document.getElementById('addPasienModal'));
            modal.hide();
            event.target.reset();
            setDefaultDateTime(); // Reset to current date/time
            
            showAlert('Kunjungan pasien berhasil dicatat', 'success');
        } else {
            throw new Error(response.message || 'Gagal mencatat kunjungan pasien');
        }
        
    } catch (error) {
        console.error('Error adding pasien:', error);
        showAlert('Gagal mencatat kunjungan pasien', 'danger');
    } finally {
        // Reset button state
        const submitBtn = event.target.querySelector('button[type="submit"]');
        submitBtn.disabled = false;
        submitBtn.innerHTML = 'Simpan Kunjungan';
    }
}

/**
 * Validate pasien form data
 */
function validatePasienForm(data) {
    const errors = [];
    
    if (!data.nama) {
        errors.push('Nama pasien harus diisi');
    }
    
    if (!data.kelas_jabatan) {
        errors.push('Kelas/Jabatan harus diisi');
    }
    
    if (!data.tanggal_kunjungan) {
        errors.push('Tanggal kunjungan harus diisi');
    }
    
    if (!data.waktu_kunjungan) {
        errors.push('Waktu kunjungan harus diisi');
    }
    
    if (!data.keluhan) {
        errors.push('Keluhan harus diisi');
    }
    
    // Check if date is not in the future
    const visitDate = new Date(data.tanggal_kunjungan);
    const today = new Date();
    today.setHours(23, 59, 59, 999); // End of today
    
    if (visitDate > today) {
        errors.push('Tanggal kunjungan tidak boleh di masa depan');
    }
    
    return {
        isValid: errors.length === 0,
        errors: errors
    };
}

/**
 * Setup form validation
 */
function setupFormValidation() {
    // Set maximum date for visit date to today
    const today = new Date().toISOString().split('T')[0];
    const visitDateInput = document.getElementById('tanggalKunjungan');
    if (visitDateInput) {
        visitDateInput.max = today;
    }
    
    // Real-time validation
    const namaInput = document.getElementById('namaPasien');
    if (namaInput) {
        namaInput.addEventListener('input', function() {
            if (this.value.trim().length < 2) {
                this.setCustomValidity('Nama pasien minimal 2 karakter');
            } else {
                this.setCustomValidity('');
            }
        });
    }
    
    const keluhanInput = document.getElementById('keluhan');
    if (keluhanInput) {
        keluhanInput.addEventListener('input', function() {
            if (this.value.trim().length < 5) {
                this.setCustomValidity('Keluhan minimal 5 karakter');
            } else {
                this.setCustomValidity('');
            }
        });
    }
}

/**
 * Set default date and time to current
 */
function setDefaultDateTime() {
    const now = new Date();
    const today = now.toISOString().split('T')[0];
    const currentTime = now.toTimeString().slice(0, 5);
    
    const dateInput = document.getElementById('tanggalKunjungan');
    const timeInput = document.getElementById('waktuKunjungan');
    const reportDateInput = document.getElementById('reportDate');
    
    if (dateInput && !dateInput.value) {
        dateInput.value = today;
    }
    
    if (timeInput && !timeInput.value) {
        timeInput.value = currentTime;
    }
    
    if (reportDateInput && !reportDateInput.value) {
        reportDateInput.value = today;
    }
}

/**
 * Generate daily report
 */
function generateDailyReport() {
    const reportDate = document.getElementById('reportDate').value;
    if (!reportDate) {
        showAlert('Pilih tanggal untuk laporan', 'warning');
        return;
    }
    
    // Filter patients by selected date
    const dailyPatients = pasienData.filter(p => p.tanggal_kunjungan === reportDate);
    
    const reportContent = document.getElementById('dailyReportContent');
    
    if (dailyPatients.length === 0) {
        reportContent.innerHTML = `
            <div class="text-center text-muted">
                <i class="bi bi-calendar-x me-2"></i>
                Tidak ada kunjungan pasien pada tanggal ${formatDate(reportDate)}
            </div>
        `;
        return;
    }
    
    // Sort by time
    const sortedPatients = dailyPatients.sort((a, b) => a.waktu_kunjungan.localeCompare(b.waktu_kunjungan));
    
    // Generate statistics
    const totalPatients = dailyPatients.length;
    const studentPatients = dailyPatients.filter(p => p.kelas_jabatan.toLowerCase().includes('kelas')).length;
    const teacherStaffPatients = totalPatients - studentPatients;
    
    // Generate report HTML
    reportContent.innerHTML = `
        <div class="print-area">
            <div class="report-header text-center mb-4">
                <h4>Laporan Harian Pasien UKS</h4>
                <p class="mb-1">Tanggal: ${formatDate(reportDate)}</p>
                <p class="text-muted">Unit Kesehatan Sekolah</p>
            </div>
            
            <div class="row mb-4">
                <div class="col-md-4">
                    <div class="card bg-primary text-white">
                        <div class="card-body text-center">
                            <h3>${totalPatients}</h3>
                            <small>Total Kunjungan</small>
                        </div>
                    </div>
                </div>
                <div class="col-md-4">
                    <div class="card bg-success text-white">
                        <div class="card-body text-center">
                            <h3>${studentPatients}</h3>
                            <small>Siswa</small>
                        </div>
                    </div>
                </div>
                <div class="col-md-4">
                    <div class="card bg-info text-white">
                        <div class="card-body text-center">
                            <h3>${teacherStaffPatients}</h3>
                            <small>Guru/Staff</small>
                        </div>
                    </div>
                </div>
            </div>
            
            <div class="table-responsive">
                <table class="table table-bordered">
                    <thead class="table-dark">
                        <tr>
                            <th>No</th>
                            <th>Waktu</th>
                            <th>Nama</th>
                            <th>Kelas/Jabatan</th>
                            <th>Keluhan</th>
                            <th>Diagnosa</th>
                            <th>Obat Diberikan</th>
                        </tr>
                    </thead>
                    <tbody>
                        ${sortedPatients.map((pasien, index) => `
                            <tr>
                                <td>${index + 1}</td>
                                <td>${formatTime(pasien.waktu_kunjungan)}</td>
                                <td>${pasien.nama}</td>
                                <td>${pasien.kelas_jabatan}</td>
                                <td>${pasien.keluhan}</td>
                                <td>${pasien.diagnosa || '-'}</td>
                                <td>${pasien.obat_diberikan || '-'}</td>
                            </tr>
                        `).join('')}
                    </tbody>
                </table>
            </div>
            
            <div class="report-footer mt-4">
                <div class="row">
                    <div class="col-6">
                        <p><strong>Petugas UKS</strong></p>
                        <br><br>
                        <p>_________________</p>
                    </div>
                    <div class="col-6 text-end">
                        <p>Dicetak pada: ${new Date().toLocaleString('id-ID')}</p>
                    </div>
                </div>
            </div>
        </div>
    `;
    
    showAlert(`Laporan harian berhasil dibuat untuk ${totalPatients} kunjungan`, 'success');
}

/**
 * Print daily report
 */
function printDailyReport() {
    const reportContent = document.getElementById('dailyReportContent');
    const printArea = reportContent.querySelector('.print-area');
    
    if (!printArea) {
        showAlert('Generate laporan terlebih dahulu sebelum mencetak', 'warning');
        return;
    }
    
    // Create print window
    const printWindow = window.open('', '_blank');
    printWindow.document.write(`
        <!DOCTYPE html>
        <html>
        <head>
            <title>Laporan Harian Pasien UKS</title>
            <link href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.0/dist/css/bootstrap.min.css" rel="stylesheet">
            <style>
                @media print {
                    .no-print { display: none !important; }
                    body { font-size: 12px; }
                    .card { border: 1px solid #dee2e6 !important; }
                }
                body { font-family: Arial, sans-serif; }
                .report-header { border-bottom: 2px solid #dee2e6; padding-bottom: 1rem; }
                .report-footer { border-top: 1px solid #dee2e6; padding-top: 1rem; }
            </style>
        </head>
        <body class="p-4">
            ${printArea.innerHTML}
        </body>
        </html>
    `);
    
    printWindow.document.close();
    printWindow.focus();
    
    // Wait for content to load then print
    setTimeout(() => {
        printWindow.print();
        printWindow.close();
    }, 500);
    
    showAlert('Laporan sedang dicetak...', 'info');
}

/**
 * Show table loading state
 */
function showTableLoading() {
    const tableBody = document.getElementById('pasienTableBody');
    if (tableBody) {
        tableBody.innerHTML = `
            <tr>
                <td colspan="7" class="text-center">
                    <div class="spinner-border" role="status">
                        <span class="visually-hidden">Loading...</span>
                    </div>
                    <p class="mt-2 mb-0">Memuat data pasien...</p>
                </td>
            </tr>
        `;
    }
}

/**
 * Show table error state
 */
function showTableError(message) {
    const tableBody = document.getElementById('pasienTableBody');
    if (tableBody) {
        tableBody.innerHTML = `
            <tr>
                <td colspan="7" class="text-center text-danger">
                    <i class="bi bi-exclamation-triangle me-2"></i>
                    ${message}
                    <br>
                    <button class="btn btn-sm btn-outline-primary mt-2" onclick="loadPasienData()">
                        <i class="bi bi-arrow-clockwise me-1"></i>Coba Lagi
                    </button>
                </td>
            </tr>
        `;
    }
}

/**
 * Refresh pasien data
 */
async function refreshPasienData() {
    await loadPasienData();
    showAlert('Data pasien berhasil diperbarui', 'success');
}

// Export functions for global access
window.clearFilters = clearFilters;
window.refreshPasienData = refreshPasienData;
window.generateDailyReport = generateDailyReport;
window.printDailyReport = printDailyReport;