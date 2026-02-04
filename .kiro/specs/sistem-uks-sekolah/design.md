# Design Document - Sistem UKS Sekolah

## Overview

Sistem UKS Sekolah adalah aplikasi web sederhana yang terdiri dari frontend HTML/CSS/JavaScript dan backend Python Flask. Design ini mengutamakan kesederhanaan dan kemudahan pemahaman, dengan fokus pengembangan frontend terlebih dahulu untuk memvalidasi user interface sebelum implementasi backend yang kompleks.

## Architecture

### High-Level Architecture

```
┌─────────────────┐    HTTP/AJAX    ┌─────────────────┐    SQLite    ┌─────────────┐
│   Frontend      │ ──────────────► │   Backend       │ ───────────► │  Database   │
│   (HTML/CSS/JS) │                 │   (Python Flask)│              │  (SQLite)   │
└─────────────────┘                 └─────────────────┘              └─────────────┘
```

### Technology Stack

**Frontend:**
- HTML5 untuk struktur halaman
- CSS3 untuk styling dan responsive design
- Vanilla JavaScript untuk interaktivitas
- Bootstrap 5 untuk komponen UI yang konsisten

**Backend:**
- Python 3.8+ dengan Flask framework
- SQLite untuk database (ringan dan mudah setup)
- Flask-CORS untuk handling cross-origin requests

**Development Approach:**
1. **Frontend-First**: Buat mockup frontend dengan data dummy
2. **API Design**: Definisikan API endpoints yang dibutuhkan
3. **Backend Implementation**: Implementasi backend sesuai API yang sudah didefinisikan
4. **Integration**: Hubungkan frontend dengan backend

## Components and Interfaces

### Frontend Components

#### 1. Layout Components
- **Header Component**: Navigasi utama dan judul aplikasi
- **Sidebar Component**: Menu navigasi untuk inventaris obat dan data pasien
- **Main Content Area**: Area konten utama yang berubah sesuai menu

#### 2. Inventaris Obat Components
- **Daftar Obat Component**: Tabel untuk menampilkan semua obat
- **Form Tambah Obat Component**: Form untuk menambahkan obat baru
- **Form Edit Obat Component**: Form untuk mengedit data obat
- **Alert Stok Rendah Component**: Notifikasi untuk obat dengan stok rendah

#### 3. Data Pasien Components
- **Daftar Pasien Component**: Tabel untuk menampilkan riwayat pasien
- **Form Tambah Pasien Component**: Form untuk mencatat kunjungan pasien baru
- **Search Pasien Component**: Fitur pencarian pasien
- **Laporan Harian Component**: Tampilan laporan pasien harian

### API Endpoints Design

#### Inventaris Obat Endpoints
```
GET    /api/obat              - Mendapatkan semua data obat
POST   /api/obat              - Menambahkan obat baru
PUT    /api/obat/{id}         - Mengupdate data obat
DELETE /api/obat/{id}         - Menghapus obat
GET    /api/obat/stok-rendah  - Mendapatkan obat dengan stok rendah
```

#### Data Pasien Endpoints
```
GET    /api/pasien            - Mendapatkan semua data pasien
POST   /api/pasien            - Menambahkan kunjungan pasien baru
GET    /api/pasien/search     - Mencari pasien berdasarkan nama/kelas
GET    /api/pasien/harian     - Mendapatkan laporan pasien harian
POST   /api/pasien/obat       - Mencatat pemberian obat ke pasien
```

### Frontend State Management

Menggunakan vanilla JavaScript dengan pola sederhana:
- **Global State Object**: Menyimpan data aplikasi sementara
- **Event-Driven Updates**: Update UI berdasarkan user actions
- **Local Storage**: Menyimpan preferensi user (opsional)

## Data Models

### Model Obat
```javascript
{
  id: number,
  nama: string,
  jenis: string,
  stok: number,
  tanggal_kadaluarsa: string (YYYY-MM-DD),
  deskripsi: string,
  created_at: string (ISO datetime),
  updated_at: string (ISO datetime)
}
```

### Model Pasien
```javascript
{
  id: number,
  nama: string,
  kelas_jabatan: string,
  keluhan: string,
  diagnosa: string,
  obat_diberikan: string,
  tanggal_kunjungan: string (YYYY-MM-DD),
  waktu_kunjungan: string (HH:MM),
  created_at: string (ISO datetime)
}
```

### Model Response API
```javascript
{
  success: boolean,
  message: string,
  data: object | array,
  error: string (optional)
}
```

## Frontend Implementation Details

### Page Structure

#### 1. Dashboard (index.html)
- Overview statistik (jumlah obat, pasien hari ini, stok rendah)
- Quick actions (tambah obat, tambah pasien)
- Notifikasi penting

