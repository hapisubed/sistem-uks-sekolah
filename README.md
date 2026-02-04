# Sistem UKS Sekolah

Sistem manajemen Unit Kesehatan Sekolah (UKS) yang komprehensif untuk mengelola inventaris obat dan data kunjungan pasien.

## 🏥 Fitur Utama

### Dashboard
- **Overview Statistik**: Total obat, pasien hari ini, stok rendah, obat kadaluarsa
- **Notifikasi Cerdas**: Peringatan otomatis untuk stok rendah dan obat kadaluarsa
- **Quick Actions**: Akses cepat untuk menambah obat dan mencatat kunjungan pasien

### Inventaris Obat
- **Manajemen CRUD**: Tambah, edit, hapus, dan lihat data obat
- **Pencarian & Filter**: Cari berdasarkan nama, filter berdasarkan jenis dan stok
- **Peringatan Otomatis**: Visual indicator untuk stok rendah dan obat kadaluarsa
- **Sorting Cerdas**: Otomatis diurutkan berdasarkan tanggal kadaluarsa

### Data Pasien
- **Pencatatan Kunjungan**: Form lengkap untuk mencatat kunjungan pasien
- **Riwayat Pasien**: Tabel dengan pencarian dan filter berdasarkan tanggal/kelas
- **Laporan Harian**: Generate dan print laporan harian dengan statistik
- **Export Functionality**: Print-friendly laporan untuk dokumentasi

## 🛠️ Teknologi

### Frontend
- **HTML5 & CSS3**: Struktur dan styling modern
- **Bootstrap 5**: Framework UI responsif
- **JavaScript ES6+**: Interaktivitas dan API communication
- **Bootstrap Icons**: Icon set yang konsisten

### Backend
- **Python Flask**: Web framework yang ringan dan fleksibel
- **SQLAlchemy**: ORM untuk database management
- **SQLite**: Database yang mudah di-deploy
- **Flask-CORS**: Cross-origin resource sharing

## 📁 Struktur Project

```
sistem-uks-sekolah/
├── frontend/                 # Frontend application
│   ├── assets/
│   │   ├── css/
│   │   │   └── style.css    # Custom styling dengan tema kesehatan
│   │   ├── js/
│   │   │   ├── api.js       # API communication layer
│   │   │   ├── dashboard.js # Dashboard functionality
│   │   │   ├── inventaris.js# Inventory management
│   │   │   ├── pasien.js    # Patient data management
│   │   │   └── navigation.js# Navigation handling
│   │   └── images/          # Static assets
│   ├── index.html           # Dashboard page
│   ├── inventaris.html      # Inventory management page
│   └── pasien.html          # Patient data page
├── backend/                 # Backend API
│   ├── app.py              # Main Flask application
│   ├── config.py           # Configuration settings
│   └── requirements.txt    # Python dependencies
└── .kiro/                  # Specification files
    └── specs/
        └── sistem-uks-sekolah/
            ├── requirements.md
            ├── design.md
            └── tasks.md
```

## 🚀 Instalasi & Setup

### Prerequisites
- Python 3.8+
- Web browser modern (Chrome, Firefox, Safari, Edge)

### Quick Start (Development)

**Cara Tercepat:**
```bash
python start.py
```
Script ini akan otomatis menjalankan backend dan frontend, lalu membuka browser.

### Manual Setup

#### Backend Setup

1. **Install dependencies**:
   ```bash
   cd backend
   pip install -r requirements.txt
   ```

2. **Run the Flask application**:
   ```bash
   python app.py
   ```
   
   Server akan berjalan di `http://localhost:5000`

#### Frontend Setup

1. **Start development server**:
   ```bash
   cd frontend
   python -m http.server 8000
   ```
   
   Frontend akan tersedia di `http://localhost:8000`

2. **Atau buka langsung**:
   Buka file `frontend/index.html` di browser

## 🌐 Deployment Gratis

### Deployment Otomatis
```bash
python deploy.py
```

### Platform Rekomendasi

