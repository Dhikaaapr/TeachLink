"use client";
import { useState, useMemo, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import styles from "./dashboard-siswa.module.css";
import { useAuth } from "../../context/AuthContext";
import { apiRequestWithRetry } from "../../../utils/api";
import ProtectedRoute from "../../components/ProtectedRoute";

/* ─────────────── DATA ─────────────── */
/* ─────────────── HELPERS ─────────────── */
 
const KOTA_DEKAT = {
  "Jakarta Selatan": ["Jakarta Selatan","Jakarta Timur","Jakarta Pusat","Depok","Bekasi"],
  "Jakarta Timur":   ["Jakarta Timur","Jakarta Selatan","Bekasi","Jakarta Pusat","Depok"],
  "Jakarta Pusat":   ["Jakarta Pusat","Jakarta Selatan","Jakarta Timur","Depok","Bekasi"],
  "Bandung":         ["Bandung","Depok","Jakarta Selatan"],
  "Surabaya":        ["Surabaya"],
  "Depok":           ["Depok","Jakarta Selatan","Jakarta Pusat","Bekasi","Bandung"],
  "Bekasi":          ["Bekasi","Jakarta Timur","Jakarta Selatan","Depok"],
};

/* ─────────────── HELPERS ─────────────── */
function getInitials(name) {
  if (!name) return "?";
  return name.split(" ").map(n => n[0]).join("").slice(0,2).toUpperCase();
}

function ModeTag({ mode }) {
  if (mode === "online")  return <span className={styles.mOnline}>Online</span>;
  if (mode === "offline") return <span className={styles.mOffline}>Offline</span>;
  return <span className={styles.mBoth}>Online & Offline</span>;
}

function OnlineDot() {
  return <span className={styles.onlineDot} />;
}

/* ─────────────── KOMPONEN UTAMA ─────────────── */
export default function DashboardSiswa() {
  const { user, logout, loading: authLoading } = useAuth();
  const router = useRouter();

  const handleLogout = async () => {
    await logout();
    router.push('/');
  };

  const [tab, setTab] = useState("overview");

  // Pengaturan siswa
  const [siswaMode, setSiswaMode] = useState("online");
  const [siswaKota, setSiswaKota] = useState("Jakarta Selatan");

  // Filter pencarian relawan
  const [searchQ, setSearchQ]       = useState("");
 const [filterProvinsi, setFilterProvinsi] = useState("");
const [filterKota, setFilterKota] = useState("");
  const [filterMode, setFilterMode] = useState("all");

  // Filter sesi
  const [sessFilter, setSessFilter] = useState("all");

  // Modal request
  const [modal, setModal]           = useState(null);
  const [toast, setToast]           = useState("");
  const [toastShow, setToastShow]   = useState(false);

  // Lists for dropdowns
  const [provinces, setProvinces] = useState([]);
  const [kabupatens, setKabupatens] = useState([]);

  useEffect(() => {
    const fetchProvinces = async () => {
      try {
        const res = await apiRequestWithRetry("/provinsi/all");
        if (res.success) setProvinces(res.data || []);
      } catch (err) { console.error("Failed to fetch provinces", err); }
    };
    fetchProvinces();
  }, []);

  useEffect(() => {
    if (filterProvinsi) {
      const fetchKabupaten = async () => {
        try {
          const res = await apiRequestWithRetry(`/kabupaten/provinsi/${filterProvinsi}`);
          if (res.success) setKabupatens(res.data || []);
        } catch (err) { console.error("Failed to fetch kabupaten", err); }
      };
      fetchKabupaten();
    } else {
      setKabupatens([]);
    }
  }, [filterProvinsi]);

  // Toast pengaturan
  const [settToast, setSettToast]   = useState(false);

  // Real Data State
  const [realKursus, setRealKursus] = useState([]);
  const [loadingReal, setLoadingReal] = useState(false);

  const [realSessions, setRealSessions] = useState([]);
  const [loadingSess, setLoadingSess] = useState(false);
 
  const [recommendations, setRecommendations] = useState([]);
  const [loadingRec, setLoadingRec] = useState(false);

  // Fetch real data for Find Tab
  useEffect(() => {
    if (tab === "find") {
      const fetchKursus = async () => {
        setLoadingReal(true);
        try {
          const params = new URLSearchParams({
            mode: filterMode,
            ...(searchQ && { nama_pelajaran: searchQ }),
            ...(filterProvinsi && { id_provinsi: filterProvinsi }),
            ...(filterKota && { id_kabupaten: filterKota }),
          });
          
          const res = await apiRequestWithRetry(`/kursus/filter?${params.toString()}`);
          if (res.success) {
            setRealKursus(res.data || []);
          }
        } catch (err) {
          console.error("Failed to fetch kursus:", err);
        } finally {
          setLoadingReal(false);
        }
      };
      
      const debounce = setTimeout(fetchKursus, 500);
      return () => clearTimeout(debounce);
    }
  }, [tab, searchQ, filterMode, filterProvinsi, filterKota]);

  // Fetch real sessions
  useEffect(() => {
    if (user?.user_id) {
      const fetchSessions = async () => {
        setLoadingSess(true);
        try {
          const res = await apiRequestWithRetry(`/kursus/siswa?id_siswa=${user.user_id}&status=ALL`);
          if (res.success) {
            setRealSessions(res.data || []);
          }
        } catch (err) {
          console.error("Failed to fetch sessions:", err);
        } finally {
          setLoadingSess(false);
        }
      };
 
      const fetchRecs = async () => {
        setLoadingRec(true);
        try {
          const res = await apiRequestWithRetry(`/kursus/recommendations?id_siswa=${user.user_id}`);
          if (res.success) {
            setRecommendations(res.data || []);
          }
        } catch (err) {
          console.error("Failed to fetch recommendations:", err);
        } finally {
          setLoadingRec(false);
        }
      };
 
      fetchSessions();
      fetchRecs();
    }
  }, [user]);

  const displayRelawan = realKursus;
  const displaySessions = realSessions;

  const filteredSessions = useMemo(() =>
    sessFilter === "all" ? displaySessions : displaySessions.filter(s => {
      const status = !!s.id_kursus ? (new Date(s.tanggal_mengajar) > new Date() ? "upcoming" : "completed") : s.status;
      return status === sessFilter;
    }),
    [sessFilter, displaySessions]
  );

  const [requestedIds, setRequestedIds] = useState([]);
  const [requestingId, setRequestingId] = useState(null);

  async function handleRequest(id_kursus, displayName) {
    if (requestedIds.includes(id_kursus)) return;
    setRequestingId(id_kursus);
    try {
      await apiRequestWithRetry("/kursus/request-kursus", {
        method: "POST",
        body: {
          id_siswa: user.user_id,
          id_kursus: id_kursus,
        }
      });
      setRequestedIds(prev => [...prev, id_kursus]);
      showToast(`✅ Request ke ${displayName} berhasil dikirim!`);
    } catch (err) {
      showToast(`❌ Gagal: ${err.message}`);
    } finally {
      setRequestingId(null);
    }
  }

  function showToast(msg) {
    setToast(msg); setToastShow(true);
    setTimeout(() => setToastShow(false), 3000);
  }

  function saveSettings() {
    setSettToast(true);
    setTimeout(() => setSettToast(false), 3000);
  }

  function jarakLabel(kota) {
    const dekat = KOTA_DEKAT[siswaKota] || [];
    const idx = dekat.indexOf(kota);
    if (idx < 0) return null;
  }

  const navItems = [
    { id:"overview",  label:"Dashboard"     },
    { id:"find",      label:"Cari Relawan"  },
    { id:"sessions",  label:"Sesi Belajar"  },
    { id:"settings",  label:"Pengaturan"    },
  ];

  function NavIcon({id}) {
    if(id==="overview")  return <svg width="14" height="14" viewBox="0 0 20 20" fill="none"><rect x="2" y="2" width="7" height="7" rx="1.5" stroke="currentColor" strokeWidth="1.5"/><rect x="11" y="2" width="7" height="7" rx="1.5" stroke="currentColor" strokeWidth="1.5"/><rect x="2" y="11" width="7" height="7" rx="1.5" stroke="currentColor" strokeWidth="1.5"/><rect x="11" y="11" width="7" height="7" rx="1.5" stroke="currentColor" strokeWidth="1.5"/></svg>;
    if(id==="find")      return <svg width="14" height="14" viewBox="0 0 20 20" fill="none"><circle cx="8.333" cy="8.333" r="5.833" stroke="currentColor" strokeWidth="1.5"/><path d="M17.5 17.5l-4.167-4.167" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/></svg>;
    if(id==="sessions")  return <svg width="14" height="14" viewBox="0 0 20 20" fill="none"><path d="M17.5 10a7.5 7.5 0 11-15 0 7.5 7.5 0 0115 0z" stroke="currentColor" strokeWidth="1.5"/><path d="M10 5.833V10l3.333 1.667" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/></svg>;
    if(id==="settings")  return <svg width="14" height="14" viewBox="0 0 20 20" fill="none"><circle cx="10" cy="10" r="3" stroke="currentColor" strokeWidth="1.5"/><path d="M10 2v2M10 16v2M2 10h2M16 10h2M4.2 4.2l1.4 1.4M14.4 14.4l1.4 1.4M4.2 15.8l1.4-1.4M14.4 5.6l1.4-1.4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/></svg>;
    return null;
  }

  function StatCard({icon,color,value,label}) {
    const map={teal:styles.siTeal,coral:styles.siCoral,blue:styles.siBlue,green:styles.siGreen};
    return (
      <div className={styles.sc}>
        <div className={`${styles.siIcon} ${map[color]}`}><StatIcon type={icon}/></div>
        <div><p className={styles.sv}>{value}</p><p className={styles.sl}>{label}</p></div>
      </div>
    );
  }

  function StatIcon({type}) {
    if(type==="clock") return <svg width="16" height="16" viewBox="0 0 20 20" fill="none"><path d="M17.5 10a7.5 7.5 0 11-15 0 7.5 7.5 0 0115 0z" stroke="currentColor" strokeWidth="1.5"/><path d="M10 5.833V10l3.333 1.667" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/></svg>;
    if(type==="star")  return <svg width="16" height="16" viewBox="0 0 20 20" fill="none"><path d="M10 2l2.5 5.3L18 8l-4 3.9.9 5.3L10 14.5 5.1 17.2l.9-5.3-4-3.9 5.5-.7L10 2z" stroke="currentColor" strokeWidth="1.5"/></svg>;
    if(type==="book")  return <svg width="16" height="16" viewBox="0 0 20 20" fill="none"><path d="M5 4.167h10c.92 0 1.667.746 1.667 1.666v9.167c0 .92-.747 1.667-1.667 1.667H5A1.667 1.667 0 013.333 15V5.833c0-.92.747-1.666 1.667-1.666z" stroke="currentColor" strokeWidth="1.5"/><path d="M8.333 14.167h3.334" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/></svg>;
    if(type==="chart") return <svg width="16" height="16" viewBox="0 0 20 20" fill="none"><path d="M2.5 15l4.167-5.833L10 12.5l3.333-5L17.5 15" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/></svg>;
    return null;
  }

  return (
    <ProtectedRoute allowedRoles={["siswa"]}>
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
              <button key={item.id} className={`${styles.navItem} ${tab===item.id ? styles.active:""}`} onClick={() => setTab(item.id)}>
                <NavIcon id={item.id} />
                {item.label}
              </button>
            ))}
          </nav>
          <div className={styles.sidebarFooter}>
            <div className={styles.userInfo}>
              <div className={styles.userAvatar} style={{background:"#D85A30"}}>{user?.full_name ? user.full_name.split(' ').map(n=>n[0]).join('').slice(0,2).toUpperCase() : 'U'}</div>
              <div>
                <p className={styles.userName}>{user?.full_name || 'User'}</p>
                <p className={styles.userRole}>{siswaKota}</p>
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
          {tab === "overview" && (
            <div className={styles.pane}>
              <header className={styles.topBar}>
                <div>
                  <h1 className={styles.pageTitle}>Selamat Datang, {user?.full_name?.split(' ')[0] || 'User'}! 👋</h1>
                  <p className={styles.pageDesc}>Yuk lanjutkan belajarmu hari ini</p>
                </div>
                <button className={styles.btnPrimary} onClick={() => setTab("find")}>+ Cari Relawan</button>
              </header>
              <div className={styles.statsGrid}>
                <StatCard icon="clock" color="teal"  value="24"  label="Jam Belajar"    />
                <StatCard icon="star"  color="coral" value="8"   label="Sesi Selesai"   />
                <StatCard icon="book"  color="blue"  value="3"   label="Mata Pelajaran" />
              </div>
              <div className={styles.grid2}>
                <div className={styles.card}>
                  <div className={styles.cardHeader}>
                    <h3>Sesi Mendatang</h3>
                    <button className={styles.linkBtn} onClick={() => setTab("sessions")}>Lihat semua</button>
                  </div>
                  <div className={styles.siList}>
                    {loadingSess ? (
                      <div className={styles.empty}>Memuat sesi...</div>
                    ) : displaySessions.length === 0 ? (
                      <div className={styles.empty}>Belum ada sesi</div>
                    ) : displaySessions.slice(0,3).map(s => {
                      const isReal = !!s.id_kursus;
                      const dateObj = isReal ? new Date(s.tanggal_mengajar) : null;
                      const day = isReal ? dateObj.getDate() : s.day;
                      const month = isReal ? dateObj.toLocaleDateString('id-ID', {month:'short'}) : s.month;
                      const status = isReal ? (new Date(s.tanggal_mengajar) > new Date() ? "upcoming" : "completed") : s.status;

                      return (
                        <div className={styles.siRow} key={isReal ? `real-s-${s.id_kursus}` : `mock-s-${s.id}`}>
                          <div className={styles.sdt}>
                            <span className={styles.sday}>{day}</span>
                            <span className={styles.smo}>{month}</span>
                          </div>
                          <div className={styles.sInfo}>
                            <p className={styles.sSubj}>{isReal ? s.nama_pelajaran : s.subject}</p>
                            <p className={styles.sMeta}>{isReal ? s.full_name : s.relawan} • ⏰ {isReal ? s.waktu_mulai?.slice(0,5) : s.time} - {isReal ? s.waktu_selesai?.slice(0,5) : ""} • {s.mode}</p>
                          </div>
                          <span className={`${styles.badge} ${status==="upcoming" ? styles.bUp : styles.bDn}`}>
                            {status==="upcoming" ? "Akan Datang" : "Selesai"}
                          </span>
                        </div>
                      );
                    })}
                  </div>
                </div>
                <div className={styles.card}>
                  <div className={styles.cardHeader}>
                    <h3>Relawan Untukmu</h3>
                    <button className={styles.linkBtn} onClick={() => setTab("find")}>Lihat semua</button>
                  </div>
                  <div className={styles.rlList}>
                    {loadingRec ? (
                      <div className={styles.empty}>Mencari relawan terbaik untukmu...</div>
                    ) : recommendations.length === 0 ? (
                      <div className={styles.empty}>Belum ada relawan yang sesuai minatmu</div>
                    ) : recommendations.map(r => (
                      <div className={styles.rlCard} key={r.id_kursus} style={{ marginBottom: 12 }}>
                        <div className={styles.avWrap}>
                          <div className={styles.avLg} style={{background: "#0F6E56"}}>{getInitials(r.full_name)}</div>
                          {r.mode !== "offline" && <OnlineDot />}
                        </div>
                        <div className={styles.rfi}>
                          <div className={styles.rfn}>
                            {r.nama_pelajaran || "Umum"}
                            <ModeTag mode={r.mode || "online"} />
                          </div>
                          <div className={styles.rfTags}>
                            <span className={styles.rtag}>{r.full_name}</span>
                          </div>
                          <div className={styles.rfs}>
                            <span>📍 {r.nama_kabupaten || "Luar Kota"}</span>
                            <span>📅 {new Date(r.tanggal_mengajar).toLocaleDateString('id-ID', {day:'numeric', month:'short'})} • ⏰ {r.waktu_mulai?.slice(0,5)} - {r.waktu_selesai?.slice(0,5)}</span>
                          </div>
                        </div>
                        <button
                          className={styles.btnPrimary}
                          style={{fontSize:11,padding:"5px 12px"}}
                          onClick={() => handleRequest(r.id_kursus, r.full_name)}
                          disabled={requestedIds.includes(r.id_kursus) || requestingId === r.id_kursus}
                        >
                          {requestedIds.includes(r.id_kursus) ? "✔ Terkirim" : requestingId === r.id_kursus ? "..." : "Request"}
                        </button>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* ══ CARI RELAWAN ══ */}
          {tab === "find" && (
            <div className={styles.pane}>
              <header className={styles.topBar}>
                <div>
                  <h1 className={styles.pageTitle}>Cari Relawan</h1>
                  <p className={styles.pageDesc}>Filter berdasarkan mode & daerah</p>
                </div>
              </header>

            <div className={styles.searchRow}>
  {/* SEARCH */}
  <input
    className={styles.searchInput}
    placeholder="Cari nama atau mata pelajaran..."
    value={searchQ}
    onChange={e => setSearchQ(e.target.value)}
  />

  {/* PROVINSI */}
  <select
    className={styles.selInput}
    value={filterProvinsi}
    onChange={e => {
      setFilterProvinsi(e.target.value);
      setFilterKota("");
    }}
  >
    <option value="">Semua Provinsi</option>
    {provinces.map((prov) => (
      <option key={prov.id_provinsi} value={prov.id_provinsi}>{prov.nama_provinsi}</option>
    ))}
  </select>

  {/* KABUPATEN */}
  <select
    className={styles.selInput}
    value={filterKota}
    onChange={e => setFilterKota(e.target.value)}
    disabled={!filterProvinsi}
  >
    <option value="">Semua Kabupaten</option>
    {kabupatens.map((kota) => (
      <option key={kota.id_kabupaten} value={kota.id_kabupaten}>{kota.nama_kabupaten}</option>
    ))}
  </select>
</div>

              <div className={styles.filterRow}>
                <span className={styles.filterLabel}>Mode:</span>
                {[{v:"all",label:"Semua"},{v:"online",label:"Online"},{v:"offline",label:"Offline"},{v:"online & offline",label:"Online & Offline"}].map(f => (
                  <button key={f.v} className={`${styles.fb} ${filterMode===f.v ? styles.faActive:""}`} onClick={() => setFilterMode(f.v)}>{f.label}</button>
                ))}
              </div>

              <div className={styles.rlFull}>
                {loadingReal ? (
                  <div className={styles.empty}>Memuat data relawan...</div>
                ) : displayRelawan.length === 0 ? (
                  <div className={styles.empty}>Tidak ada relawan yang cocok dengan filter ini</div>
                ) : displayRelawan.map(r => {
                  const isReal = !!r.id_kursus;
                  const rName = isReal ? r.full_name : r.name;
                  const rKota = isReal ? r.nama_kabupaten : r.kota;
                  const rExp  = isReal ? [r.nama_pelajaran] : r.exp;
                  const rCol  = isReal ? "#0F6E56" : r.col;
                  const rAv   = isReal ? getInitials(r.full_name) : r.av;
                  const rMode = r.mode;
                  
                  const jarak = jarakLabel(rKota);
                  const isSama = rKota === siswaKota;
                  const bisaOffline = rMode === "offline" || rMode === "both";
                  
                  return (
                    <div className={styles.rlCard} key={isReal ? `real-${r.id_kursus}` : `mock-${r.id}`}>
                      <div className={styles.avWrap}>
                        <div className={styles.avLg} style={{background:rCol}}>{rAv}</div>
                        {rMode !== "offline" && <OnlineDot />}
                      </div>
                      <div className={styles.rfi}>
                        <div className={styles.rfn}>
                          {rExp[0]}
                          <ModeTag mode={rMode} />
                          {jarak && <span className={styles.distBadge}>{jarak}</span>}
                        </div>
                        <div className={styles.rfTags}><span className={styles.rtag}>{rName}</span></div>
                        <div className={styles.rfs}>
                          <span>📍 {rKota}</span>
                          {isReal ? (
                            <span>📅 {new Date(r.tanggal_mengajar).toLocaleDateString('id-ID', {day:'numeric', month:'short'})} • ⏰ {r.waktu_mulai.slice(0,5)} - {r.waktu_selesai?.slice(0,5)}</span>
                          ) : (
                            <span>⏱ {r.jam} jam</span>
                          )}
                        </div>
                      </div>
                      <button
                        className={styles.btnPrimary}
                        style={{fontSize:11,padding:"5px 12px"}}
                        onClick={() => isReal && handleRequest(r.id_kursus, rName)}
                        disabled={!isReal || requestedIds.includes(r.id_kursus) || requestingId === r.id_kursus}
                      >
                        {requestedIds.includes(r.id_kursus) ? "✔ Terkirim" : requestingId === r.id_kursus ? "..." : "Request"}
                      </button>
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {/* ══ SESI BELAJAR ══ */}
          {tab === "sessions" && (
            <div className={styles.pane}>
              <header className={styles.topBar}>
                <div>
                  <h1 className={styles.pageTitle}>Sesi Belajar</h1>
                  <p className={styles.pageDesc}>Riwayat dan jadwal sesimu</p>
                </div>
                <div className={styles.filterRow}>
                  {[{v:"all",label:"Semua"},{v:"upcoming",label:"Akan Datang"},{v:"completed",label:"Selesai"}].map(f => (
                    <button key={f.v} className={`${styles.fb} ${sessFilter===f.v ? styles.faActive:""}`} onClick={() => setSessFilter(f.v)}>{f.label}</button>
                  ))}
                </div>
              </header>
              <div className={styles.sessFull}>
                {loadingSess ? (
                  <div className={styles.empty}>Memuat sesi...</div>
                ) : displaySessions.length === 0 ? (
                  <div className={styles.empty}>Tidak ada sesi</div>
                ) : displaySessions.map(s => {
                  const isReal = !!s.id_kursus;
                  const dateObj = isReal ? new Date(s.tanggal_mengajar) : null;
                  const day = isReal ? dateObj.getDate() : s.day;
                  const month = isReal ? dateObj.toLocaleDateString('id-ID', {month:'short'}) : s.month;
                  const status = isReal ? (new Date(s.tanggal_mengajar) > new Date() ? "upcoming" : "completed") : s.status;

                  return (
                    <div className={styles.sessCard} key={isReal ? `real-fs-${s.id_kursus}` : `mock-fs-${s.id}`}>
                      <div className={styles.sdt} style={{background: status==="upcoming" ? "#FEF3C7" : "var(--teal-light)", minWidth:46, padding:"8px 6px"}}>
                        <span className={styles.sday} style={{color: status==="upcoming"?"#854F0B":"var(--teal-primary)", fontSize:16}}>{day}</span>
                        <span className={styles.smo} style={{color: status==="upcoming"?"#854F0B":"var(--teal-primary)"}}>{month}</span>
                      </div>
                      <div style={{flex:1}}>
                        <p className={styles.sSubj} style={{fontSize:13}}>{isReal ? s.nama_pelajaran : s.subject}</p>
                        <p className={styles.sMeta}>dengan {isReal ? s.full_name : s.relawan} • ⏰ {isReal ? s.waktu_mulai?.slice(0,5) : s.time} - {isReal ? s.waktu_selesai?.slice(0,5) : ""} • {s.mode}</p>
                      </div>
                      <span className={`${styles.badge} ${status==="upcoming" ? styles.bUp : styles.bDn}`} style={{marginRight:6}}>
                        {status==="upcoming" ? "Akan Datang" : "Selesai"}
                      </span>
                      {status === "upcoming" && (
                        <a href={`https://${isReal ? (s.url_gmeet || "meet.google.com") : s.gmeet}`} target="_blank" rel="noreferrer" className={styles.meetBtn}>Buka Meet</a>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>
          )}



          {/* ══ PENGATURAN ══ */}
          {tab === "settings" && (
            <div className={styles.pane}>
              <header className={styles.topBar}>
                <div><h1 className={styles.pageTitle}>Pengaturan Profil</h1><p className={styles.pageDesc}>Atur preferensi belajarmu</p></div>
              </header>

              <div className={styles.settCard}>
                <p className={styles.settTitle}>Preferensi Mode Belajar</p>
                <div className={styles.settRow}>
                  <div>
                    <p className={styles.settLabel}>Mode Belajar Saya</p>
                    <p className={styles.settDesc}>Pilih apakah kamu mau belajar online, offline, atau keduanya</p>
                  </div>
                  <div className={styles.modeBtnRow}>
                    {[
                      {v:"online",  label:"Online",          cls:styles.mBtnOnline  },
                      {v:"offline", label:"Offline",         cls:styles.mBtnOffline },
                      {v:"both",    label:"Keduanya",        cls:styles.mBtnBoth    },
                    ].map(m => (
                      <button key={m.v} className={`${styles.mBtn} ${siswaMode===m.v ? m.cls:""}`} onClick={() => setSiswaMode(m.v)}>{m.label}</button>
                    ))}
                  </div>
                </div>
                <div className={styles.settRow}>
                  <div>
                    <p className={styles.settLabel}>Daerah Domisili</p>
                    <p className={styles.settDesc}>Digunakan untuk mencari relawan offline terdekat</p>
                  </div>
                  <select className={styles.kotaSel} value={siswaKota} onChange={e => setSiswaKota(e.target.value)}>
                    <option value="">Pilih Daerah</option>
                    {kabupatens.map(k => <option key={k.id_kabupaten} value={k.nama_kabupaten}>{k.nama_kabupaten}</option>)}
                  </select>
                </div>
              </div>

              <div className={styles.settCard}>
                <p className={styles.settTitle}>Notifikasi</p>
                <div className={styles.settRow}>
                  <div>
                    <p className={styles.settLabel}>Notifikasi Sesi Baru</p>
                    <p className={styles.settDesc}>Dapat notif saat relawan konfirmasi request</p>
                  </div>
                  <label className={styles.toggle}><input type="checkbox" defaultChecked /><span className={styles.tSlider} /></label>
                </div>
                <div className={styles.settRow}>
                  <div>
                    <p className={styles.settLabel}>Pengingat Jadwal</p>
                    <p className={styles.settDesc}>Ingatkan 1 jam sebelum sesi dimulai</p>
                  </div>
                  <label className={styles.toggle}><input type="checkbox" defaultChecked /><span className={styles.tSlider} /></label>
                </div>
              </div>

              <button className={styles.saveBtn} onClick={saveSettings}>Simpan Pengaturan</button>
              {settToast && <div className={styles.toastMsg}>Tersimpan! Mode: {siswaMode === "both" ? "Online & Offline" : siswaMode.charAt(0).toUpperCase()+siswaMode.slice(1)} | Daerah: {siswaKota}</div>}
            </div>
          )}

        </main>

        {/* ─── TOAST ─── */}
        {toastShow && <div className={styles.toastMsg}>{toast}</div>}
      </div>
    </ProtectedRoute>
  );
}