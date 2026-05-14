"use client";
import { useState, useMemo, useEffect, useCallback } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import styles from "./dashboard-relawan.module.css";
import { useAuth } from "../../context/AuthContext";
import { apiRequestWithRetry } from "../../../utils/api";
import ProtectedRoute from "../../components/ProtectedRoute";

/* ─────────────── KONSTANTA ─────────────── */
const MONTHS = ['Januari','Februari','Maret','April','Mei','Juni','Juli','Agustus','September','Oktober','November','Desember'];
const SUBJECT_POOL = ['Matematika','Sejarah','Fisika','Matematika','Sejarah','Fisika'];
const GMEET_POOL   = [
  'meet.google.com/abc-def','meet.google.com/ghi-jkl','meet.google.com/mno-pqr',
  'meet.google.com/stu-vwx','meet.google.com/yza-bcd','meet.google.com/efg-hij',
];
const KOTA_LIST  = ['Jakarta Selatan','Jakarta Timur','Jakarta Pusat','Bandung','Surabaya','Depok','Bekasi'];
const ALL_MAPEL  = ['Matematika','Fisika','Kimia','Biologi','Bahasa Inggris','Sejarah'];
const SESI_TIMES = [{ s:'15:00', e:'16:30' }, { s:'17:00', e:'18:00' }];
const AV_COLORS  = ['#D85A30','#185FA5','#BA7517','#1D9E75','#993556','#534AB7'];

/* ─────────────── DATA ─────────────── */
const TODAY_SESSIONS = [
  {
    mapel:'Matematika', sesi:1, jam:'15:00', end:'16:30', mode:'Online',
    gmeet:'meet.google.com/abc-def',
    siswa:[{n:'Rafi Ahmad',c:'#1D9E75'},{n:'Bima Putra',c:'#185FA5'},{n:'Aisyah Nur',c:'#BA7517'}],
  },
  {
    mapel:'Sejarah', sesi:2, jam:'17:00', end:'18:00', mode:'Online',
    gmeet:'meet.google.com/ghi-jkl',
    siswa:[{n:'Maya Sari',c:'#D85A30'},{n:'Dina Kusuma',c:'#1D9E75'}],
  },
];

const SISWA_DATA = [
  { nama:'Rafi Ahmad',   mapel:'Matematika', sesi:8,  total:12, col:'#D85A30' },
  { nama:'Dina Kusuma',  mapel:'Fisika',     sesi:5,  total:12, col:'#185FA5' },
  { nama:'Bima Putra',   mapel:'Matematika', sesi:11, total:12, col:'#BA7517' },
  { nama:'Aisyah Nur',   mapel:'Fisika',     sesi:7,  total:12, col:'#1D9E75' },
  { nama:'Maya Sari',    mapel:'Sejarah',    sesi:4,  total:12, col:'#993556' },
  { nama:'Farhan H.',    mapel:'Matematika', sesi:2,  total:12, col:'#3B6D11' },
];

const CERT_DATA = [
  { mapel:'Matematika', level:'SMA', siswa:8, rating:4.9, status:'done',     periode:'Apr–Okt 2025', from:'#D85A30', to:'#F0997B' },
  { mapel:'Fisika',     level:'SMA', siswa:4, rating:4.8, status:'progress', bulan:2, total:6, mulai:'Feb 2026', target:'Agt 2026', from:'#1D9E75', to:'#5DCAA5' },
];

const INIT_REQUESTS = [
  { id:1, nama:'Rafi Ahmad',    mapel:'Matematika', tgl:'22 Apr 2026', jam:'16:00', mode:'online',  kota:'Jakarta Selatan', usia:15 },
  { id:2, nama:'Dina Kusuma',   mapel:'Fisika',     tgl:'23 Apr 2026', jam:'10:00', mode:'offline', kota:'Jakarta Selatan', usia:17 },
  { id:3, nama:'Farhan Hidayat',mapel:'Kimia',      tgl:'24 Apr 2026', jam:'14:00', mode:'online',  kota:'Depok',           usia:16 },
];

