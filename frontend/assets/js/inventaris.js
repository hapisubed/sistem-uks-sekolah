/**
 * Inventaris JavaScript Module
 * Handles inventory management functionality
 */

// Global variables
let obatData = [];
let filteredData = [];

document.addEventListener('DOMContentLoaded', function() {
    initializeInventaris();
});

/**
 * Initialize inventaris page
 */
async function initializeInventaris() {
    try {
        // Load obat data
        await loadObatData();
        
        // Setup event listeners
        setupEventListeners();
        
        // Setup form validation
        setupFormValidation();
        
    } catch (error) {
        console.error('Error initializing inventaris:', error);
        showAlert('Gagal memuat data inventaris', 'danger');
    }
}

/**
 * Load obat data from API
 */
async function loadObatData() {
    try {
        showTableLoading();
        
        // Use API wrapper that switches between real and mock API
        const response = await api.getAllObat();
        
        if (response.success) {
            obatData = response.data;
            filteredData = [...obatData];
            renderObatTable();
        } else {
            throw new Error(response.message || 'Gagal memuat data obat');
        }
        
    } catch (error) {
        console.error('Error loading obat data:', error);
        showTableError('Gagal memuat data obat');
        showAlert('Gagal memuat data obat', 'danger');
    }
}

/**
 * Render obat table
 */
function renderObatTable() {
    const tableBody = document.getElementById('obatTableBody');
    if (!tableBody) return;
    
    if (filteredData.length === 0) {
        tableBody.innerHTML = `
            <tr>
                <td colspan="6" class="text-center text-muted">
                    <i class="bi bi-info-circle me-2"></i>
                    Tidak ada data obat yang ditemukan
                </td>
            </tr>
        `;
        return;
    }
    
    // Sort by expiry date (closest first)
    const sortedData = [...filteredData].sort((a, b) => 
        new Date(a.tanggal_kadaluarsa) - new Date(b.tanggal_kadaluarsa)
    );
    
    tableBody.innerHTML = sortedData.map(obat => {
        const isLowStock = obat.stok < 5;
        const isExpired = new Date(obat.tanggal_kadaluarsa) < new Date();
        const isExpiringSoon = new Date(obat.tanggal_kadaluarsa) < new Date(Date.now() + 30 * 24 * 60 * 60 * 1000);
        
        let stockBadge = 'bg-success';
        let stockText = 'Normal';
        if (isLowStock) {
            stockBadge = 'bg-warning';
            stockText = 'Rendah';
        }
        
        let expiryClass = '';
        if (isExpired) {
            expiryClass = 'text-danger fw-bold';
        } else if (isExpiringSoon) {
            expiryClass = 'text-warning fw-bold';
        }
        
        return `
            <tr class="${isLowStock || isExpired ? 'table-warning' : ''}">
                <td>
                    <div class="d-flex align-items-center">
                        <i class="bi bi-capsule me-2 text-primary"></i>
                        <div>
                            <div class="fw-bold">${obat.nama}</div>
                            ${isExpired ? '<small class="text-danger"><i class="bi bi-exclamation-triangle me-1"></i>Kadaluarsa</small>' : ''}
                            ${isExpiringSoon && !isExpired ? '<small class="text-warning"><i class="bi bi-clock me-1"></i>Segera kadaluarsa</small>' : ''}
                        </div>
                    </div>
                </td>
                <td>
                    <span class="badge bg-secondary">${obat.jenis}</span>
                </td>
                <td>
                    <div class="d-flex align-items-center">
                        <span class="fw-bold me-2">${obat.stok}</span>
                        <span class="badge ${stockBadge}">${stockText}</span>
                    </div>
                </td>
                <td class="${expiryClass}">
                    <div>
                        <div>${formatDate(obat.tanggal_kadaluarsa)}</div>
                        <small class="text-muted">${getDaysUntilExpiry(obat.tanggal_kadaluarsa)}</small>
                    </div>
                </td>
                <td>
                    <div class="text-truncate" style="max-width: 200px;" title="${obat.deskripsi}">
                        ${obat.deskripsi || '-'}
                    </div>
                </td>
                <td>
                    <div class="btn-group btn-group-sm">
                        <button class="btn btn-outline-primary" onclick="editObat(${obat.id})" title="Edit">
                            <i class="bi bi-pencil"></i>
                        </button>
                        <button class="btn btn-outline-danger" onclick="deleteObat(${obat.id})" title="Hapus">
                            <i class="bi bi-trash"></i>
                        </button>
                    </div>
                </td>
            </tr>
        `;
    }).join('');
}

