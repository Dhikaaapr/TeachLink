"use client";
import { useState, useMemo } from "react";
import Link from "next/link";
import styles from "./dashboard-siswa.module.css";

/* ─────────────── DATA ─────────────── */
const KOTA_LIST = [
  "Jakarta Selatan","Jakarta Timur","Jakarta Pusat",
  "Bandung","Surabaya","Depok","Bekasi",
];

// Urutan kedekatan per kota siswa
const KOTA_DEKAT = {
  "Jakarta Selatan": ["Jakarta Selatan","Jakarta Timur","Jakarta Pusat","Depok","Bekasi"],
  "Jakarta Timur":   ["Jakarta Timur","Jakarta Selatan","Bekasi","Jakarta Pusat","Depok"],
  "Jakarta Pusat":   ["Jakarta Pusat","Jakarta Selatan","Jakarta Timur","Depok","Bekasi"],
  "Bandung":         ["Bandung","Depok","Jakarta Selatan"],
  "Surabaya":        ["Surabaya"],
  "Depok":           ["Depok","Jakarta Selatan","Jakarta Pusat","Bekasi","Bandung"],
  "Bekasi":          ["Bekasi","Jakarta Timur","Jakarta Selatan","Depok"],
};

const RELAWAN_DATA = [
  { id:1, name:"Andi Pratama",    exp:["Matematika","Fisika"],             kota:"Jakarta Selatan", rating:4.9, jam:120, av:"AP",  col:"#D85A30", mode:"both"    },
  { id:2, name:"Sari Dewi",       exp:["Bahasa Inggris","Bahasa Indonesia"],kota:"Bandung",          rating:4.8, jam:95,  av:"SD",  col:"#185FA5", mode:"online"  },
  { id:3, name:"Budi Santoso",    exp:["Kimia","Biologi"],                 kota:"Surabaya",         rating:4.7, jam:80,  av:"BS",  col:"#BA7517", mode:"both"    },
  { id:4, name:"Lina Wahyu",      exp:["Matematika","Kimia"],              kota:"Jakarta Timur",    rating:4.6, jam:65,  av:"LW",  col:"#1D9E75", mode:"offline" },
  { id:5, name:"Rizky Ananda",    exp:["Fisika","Matematika"],             kota:"Depok",            rating:4.5, jam:50,  av:"RA",  col:"#3B6D11", mode:"online"  },
  { id:6, name:"Nadia Putri",     exp:["Biologi","Kimia"],                 kota:"Jakarta Pusat",    rating:4.8, jam:72,  av:"NP",  col:"#993556", mode:"both"    },
  { id:7, name:"Hendra Wijaya",   exp:["Bahasa Indonesia","Sejarah"],      kota:"Bekasi",           rating:4.4, jam:40,  av:"HW",  col:"#534AB7", mode:"offline" },
];

const SESSIONS_DATA = [
  { id:1, relawan:"Andi Pratama",  subject:"Matematika",      day:"22", month:"Apr", time:"16:00", status:"upcoming",  mode:"Online",  gmeet:"meet.google.com/abc-def-ghi" },
  { id:2, relawan:"Sari Dewi",     subject:"Bahasa Inggris",  day:"20", month:"Apr", time:"14:00", status:"upcoming",  mode:"Online",  gmeet:"meet.google.com/jkl-mno-pqr" },
  { id:3, relawan:"Budi Santoso",  subject:"Kimia",           day:"15", month:"Apr", time:"10:00", status:"completed", mode:"Offline", gmeet:""                            },
  { id:4, relawan:"Andi Pratama",  subject:"Fisika",          day:"10", month:"Apr", time:"16:00", status:"completed", mode:"Online",  gmeet:""                            },
  { id:5, relawan:"Lina Wahyu",    subject:"Matematika",      day:"5",  month:"Apr", time:"09:00", status:"completed", mode:"Offline", gmeet:""                            },
];

const PROGRESS_DATA = [
  { mapel:"Matematika",     pct:72, sesi:8,  target:12, topics:[{t:"Aljabar",done:true},{t:"Geometri",done:true},{t:"Trigonometri",done:true},{t:"Kalkulus",done:false},{t:"Statistik",done:false}] },
  { mapel:"Bahasa Inggris", pct:55, sesi:5,  target:10, topics:[{t:"Grammar",done:true},{t:"Reading",done:true},{t:"Writing",done:false},{t:"Speaking",done:false}] },
  { mapel:"Kimia",          pct:33, sesi:3,  target:9,  topics:[{t:"Atom & Molekul",done:true},{t:"Ikatan Kimia",done:false},{t:"Reaksi Kimia",done:false},{t:"Larutan",done:false}] },
];