/* ─────────────── HELPERS ─────────────── */
function getInitials(name) {
  if (!name) return "?";
  return name.split(' ').map(n => n[0]).join('').slice(0,2).toUpperCase();
}
function avColor(i) { return AV_COLORS[i % AV_COLORS.length]; }

function getDayName(d) { return ['Min','Sen','Sel','Rab','Kam','Jum','Sab'][d]; }

function getScheduleWeeks(month, year) {
  const sessions = [];
  const dt = new Date(year, month, 1);
  while (dt.getMonth() === month && sessions.length < 12) {
    const d = dt.getDay();
    if (d === 1 || d === 3) {
      const idx = sessions.length % SUBJECT_POOL.length;
      sessions.push({
        label: `${getDayName(d)}, ${dt.getDate()} ${MONTHS[month]} ${year}`,
        subj:  SUBJECT_POOL[idx],
        gmeet: GMEET_POOL[idx],
      });
    }
    dt.setDate(dt.getDate() + 1);
  }
  const weeks = [];
  for (let i = 0; i < sessions.length; i += 2) {
    weeks.push({ w: Math.floor(i/2)+1, ss: sessions.slice(i, i+2) });
  }
  return weeks;
}

function ModeTag({ mode }) {
  if (mode === 'online')  return <span className={styles.mOn}>Online</span>;
  if (mode === 'offline') return <span className={styles.mOff}>Offline</span>;
  return <span className={styles.mBoth}>Online & Offline</span>;
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
  const [requests, setRequests] = useState(INIT_REQUESTS);
  const [reqFilter, setReqFilter] = useState('all');

  // Pengaturan relawan
  const [isOnline, setIsOnline]     = useState(true);
  const [relMode, setRelMode]       = useState('online');
  const [relKota, setRelKota]       = useState('Jakarta Selatan');
  const [mapelActive, setMapelActive] = useState(['Matematika','Fisika']);

  // Jadwal
  const [curMonth, setCurMonth] = useState(3);

  // Toast
  const [toast, setToast]         = useState('');
  const [toastShow, setToastShow] = useState(false);
  const [settToast, setSettToast] = useState('');
  const [settToastShow, setSettToastShow] = useState(false);

  // Real Data State
  const [realRequests, setRealRequests] = useState([]);
  const [loadingReqs, setLoadingReqs] = useState(false);

  const [realKursusCreated, setRealKursusCreated] = useState([]);
  const [loadingKursus, setLoadingKursus] = useState(false);

  // New Kursus Form State
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [formLoading, setFormLoading] = useState(false);
  const [formData, setFormData] = useState({
    id_pelajaran: 1,
    tanggal_mengajar: new Date().toISOString().split('T')[0],
    waktu_mulai: '15:00',
    waktu_selesai: '16:30',
    mode: 'online'
  });

  // Fetch real requests
  useEffect(() => {
    if (user?.user_id) {
      const fetchRequests = async () => {
        setLoadingReqs(true);
        try {
          const res = await apiRequestWithRetry(`/kursus/requests?id_relawan=${user.user_id}&keterangan=ALL`);
          if (res.success) {
            setRealRequests(res.data || []);
          }
        } catch (err) {
          console.error("Failed to fetch requests:", err);
        } finally {
          setLoadingReqs(false);
        }
      };
      fetchRequests();
    }
  }, [user]);

  const fetchCreatedKursus = useCallback(async () => {
    if (!user?.user_id) return;
    setLoadingKursus(true);
    try {
      const res = await apiRequestWithRetry(`/kursus/relawan/${user.user_id}`);
      if (res.success) {
        setRealKursusCreated(res.data || []);
      }
    } catch (err) {
      console.error("Failed to fetch created kursus:", err);
    } finally {
      setLoadingKursus(false);
    }
  }, [user]);

  useEffect(() => {
    fetchCreatedKursus();
  }, [fetchCreatedKursus]);

  async function handleCreateKursus(e) {
    e.preventDefault();
    setFormLoading(true);
    try {
      const res = await apiRequestWithRetry('/kursus/kursus', {
        method: 'POST',
        body: {
          ...formData,
          id_relawan: user.user_id,
          id_pelajaran: parseInt(formData.id_pelajaran)
        }
      });
      if (res.success) {
        showToast("Jadwal mengajar berhasil ditambahkan!");
        setShowCreateModal(false);
        fetchCreatedKursus();
      }
    } catch (err) {
      showToast(`Gagal: ${err.message}`);
    } finally {
      setFormLoading(false);
    }
  }

  /* Filtered requests */
  const displayRequests = tab === 'overview' ? realRequests.slice(0, 3) : 
                        (reqFilter === 'all' ? realRequests : realRequests.filter(r => r.mode === reqFilter));

  const displayKursus = realKursusCreated.length > 0 ? realKursusCreated : TODAY_SESSIONS;

  function showToast(msg) {
    setToast(msg); setToastShow(true);
    setTimeout(() => setToastShow(false), 3000);
  }

  async function acceptReq(id) {
    try {
      const res = await apiRequestWithRetry(`/kursus/acc/${id}`, { method: 'PATCH' });
      if (res.success) {
        setRealRequests(prev => prev.filter(x => x.id_detail_kursus !== id));
        showToast(`Request berhasil dikonfirmasi!`);
      }
    } catch (err) {
      showToast(`Gagal: ${err.message}`);
    }
  }
  async function declineReq(id) {
    // Note: Backend might need a specific decline endpoint or we just leave it for now
    // If no decline endpoint, we just filter it out locally for mock effect or implement later
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

  const scheduleWeeks = getScheduleWeeks(curMonth, 2026);

  const navItems = [
    { id:'overview', label:'Dashboard'   },
    { id:'requests', label:'Permintaan', badge: requests.length },
    { id:'students', label:'Siswa Saya'  },
    { id:'schedule', label:'Jadwal'      },
    { id:'cert',     label:'Sertifikat'  },
    { id:'settings', label:'Pengaturan'  },
  ];

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
              <button key={item.id} className={`${styles.navItem} ${tab===item.id?styles.active:''}`} onClick={() => setTab(item.id)}>
                <NavIcon id={item.id} />
                {item.label}
                {item.badge ? <span className={styles.navBadge}>{item.badge}</span> : null}
              </button>
            ))}
          </nav>
          <div className={styles.sidebarFooter}>
            <div className={styles.userInfo}>
              <div className={styles.avWrap}>
                <div className={styles.av} style={{background:'#D85A30'}}>{user?.full_name ? user.full_name.split(' ').map(n=>n[0]).join('').slice(0,2).toUpperCase() : 'U'}</div>
                {isOnline && <span className={styles.onlineDot} />}
              </div>
              <div>
                <p className={styles.userName}>{user?.full_name || 'User'}</p>
                <p className={styles.userRole}>{relKota}</p>
              </div>
            </div>
            <button onClick={handleLogout} style={{background:'none',border:'none',cursor:'pointer',padding:4,color:'var(--gray-400)',display:'flex',alignItems:'center'}} title="Logout">
              <svg width="16" height="16" viewBox="0 0 20 20" fill="none"><path d="M7.5 17.5H4.167A1.667 1.667 0 012.5 15.833V4.167A1.667 1.667 0 014.167 2.5H7.5M13.333 14.167L17.5 10l-4.167-4.167M17.5 10H7.5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/></svg>
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
                  <p className={styles.pageDesc}>{new Date().toLocaleDateString('id-ID', {weekday:'long', day:'numeric', month:'short', year:'numeric'})} · {displayKursus.length} sesi terdaftar</p>
                </div>
                <div style={{display:'flex', gap: 12, alignItems:'center'}}>
                  <button className={styles.btnCoral} onClick={() => setShowCreateModal(true)}>+ Tambah Jadwal</button>
                  <div className={styles.modePill}>
                    <ModeTag mode={relMode} />
                    <span className={styles.kotaText}>📍 {relKota}</span>
                  </div>
                </div>
              </header>
              <div className={styles.statsGrid}>
                <StatCard icon="users" color="teal"  value="12"            label="Siswa Aktif"   />
                <StatCard icon="star"  color="amber" value="4.9"           label="Rating"        />
                <StatCard icon="chat"  color="blue"  value={requests.length} label="Request Masuk" />
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
                  ) : displayKursus.length === 0 ? (
                    <div className={styles.empty}>Belum ada sesi</div>
                  ) : displayKursus.slice(0, 3).map((s, i) => {
                    const isReal = !!s.id_kursus;
                    return (
                      <div key={isReal ? `real-s-${s.id_kursus}` : `mock-s-${i}`} className={styles.todayCard}>
                        <div className={styles.timeBlock} style={{background: i===0?'var(--coral-light)':'var(--teal-light)'}}>
                          <p className={styles.timeVal} style={{color: i===0?'var(--coral)':'var(--teal)'}}>{isReal ? s.waktu_mulai : s.jam}</p>
                          <p className={styles.timeWib} style={{color: i===0?'#F0997B':'#5DCAA5'}}>WIB</p>
                        </div>
                        <div className={styles.todayBody}>
                          <p className={styles.todayMapel}>{isReal ? s.nama_pelajaran : s.mapel} — {isReal ? new Date(s.tanggal_mengajar).toLocaleDateString('id-ID', {day:'numeric', month:'short'}) : `Sesi ${s.sesi}`}</p>
                          <p className={styles.todayMeta}>{s.mode} • {isReal ? `${s.waktu_mulai}–${s.waktu_selesai}` : `${s.jam}–${s.end}`}</p>
                          <div className={styles.siswaChips}>
                            {isReal ? (
                              <span className={styles.siswaChip} style={{background:'var(--teal-light)',color:'var(--teal-dark)'}}>{s.full_name}</span>
                            ) : s.siswa.map((sw,j) => (
                              <span key={j} className={styles.siswaChip} style={{background:'var(--teal-light)',color:'var(--teal-dark)'}}>{sw.n}</span>
                            ))}
                          </div>
                          <a href={`https://${isReal ? (s.url_gmeet || "meet.google.com") : s.gmeet}`} target="_blank" rel="noreferrer" className={styles.meetLink}>▶ Buka Meet</a>
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
                      <div className={styles.av} style={{background: avColor(i), width:32, height:32, fontSize:10}}>{getInitials(r.full_name)}</div>
                      <div className={styles.reqMiniInfo}>
                        <p className={styles.rn}>{r.full_name}</p>
                        <div style={{display:'flex',alignItems:'center',gap:5}}><span className={styles.rxSmall}>{r.nama_pelajaran}</span><ModeTag mode={r.mode} /></div>
                      </div>
                      <div className={styles.btnRow}>
                        <button className={styles.btnDecline} onClick={() => declineReq(r.id_detail_kursus)}>Tolak</button>
                        <button className={styles.btnAccept} onClick={() => acceptReq(r.id_detail_kursus)}>Terima</button>
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
                  <p className={styles.pageDesc}>{requests.length} siswa menunggu konfirmasi</p>
                </div>
                <div className={styles.filterRow}>
                  {[{v:'all',l:'Semua'},{v:'online',l:'Online'},{v:'offline',l:'Offline'}].map(f => (
                    <button key={f.v} className={`${styles.fb} ${reqFilter===f.v?styles.faActive:''}`} onClick={() => setReqFilter(f.v)}>{f.l}</button>
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
                      <div className={styles.av} style={{background: avColor(i), width:36, height:36}}>{getInitials(r.full_name)}</div>
                      <div className={styles.reqInfo}>
                        <p className={styles.rn}>{r.full_name}</p>
                        <p className={styles.rx}>{r.nama_pelajaran} • Usia {r.usia} • 📍 {r.nama_kabupaten}</p>
                      </div>
                      <ModeTag mode={r.mode} />
                    </div>
                    <div className={styles.reqBot}>
                      <span className={styles.reqTime}>📅 {new Date(r.tanggal_mengajar).toLocaleDateString('id-ID', {day:'numeric', month:'short'})} • ⏰ {r.waktu_mulai} WIB</span>
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

          {/* ══ SISWA SAYA ══ */}
          {tab === 'students' && (
            <div className={styles.pane}>
              <header className={styles.topBar}>
                <div><h1 className={styles.pageTitle}>Siswa Saya</h1><p className={styles.pageDesc}>{SISWA_DATA.length} siswa aktif</p></div>
              </header>
              <div className={styles.siswaList}>
                {SISWA_DATA.map((s, i) => (
                  <div key={i} className={styles.siswaCard}>
                    <div className={styles.av} style={{background:s.col, width:36, height:36}}>{getInitials(s.nama)}</div>
                    <div className={styles.siInfo}>
                      <p className={styles.siName}>{s.nama}</p>
                      <p className={styles.siMeta}>{s.mapel} • {s.sesi}/{s.total} sesi</p>
                      <div className={styles.progBar}><div className={styles.progFill} style={{width:`${Math.round(s.sesi/s.total*100)}%`}} /></div>
                    </div>
                    <span className={styles.progPct}>{Math.round(s.sesi/s.total*100)}%</span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* ══ JADWAL ══ */}
          {tab === 'schedule' && (
            <div className={styles.pane}>
              <header className={styles.topBar}>
                <div><h1 className={styles.pageTitle}>Jadwal 6 Bulan</h1><p className={styles.pageDesc}>Apr–Sep 2026 · 2× seminggu · 2 sesi/hari</p></div>
                <div className={styles.monthNav}>
                  <button className={styles.mnBtn} onClick={() => setCurMonth(m => Math.max(3, m-1))}>‹</button>
                  <span className={styles.mnLabel}>{MONTHS[curMonth]} 2026</span>
                  <button className={styles.mnBtn} onClick={() => setCurMonth(m => Math.min(8, m+1))}>›</button>
                </div>
              </header>
              <div className={styles.jadwalGrid}>
                {scheduleWeeks.map(w => (
                  <div key={w.w} className={styles.weekRow}>
                    <div className={styles.weekHd}>Minggu ke-{w.w}</div>
                    {w.ss.map((s, i) => (
                      <div key={i} className={styles.schedItem}>
                        <div className={`${styles.schedDot} ${i===0 ? styles.dc : styles.dt}`} />
                        <div className={styles.schedInfo}>
                          <p className={styles.sm}>{s.subj} — Sesi {i+1}</p>
                          <p className={styles.smm}>{s.label} • {SESI_TIMES[i].s}–{SESI_TIMES[i].e} WIB</p>
                        </div>
                        <a href={`https://${s.gmeet}`} target="_blank" rel="noreferrer" className={styles.meetBtn}>Buka Meet</a>
                      </div>
                    ))}
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* ══ SERTIFIKAT ══ */}
          {tab === 'cert' && (
            <div className={styles.pane}>
              <header className={styles.topBar}><div><h1 className={styles.pageTitle}>Sertifikat Relawan</h1><p className={styles.pageDesc}>Diterbitkan setelah 6 bulan mengajar per mapel</p></div></header>
              <div className={styles.certPage}>
                {CERT_DATA.map(c => (
                  <div key={c.mapel} className={styles.certCard}>
                    <div className={styles.certBanner} style={{background:`linear-gradient(135deg,${c.from},${c.to})`}}>
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
                            <div><p className={styles.csText} style={{color:'var(--teal)'}}>Sertifikat Siap Diunduh</p><p className={styles.csDesc}>Selesai 6 bulan — {c.periode}</p></div>
                          </div>
                          <div style={{marginTop:10}}><button className={styles.btnCoral}>Download PDF</button></div>
                        </>
                      ) : (
                        <>
                          <div className={`${styles.certStatus} ${styles.csProg}`}>
                            <svg width="16" height="16" viewBox="0 0 20 20" fill="none"><circle cx="10" cy="10" r="7.5" stroke="#BA7517" strokeWidth="1.5"/><path d="M10 6.667V10l2.5 1.667" stroke="#BA7517" strokeWidth="1.5" strokeLinecap="round"/></svg>
                            <div><p className={styles.csText} style={{color:'var(--amber)'}}>Dalam Proses — {c.total-c.bulan} bulan lagi</p><p className={styles.csDesc}>Mulai {c.mulai} — Target {c.target}</p></div>
                          </div>
                          <div style={{marginTop:10}}>
                            <div className={styles.certProgLabel}><span>Progres waktu</span><span>{c.bulan}/{c.total} bulan</span></div>
                            <div className={styles.progBar}><div className={styles.progFill} style={{width:`${Math.round(c.bulan/c.total*100)}%`, background:'var(--amber)'}}/></div>
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
              <header className={styles.topBar}><div><h1 className={styles.pageTitle}>Pengaturan Profil</h1><p className={styles.pageDesc}>Kelola status, mode, dan lokasi mengajarmu</p></div></header>

              <div className={styles.settCard}>
                <p className={styles.settTitle}>Status & Mode Mengajar</p>

                {/* Toggle online */}
                <div className={styles.settRow}>
                  <div>
                    <p className={styles.settLabel}>Status Ketersediaan</p>
                    <p className={styles.settDesc}>Aktifkan agar siswa bisa melihat dan merequest sesimu</p>
                  </div>
                  <div style={{display:'flex',alignItems:'center',gap:8}}>
                    <label className={styles.toggle}>
                      <input type="checkbox" checked={isOnline} onChange={e => setIsOnline(e.target.checked)} />
                      <span className={styles.tsl} />
                    </label>
                    <span style={{fontSize:11,fontWeight:600, color: isOnline?'var(--green)':'var(--gray-400)'}}>
                      {isOnline ? '● Online' : '○ Offline'}
                    </span>
                  </div>
                </div>

                {/* Mode mengajar */}
                <div className={styles.settRow}>
                  <div>
                    <p className={styles.settLabel}>Mode Mengajar</p>
                    <p className={styles.settDesc}>Pilih cara kamu bisa mengajar siswa</p>
                  </div>
                  <div className={styles.modeBtns}>
                    {[
                      { v:'online',  l:'Online',           cls:styles.mbOn   },
                      { v:'offline', l:'Offline',          cls:styles.mbOff  },
                      { v:'both',    l:'Online & Offline', cls:styles.mbBoth },
                    ].map(m => (
                      <button key={m.v} className={`${styles.mb} ${relMode===m.v ? m.cls : ''}`} onClick={() => setRelMode(m.v)}>{m.l}</button>
                    ))}
                  </div>
                </div>

                {/* Kota */}
                <div className={styles.settRow}>
                  <div>
                    <p className={styles.settLabel}>Daerah Mengajar</p>
                    <p className={styles.settDesc}>Tampil di hasil pencarian siswa offline di daerahmu</p>
                  </div>
                  <select className={styles.kotaSel} value={relKota} onChange={e => setRelKota(e.target.value)}>
                    {KOTA_LIST.map(k => <option key={k}>{k}</option>)}
                  </select>
                </div>

                {/* Mapel */}
                <div className={styles.settRow}>
                  <div>
                    <p className={styles.settLabel}>Mata Pelajaran</p>
                    <p className={styles.settDesc}>Pilih mapel yang kamu ajarkan (bisa lebih dari 1)</p>
                  </div>
                  <div className={styles.mapelTags}>
                    {ALL_MAPEL.map(m => (
                      <button key={m}
                        className={`${styles.mapelChip} ${mapelActive.includes(m) ? styles.mapelActive : ''}`}
                        onClick={() => toggleMapel(m)}
                      >{m}</button>
                    ))}
                  </div>
                </div>
              </div>

              <div className={styles.settCard}>
                <p className={styles.settTitle}>Notifikasi</p>
                <div className={styles.settRow}>
                  <div><p className={styles.settLabel}>Notifikasi Request Baru</p><p className={styles.settDesc}>Dapat notif saat ada siswa yang request sesi</p></div>
                  <label className={styles.toggle}><input type="checkbox" defaultChecked /><span className={styles.tsl} /></label>
                </div>
                <div className={styles.settRow}>
                  <div><p className={styles.settLabel}>Pengingat Jadwal</p><p className={styles.settDesc}>Ingatkan 1 jam sebelum sesi dimulai</p></div>
                  <label className={styles.toggle}><input type="checkbox" defaultChecked /><span className={styles.tsl} /></label>
                </div>
              </div>

              <button className={styles.saveBtn} onClick={saveSettings}>Simpan Pengaturan</button>
              {settToastShow && <div className={styles.toastMsg}>{settToast}</div>}
            </div>
          )}

        </main>

        {/* ─── GLOBAL TOAST ─── */}
        {toastShow && <div className={styles.toastMsg}>{toast}</div>}

        {/* ─── CREATE MODAL ─── */}
        {showCreateModal && (
          <div className={styles.modalOverlay} onClick={() => setShowCreateModal(false)}>
            <div className={styles.modal} onClick={e => e.stopPropagation()}>
              <h2 className={styles.modalTitle}>Tambah Jadwal Mengajar</h2>
              <p className={styles.modalSub}>Tentukan waktu dan mata pelajaran yang ingin Kakak ajarkan.</p>
              
              <form onSubmit={handleCreateKursus} className={styles.modalForm}>
                <div className={styles.mField}>
                  <label className={styles.mLabel}>Mata Pelajaran</label>
                  <select 
                    className={styles.mSel} 
                    value={formData.id_pelajaran} 
                    onChange={e => setFormData({...formData, id_pelajaran: e.target.value})}
                  >
                    <option value="1">Matematika</option>
                    <option value="2">Bahasa Inggris</option>
                    <option value="3">Fisika</option>
                    <option value="4">Kimia</option>
                    <option value="5">Biologi</option>
                    <option value="6">Sejarah</option>
                  </select>
                </div>

                <div className={styles.mGrid}>
                  <div className={styles.mField}>
                    <label className={styles.mLabel}>Tanggal</label>
                    <input 
                      type="date" 
                      className={styles.mInput} 
                      value={formData.tanggal_mengajar} 
                      onChange={e => setFormData({...formData, tanggal_mengajar: e.target.value})}
                      required 
                    />
                  </div>
                  <div className={styles.mField}>
                    <label className={styles.mLabel}>Mode</label>
                    <select 
                      className={styles.mSel} 
                      value={formData.mode} 
                      onChange={e => setFormData({...formData, mode: e.target.value})}
                    >
                      <option value="online">Online</option>
                      <option value="offline">Offline</option>
                    </select>
                  </div>
                </div>

                <div className={styles.mGrid}>
                  <div className={styles.mField}>
                    <label className={styles.mLabel}>Waktu Mulai</label>
                    <input 
                      type="time" 
                      className={styles.mInput} 
                      value={formData.waktu_mulai} 
                      onChange={e => setFormData({...formData, waktu_mulai: e.target.value})}
                      required 
                    />
                  </div>
                  <div className={styles.mField}>
                    <label className={styles.mLabel}>Waktu Selesai</label>
                    <input 
                      type="time" 
                      className={styles.mInput} 
                      value={formData.waktu_selesai} 
                      onChange={e => setFormData({...formData, waktu_selesai: e.target.value})}
                      required 
                    />
                  </div>
                </div>

                <div className={styles.modalFoot}>
                  <button type="button" className={styles.btnOutline} onClick={() => setShowCreateModal(false)}>Batal</button>
                  <button type="submit" className={styles.btnCoral} disabled={formLoading}>
                    {formLoading ? "Menyimpan..." : "Simpan Jadwal"}
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}
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