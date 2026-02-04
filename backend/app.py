# Flask Application untuk Sistem UKS Sekolah
from flask import Flask, jsonify, request
from flask_cors import CORS
from flask_sqlalchemy import SQLAlchemy
from datetime import datetime
import os
from config import Config

# Initialize Flask app
app = Flask(__name__)
app.config.from_object(Config)

# Initialize extensions
db = SQLAlchemy(app)
CORS(app, origins=['*'])  # Allow all origins for deployment

# Define models here to avoid circular imports
class Obat(db.Model):
    """Model untuk data obat/inventaris"""
    __tablename__ = 'obat'
    
    id = db.Column(db.Integer, primary_key=True)
    nama = db.Column(db.String(100), nullable=False)
    jenis = db.Column(db.String(50), nullable=False)
    stok = db.Column(db.Integer, nullable=False, default=0)
    tanggal_kadaluarsa = db.Column(db.Date, nullable=False)
    deskripsi = db.Column(db.Text)
    created_at = db.Column(db.DateTime, default=datetime.utcnow)
    updated_at = db.Column(db.DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)
    
    def to_dict(self):
        return {
            'id': self.id,
            'nama': self.nama,
            'jenis': self.jenis,
            'stok': self.stok,
            'tanggal_kadaluarsa': self.tanggal_kadaluarsa.isoformat() if self.tanggal_kadaluarsa else None,
            'deskripsi': self.deskripsi,
            'created_at': self.created_at.isoformat() if self.created_at else None,
            'updated_at': self.updated_at.isoformat() if self.updated_at else None
        }

class Pasien(db.Model):
    """Model untuk data kunjungan pasien"""
    __tablename__ = 'pasien'
    
    id = db.Column(db.Integer, primary_key=True)
    nama = db.Column(db.String(100), nullable=False)
    kelas_jabatan = db.Column(db.String(50), nullable=False)
    tanggal_kunjungan = db.Column(db.Date, nullable=False)
    waktu_kunjungan = db.Column(db.Time, nullable=False)
    keluhan = db.Column(db.Text, nullable=False)
    diagnosa = db.Column(db.Text)
    obat_diberikan = db.Column(db.Text)
    created_at = db.Column(db.DateTime, default=datetime.utcnow)
    
    def to_dict(self):
        return {
            'id': self.id,
            'nama': self.nama,
            'kelas_jabatan': self.kelas_jabatan,
            'tanggal_kunjungan': self.tanggal_kunjungan.isoformat() if self.tanggal_kunjungan else None,
            'waktu_kunjungan': self.waktu_kunjungan.strftime('%H:%M') if self.waktu_kunjungan else None,
            'keluhan': self.keluhan,
            'diagnosa': self.diagnosa,
            'obat_diberikan': self.obat_diberikan,
            'created_at': self.created_at.isoformat() if self.created_at else None
        }

# Create database tables
with app.app_context():
    db.create_all()

# ==================== BASIC ROUTES ====================

@app.route('/')
def index():
    return jsonify({
        'message': 'Sistem UKS Sekolah API',
        'version': '1.0.0',
        'status': 'Running',
        'endpoints': {
            'health': '/api/health',
            'obat': '/api/obat',
            'pasien': '/api/pasien',
            'dashboard': '/api/dashboard'
        }
    })

@app.route('/api/health')
def health_check():
    return jsonify({
        'status': 'OK',
        'message': 'API is running',
        'database': 'Connected',
        'timestamp': datetime.now().isoformat()
    })

# ==================== OBAT ENDPOINTS ====================

@app.route('/api/obat', methods=['GET'])
def get_all_obat():
    try:
        obat_list = Obat.query.all()
        return jsonify({
            'success': True,
            'data': [obat.to_dict() for obat in obat_list],
            'message': 'Data obat berhasil diambil'
        })
    except Exception as e:
        return jsonify({
            'success': False,
            'message': f'Error: {str(e)}'
        }), 500