/**
 * Setup event listeners
 */
function setupEventListeners() {
    // Search functionality
    const searchInput = document.getElementById('searchObat');
    if (searchInput) {
        searchInput.addEventListener('input', handleSearch);
    }
    
    // Filter functionality
    const filterJenis = document.getElementById('filterJenis');
    if (filterJenis) {
        filterJenis.addEventListener('change', handleFilter);
    }
    
    const filterStok = document.getElementById('filterStok');
    if (filterStok) {
        filterStok.addEventListener('change', handleFilter);
    }
    
    // Add obat form
    const addObatForm = document.getElementById('addObatForm');
    if (addObatForm) {
        addObatForm.addEventListener('submit', handleAddObat);
    }
    
    // Edit obat form
    const editObatForm = document.getElementById('editObatForm');
    if (editObatForm) {
        editObatForm.addEventListener('submit', handleEditObat);
    }
    
    // Delete confirmation
    const confirmDeleteBtn = document.getElementById('confirmDeleteBtn');
    if (confirmDeleteBtn) {
        confirmDeleteBtn.addEventListener('click', handleDeleteObat);
    }
}

/**
 * Handle search functionality
 */
function handleSearch() {
    const searchTerm = document.getElementById('searchObat').value.toLowerCase();
    applyFilters(searchTerm);
}

/**
 * Handle filter functionality
 */
function handleFilter() {
    const searchTerm = document.getElementById('searchObat').value.toLowerCase();
    applyFilters(searchTerm);
}

/**
 * Apply search and filters
 */
function applyFilters(searchTerm = '') {
    const jenisFilter = document.getElementById('filterJenis').value;
    const stokFilter = document.getElementById('filterStok').value;
    
    filteredData = obatData.filter(obat => {
        // Search filter
        const matchesSearch = searchTerm === '' || 
            obat.nama.toLowerCase().includes(searchTerm) ||
            obat.jenis.toLowerCase().includes(searchTerm) ||
            (obat.deskripsi && obat.deskripsi.toLowerCase().includes(searchTerm));
        
        // Jenis filter
        const matchesJenis = jenisFilter === '' || obat.jenis === jenisFilter;
        
        // Stok filter
        let matchesStok = true;
        if (stokFilter === 'rendah') {
            matchesStok = obat.stok < 5;
        } else if (stokFilter === 'normal') {
            matchesStok = obat.stok >= 5;
        }
        
        return matchesSearch && matchesJenis && matchesStok;
    });
    
    renderObatTable();
}

/**
 * Handle add obat form submission with enhanced UX
 */
async function handleAddObat(event) {
    event.preventDefault();
    
    const formData = {
        nama: document.getElementById('namaObat').value.trim(),
        jenis: document.getElementById('jenisObat').value,
        stok: parseInt(document.getElementById('stokObat').value),
        tanggal_kadaluarsa: document.getElementById('tanggalKadaluarsa').value,
        deskripsi: document.getElementById('deskripsiObat').value.trim()
    };
    
    // Enhanced validation
    const validation = validateObatForm(formData);
    if (!validation.isValid) {
        // Show validation errors with shake animation
        const form = event.target;
        form.classList.add('shake');
        setTimeout(() => form.classList.remove('shake'), 500);
        
        showToast(validation.errors.join('<br>'), 'error');
        return;
    }
    
    // Show warnings if any
    if (validation.hasWarnings) {
        const confirmWarnings = await showConfirmDialog(
            'Peringatan',
            `Ada beberapa peringatan:\n${validation.warnings.join('\n')}\n\nLanjutkan menyimpan?`
        );
        if (!confirmWarnings) return;
    }
    
    try {
        // Enhanced loading state
        const submitBtn = event.target.querySelector('button[type="submit"]');
        const originalText = submitBtn.innerHTML;
        submitBtn.classList.add('loading');
        submitBtn.disabled = true;
        
        // Show progress toast
        const progressToast = showToast('Menyimpan obat...', 'info', 0);
        
        // Use API wrapper
        const response = await api.addObat(formData);
        
        if (response.success) {
            // Add to local data
            obatData.push(response.data);
            
            // Refresh table with animation
            applyFilters();
            
            // Close modal and reset form
            const modal = bootstrap.Modal.getInstance(document.getElementById('addObatModal'));
            modal.hide();
            event.target.reset();
            
            // Remove validation classes
            const inputs = event.target.querySelectorAll('.form-control');
            inputs.forEach(input => {
                input.classList.remove('is-valid', 'is-invalid');
            });
            
            showToast('Obat berhasil ditambahkan', 'success');
        } else {
            throw new Error(response.message || 'Gagal menambahkan obat');
        }
        
    } catch (error) {
        console.error('Error adding obat:', error);
        showToast(`Gagal menambahkan obat: ${error.message}`, 'error');
    } finally {
        // Reset button state
        const submitBtn = event.target.querySelector('button[type="submit"]');
        submitBtn.classList.remove('loading');
        submitBtn.disabled = false;
    }
}

