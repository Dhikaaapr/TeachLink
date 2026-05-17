"use client";
import { useState, useMemo, useEffect, useCallback } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import styles from "./dashboard-relawan.module.css";
import { useAuth } from "../../context/AuthContext";
import { apiRequestWithRetry } from "../../../utils/api";
import ProtectedRoute from "../../components/ProtectedRoute";

/* ─────────────── KONSTANTA ─────────────── */
const AV_COLORS  = ['#D85A30','#185FA5','#BA7517','#1D9E75','#993556','#534AB7'];
const MAPEL_COLOR = {
  1: { bg: 'var(--coral-light)', color: 'var(--coral)' },
  2: { bg: 'var(--blue-light)',  color: 'var(--blue)'  },
  3: { bg: 'var(--teal-light)',  color: 'var(--teal)'  },
  4: { bg: 'var(--amber-light)', color: 'var(--amber)' },
  5: { bg: 'var(--green-light)', color: 'var(--green)' },
  6: { bg: 'var(--gray-100)',    color: 'var(--gray-500)' },
};

/* ─────────────── DATA MOCK ─────────────── */
const CERT_DATA = [
  { mapel:'Matematika', level:'SMA', siswa:8, rating:4.9, status:'done',     periode:'Apr–Okt 2025', from:'#D85A30', to:'#F0997B' },
  { mapel:'Fisika',     level:'SMA', siswa:4, rating:4.8, status:'progress', bulan:2, total:6, mulai:'Feb 2026', target:'Agt 2026', from:'#1D9E75', to:'#5DCAA5' },
];

/* ─────────────── HELPERS ─────────────── */
function getInitials(name) {
  if (!name) return "?";
  return name.split(' ').map(n => n[0]).join('').slice(0,2).toUpperCase();
}
function avColor(i) { return AV_COLORS[i % AV_COLORS.length]; }

function getDurMins(start, end) {
  if (!start || !end) return 0;
  const [sh, sm] = start.split(':').map(Number);
  const [eh, em] = end.split(':').map(Number);
  return (eh * 60 + em) - (sh * 60 + sm);
}

function fmtDur(mins) {
  const h = Math.floor(mins / 60);
  const m = mins % 60;
  if (m === 0) return `${h} jam`;
  return `${h} jam ${m} menit`;
}


function ModeTag({ mode }) {
  if (mode === 'online')  return <span className={styles.mOn}>Online</span>;
  if (mode === 'offline') return <span className={styles.mOff}>Offline</span>;
  return <span className={styles.mBoth}>Online & Offline</span>;
}

/* ─────────────── TAMBAH/EDIT MODAL ─────────────── */
const EMPTY_FORM = {
  id_pelajaran: 1,
  tanggal_mengajar: new Date().toISOString().split('T')[0],
  waktu_mulai: '15:00',
  waktu_selesai: '16:30',
  mode: 'online',
  url_gmeet: '',
  lokasi_offline: '',
};