@app.route('/api/obat', methods=['POST'])
def add_obat():
    try:
        data = request.get_json()
        
        # Validate required fields
        required_fields = ['nama', 'jenis', 'stok', 'tanggal_kadaluarsa']
        for field in required_fields:
            if field not in data:
                return jsonify({
                    'success': False,
                    'message': f'Field {field} harus diisi'
                }), 400
        
        # Create new obat
        obat = Obat(
            nama=data['nama'],
            jenis=data['jenis'],
            stok=data['stok'],
            tanggal_kadaluarsa=datetime.strptime(data['tanggal_kadaluarsa'], '%Y-%m-%d').date(),
            deskripsi=data.get('deskripsi', '')
        )
        
        db.session.add(obat)
        db.session.commit()
        
        return jsonify({
            'success': True,
            'data': obat.to_dict(),
            'message': 'Obat berhasil ditambahkan'
        }), 201
        
    except Exception as e:
        db.session.rollback()
        return jsonify({
            'success': False,
            'message': f'Error: {str(e)}'
        }), 500

@app.route('/api/obat/<int:obat_id>', methods=['PUT'])
def update_obat(obat_id):
    try:
        obat = Obat.query.get_or_404(obat_id)
        data = request.get_json()
        
        # Update fields
        if 'nama' in data:
            obat.nama = data['nama']
        if 'jenis' in data:
            obat.jenis = data['jenis']
        if 'stok' in data:
            obat.stok = data['stok']
        if 'tanggal_kadaluarsa' in data:
            obat.tanggal_kadaluarsa = datetime.strptime(data['tanggal_kadaluarsa'], '%Y-%m-%d').date()
        if 'deskripsi' in data:
            obat.deskripsi = data['deskripsi']
        
        obat.updated_at = datetime.utcnow()
        db.session.commit()
        
        return jsonify({
            'success': True,
            'data': obat.to_dict(),
            'message': 'Obat berhasil diupdate'
        })
        
    except Exception as e:
        db.session.rollback()
        return jsonify({
            'success': False,
            'message': f'Error: {str(e)}'
        }), 500

@app.route('/api/obat/<int:obat_id>', methods=['DELETE'])
def delete_obat(obat_id):
    try:
        obat = Obat.query.get_or_404(obat_id)
        db.session.delete(obat)
        db.session.commit()
        
        return jsonify({
            'success': True,
            'message': 'Obat berhasil dihapus'
        })
        
    except Exception as e:
        db.session.rollback()
        return jsonify({
            'success': False,
            'message': f'Error: {str(e)}'
        }), 500

# ==================== PASIEN ENDPOINTS ====================

@app.route('/api/pasien', methods=['GET'])
def get_all_pasien():
    try:
        pasien_list = Pasien.query.order_by(Pasien.tanggal_kunjungan.desc(), Pasien.waktu_kunjungan.desc()).all()
        return jsonify({
            'success': True,
            'data': [pasien.to_dict() for pasien in pasien_list],
            'message': 'Data pasien berhasil diambil'
        })
    except Exception as e:
        return jsonify({
            'success': False,
            'message': f'Error: {str(e)}'
        }), 500

@app.route('/api/pasien', methods=['POST'])
def add_pasien():
    try:
        data = request.get_json()
        
        # Validate required fields
        required_fields = ['nama', 'kelas_jabatan', 'tanggal_kunjungan', 'waktu_kunjungan', 'keluhan']
        for field in required_fields:
            if field not in data:
                return jsonify({
                    'success': False,
                    'message': f'Field {field} harus diisi'
                }), 400
        
        # Create new pasien
        pasien = Pasien(
            nama=data['nama'],
            kelas_jabatan=data['kelas_jabatan'],
            tanggal_kunjungan=datetime.strptime(data['tanggal_kunjungan'], '%Y-%m-%d').date(),
            waktu_kunjungan=datetime.strptime(data['waktu_kunjungan'], '%H:%M').time(),
            keluhan=data['keluhan'],
            diagnosa=data.get('diagnosa', ''),
            obat_diberikan=data.get('obat_diberikan', '')
        )
        
        db.session.add(pasien)
        db.session.commit()
        
        return jsonify({
            'success': True,
            'data': pasien.to_dict(),
            'message': 'Kunjungan pasien berhasil dicatat'
        }), 201
        
    except Exception as e:
        db.session.rollback()
        return jsonify({
            'success': False,
            'message': f'Error: {str(e)}'
        }), 500