/**
 * Show confirmation dialog
 * @param {string} title - Dialog title
 * @param {string} message - Dialog message
 * @returns {Promise<boolean>} User confirmation
 */
function showConfirmDialog(title, message) {
    return new Promise((resolve) => {
        // Create modal if it doesn't exist
        let confirmModal = document.getElementById('confirmModal');
        if (!confirmModal) {
            confirmModal = document.createElement('div');
            confirmModal.id = 'confirmModal';
            confirmModal.className = 'modal fade';
            confirmModal.innerHTML = `
                <div class="modal-dialog">
                    <div class="modal-content">
                        <div class="modal-header">
                            <h5 class="modal-title" id="confirmModalTitle">${title}</h5>
                            <button type="button" class="btn-close" data-bs-dismiss="modal"></button>
                        </div>
                        <div class="modal-body" id="confirmModalBody">
                            ${message.replace(/\n/g, '<br>')}
                        </div>
                        <div class="modal-footer">
                            <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">Batal</button>
                            <button type="button" class="btn btn-primary" id="confirmModalOk">Ya, Lanjutkan</button>
                        </div>
                    </div>
                </div>
            `;
            document.body.appendChild(confirmModal);
        } else {
            document.getElementById('confirmModalTitle').textContent = title;
            document.getElementById('confirmModalBody').innerHTML = message.replace(/\n/g, '<br>');
        }
        
        const modal = new bootstrap.Modal(confirmModal);
        
        // Handle OK button
        const okBtn = document.getElementById('confirmModalOk');
        const handleOk = () => {
            modal.hide();
            resolve(true);
            okBtn.removeEventListener('click', handleOk);
        };
        okBtn.addEventListener('click', handleOk);
        
        // Handle modal close
        const handleClose = () => {
            resolve(false);
            confirmModal.removeEventListener('hidden.bs.modal', handleClose);
        };
        confirmModal.addEventListener('hidden.bs.modal', handleClose);
        
        modal.show();
    });
}

/**
 * Enhanced obat form validation with detailed rules
 */
function validateObatForm(data) {
    const validationRules = [
        {
            name: 'nama',
            rules: {
                required: true,
                minLength: 2,
                maxLength: 100,
                pattern: /^[a-zA-Z0-9\s\-\+\%]+$/,
                patternMessage: 'Nama obat hanya boleh mengandung huruf, angka, spasi, tanda hubung, plus, dan persen'
            }
        },
        {
            name: 'jenis',
            rules: {
                required: true
            }
        },
        {
            name: 'stok',
            rules: {
                required: true,
                min: 0,
                max: 10000,
                warnIfLow: 5
            }
        },
        {
            name: 'tanggal_kadaluarsa',
            rules: {
                required: true,
                dateNotPast: true,
                warnIfExpiringSoon: true
            }
        }
    ];
    
    const validation = validateFormData(data, validationRules);
    
    // Additional custom validations
    if (data.tanggal_kadaluarsa) {
        const expiryDate = new Date(data.tanggal_kadaluarsa);
        const today = new Date();
        today.setHours(0, 0, 0, 0);
        
        if (expiryDate < today) {
            validation.errors.push('Tanggal kadaluarsa tidak boleh di masa lalu');
            validation.isValid = false;
        }
        
        // Check if expiring within 30 days
        const daysUntilExpiry = Math.ceil((expiryDate - today) / (1000 * 60 * 60 * 24));
        if (daysUntilExpiry <= 30 && daysUntilExpiry > 0) {
            validation.warnings.push(`Obat akan kadaluarsa dalam ${daysUntilExpiry} hari`);
        }
    }
    
    // Check for low stock
    if (data.stok && parseInt(data.stok) < 5) {
        validation.warnings.push(`Stok obat rendah (${data.stok} unit)`);
    }
    
    return validation;
}