#### 2. Inventaris Obat (inventaris.html)
- Tabel daftar obat dengan sorting dan filtering
- Modal untuk tambah/edit obat
- Alert untuk stok rendah
- Search dan filter berdasarkan jenis obat

#### 3. Data Pasien (pasien.html)
- Tabel riwayat kunjungan pasien
- Form untuk mencatat kunjungan baru
- Search berdasarkan nama/kelas
- Filter berdasarkan tanggal

### CSS Framework dan Styling

**Bootstrap 5 Components:**
- Grid system untuk responsive layout
- Cards untuk menampilkan informasi
- Tables untuk data tabular
- Forms untuk input data
- Modals untuk popup forms
- Alerts untuk notifikasi

**Custom CSS:**
- Color scheme yang sesuai tema kesehatan (hijau, biru)
- Typography yang mudah dibaca
- Spacing yang konsisten
- Hover effects untuk interaktivitas

### JavaScript Functionality

#### Core Functions
```javascript
// API Communication
async function fetchData(endpoint)
async function postData(endpoint, data)
async function updateData(endpoint, data)
async function deleteData(endpoint)

// UI Updates
function renderObatTable(data)
function renderPasienTable(data)
function showAlert(message, type)
function showModal(modalId)

// Form Handling
function handleObatForm(event)
function handlePasienForm(event)
function validateForm(formData)

// Search and Filter
function searchObat(query)
function searchPasien(query)
function filterByDate(startDate, endDate)
```

## Backend Architecture (Simplified)

### Flask Application Structure
```
app.py              # Main Flask application
models.py           # Database models
routes/
  ├── obat.py       # Obat-related routes
  └── pasien.py     # Pasien-related routes
database.py         # Database initialization
config.py           # Configuration settings
```

### Database Schema (SQLite)

#### Table: obat
```sql
CREATE TABLE obat (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    nama VARCHAR(100) NOT NULL,
    jenis VARCHAR(50) NOT NULL,
    stok INTEGER NOT NULL DEFAULT 0,
    tanggal_kadaluarsa DATE NOT NULL,
    deskripsi TEXT,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
);
```

#### Table: pasien
```sql
CREATE TABLE pasien (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    nama VARCHAR(100) NOT NULL,
    kelas_jabatan VARCHAR(50) NOT NULL,
    keluhan TEXT NOT NULL,
    diagnosa TEXT,
    obat_diberikan VARCHAR(200),
    tanggal_kunjungan DATE NOT NULL,
    waktu_kunjungan TIME NOT NULL,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP
);
```

## Correctness Properties

*A property is a characteristic or behavior that should hold true across all valid executions of a system-essentially, a formal statement about what the system should do. Properties serve as the bridge between human-readable specifications and machine-verifiable correctness guarantees.*

Berdasarkan analisis acceptance criteria, berikut adalah correctness properties yang dapat diuji secara otomatis:

### Property 1: Data Obat Persistence
*For any* obat yang ditambahkan dengan data valid (nama, jenis, stok, tanggal kadaluarsa, deskripsi), sistem harus menyimpan semua field tersebut dan dapat mengambilnya kembali dengan nilai yang sama
**Validates: Requirements 1.1**

### Property 2: Obat Display Completeness  
*For any* daftar obat yang ada di database, semua obat harus ditampilkan di UI dengan semua informasi lengkap (nama, jenis, stok, tanggal kadaluarsa, deskripsi)
**Validates: Requirements 1.2**

### Property 3: Stok Update Consistency
*For any* obat dan nilai stok baru yang valid, ketika stok diupdate, nilai stok harus berubah sesuai input dan timestamp updated_at harus diperbarui
**Validates: Requirements 1.3**

### Property 4: Obat Deletion Completeness
*For any* obat yang ada di sistem, setelah dihapus, obat tersebut tidak boleh muncul lagi di daftar inventaris atau hasil pencarian
**Validates: Requirements 1.4**

### Property 5: Obat Sorting by Expiry Date
*For any* daftar obat dengan tanggal kadaluarsa berbeda, sistem harus mengurutkan obat berdasarkan tanggal kadaluarsa terdekat (ascending order)
**Validates: Requirements 1.5**

### Property 6: Low Stock Alert Trigger
*For any* obat dengan stok kurang dari 5 unit, sistem harus menampilkan peringatan stok rendah
**Validates: Requirements 1.6**

### Property 7: Data Pasien Persistence
*For any* data pasien yang ditambahkan dengan informasi valid (nama, kelas/jabatan, keluhan, diagnosa, obat yang diberikan, tanggal kunjungan), sistem harus menyimpan semua field tersebut dengan benar
**Validates: Requirements 2.1**