/* ─────────────── HELPERS ─────────────── */
function getInitials(name) {
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
  const [tab, setTab] = useState("overview");

  // Pengaturan siswa
  const [siswaMode, setSiswaMode] = useState("online"); // "online" | "offline" | "both"
  const [siswaKota, setSiswaKota] = useState("Jakarta Selatan");

  // Filter pencarian relawan
  const [searchQ, setSearchQ]       = useState("");
  const [filterKota, setFilterKota] = useState("");
  const [filterMode, setFilterMode] = useState("all"); // "all"|"online"|"offline"|"both"
  const [sortBy, setSortBy]         = useState("rating");

  // Filter sesi
  const [sessFilter, setSessFilter] = useState("all");

  // Modal request
  const [modal, setModal]           = useState(null);
  const [toast, setToast]           = useState("");
  const [toastShow, setToastShow]   = useState(false);

  // Toast pengaturan
  const [settToast, setSettToast]   = useState(false);

  /* Filtered relawan */
  const filteredRelawan = useMemo(() => {
    const dekat = KOTA_DEKAT[siswaKota] || [];
    let data = RELAWAN_DATA.filter(r => {
      const qLower = searchQ.toLowerCase();
      const matchQ = !searchQ || r.name.toLowerCase().includes(qLower) || r.exp.some(e => e.toLowerCase().includes(qLower));
      const matchKota = !filterKota || r.kota === filterKota;
      let matchMode = true;
      if (filterMode === "online")  matchMode = r.mode === "online"  || r.mode === "both";
      if (filterMode === "offline") matchMode = r.mode === "offline" || r.mode === "both";
      if (filterMode === "both")    matchMode = r.mode === "both";
      return matchQ && matchKota && matchMode;
    });
    if (sortBy === "dekat")  data.sort((a,b) => (dekat.indexOf(a.kota) < 0 ? 99 : dekat.indexOf(a.kota)) - (dekat.indexOf(b.kota) < 0 ? 99 : dekat.indexOf(b.kota)));
    else if (sortBy === "rating") data.sort((a,b) => b.rating - a.rating);
    else if (sortBy === "jam")    data.sort((a,b) => b.jam - a.jam);
    return data;
  }, [searchQ, filterKota, filterMode, sortBy, siswaKota]);

  const filteredSessions = useMemo(() =>
    sessFilter === "all" ? SESSIONS_DATA : SESSIONS_DATA.filter(s => s.status === sessFilter),
    [sessFilter]
  );

  function openModal(r) {
    setModal(r);
  }
  function closeModal() { setModal(null); }

  function submitRequest() {
    closeModal();
    showToast(`Request ke ${modal.name} berhasil dikirim!`);
  }

  function showToast(msg) {
    setToast(msg);
    setToastShow(true);
    setTimeout(() => setToastShow(false), 3000);
  }

  function saveSettings() {
    setSettToast(true);
    setTimeout(() => setSettToast(false), 3000);
  }

  // Jarak label
  function jarakLabel(kota) {
    const dekat = KOTA_DEKAT[siswaKota] || [];
    const idx = dekat.indexOf(kota);
    if (idx < 0) return null;
    if (idx === 0) return "Daerahmu";
    if (idx <= 2)  return "Dekat";
    return "Agak Jauh";
  }

  const navItems = [
    { id:"overview",  label:"Dashboard"     },
    { id:"find",      label:"Cari Relawan"  },
    { id:"sessions",  label:"Sesi Belajar"  },
    { id:"progress",  label:"Progress"      },
    { id:"settings",  label:"Pengaturan"    },
  ];

  return (
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
            <div className={styles.userAvatar} style={{background:"#D85A30"}}>RA</div>
            <div>
              <p className={styles.userName}>Rafi Ahmad</p>
              <p className={styles.userRole}>{siswaKota}</p>
            </div>
          </div>
          <Link href="/login" className={styles.logoutBtn}>
            <svg width="15" height="15" viewBox="0 0 20 20" fill="none">
              <path d="M7.5 17.5H4.167A1.667 1.667 0 012.5 15.833V4.167A1.667 1.667 0 014.167 2.5H7.5M13.333 14.167L17.5 10l-4.167-4.167M17.5 10H7.5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
          </Link>
        </div>
      </aside>

      {/* ─── MAIN ─── */}
      <main className={styles.main}>

        {/* ══ DASHBOARD ══ */}
        {tab === "overview" && (
          <div className={styles.pane}>
            <header className={styles.topBar}>
              <div>
                <h1 className={styles.pageTitle}>Selamat Datang, Rafi! 👋</h1>
                <p className={styles.pageDesc}>Yuk lanjutkan belajarmu hari ini</p>
              </div>
              <button className={styles.btnPrimary} onClick={() => setTab("find")}>+ Cari Relawan</button>
            </header>
            <div className={styles.statsGrid}>
              <StatCard icon="clock" color="teal"  value="24"  label="Jam Belajar"    />
              <StatCard icon="star"  color="coral" value="8"   label="Sesi Selesai"   />
              <StatCard icon="book"  color="blue"  value="3"   label="Mata Pelajaran" />
              <StatCard icon="chart" color="green" value="85%" label="Progress"       />
            </div>
            <div className={styles.grid2}>
              {/* Sesi */}
              <div className={styles.card}>
                <div className={styles.cardHeader}>
                  <h3>Sesi Mendatang</h3>
                  <button className={styles.linkBtn} onClick={() => setTab("sessions")}>Lihat semua</button>
                </div>
                <div className={styles.siList}>
                  {SESSIONS_DATA.slice(0,3).map(s => (
                    <div className={styles.siRow} key={s.id}>
                      <div className={styles.sdt}>
                        <span className={styles.sday}>{s.day}</span>
                        <span className={styles.smo}>{s.month}</span>
                      </div>
                      <div className={styles.sInfo}>
                        <p className={styles.sSubj}>{s.subject}</p>
                        <p className={styles.sMeta}>dengan {s.relawan} • {s.time} • {s.mode}</p>
                      </div>
                      <span className={`${styles.badge} ${s.status==="upcoming" ? styles.bUp : styles.bDn}`}>
                        {s.status==="upcoming" ? "Akan Datang" : "Selesai"}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
              {/* Relawan */}
              <div className={styles.card}>
                <div className={styles.cardHeader}>
                  <h3>Relawan Untukmu</h3>
                  <button className={styles.linkBtn} onClick={() => setTab("find")}>Lihat semua</button>
                </div>
                <div className={styles.rlList}>
                  {RELAWAN_DATA.slice(0,3).map(r => (
                    <div className={styles.rlRow} key={r.id}>
                      <div className={styles.avWrap}>
                        <div className={styles.av} style={{background:r.col}}>{r.av}</div>
                        {r.mode !== "offline" && <OnlineDot />}
                      </div>
                      <div className={styles.ri}>
                        <p className={styles.rn}>{r.name}</p>
                        <p className={styles.rx}>{r.exp.join(", ")}</p>
                        <div className={styles.rm}><ModeTag mode={r.mode} /> <span>📍 {r.kota}</span></div>
                      </div>
                      <button className={styles.btnOutline} onClick={() => openModal(r)}>Request</button>
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

            {/* Search + filter kota */}
            <div className={styles.searchRow}>
              <input className={styles.searchInput} placeholder="Cari nama atau mata pelajaran..." value={searchQ} onChange={e => setSearchQ(e.target.value)} />
              <select className={styles.selInput} value={filterKota} onChange={e => setFilterKota(e.target.value)}>
                <option value="">Semua Daerah</option>
                {KOTA_LIST.map(k => <option key={k}>{k}</option>)}
              </select>
            </div>

            {/* Filter mode */}
            <div className={styles.filterRow}>
              <span className={styles.filterLabel}>Mode:</span>
              {[{v:"all",label:"Semua"},{v:"online",label:"Online"},{v:"offline",label:"Offline"},{v:"both",label:"Online & Offline"}].map(f => (
                <button key={f.v} className={`${styles.fb} ${filterMode===f.v ? styles.faActive:""}`} onClick={() => setFilterMode(f.v)}>{f.label}</button>
              ))}
              <span className={styles.filterLabel} style={{marginLeft:8}}>Urutkan:</span>
              <select className={styles.selInput} value={sortBy} onChange={e => setSortBy(e.target.value)}>
                <option value="rating">Rating</option>
                <option value="dekat">Terdekat</option>
                <option value="jam">Jam Terbanyak</option>
              </select>
            </div>

            {/* Results */}
            <div className={styles.rlFull}>
              {filteredRelawan.length === 0 ? (
                <div className={styles.empty}>Tidak ada relawan yang cocok dengan filter ini</div>
              ) : filteredRelawan.map(r => {
                const jarak = jarakLabel(r.kota);
                const isSama = r.kota === siswaKota;
                const bisaOffline = r.mode === "offline" || r.mode === "both";
                return (
                  <div className={styles.rlCard} key={r.id}>
                    <div className={styles.avWrap}>
                      <div className={styles.avLg} style={{background:r.col}}>{r.av}</div>
                      {r.mode !== "offline" && <OnlineDot />}
                    </div>
                    <div className={styles.rfi}>
                      <div className={styles.rfn}>
                        {r.name}
                        <ModeTag mode={r.mode} />
                        {jarak && <span className={styles.distBadge}>{jarak}</span>}
                      </div>
                      <div className={styles.rfTags}>{r.exp.map(e => <span key={e} className={styles.rtag}>{e}</span>)}</div>
                      <div className={styles.rfs}>
                        <span>★ {r.rating}</span>
                        <span>📍 {r.kota}</span>
                        <span>⏱ {r.jam} jam</span>
                        {isSama && bisaOffline && <span className={styles.bisaOffline}>✓ Bisa offline di daerahmu</span>}
                      </div>
                    </div>
                    <button className={styles.btnPrimary} style={{fontSize:11,padding:"5px 12px"}} onClick={() => openModal(r)}>Request</button>
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
              {filteredSessions.length === 0 ? <div className={styles.empty}>Tidak ada sesi</div> : filteredSessions.map(s => (
                <div className={styles.sessCard} key={s.id}>
                  <div className={styles.sdt} style={{background: s.status==="upcoming" ? "#FEF3C7" : "var(--teal-light)", minWidth:46, padding:"8px 6px"}}>
                    <span className={styles.sday} style={{color: s.status==="upcoming"?"#854F0B":"var(--teal-primary)", fontSize:16}}>{s.day}</span>
                    <span className={styles.smo} style={{color: s.status==="upcoming"?"#854F0B":"var(--teal-primary)"}}>{s.month}</span>
                  </div>
                  <div style={{flex:1}}>
                    <p className={styles.sSubj} style={{fontSize:13}}>{s.subject}</p>
                    <p className={styles.sMeta}>dengan {s.relawan} • {s.time} WIB • {s.mode}</p>
                  </div>
                  <span className={`${styles.badge} ${s.status==="upcoming" ? styles.bUp : styles.bDn}`} style={{marginRight:6}}>
                    {s.status==="upcoming" ? "Akan Datang" : "Selesai"}
                  </span>
                  {s.status === "upcoming" && (
                    <a href={`https://${s.gmeet}`} target="_blank" rel="noreferrer" className={styles.meetBtn}>Buka Meet</a>
                  )}
                </div>
              ))}
            </div>
          </div>
        )}

        {/* ══ PROGRESS ══ */}
        {tab === "progress" && (
          <div className={styles.pane}>
            <header className={styles.topBar}>
              <div><h1 className={styles.pageTitle}>Progress Belajar</h1><p className={styles.pageDesc}>Perkembangan belajarmu per mapel</p></div>
            </header>
            <div className={styles.progList}>
              {PROGRESS_DATA.map(p => (
                <div className={styles.progCard} key={p.mapel}>
                  <div className={styles.progH}>
                    <p className={styles.progT}>{p.mapel}</p>
                    <p className={styles.progPct}>{p.pct}%</p>
                  </div>
                  <div className={styles.progBar}><div className={styles.progFill} style={{width:`${p.pct}%`}} /></div>
                  <div className={styles.progMeta}><span>{p.sesi} dari {p.target} sesi selesai</span><span>{p.target-p.sesi} sesi tersisa</span></div>
                  <div className={styles.tchips}>
                    {p.topics.map(t => <span key={t.t} className={`${styles.tc} ${t.done ? styles.tcd:""}`}>{t.done?"✓ ":""}{t.t}</span>)}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* ══ PENGATURAN ══ */}
        {tab === "settings" && (
          <div className={styles.pane}>
            <header className={styles.topBar}>
              <div><h1 className={styles.pageTitle}>Pengaturan Profil</h1><p className={styles.pageDesc}>Atur preferensi belajarmu</p></div>
            </header>

            {/* Mode belajar */}
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
                  {KOTA_LIST.map(k => <option key={k}>{k}</option>)}
                </select>
              </div>
            </div>

            {/* Notifikasi */}
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

      {/* ─── MODAL REQUEST ─── */}
      {modal && (
        <div className={styles.modalOverlay} onClick={closeModal}>
          <div className={styles.modal} onClick={e => e.stopPropagation()}>
            <p className={styles.modalTitle}>Request ke {modal.name}</p>
            <p className={styles.modalSub}>{modal.exp.join(" • ")} • {modal.kota}</p>
            <div className={styles.mField}>
              <label className={styles.mLabel}>Mata Pelajaran</label>
              <select className={styles.mSel}>{modal.exp.map(e => <option key={e}>{e}</option>)}</select>
            </div>
            <div className={styles.mField}>
              <label className={styles.mLabel}>Mode Sesi</label>
              <select className={styles.mSel}>
                {(modal.mode === "online"  || modal.mode === "both") && <option>Online</option>}
                {(modal.mode === "offline" || modal.mode === "both") && <option>Offline</option>}
              </select>
            </div>
            <div className={styles.mField}>
              <label className={styles.mLabel}>Tanggal</label>
              <input className={styles.mInput} type="date" defaultValue={new Date().toISOString().split("T")[0]} />
            </div>
            <div className={styles.mField}>
              <label className={styles.mLabel}>Jam</label>
              <select className={styles.mSel}>{["09:00","10:00","13:00","14:00","15:00","16:00","17:00"].map(t=><option key={t}>{t}</option>)}</select>
            </div>
            <div className={styles.modalFoot}>
              <button className={styles.fb} onClick={closeModal}>Batal</button>
              <button className={styles.btnPrimary} onClick={submitRequest}>Kirim Request</button>
            </div>
          </div>
        </div>
      )}

      {/* ─── TOAST ─── */}
      {toastShow && <div className={styles.toastMsg}>{toast}</div>}
    </div>
  );
}

/* ── Sub-components ── */
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

function NavIcon({id}) {
  if(id==="overview")  return <svg width="14" height="14" viewBox="0 0 20 20" fill="none"><rect x="2" y="2" width="7" height="7" rx="1.5" stroke="currentColor" strokeWidth="1.5"/><rect x="11" y="2" width="7" height="7" rx="1.5" stroke="currentColor" strokeWidth="1.5"/><rect x="2" y="11" width="7" height="7" rx="1.5" stroke="currentColor" strokeWidth="1.5"/><rect x="11" y="11" width="7" height="7" rx="1.5" stroke="currentColor" strokeWidth="1.5"/></svg>;
  if(id==="find")      return <svg width="14" height="14" viewBox="0 0 20 20" fill="none"><circle cx="8.333" cy="8.333" r="5.833" stroke="currentColor" strokeWidth="1.5"/><path d="M17.5 17.5l-4.167-4.167" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/></svg>;
  if(id==="sessions")  return <svg width="14" height="14" viewBox="0 0 20 20" fill="none"><path d="M17.5 10a7.5 7.5 0 11-15 0 7.5 7.5 0 0115 0z" stroke="currentColor" strokeWidth="1.5"/><path d="M10 5.833V10l3.333 1.667" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/></svg>;
  if(id==="progress")  return <svg width="14" height="14" viewBox="0 0 20 20" fill="none"><path d="M2.5 15l4.167-5.833L10 12.5l3.333-5L17.5 15" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/></svg>;
  if(id==="settings")  return <svg width="14" height="14" viewBox="0 0 20 20" fill="none"><circle cx="10" cy="10" r="3" stroke="currentColor" strokeWidth="1.5"/><path d="M10 2v2M10 16v2M2 10h2M16 10h2M4.2 4.2l1.4 1.4M14.4 14.4l1.4 1.4M4.2 15.8l1.4-1.4M14.4 5.6l1.4-1.4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/></svg>;
  return null;
}     