function JadwalModal({ isOpen, onClose, onSubmit, editData, loading, mapelOptions = [] }) {
  const [form, setForm] = useState(EMPTY_FORM);
  const [errors, setErrors] = useState({});

  useEffect(() => {
    if (isOpen) {
      if (editData) {
        setForm({
          id_pelajaran:    editData.id_pelajaran || (mapelOptions[0]?.id || 1),
          tanggal_mengajar: editData.tanggal_mengajar
            ? new Date(editData.tanggal_mengajar).toISOString().split('T')[0]
            : new Date().toISOString().split('T')[0],
          waktu_mulai:  editData.waktu_mulai?.slice(0,5) || '15:00',
          waktu_selesai: editData.waktu_selesai?.slice(0,5) || '16:30',
          mode:     editData.mode || 'online',
          url_gmeet: editData.url_gmeet || '',
          lokasi_offline: editData.lokasi_offline || '',
        });
      } else {
        setForm({
          ...EMPTY_FORM,
          id_pelajaran: mapelOptions[0]?.id || 1,
        });
      }
      setErrors({});
    }
  }, [isOpen, editData, mapelOptions]);

  const durMins = getDurMins(form.waktu_mulai, form.waktu_selesai);
  const durValid = durMins >= 60 && durMins <= 180;

  function validate() {
    const e = {};
    if (!form.waktu_mulai)  e.waktu_mulai  = 'Waktu mulai wajib diisi';
    if (!form.waktu_selesai) e.waktu_selesai = 'Waktu selesai wajib diisi';
    if (form.waktu_mulai && form.waktu_selesai) {
      const d = getDurMins(form.waktu_mulai, form.waktu_selesai);
      if (d <= 0)   e.waktu_selesai = 'Waktu selesai harus setelah waktu mulai';
      else if (d < 60)  e.waktu_selesai = 'Durasi minimal 1 jam';
      else if (d > 180) e.waktu_selesai = 'Durasi maksimal 3 jam';
    }
    if (form.mode === 'online' && !form.url_gmeet.trim()) {
      e.url_gmeet = 'Link Google Meet wajib diisi untuk mode online';
    }
    return e;
  }

  function handleSubmit(e) {
    e.preventDefault();
    const errs = validate();
    if (Object.keys(errs).length) { setErrors(errs); return; }
    onSubmit({ ...form, id_pelajaran: parseInt(form.id_pelajaran) });
  }

  function set(field, val) {
    setForm(prev => {
      const next = { ...prev, [field]: val };
      if (field === 'mode' && val === 'offline') next.url_gmeet = '';
      if (field === 'mode' && val === 'online') next.lokasi_offline = '';
      return next;
    });
    setErrors(prev => ({ ...prev, [field]: undefined }));
  }

  if (!isOpen) return null;

  const durColor = durMins <= 0 ? 'var(--gray-400)'
    : !durValid && durMins < 60 ? 'var(--amber)'
    : !durValid && durMins > 180 ? '#E24B4A'
    : 'var(--teal)';
  const durBg = durMins <= 0 ? 'var(--gray-100)'
    : !durValid && durMins < 60 ? 'var(--amber-light)'
    : !durValid && durMins > 180 ? '#FCEBEB'
    : 'var(--teal-light)';

  return (
    <div className={styles.modalOverlay} onClick={e => { if (e.target === e.currentTarget) onClose(); }}>
      <div className={styles.modal} onClick={e => e.stopPropagation()}>
        <div className={styles.modalHead}>
          <div>
            <h2 className={styles.modalTitle}>{editData ? 'Edit Jadwal' : 'Tambah Jadwal Mengajar'}</h2>
            <p className={styles.modalSub}>Pilih mata pelajaran, atur waktu, dan isi link GMeet-mu</p>
          </div>
          <button className={styles.modalClose} onClick={onClose} aria-label="Tutup">✕</button>
        </div>

        <form onSubmit={handleSubmit} className={styles.modalForm}>

          {/* ── Mata Pelajaran dropdown ── */}
          <div className={styles.mField}>
            <label className={styles.mLabel}>Mata Pelajaran</label>
            <select
              className={styles.mInput}
              value={form.id_pelajaran}
              onChange={e => set('id_pelajaran', parseInt(e.target.value))}
              disabled={!!editData}
            >
              {mapelOptions.map(m => (
                <option key={m.id} value={m.id}>
                  {m.icon}  {m.label}
                </option>
              ))}
            </select>
          </div>

          {/* ── Tanggal ── */}
          <div className={styles.mField}>
            <label className={styles.mLabel}>Tanggal Mengajar</label>
            <input
              type="date"
              className={styles.mInput}
              value={form.tanggal_mengajar}
              onChange={e => set('tanggal_mengajar', e.target.value)}
              required
              disabled={!!editData}
            />
          </div>

          {/* ── Waktu mulai & selesai ── */}
          <div className={styles.mGrid}>
            <div className={styles.mField}>
              <label className={styles.mLabel}>Waktu Mulai</label>
              <input
                type="time"
                className={`${styles.mInput} ${errors.waktu_mulai ? styles.mInputErr : ''}`}
                value={form.waktu_mulai}
                onChange={e => set('waktu_mulai', e.target.value)}
                required
              />
              {errors.waktu_mulai && <p className={styles.mErr}>{errors.waktu_mulai}</p>}
            </div>
            <div className={styles.mField}>
              <label className={styles.mLabel}>Waktu Selesai</label>
              <input
                type="time"
                className={`${styles.mInput} ${errors.waktu_selesai ? styles.mInputErr : ''}`}
                value={form.waktu_selesai}
                onChange={e => set('waktu_selesai', e.target.value)}
                required
              />
              {errors.waktu_selesai && <p className={styles.mErr}>{errors.waktu_selesai}</p>}
            </div>
          </div>

          {/* ── Mode Mengajar ── */}
          <div className={styles.mField}>
            <label className={styles.mLabel}>Mode Mengajar</label>
            <div className={styles.modeBtnRow}>
              <button
                type="button"
                className={`${styles.modeBtn} ${form.mode === 'online' ? styles.modeBtnOnActive : ''}`}
                onClick={() => set('mode', 'online')}
              >
                <span>🌐</span> Online
              </button>
              <button
                type="button"
                className={`${styles.modeBtn} ${form.mode === 'offline' ? styles.modeBtnOffActive : ''}`}
                onClick={() => set('mode', 'offline')}
              >
                <span>📍</span> Offline
              </button>
            </div>
          </div>

          {/* ── Google Meet link (hanya muncul kalau online) ── */}
          {form.mode === 'online' && (
            <div className={styles.mField}>
              <label className={styles.mLabel}>Link Google Meet</label>
              <div className={`${styles.gmeetInputWrap} ${errors.url_gmeet ? styles.gmeetInputErr : ''}`}>
                <span className={styles.gmeetPrefix}>
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M15.5 8.5L19 5v14l-3.5-3.5V13l-8 4V7l8 4V8.5z" stroke="currentColor" strokeWidth="1.5" strokeLinejoin="round"/>
                    <rect x="2" y="7" width="9" height="10" rx="1.5" stroke="currentColor" strokeWidth="1.5"/>
                  </svg>
                </span>
                <input
                  type="text"
                  className={styles.gmeetInput}
                  placeholder="meet.google.com/xxx-yyy-zzz"
                  value={form.url_gmeet}
                  onChange={e => set('url_gmeet', e.target.value)}
                />
                {form.url_gmeet && (
                  <a
                    href={`https://${form.url_gmeet.replace(/^https?:\/\//, '')}`}
                    target="_blank"
                    rel="noreferrer"
                    className={styles.gmeetTestBtn}
                  >
                    Tes ↗
                  </a>
                )}
              </div>
              {errors.url_gmeet && <p className={styles.mErr}>{errors.url_gmeet}</p>}
              <p className={styles.gmeetHint}>Contoh: meet.google.com/abc-def-ghi</p>
            </div>
          )}


          {/* ── Footer ── */}
          <div className={styles.modalFoot}>
            <button type="button" className={styles.btnOutline} onClick={onClose}>Batal</button>
            <button type="submit" className={styles.btnCoral} disabled={loading}>
              {loading ? 'Menyimpan...' : editData ? 'Simpan Perubahan' : 'Tambah Jadwal'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

/* ─────────────── KOMPONEN UTAMA ─────────────── */
export default function DashboardRelawan() {
  const { user, logout, loading: authLoading } = useAuth();
  const router = useRouter();

  const handleLogout = async () => {
    await logout();
    router.push('/');
  };

  const [tab, setTab]           = useState('overview');
  const [reqFilter, setReqFilter] = useState('all');

  const [isOnline, setIsOnline]     = useState(true);
  const [relMode, setRelMode]       = useState('online');
  const [relKota, setRelKota]       = useState('Jakarta Selatan');
  const [mapelActive, setMapelActive] = useState(['Matematika','Fisika']);

  const [toast, setToast]         = useState('');
  const [toastShow, setToastShow] = useState(false);
  const [settToast, setSettToast] = useState('');
  const [settToastShow, setSettToastShow] = useState(false);

  /* ── Real data ── */
  const [realRequests, setRealRequests]         = useState([]);
  const [loadingReqs, setLoadingReqs]           = useState(false);
  const [realKursusCreated, setRealKursusCreated] = useState([]);
  const [loadingKursus, setLoadingKursus]       = useState(false);
  const [pelajaranList, setPelajaranList]       = useState([]);

  /* ── Modal state ── */
  const [showModal, setShowModal]   = useState(false);
  const [editData, setEditData]     = useState(null);
  const [formLoading, setFormLoading] = useState(false);

  /* ── Fetch requests ── */
  useEffect(() => {
    if (user?.user_id) {
      const fetchRequests = async () => {
        setLoadingReqs(true);
        try {
          const res = await apiRequestWithRetry(`/kursus/requests?id_relawan=${user.user_id}&keterangan=PENDING`);
          if (res.success) setRealRequests(res.data || []);
        } catch (err) {
          console.error('Failed to fetch requests:', err);
        } finally {
          setLoadingReqs(false);
        }
      };
      fetchRequests();
    }
  }, [user]);

  /* ── Fetch kursus yang dibuat relawan ── */
  const fetchCreatedKursus = useCallback(async () => {
    if (!user?.user_id) return;
    setLoadingKursus(true);
    try {
      const res = await apiRequestWithRetry(`/kursus/relawan/${user.user_id}`);
      if (res.success) setRealKursusCreated(res.data || []);
    } catch (err) {
      console.error('Failed to fetch created kursus:', err);
    } finally {
      setLoadingKursus(false);
    }
  }, [user]);

  useEffect(() => { fetchCreatedKursus(); }, [fetchCreatedKursus]);

  /* ── Fetch pelajaran ── */
  useEffect(() => {
    const fetchPelajaran = async () => {
      try {
        const res = await apiRequestWithRetry('/pelajaran/all');
        if (res.success) {
          setPelajaranList(res.data || []);
        }
      } catch (err) {
        console.error('Failed to fetch pelajaran:', err);
      }
    };
    fetchPelajaran();
  }, []);

  const pelajaranOptions = useMemo(() => {
    const defaultIcons = {
      'matematika': '∑',
      'bahasa inggris': 'Aa',
      'fisika': '⚛',
      'kimia': '⚗',
      'biologi': '🌿',
      'sejarah': '📜'
    };
    
    if (pelajaranList.length === 0) {
      return [];
    }
    
    return pelajaranList.map(p => {
      const lower = p.nama_pelajaran.toLowerCase();
      let icon = '📖';
      for (const [key, val] of Object.entries(defaultIcons)) {
        if (lower.includes(key)) {
          icon = val;
          break;
        }
      }
      return {
        id: p.id_pelajaran,
        label: p.nama_pelajaran,
        icon: icon
      };
    });
  }, [pelajaranList]);

  /* ── Filter Sesi Hari Ini ── */
  const todaySessions = useMemo(() => {
    const today = new Date();
    const todayStr = `${today.getFullYear()}-${String(today.getMonth() + 1).padStart(2, '0')}-${String(today.getDate()).padStart(2, '0')}`;
    
    return realKursusCreated.filter(s => {
      // 1. Harus udah ada siswanya
      if (!s.full_name) return false;
      
      // 2. Tanggal mengajar harus sama dengan tanggal hari ini
      if (!s.tanggal_mengajar) return false;
      const scheduleDate = new Date(s.tanggal_mengajar);
      const scheduleDateStr = `${scheduleDate.getFullYear()}-${String(scheduleDate.getMonth() + 1).padStart(2, '0')}-${String(scheduleDate.getDate()).padStart(2, '0')}`;
      return scheduleDateStr === todayStr;
    });
  }, [realKursusCreated]);

  /* ── Filter Jumlah Siswa Aktif Unik ── */
  const activeSiswaCount = useMemo(() => {
    return realKursusCreated.filter(k => k.full_name).length;
  }, [realKursusCreated]);

  /* ── CRUD handlers ── */
  async function handleSubmitJadwal(formData) {
    setFormLoading(true);
    try {
      let res;
      if (editData) {
        res = await apiRequestWithRetry('/kursus/waktu-mengajar', {
          method: 'PATCH',
          body: {
            id_kursus: editData.id_kursus,
            waktu_mulai: formData.waktu_mulai.slice(0, 5),
            waktu_selesai: formData.waktu_selesai.slice(0, 5),
            mode: formData.mode,
            url_gmeet: formData.url_gmeet || '',
          },
        });
      } else {
        res = await apiRequestWithRetry('/kursus/kursus', {
          method: 'POST',
          body: {
            id_relawan: parseInt(user.user_id),
            tanggal_mengajar: formData.tanggal_mengajar,
            waktu_mulai: formData.waktu_mulai.slice(0, 5),
            waktu_selesai: formData.waktu_selesai.slice(0, 5),
            id_pelajaran: parseInt(formData.id_pelajaran),
            mode: formData.mode,
            url_gmeet: formData.mode === 'online' ? (formData.url_gmeet || '') : undefined,
          },
        });
      }
      if (res.success) {
        showToast(editData ? 'Jadwal berhasil diperbarui!' : 'Jadwal berhasil ditambahkan!');
        setShowModal(false);
        setEditData(null);
        fetchCreatedKursus();
      } else {
        showToast(`Gagal: ${res.message || 'Terjadi kesalahan'}`);
      }
    } catch (err) {
      showToast(`Gagal: ${err.message}`);
    } finally {
      setFormLoading(false);
    }
  }

  async function handleDeleteJadwal(id_kursus) {
    if (!confirm('Hapus jadwal ini?')) return;
    try {
      const res = await apiRequestWithRetry(`/kursus/delete/${id_kursus}`, { method: 'DELETE' });
      if (res.success) {
        setRealKursusCreated(prev => prev.filter(j => j.id_kursus !== id_kursus));
        showToast('Jadwal berhasil dihapus');
      } else {
        showToast(`Gagal menghapus: ${res.message}`);
      }
    } catch (err) {
      showToast(`Gagal: ${err.message}`);
    }
  }

  function openAddModal() { setEditData(null); setShowModal(true); }
  function openEditModal(kursus) { setEditData(kursus); setShowModal(true); }

  /* ── Requests ── */
  const displayRequests = tab === 'overview'
    ? realRequests.slice(0, 3)
    : reqFilter === 'all' ? realRequests : realRequests.filter(r => r.mode === reqFilter);

  function showToast(msg) {
    setToast(msg); setToastShow(true);
    setTimeout(() => setToastShow(false), 3000);
  }

  async function acceptReq(id) {
    try {
      const res = await apiRequestWithRetry(`/kursus/acc/${id}`, { method: 'PATCH' });
      if (res.success) {
        setRealRequests(prev => prev.filter(x => x.id_detail_kursus !== id));
        showToast('Request berhasil dikonfirmasi!');
        fetchCreatedKursus();
      }
    } catch (err) {
      showToast(`Gagal: ${err.message}`);
    }
  }

  async function declineReq(id) {
    setRealRequests(prev => prev.filter(x => x.id_detail_kursus !== id));
    showToast('Permintaan ditolak.');
  }

  function toggleMapel(m) {
    setMapelActive(prev => prev.includes(m) ? prev.filter(x => x !== m) : [...prev, m]);
  }

  function saveSettings() {
    const msg = `Tersimpan! Mode: ${relMode === 'both' ? 'Online & Offline' : relMode} | Daerah: ${relKota} | Status: ${isOnline ? 'Online' : 'Offline'}`;
    setSettToast(msg); setSettToastShow(true);
    setTimeout(() => setSettToastShow(false), 3500);
  }

  const navItems = [
    { id:'overview', label:'Dashboard' },
    { id:'requests', label:'Permintaan', badge: realRequests.length },
    { id:'schedule', label:'Jadwal' },
    { id:'settings', label:'Kursus' },
    { id:'cert',     label:'Sertifikat' }
  ];

  /* ── Helper: format tanggal untuk blok kecil ── */
  function fmtDateBlock(dateStr) {
    const d = new Date(dateStr);
    return {
      day:   d.toLocaleDateString('id-ID', { day: 'numeric' }),
      month: d.toLocaleDateString('id-ID', { month: 'short' }),
    };
  }

  return (
    <ProtectedRoute allowedRoles={["relawan"]}>
      <div className={styles.layout}>

        {/* ─── SIDEBAR ─── */}
        <aside className={styles.sidebar}>
          <div className={styles.sidebarHeader}>
            <Link href="/" className={styles.brand}>
              <div className={styles.brandIcon}>
                <svg width="14" height="14" viewBox="0 0 20 20" fill="none">
                  <path d="M3 5h6v10H3V5zm8 0h6v10h-6V5z" fill="white" />
                </svg>
              </div>
              TemanBelajar
            </Link>
          </div>
          <nav className={styles.sideNav}>
            {navItems.map(item => (
              <button
                key={item.id}
                className={`${styles.navItem} ${tab === item.id ? styles.active : ''}`}
                onClick={() => setTab(item.id)}
              >
                <NavIcon id={item.id} />
                {item.label}
                {item.badge ? <span className={styles.navBadge}>{item.badge}</span> : null}
              </button>
            ))}
          </nav>
          <div className={styles.sidebarFooter}>
            <div className={styles.userInfo}>
              <div className={styles.avWrap}>
                <div className={styles.av} style={{ background: '#D85A30', width: 32, height: 32, fontSize: 11 }}>
                  {user?.full_name ? user.full_name.split(' ').map(n => n[0]).join('').slice(0,2).toUpperCase() : 'U'}
                </div>
                {isOnline && <span className={styles.onlineDot} />}
              </div>
              <div>
                <p className={styles.userName}>{user?.full_name || 'User'}</p>
                <p className={styles.userRole}>{relKota}</p>
              </div>
            </div>
            <button
              onClick={handleLogout}
              style={{ background:'none',border:'none',cursor:'pointer',padding:4,color:'var(--gray-400)',display:'flex',alignItems:'center' }}
              title="Logout"
            >
              <svg width="16" height="16" viewBox="0 0 20 20" fill="none">
                <path d="M7.5 17.5H4.167A1.667 1.667 0 012.5 15.833V4.167A1.667 1.667 0 014.167 2.5H7.5M13.333 14.167L17.5 10l-4.167-4.167M17.5 10H7.5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
            </button>
          </div>
        </aside>

        {/* ─── MAIN ─── */}
        <main className={styles.main}>

          {/* ══ DASHBOARD ══ */}
          {tab === 'overview' && (
            <div className={styles.pane}>
              <header className={styles.topBar}>
                <div>
                  <h1 className={styles.pageTitle}>Halo, Kak {user?.full_name?.split(' ')[0] || 'User'}! 🧡</h1>
                  <p className={styles.pageDesc}>
                    {new Date().toLocaleDateString('id-ID', { weekday:'long', day:'numeric', month:'short', year:'numeric' })}
                  </p>
                </div>
                <div style={{ display:'flex', gap:12, alignItems:'center' }}>
                  <button className={styles.btnCoral} onClick={openAddModal}>+ Tambah Jadwal</button>
                </div>
              </header>

              <div className={styles.statsGrid}>
                <StatCard icon="users" color="teal"  value={activeSiswaCount}      label="Siswa Aktif"   />
                <StatCard icon="star"  color="amber" value="4.9"                  label="Rating"        />
                <StatCard icon="chat"  color="blue"  value={realRequests.length} label="Request Masuk" />
              </div>

              <div className={styles.grid2}>
                {/* Sesi hari ini */}
                <div className={styles.card}>
                  <div className={styles.cardHeader}>
                    <h3>Sesi Hari Ini</h3>
                    <button className={styles.linkBtn} onClick={() => setTab('schedule')}>Lihat jadwal</button>
                  </div>
                  {loadingKursus ? (
                    <div className={styles.empty}>Memuat sesi...</div>
                  ) : todaySessions.length === 0 ? (
                    <div className={styles.empty}>Tidak ada sesi mengajar untuk hari ini</div>
                  ) : todaySessions.slice(0, 3).map((s, i) => {
                    const dateInfo = fmtDateBlock(s.tanggal_mengajar);
                    const accentColor = i === 0 ? 'var(--coral)' : 'var(--teal)';
                    const accentBg    = i === 0 ? 'var(--coral-light)' : 'var(--teal-light)';
                    const accentMid   = i === 0 ? '#F0997B' : '#5DCAA5';

                    return (
                      <div key={`real-s-${s.id_kursus}`} className={styles.todayCard}>
                        {/* ── blok kiri: tanggal ── */}
                        <div className={styles.timeBlock} style={{ background: accentBg }}>
                          <p className={styles.timeDay}  style={{ color: accentColor }}>{dateInfo.day}</p>
                          <p className={styles.timeMon}  style={{ color: accentMid  }}>{dateInfo.month}</p>
                        </div>

                        <div className={styles.todayBody}>
                          <p className={styles.todayMapel}>
                            {s.nama_pelajaran}
                          </p>
                          <p className={styles.todayMeta}>
                            {s.mode} • {s.waktu_mulai?.slice(0,5)}–{s.waktu_selesai?.slice(0,5)} WIB
                          </p>
                          <div className={styles.siswaChips}>
                            <span className={styles.siswaChip} style={{ background:'var(--teal-light)', color:'var(--teal-dark)' }}>{s.full_name}</span>
                          </div>
                          {s.mode === 'online' && s.url_gmeet && (
                            <a
                              href={`https://${s.url_gmeet.replace(/^https?:\/\//, '')}`}
                              target="_blank" rel="noreferrer"
                              className={styles.meetLink}
                            >▶ Buka Meet</a>
                          )}
                        </div>
                      </div>
                    );
                  })}
                </div>

                {/* Request terbaru */}
                <div className={styles.card}>
                  <div className={styles.cardHeader}>
                    <h3>Request Terbaru</h3>
                    <button className={styles.linkBtn} onClick={() => setTab('requests')}>Lihat semua</button>
                  </div>
                  {loadingReqs ? (
                    <div className={styles.empty}>Memuat request...</div>
                  ) : realRequests.length === 0 ? (
                    <div className={styles.empty}>Belum ada request</div>
                  ) : realRequests.slice(0, 3).map((r, i) => (
                    <div key={r.id_detail_kursus} className={styles.reqMiniCard}>
                      <div className={styles.av} style={{ background: avColor(i), width:32, height:32, fontSize:10 }}>{getInitials(r.full_name)}</div>
                      <div className={styles.reqMiniInfo}>
                        <p className={styles.rn}>{r.full_name}</p>
                        <div style={{ display:'flex', alignItems:'center', gap:5 }}>
                          <span className={styles.rxSmall}>{r.nama_pelajaran}</span>
                          <ModeTag mode={r.mode} />
                        </div>
                      </div>
                      <div className={styles.btnRow}>
                        <button className={styles.btnDecline} onClick={() => declineReq(r.id_detail_kursus)}>Tolak</button>
                        <button className={styles.btnAccept}  onClick={() => acceptReq(r.id_detail_kursus)}>Terima</button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* ══ PERMINTAAN ══ */}
          {tab === 'requests' && (
            <div className={styles.pane}>
              <header className={styles.topBar}>
                <div>
                  <h1 className={styles.pageTitle}>Permintaan Sesi</h1>
                  <p className={styles.pageDesc}>{realRequests.length} siswa menunggu konfirmasi</p>
                </div>
                <div className={styles.filterRow}>
                  {[{v:'all',l:'Semua'},{v:'online',l:'Online'},{v:'offline',l:'Offline'}].map(f => (
                    <button key={f.v} className={`${styles.fb} ${reqFilter === f.v ? styles.faActive : ''}`} onClick={() => setReqFilter(f.v)}>{f.l}</button>
                  ))}
                </div>
              </header>
              <div className={styles.reqList}>
                {loadingReqs ? (
                  <div className={styles.empty}>Memuat request...</div>
                ) : displayRequests.length === 0 ? (
                  <div className={styles.empty}>Tidak ada permintaan</div>
                ) : displayRequests.map((r, i) => (
                  <div key={r.id_detail_kursus} className={styles.reqCard}>
                    <div className={styles.reqTop}>
                      <div className={styles.av} style={{ background: avColor(i), width:36, height:36 }}>{getInitials(r.full_name)}</div>
                      <div className={styles.reqInfo}>
                        <p className={styles.rn}>{r.full_name}</p>
                        <p className={styles.rx}>{r.nama_pelajaran} • Usia {r.usia} • 📍 {r.nama_kabupaten}</p>
                      </div>
                      <ModeTag mode={r.mode} />
                    </div>
                    <div className={styles.reqBot}>
                      <span className={styles.reqTime}>
                        📅 {new Date(r.tanggal_mengajar).toLocaleDateString('id-ID', { day:'numeric', month:'short' })} • ⏰ {r.waktu_mulai?.slice(0,5)} - {r.waktu_selesai?.slice(0,5)}
                      </span>
                      <div className={styles.btnRow}>
                        <button className={styles.btnDecline} onClick={() => declineReq(r.id_detail_kursus)}>Tolak</button>
                        <button className={styles.btnAccept}  onClick={() => acceptReq(r.id_detail_kursus)}>Terima</button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* ══ JADWAL ══ */}
          {tab === 'schedule' && (
            <div className={styles.pane}>
              <header className={styles.topBar}>
                <div>
                  <h1 className={styles.pageTitle}>Jadwal Mengajar</h1>
                  <p className={styles.pageDesc}>{realKursusCreated.filter(k => k.full_name).length} sesi aktif · Kelola sesi mengajarmu yang telah dipesan siswa</p>
                </div>
                <div style={{ display:'flex', gap:10, alignItems:'center' }}>
                  <button className={styles.btnCoral} onClick={openAddModal}>+ Tambah Jadwal</button>
                </div>
              </header>

              <div>
                <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 12 }}>
                  <p style={{ fontSize: 12, fontWeight: 700, color: 'var(--teal)', textTransform: 'uppercase', letterSpacing: '.05em' }}>
                    Jadwal Kamu
                  </p>
                  <span style={{ fontSize: 10, background: 'var(--teal-light)', color: 'var(--teal-dark)', padding: '2px 8px', borderRadius: '12px', fontWeight: 600 }}>
                    {realKursusCreated.filter(k => k.full_name).length} Sesi Aktif
                  </span>
                </div>
                <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
                  {realKursusCreated.filter(k => k.full_name).length === 0 ? (
                    <div className={styles.empty} style={{ padding: '24px', borderRadius: '12px', border: '1px dashed var(--gray-200)', background: 'var(--gray-50)', color: 'var(--gray-400)', textAlign: 'center', fontSize: '13px' }}>
                      ✨ Belum ada jadwal yang dipesan oleh murid. Tunggu request masuk di tab Permintaan!
                    </div>
                  ) : (
                    realKursusCreated.filter(k => k.full_name).map(k => {
                      const mapelObj = pelajaranOptions.find(m => m.id === k.id_pelajaran) || pelajaranOptions[0] || { label: k.nama_pelajaran || 'Pelajaran', icon: '📖' };
                      const clr = MAPEL_COLOR[k.id_pelajaran] || MAPEL_COLOR[1];
                      const dur = getDurMins(k.waktu_mulai?.slice(0,5), k.waktu_selesai?.slice(0,5));
                      return (
                        <div key={k.id_kursus} className={styles.jadwalItemCard}>
                          <div className={styles.jadwalItemIcon} style={{ background: clr.bg, color: clr.color }}>
                            <span style={{ fontSize: 16 }}>{mapelObj.icon}</span>
                          </div>
                          <div className={styles.jadwalItemInfo}>
                            <p className={styles.jadwalItemMapel}>
                              {k.nama_pelajaran || mapelObj.label} - <span style={{ color: 'var(--coral)', fontWeight: 600 }}>{k.full_name}</span>
                            </p>
                            <p className={styles.jadwalItemMeta}>
                              📅 {new Date(k.tanggal_mengajar).toLocaleDateString('id-ID', { day:'numeric', month:'short', year:'numeric' })}
                              {' · '}<span>⏰</span> {k.waktu_mulai?.slice(0,5)}–{k.waktu_selesai?.slice(0,5)} WIB
                              {dur > 0 && ` (${fmtDur(dur)})`}
                            </p>
                            {k.mode === 'online' && k.url_gmeet && (
                              <a href={`https://${k.url_gmeet}`} target="_blank" rel="noreferrer" className={styles.jadwalMeetLink}>
                                ▶ {k.url_gmeet}
                              </a>
                            )}
                          </div>
                          <div style={{ display:'flex', alignItems:'center', gap:6 }}>
                            <ModeTag mode={k.mode} />
                          </div>
                          <div className={styles.btnRow}>
                            <button className={styles.btnDecline} onClick={() => openEditModal(k)}>Edit</button>
                            <button
                              className={styles.btnDecline}
                              style={{ color:'#A32D2D' }}
                              onClick={() => handleDeleteJadwal(k.id_kursus)}
                            >Hapus</button>
                          </div>
                        </div>
                      );
                    })
                  )}
                </div>
              </div>

            </div>
          )}

          {/* ══ SERTIFIKAT ══ */}
          {tab === 'cert' && (
            <div className={styles.pane}>
              <header className={styles.topBar}>
                <div>
                  <h1 className={styles.pageTitle}>Sertifikat Relawan</h1>
                  <p className={styles.pageDesc}>Diterbitkan setelah 6 bulan mengajar per mapel</p>
                </div>
              </header>
              <div className={styles.certPage}>
                {CERT_DATA.map(c => (
                  <div key={c.mapel} className={styles.certCard}>
                    <div className={styles.certBanner} style={{ background:`linear-gradient(135deg,${c.from},${c.to})` }}>
                      <div>
                        <p className={styles.certBannerTitle}>{c.mapel}</p>
                        <p className={styles.certBannerSub}>{c.level} — Relawan Pengajar</p>
                      </div>
                      <div className={styles.certSeal}>
                        <svg width="22" height="22" viewBox="0 0 24 24" fill="none">
                          <path d="M12 2l2.4 7.4H22l-6.2 4.5 2.4 7.4-6.2-4.6-6.2 4.6 2.4-7.4L2 9.4h7.6L12 2z" fill={c.status==='done'?'white':'rgba(255,255,255,.4)'} stroke="white" strokeWidth="1.5"/>
                        </svg>
                      </div>
                    </div>
                    <div className={styles.certBody}>
                      <p className={styles.certMapel}>{c.mapel} — {c.level}</p>
                      <div className={styles.certStats}>
                        <div className={styles.certStat}><p className={styles.csv}>{c.siswa}</p><p className={styles.csl}>Siswa Dibantu</p></div>
                        <div className={styles.certStat}><p className={styles.csv}>{c.rating}</p><p className={styles.csl}>Rating</p></div>
                      </div>
                      {c.status === 'done' ? (
                        <>
                          <div className={`${styles.certStatus} ${styles.csDone}`}>
                            <svg width="16" height="16" viewBox="0 0 20 20" fill="none"><path d="M4 10l4.5 4.5L16 6" stroke="#1D9E75" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/></svg>
                            <div>
                              <p className={styles.csText} style={{ color:'var(--teal)' }}>Sertifikat Siap Diunduh</p>
                              <p className={styles.csDesc}>Selesai 6 bulan — {c.periode}</p>
                            </div>
                          </div>
                          <div style={{ marginTop:10 }}><button className={styles.btnCoral}>Download PDF</button></div>
                        </>
                      ) : (
                        <>
                          <div className={`${styles.certStatus} ${styles.csProg}`}>
                            <svg width="16" height="16" viewBox="0 0 20 20" fill="none"><circle cx="10" cy="10" r="7.5" stroke="#BA7517" strokeWidth="1.5"/><path d="M10 6.667V10l2.5 1.667" stroke="#BA7517" strokeWidth="1.5" strokeLinecap="round"/></svg>
                            <div>
                              <p className={styles.csText} style={{ color:'var(--amber)' }}>Dalam Proses — {c.total - c.bulan} bulan lagi</p>
                              <p className={styles.csDesc}>Mulai {c.mulai} — Target {c.target}</p>
                            </div>
                          </div>
                          <div style={{ marginTop:10 }}>
                            <div className={styles.certProgLabel}><span>Progres waktu</span><span>{c.bulan}/{c.total} bulan</span></div>
                            <div className={styles.progBar}><div className={styles.progFill} style={{ width:`${Math.round(c.bulan/c.total*100)}%`, background:'var(--amber)' }}/></div>
                          </div>
                        </>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* ══ PENGATURAN ══ */}
          {tab === 'settings' && (
            <div className={styles.pane}>
              <header className={styles.topBar}>
                <div>
                  <h1 className={styles.pageTitle}>Daftar Jadwal</h1>
                  <p className={styles.pageDesc}>Daftar jadwal yang kamu sediakan untuk direquest oleh siswa</p>
                </div>
                <div style={{ display:'flex', gap:12, alignItems:'center' }}>
                  <button className={styles.btnCoral} onClick={openAddModal}>+ Tambah Jadwal</button>
                </div>
              </header>

              {/* ── SECTION: LIST JADWAL KAMU (Belum Ada Murid) ── */}
              <div className={styles.settCard} style={{ padding: '16px', marginBottom: '24px' }}>
              
                <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
                  {realKursusCreated.filter(k => !k.full_name).length === 0 ? (
                    <div className={styles.empty} style={{ padding: '24px', borderRadius: '12px', border: '1px dashed var(--gray-200)', background: 'var(--gray-50)', color: 'var(--gray-400)', textAlign: 'center', fontSize: '13px' }}>
                      Semua jadwal mengajar Anda sudah dipesan oleh murid!
                    </div>
                  ) : (
                    realKursusCreated.filter(k => !k.full_name).map(k => {
                      const mapelObj = pelajaranOptions.find(m => m.id === k.id_pelajaran) || pelajaranOptions[0] || { label: k.nama_pelajaran || 'Pelajaran', icon: '📖' };
                      const clr = MAPEL_COLOR[k.id_pelajaran] || MAPEL_COLOR[1];
                      const dur = getDurMins(k.waktu_mulai?.slice(0,5), k.waktu_selesai?.slice(0,5));
                      return (
                        <div key={k.id_kursus} className={styles.jadwalItemCard}>
                          <div className={styles.jadwalItemIcon} style={{ background: clr.bg, color: clr.color }}>
                            <span style={{ fontSize: 16 }}>{mapelObj.icon}</span>
                          </div>
                          <div className={styles.jadwalItemInfo}>
                            <p className={styles.jadwalItemMapel}>
                              {k.nama_pelajaran || mapelObj.label}
                            </p>
                            <p className={styles.jadwalItemMeta}>
                              📅 {new Date(k.tanggal_mengajar).toLocaleDateString('id-ID', { day:'numeric', month:'short', year:'numeric' })}
                              {' · '}<span>⏰</span> {k.waktu_mulai?.slice(0,5)}–{k.waktu_selesai?.slice(0,5)} WIB
                              {dur > 0 && ` (${fmtDur(dur)})`}
                            </p>
                            {k.mode === 'online' && k.url_gmeet && (
                              <a href={`https://${k.url_gmeet}`} target="_blank" rel="noreferrer" className={styles.jadwalMeetLink}>
                                ▶ {k.url_gmeet}
                              </a>
                            )}
                          </div>
                          <div style={{ display:'flex', alignItems:'center', gap:6 }}>
                            <ModeTag mode={k.mode} />
                          </div>
                          <div className={styles.btnRow}>
                            <button className={styles.btnDecline} onClick={() => openEditModal(k)}>Edit</button>
                            <button
                              className={styles.btnDecline}
                              style={{ color:'#A32D2D' }}
                              onClick={() => handleDeleteJadwal(k.id_kursus)}
                            >Hapus</button>
                          </div>
                        </div>
                      );
                    })
                  )}
                </div>
              </div>

              
              {settToastShow && <div className={styles.toastMsg}>{settToast}</div>}
            </div>
          )}

       

       

        </main>

        {/* ─── GLOBAL TOAST ─── */}
        {toastShow && <div className={styles.toastMsg}>{toast}</div>}

        {/* ─── JADWAL MODAL ─── */}
        <JadwalModal
          isOpen={showModal}
          onClose={() => { setShowModal(false); setEditData(null); }}
          onSubmit={handleSubmitJadwal}
          editData={editData}
          loading={formLoading}
          mapelOptions={pelajaranOptions}
        />

      </div>
    </ProtectedRoute>
  );
}

/* ── Sub-components ── */
function StatCard({ icon, color, value, label }) {
  const map = { coral:styles.siCoral, teal:styles.siTeal, amber:styles.siAmber, blue:styles.siBlue };
  return (
    <div className={styles.sc}>
      <div className={`${styles.siIcon} ${map[color]}`}><StatIcon type={icon} /></div>
      <div><p className={styles.sv}>{value}</p><p className={styles.sl}>{label}</p></div>
    </div>
  );
}
function StatIcon({ type }) {
  if (type==='users') return <svg width="16" height="16" viewBox="0 0 20 20" fill="none"><circle cx="10" cy="7" r="3.5" stroke="currentColor" strokeWidth="1.5"/><path d="M3 17.5c0-3.866 3.134-7 7-7s7 3.134 7 7" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/></svg>;
  if (type==='star')  return <svg width="16" height="16" viewBox="0 0 20 20" fill="none"><path d="M10 2l2.5 5.3L18 8l-4 3.9.9 5.3L10 14.5 5.1 17.2l.9-5.3-4-3.9 5.5-.7L10 2z" stroke="currentColor" strokeWidth="1.5"/></svg>;
  if (type==='chat')  return <svg width="16" height="16" viewBox="0 0 20 20" fill="none"><path d="M17.5 12.5a1.667 1.667 0 01-1.667 1.667h-10L2.5 17.5V5.833A1.667 1.667 0 014.167 4.167h11.666A1.667 1.667 0 0117.5 5.833V12.5z" stroke="currentColor" strokeWidth="1.5"/></svg>;
  return null;
}
function NavIcon({ id }) {
  if (id==='overview') return <svg width="14" height="14" viewBox="0 0 20 20" fill="none"><rect x="2" y="2" width="7" height="7" rx="1.5" stroke="currentColor" strokeWidth="1.5"/><rect x="11" y="2" width="7" height="7" rx="1.5" stroke="currentColor" strokeWidth="1.5"/><rect x="2" y="11" width="7" height="7" rx="1.5" stroke="currentColor" strokeWidth="1.5"/><rect x="11" y="11" width="7" height="7" rx="1.5" stroke="currentColor" strokeWidth="1.5"/></svg>;
  if (id==='requests') return <svg width="14" height="14" viewBox="0 0 20 20" fill="none"><path d="M17.5 12.5a1.667 1.667 0 01-1.667 1.667h-10L2.5 17.5V5.833A1.667 1.667 0 014.167 4.167h11.666A1.667 1.667 0 0117.5 5.833V12.5z" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/></svg>;
  if (id==='students') return <svg width="14" height="14" viewBox="0 0 20 20" fill="none"><circle cx="10" cy="7" r="3.5" stroke="currentColor" strokeWidth="1.5"/><path d="M3 17.5c0-3.866 3.134-7 7-7s7 3.134 7 7" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/></svg>;
  if (id==='schedule') return <svg width="14" height="14" viewBox="0 0 20 20" fill="none"><rect x="2.5" y="3.333" width="15" height="14.167" rx="2" stroke="currentColor" strokeWidth="1.5"/><path d="M13.333 1.667v3.333M6.667 1.667v3.333M2.5 8.333h15" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/></svg>;
  if (id==='cert')     return <svg width="14" height="14" viewBox="0 0 20 20" fill="none"><path d="M10 12.5l-3.5 5 1-3.5-3-1.5L10 12.5zm0 0l3.5 5-1-3.5 3-1.5L10 12.5z" stroke="currentColor" strokeWidth="1.5" strokeLinejoin="round"/><circle cx="10" cy="7.5" r="5" stroke="currentColor" strokeWidth="1.5"/></svg>;
  if (id==='settings') return <svg width="14" height="14" viewBox="0 0 20 20" fill="none"><circle cx="10" cy="10" r="3" stroke="currentColor" strokeWidth="1.5"/><path d="M10 2v2M10 16v2M2 10h2M16 10h2M4.2 4.2l1.4 1.4M14.4 14.4l1.4 1.4M4.2 15.8l1.4-1.4M14.4 5.6l1.4-1.4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/></svg>;
  return null;
}