1. **Railway** (Termudah) - [railway.app](https://railway.app)
   - Setup 5 menit
   - Database PostgreSQL gratis
   - Auto-deploy dari Git

2. **Render** (Stabil) - [render.com](https://render.com)
   - 750 jam gratis/bulan
   - PostgreSQL database
   - Production-ready

3. **Vercel** (Cepat) - [vercel.com](https://vercel.com)
   - Global CDN
   - Serverless functions
   - Unlimited bandwidth

**Panduan lengkap:** Lihat file `DEPLOYMENT.md`

## 🔧 Konfigurasi

### API Configuration
Edit `frontend/assets/js/api.js` untuk mengatur mode API:

```javascript
const API_CONFIG = {
    USE_REAL_API: true,  // true = real backend, false = mock data
    BASE_URL: 'http://localhost:5000/api'
};
```

### Database Configuration
Edit `backend/config.py` untuk konfigurasi database:

```python
class Config:
    SECRET_KEY = 'your-secret-key'
    SQLALCHEMY_DATABASE_URI = 'sqlite:///uks_sekolah.db'
```

## 📊 API Endpoints

### Obat (Medicine)
- `GET /api/obat` - Get all medicines
- `POST /api/obat` - Add new medicine
- `PUT /api/obat/{id}` - Update medicine
- `DELETE /api/obat/{id}` - Delete medicine

### Pasien (Patient)
- `GET /api/pasien` - Get all patient visits
- `POST /api/pasien` - Record new patient visit
- `GET /api/pasien/search?q={query}` - Search patients
- `GET /api/pasien/harian?date={date}` - Daily report

### Dashboard
- `GET /api/dashboard/stats` - Get dashboard statistics
- `GET /api/dashboard/notifications` - Get system notifications

## 🎨 Tema & Styling

Sistem menggunakan tema kesehatan dengan palet warna:
- **Primary**: Hijau kesehatan (#2d6a4f)
- **Secondary**: Biru medis (#40916c)
- **Success**: Hijau sukses (#28a745)
- **Warning**: Orange peringatan (#ffc107)
- **Danger**: Merah bahaya (#dc3545)

## 📱 Responsive Design

- **Desktop**: Layout penuh dengan sidebar
- **Tablet**: Layout adaptif dengan navigation yang dapat dilipat
- **Mobile**: Layout stack dengan navigation hamburger

## 🔒 Keamanan

- **Input Validation**: Validasi client-side dan server-side
- **CORS Protection**: Konfigurasi CORS yang aman
- **SQL Injection Prevention**: Menggunakan SQLAlchemy ORM
- **Error Handling**: Comprehensive error handling di semua layer

## 📈 Fitur Lanjutan

### Smart Notifications
- Otomatis deteksi stok rendah (< 5 unit)
- Peringatan obat kadaluarsa
- Notifikasi real-time di dashboard

### Data Analytics
- Statistik kunjungan harian
- Tracking penggunaan obat
- Laporan yang dapat dicetak

### User Experience
- Loading states untuk semua operasi async
- Success/error feedback yang jelas
- Auto-refresh data setiap 5 menit
- Form validation real-time

## 🧪 Testing

Sistem telah ditest untuk:
- ✅ CRUD operations untuk obat dan pasien
- ✅ Search dan filtering functionality
- ✅ Responsive design di berbagai device
- ✅ Error handling dan edge cases
- ✅ API integration dan data consistency

## 📝 Development Notes

### Frontend-First Approach
Sistem dikembangkan dengan pendekatan frontend-first untuk validasi UI/UX sebelum implementasi backend yang kompleks.

### Mock Data Support
Sistem mendukung mode mock data untuk development dan testing tanpa backend.

### Incremental Development
Setiap fitur dikembangkan secara incremental dengan checkpoint untuk validasi.

## 🤝 Contributing

1. Fork the repository
2. Create feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit changes (`git commit -m 'Add AmazingFeature'`)
4. Push to branch (`git push origin feature/AmazingFeature`)
5. Open Pull Request

## 📄 License

Distributed under the MIT License. See `LICENSE` for more information.

## 👥 Team

Developed for school health unit management with focus on:
- **Usability**: Easy to use for school health staff
- **Reliability**: Robust data management
- **Scalability**: Can be extended for larger schools
- **Maintainability**: Clean, documented code

---

**Sistem UKS Sekolah** - Membantu mengelola kesehatan sekolah dengan lebih efisien dan terorganisir.