@app.route('/api/pasien/search')
def search_pasien():
    try:
        query = request.args.get('q', '')
        if not query:
            return jsonify({
                'success': False,
                'message': 'Query parameter q is required'
            }), 400
        
        pasien_list = Pasien.query.filter(
            (Pasien.nama.contains(query)) |
            (Pasien.kelas_jabatan.contains(query)) |
            (Pasien.keluhan.contains(query))
        ).order_by(Pasien.tanggal_kunjungan.desc()).all()
        
        return jsonify({
            'success': True,
            'data': [pasien.to_dict() for pasien in pasien_list],
            'message': f'Ditemukan {len(pasien_list)} hasil pencarian'
        })
        
    except Exception as e:
        return jsonify({
            'success': False,
            'message': f'Error: {str(e)}'
        }), 500

@app.route('/api/pasien/harian')
def get_daily_report():
    try:
        date_str = request.args.get('date')
        if not date_str:
            date_str = datetime.now().strftime('%Y-%m-%d')
        
        target_date = datetime.strptime(date_str, '%Y-%m-%d').date()
        pasien_list = Pasien.query.filter_by(tanggal_kunjungan=target_date).order_by(Pasien.waktu_kunjungan).all()
        
        return jsonify({
            'success': True,
            'data': [pasien.to_dict() for pasien in pasien_list],
            'date': date_str,
            'total': len(pasien_list),
            'message': f'Laporan harian untuk {date_str}'
        })
        
    except Exception as e:
        return jsonify({
            'success': False,
            'message': f'Error: {str(e)}'
        }), 500

# ==================== DASHBOARD ENDPOINTS ====================

@app.route('/api/dashboard/stats')
def get_dashboard_stats():
    try:
        # Get statistics
        total_obat = Obat.query.count()
        
        # Patients today
        today = datetime.now().date()
        pasien_hari_ini = Pasien.query.filter_by(tanggal_kunjungan=today).count()
        
        # Low stock medicines (< 5)
        stok_rendah = Obat.query.filter(Obat.stok < 5).count()
        
        # Expired medicines
        obat_kadaluarsa = Obat.query.filter(Obat.tanggal_kadaluarsa < today).count()
        
        return jsonify({
            'success': True,
            'data': {
                'totalObat': total_obat,
                'pasienHariIni': pasien_hari_ini,
                'stokRendah': stok_rendah,
                'obatKadaluarsa': obat_kadaluarsa
            },
            'message': 'Statistik dashboard berhasil diambil'
        })
        
    except Exception as e:
        return jsonify({
            'success': False,
            'message': f'Error: {str(e)}'
        }), 500

@app.route('/api/dashboard/notifications')
def get_notifications():
    try:
        notifications = []
        today = datetime.now().date()
        
        # Check for low stock
        low_stock_obat = Obat.query.filter(Obat.stok < 5).all()
        for obat in low_stock_obat:
            notifications.append({
                'type': 'warning',
                'message': f'Stok {obat.nama} tinggal {obat.stok} unit',
                'timestamp': datetime.now().isoformat()
            })
        
        # Check for expired medicines
        expired_obat = Obat.query.filter(Obat.tanggal_kadaluarsa < today).all()
        for obat in expired_obat:
            notifications.append({
                'type': 'danger',
                'message': f'{obat.nama} sudah kadaluarsa',
                'timestamp': datetime.now().isoformat()
            })
        
        if not notifications:
            notifications.append({
                'type': 'success',
                'message': 'Semua sistem berjalan normal',
                'timestamp': datetime.now().isoformat()
            })
        
        return jsonify({
            'success': True,
            'data': notifications,
            'message': 'Notifikasi berhasil diambil'
        })
        
    except Exception as e:
        return jsonify({
            'success': False,
            'message': f'Error: {str(e)}'
        }), 500

# ==================== ERROR HANDLERS ====================

@app.errorhandler(404)
def not_found(error):
    return jsonify({
        'success': False,
        'message': 'Endpoint tidak ditemukan'
    }), 404

@app.errorhandler(500)
def internal_error(error):
    db.session.rollback()
    return jsonify({
        'success': False,
        'message': 'Terjadi kesalahan server internal'
    }), 500

if __name__ == '__main__':
    port = int(os.environ.get('PORT', 5000))
    app.run(debug=False, host='0.0.0.0', port=port)