/**
 * Setup form validation with enhanced rules
 */
function setupFormValidation() {
    // Set minimum date for expiry date to today
    const today = new Date().toISOString().split('T')[0];
    const expiryInput = document.getElementById('tanggalKadaluarsa');
    const editExpiryInput = document.getElementById('editTanggalKadaluarsa');
    
    if (expiryInput) {
        expiryInput.min = today;
    }
    if (editExpiryInput) {
        editExpiryInput.min = today;
    }
    
    // Setup real-time validation for add form
    const addFormRules = {
        namaObat: {
            required: true,
            minLength: 2,
            maxLength: 100,
            label: 'Nama Obat'
        },
        jenisObat: {
            required: true,
            label: 'Jenis Obat'
        },
        stokObat: {
            required: true,
            min: 0,
            max: 10000,
            warnIfLow: 5,
            label: 'Stok'
        },
        tanggalKadaluarsa: {
            required: true,
            dateNotPast: true,
            warnIfExpiringSoon: true,
            label: 'Tanggal Kadaluarsa'
        },
        deskripsiObat: {
            maxLength: 500,
            label: 'Deskripsi'
        }
    };
    
    setupRealtimeValidation('addObatForm', addFormRules);
    
    // Setup real-time validation for edit form
    const editFormRules = {
        editNamaObat: {
            required: true,
            minLength: 2,
            maxLength: 100,
            label: 'Nama Obat'
        },
        editJenisObat: {
            required: true,
            label: 'Jenis Obat'
        },
        editStokObat: {
            required: true,
            min: 0,
            max: 10000,
            warnIfLow: 5,
            label: 'Stok'
        },
        editTanggalKadaluarsa: {
            required: true,
            dateNotPast: true,
            warnIfExpiringSoon: true,
            label: 'Tanggal Kadaluarsa'
        },
        editDeskripsiObat: {
            maxLength: 500,
            label: 'Deskripsi'
        }
    };
    
    setupRealtimeValidation('editObatForm', editFormRules);
}

/**
 * Edit obat functionality
 */
function editObat(id) {
    const obat = obatData.find(o => o.id === id);
    if (!obat) {
        showAlert('Obat tidak ditemukan', 'danger');
        return;
    }
    
    // Populate edit form
    document.getElementById('editObatId').value = obat.id;
    document.getElementById('editNamaObat').value = obat.nama;
    document.getElementById('editJenisObat').value = obat.jenis;
    document.getElementById('editStokObat').value = obat.stok;
    document.getElementById('editTanggalKadaluarsa').value = obat.tanggal_kadaluarsa;
    document.getElementById('editDeskripsiObat').value = obat.deskripsi || '';
    
    // Show edit modal
    const editModal = new bootstrap.Modal(document.getElementById('editObatModal'));
    editModal.show();
}

/**
 * Delete obat functionality
 */
function deleteObat(id) {
    const obat = obatData.find(o => o.id === id);
    if (!obat) {
        showAlert('Obat tidak ditemukan', 'danger');
        return;
    }
    
    // Set obat name in confirmation modal
    document.getElementById('deleteObatName').textContent = obat.nama;
    
    // Store ID for deletion
    document.getElementById('confirmDeleteBtn').setAttribute('data-obat-id', id);
    
    // Show delete confirmation modal
    const deleteModal = new bootstrap.Modal(document.getElementById('deleteObatModal'));
    deleteModal.show();
}

/**
 * Show table loading state
 */
function showTableLoading() {
    const tableBody = document.getElementById('obatTableBody');
    if (tableBody) {
        tableBody.innerHTML = `
            <tr>
                <td colspan="6" class="text-center">
                    <div class="spinner-border" role="status">
                        <span class="visually-hidden">Loading...</span>
                    </div>
                    <p class="mt-2 mb-0">Memuat data obat...</p>
                </td>
            </tr>
        `;
    }
}

/**
 * Show table error state
 */
function showTableError(message) {
    const tableBody = document.getElementById('obatTableBody');
    if (tableBody) {
        tableBody.innerHTML = `
            <tr>
                <td colspan="6" class="text-center text-danger">
                    <i class="bi bi-exclamation-triangle me-2"></i>
                    ${message}
                    <br>
                    <button class="btn btn-sm btn-outline-primary mt-2" onclick="loadObatData()">
                        <i class="bi bi-arrow-clockwise me-1"></i>Coba Lagi
                    </button>
                </td>
            </tr>
        `;
    }
}