### Property 8: Pasien History Completeness
*For any* data pasien yang tersimpan di database, semua kunjungan harus ditampilkan di riwayat pasien
**Validates: Requirements 2.2**

### Property 9: Pasien Search Functionality
*For any* query pencarian (nama atau kelas/jabatan), hasil pencarian harus mengembalikan semua pasien yang mengandung query tersebut di field nama atau kelas/jabatan
**Validates: Requirements 2.3**

### Property 10: Stock Reduction on Medicine Distribution
*For any* pemberian obat kepada pasien, stok obat yang sesuai di inventaris harus berkurang sesuai jumlah yang diberikan
**Validates: Requirements 2.4**

### Property 11: Stock Validation Before Distribution
*For any* pemberian obat, sistem harus memvalidasi ketersediaan stok yang cukup sebelum mengurangi jumlah stok
**Validates: Requirements 2.5**

### Property 12: Daily Report Filtering
*For any* tanggal tertentu, laporan harian harus menampilkan hanya pasien yang berobat pada tanggal tersebut
**Validates: Requirements 2.6**

### Property 13: Form Validation Consistency
*For any* form input yang tidak valid, sistem harus menampilkan pesan error yang informatif dan mencegah penyimpanan data yang salah
**Validates: Requirements 3.2**

### Property 14: Operation Feedback Consistency
*For any* operasi CRUD (tambah, edit, hapus), sistem harus memberikan konfirmasi keberhasilan atau pesan error yang jelas
**Validates: Requirements 3.3**

### Property 15: Data Persistence Reliability
*For any* data yang berhasil disimpan, data tersebut harus tetap ada dan dapat diakses setelah sistem direstart
**Validates: Requirements 4.1**

### Property 16: Error Handling Data Integrity
*For any* error yang terjadi saat penyimpanan, data yang sudah ada sebelumnya tidak boleh rusak atau hilang
**Validates: Requirements 4.2**

### Property 17: Data Format Consistency
*For any* operasi penyimpanan, data harus mengikuti schema yang telah ditentukan (format tanggal, tipe data, dll.)
**Validates: Requirements 4.3**

## Error Handling

### Frontend Error Handling
- **Network Errors**: Tampilkan pesan error jika koneksi ke backend gagal
- **Validation Errors**: Tampilkan pesan error di form jika input tidak valid
- **API Errors**: Tampilkan pesan error dari backend response
- **Loading States**: Tampilkan loading indicator saat proses berlangsung

### Backend Error Handling
- **Database Errors**: Handle error koneksi dan query database
- **Validation Errors**: Validasi input sebelum menyimpan ke database
- **HTTP Errors**: Return appropriate HTTP status codes
- **Exception Handling**: Catch dan handle semua exception dengan proper logging

### Error Response Format
```javascript
{
  success: false,
  message: "Pesan error yang user-friendly",
  error: "Technical error details (untuk debugging)",
  code: "ERROR_CODE"
}
```

## Testing Strategy

### Dual Testing Approach

Sistem akan menggunakan kombinasi unit testing dan property-based testing untuk memastikan correctness yang komprehensif:

**Unit Tests:**
- Test specific examples dan edge cases
- Test error conditions dan validation
- Test integration points antara frontend dan backend
- Focus pada concrete scenarios dan boundary conditions

**Property-Based Tests:**
- Test universal properties across all inputs menggunakan library seperti Hypothesis (Python)
- Generate random test data untuk comprehensive coverage
- Minimum 100 iterations per property test
- Each property test harus reference design document property dengan format tag: **Feature: sistem-uks-sekolah, Property {number}: {property_text}**

### Frontend Testing
- **Unit Tests**: Test individual JavaScript functions
- **Integration Tests**: Test API communication dan UI updates
- **Manual Testing**: Test user workflows dan responsive design

### Backend Testing
- **Unit Tests**: Test individual Flask routes dan database operations
- **Property Tests**: Test data persistence, validation, dan business logic properties
- **API Tests**: Test all endpoints dengan berbagai input scenarios

### Test Configuration
- Property tests minimum 100 iterations untuk randomization coverage
- Each correctness property harus diimplementasikan sebagai SINGLE property-based test
- Tag format untuk property tests: **Feature: sistem-uks-sekolah, Property {number}: {property_text}**
- Unit tests dan property tests adalah complementary - keduanya diperlukan untuk comprehensive coverage

### Testing Tools
- **Python Backend**: pytest untuk unit tests, Hypothesis untuk property-based testing
- **JavaScript Frontend**: Jest atau Mocha untuk unit tests
- **API Testing**: Postman atau automated API tests
- **Database Testing**: SQLite in-memory database untuk testing