/**
 * Get days until expiry
 */
function getDaysUntilExpiry(expiryDate) {
    const today = new Date();
    const expiry = new Date(expiryDate);
    const diffTime = expiry - today;
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    
    if (diffDays < 0) {
        return `Kadaluarsa ${Math.abs(diffDays)} hari lalu`;
    } else if (diffDays === 0) {
        return 'Kadaluarsa hari ini';
    } else if (diffDays === 1) {
        return 'Kadaluarsa besok';
    } else if (diffDays <= 30) {
        return `${diffDays} hari lagi`;
    } else if (diffDays <= 365) {
        const months = Math.floor(diffDays / 30);
        return `${months} bulan lagi`;
    } else {
        const years = Math.floor(diffDays / 365);
        return `${years} tahun lagi`;
    }
}

/**
 * Handle edit obat form submission
 */
async function handleEditObat(event) {
    event.preventDefault();
    
    const obatId = parseInt(document.getElementById('editObatId').value);
    const formData = {
        nama: document.getElementById('editNamaObat').value.trim(),
        jenis: document.getElementById('editJenisObat').value,
        stok: parseInt(document.getElementById('editStokObat').value),
        tanggal_kadaluarsa: document.getElementById('editTanggalKadaluarsa').value,
        deskripsi: document.getElementById('editDeskripsiObat').value.trim()
    };
    
    // Validate form
    const validation = validateObatForm(formData);
    if (!validation.isValid) {
        showAlert(validation.errors.join('<br>'), 'danger');
        return;
    }
    
    try {
        // Show loading state
        const submitBtn = event.target.querySelector('button[type="submit"]');
        const originalText = submitBtn.innerHTML;
        submitBtn.disabled = true;
        submitBtn.innerHTML = '<span class="spinner-border spinner-border-sm me-2"></span>Mengupdate...';
        
        // Use API wrapper
        const response = await api.updateObat(obatId, formData);
        
        if (response.success) {
            // Update local data
            const obatIndex = obatData.findIndex(o => o.id === obatId);
            if (obatIndex !== -1) {
                obatData[obatIndex] = response.data;
            }
            
            // Refresh table
            applyFilters();
            
            // Close modal and reset form
            const modal = bootstrap.Modal.getInstance(document.getElementById('editObatModal'));
            modal.hide();
            event.target.reset();
            
            showAlert('Obat berhasil diupdate', 'success');
        } else {
            throw new Error(response.message || 'Gagal mengupdate obat');
        }
        
    } catch (error) {
        console.error('Error updating obat:', error);
        showAlert('Gagal mengupdate obat', 'danger');
    } finally {
        // Reset button state
        const submitBtn = event.target.querySelector('button[type="submit"]');
        submitBtn.disabled = false;
        submitBtn.innerHTML = 'Update Obat';
    }
}

/**
 * Handle delete obat
 */
async function handleDeleteObat() {
    const obatId = parseInt(document.getElementById('confirmDeleteBtn').getAttribute('data-obat-id'));
    
    try {
        // Show loading state
        const deleteBtn = document.getElementById('confirmDeleteBtn');
        const originalText = deleteBtn.innerHTML;
        deleteBtn.disabled = true;
        deleteBtn.innerHTML = '<span class="spinner-border spinner-border-sm me-2"></span>Menghapus...';
        
        // Use API wrapper
        const response = await api.deleteObat(obatId);
        
        if (response.success) {
            // Remove from local data
            obatData = obatData.filter(o => o.id !== obatId);
            
            // Refresh table
            applyFilters();
            
            // Close modal
            const modal = bootstrap.Modal.getInstance(document.getElementById('deleteObatModal'));
            modal.hide();
            
            showAlert('Obat berhasil dihapus', 'success');
        } else {
            throw new Error(response.message || 'Gagal menghapus obat');
        }
        
    } catch (error) {
        console.error('Error deleting obat:', error);
        showAlert('Gagal menghapus obat', 'danger');
    } finally {
        // Reset button state
        const deleteBtn = document.getElementById('confirmDeleteBtn');
        deleteBtn.disabled = false;
        deleteBtn.innerHTML = 'Hapus Obat';
    }
}

/**
 * Refresh obat data
 */
async function refreshObatData() {
    await loadObatData();
    showAlert('Data inventaris berhasil diperbarui', 'success');
}

// Export functions for global access
window.editObat = editObat;
window.deleteObat = deleteObat;
window.refreshObatData = refreshObatData;