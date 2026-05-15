"use client";
import { useState, useEffect } from "react";
import Link from "next/link";
import styles from "./cari-relawan.module.css";
import { useAuth } from "../context/AuthContext";
import { apiRequestWithRetry } from "../../utils/api";

const subjects = ["Semua", "Matematika", "Fisika", "Kimia", "Biologi", "Bahasa Inggris", "Bahasa Indonesia", "Komputer", "Sejarah"];

export default function CariRelawan() {
  const { user } = useAuth();
  const [search, setSearch] = useState("");
  const [selectedSubject, setSelectedSubject] = useState("Semua");
  const [modeFilter, setModeFilter] = useState("all");
  const [filterProvinsi, setFilterProvinsi] = useState("");
  const [filterKota, setFilterKota] = useState("");
  const [requestedIds, setRequestedIds] = useState([]);
  
  const [realKursus, setRealKursus] = useState([]);
  const [loading, setLoading] = useState(false);
  const [toast, setToast] = useState("");
  const [toastShow, setToastShow] = useState(false);

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

  useEffect(() => {
    const fetchKursus = async () => {
      setLoading(true);
      try {
        const params = new URLSearchParams({
          mode: modeFilter,
          ...(selectedSubject !== "Semua" && { nama_pelajaran: selectedSubject }),
          ...(search && { nama_pelajaran: search }),
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
        setLoading(false);
      }
    };
    
    const debounce = setTimeout(fetchKursus, 500);
    return () => clearTimeout(debounce);
  }, [search, selectedSubject, modeFilter, filterProvinsi, filterKota]);

  const handleRequest = async (id_kursus, name) => {
    if (!user) {
      showToast("Silakan login terlebih dahulu");
      return;
    }
    try {
      await apiRequestWithRetry("/kursus/request-kursus", {
        method: "POST",
        body: {
          id_siswa: user.user_id,
          id_kursus: id_kursus,
        }
      });
      setRequestedIds(prev => [...prev, id_kursus]);
      showToast(`Request ke ${name} berhasil dikirim!`);
    } catch (err) {
      showToast(`Gagal: ${err.message}`);
    }
  };

  function showToast(msg) {
    setToast(msg); setToastShow(true);
    setTimeout(() => setToastShow(false), 3000);
  }

  function getInitials(name) {
    if (!name) return "?";
    return name.split(" ").map(n => n[0]).join("").slice(0, 2).toUpperCase();
  }

  return (
    <div className={styles.page}>
      {/* Header */}
      <header className={styles.header}>
        <div className={`container ${styles.headerInner}`}>
          <Link href="/dashboard/siswa" className={styles.backBtn}>
            <svg width="20" height="20" viewBox="0 0 20 20" fill="none"><path d="M16 10H4M4 10L9 5M4 10L9 15" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/></svg>
            Kembali
          </Link>
          <h1>Cari Relawan Pengajar</h1>
          <p>{realKursus.length} relawan tersedia</p>
        </div>
      </header>

      <div className={`container ${styles.content}`}>
        {/* Filters */}
        <div className={styles.filters}>
          <div className={styles.searchWrap}>
            <svg width="18" height="18" viewBox="0 0 20 20" fill="none" className={styles.searchIcon}>
              <circle cx="8.333" cy="8.333" r="5.833" stroke="currentColor" strokeWidth="1.5"/>
              <path d="M17.5 17.5l-4.167-4.167" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
            </svg>
            <input
              type="text"
              placeholder="Cari mata pelajaran..."
              value={search}
              onChange={e => setSearch(e.target.value)}
              className={styles.searchInput}
            />
          </div>

          <div className={styles.filterRow}>
            <select className={styles.selInput} value={filterProvinsi} onChange={e => { setFilterProvinsi(e.target.value); setFilterKota(""); }}>
              <option value="">Semua Provinsi</option>
              {provinces.map(p => <option key={p.id_provinsi} value={p.id_provinsi}>{p.nama_provinsi}</option>)}
            </select>

            <select className={styles.selInput} value={filterKota} onChange={e => setFilterKota(e.target.value)} disabled={!filterProvinsi}>
              <option value="">Semua Kabupaten</option>
              {kabupatens.map(k => <option key={k.id_kabupaten} value={k.id_kabupaten}>{k.nama_kabupaten}</option>)}
            </select>

            <div className={styles.modeFilter}>
              <button className={`${styles.modeBtn} ${modeFilter === "all" ? styles.modeActive : ""}`} onClick={() => setModeFilter("all")}>Semua</button>
              <button className={`${styles.modeBtn} ${modeFilter === "online" ? styles.modeActive : ""}`} onClick={() => setModeFilter("online")}>🟢 Online</button>
              <button className={`${styles.modeBtn} ${modeFilter === "offline" ? styles.modeActive : ""}`} onClick={() => setModeFilter("offline")}>📍 Offline</button>
              <button className={`${styles.modeBtn} ${modeFilter === "online & offline" ? styles.modeActive : ""}`} onClick={() => setModeFilter("online & offline")}>🌓 Keduanya</button>
            </div>
          </div>

          <div className={styles.subjectFilter} style={{ marginTop: 12 }}>
            {subjects.map(s => (
              <button
                key={s}
                className={`${styles.filterChip} ${selectedSubject === s ? styles.filterActive : ""}`}
                onClick={() => setSelectedSubject(s)}
              >
                {s}
              </button>
            ))}
          </div>
        </div>

        {/* Results Grid */}
        <div className={styles.grid}>
          {loading ? (
            <div className={styles.empty}>Memuat data...</div>
          ) : realKursus.map(r => (
            <div className={styles.card} key={r.id_kursus}>
              <div className={styles.cardTop}>
                <div className={styles.avatar}>
                  {getInitials(r.full_name)}
                  {r.mode !== "offline" && <span className={styles.onlineDot}></span>}
                </div>
                <div className={styles.cardInfo}>
                  <h3 className={styles.name}>{r.nama_pelajaran}</h3>
                  <p className={styles.city}>{r.full_name} • 📍 {r.nama_kabupaten}</p>
                </div>
              </div>

              <p className={styles.bio}>Relawan pengajar mata pelajaran {r.nama_pelajaran}. Siap membantu Anda belajar dengan metode yang menyenangkan.</p>

              <div className={styles.tags}>
                <span className={styles.tag}>{r.nama_pelajaran}</span>
              </div>

              <div className={styles.meta}>
                <span>📅 {new Date(r.tanggal_mengajar).toLocaleDateString('id-ID', {day:'numeric', month:'short'})}</span>
                <span>⏰ {r.waktu_mulai.slice(0,5)} - {r.waktu_selesai?.slice(0,5)}</span>
                <div className={styles.modes}>
                  <span className={styles.modeTag}>{r.mode}</span>
                </div>
              </div>

              <div className={styles.cardActions}>
                <Link href={`/profil/${r.id_relawan || r.user_id}`} className={styles.profileLink}>Lihat Profil</Link>
                {requestedIds.includes(r.id_kursus) ? (
                  <button className={styles.requestedBtn} disabled>
                    <svg width="16" height="16" viewBox="0 0 16 16" fill="none"><path d="M4 8L7 11L12 5" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/></svg>
                    Terkirim
                  </button>
                ) : (
                  <button className={styles.requestBtn} onClick={() => handleRequest(r.id_kursus, r.full_name)}>
                    Request Sesi
                  </button>
                )}
              </div>
            </div>
          ))}
        </div>

        {!loading && realKursus.length === 0 && (
          <div className={styles.empty}>
            <svg width="48" height="48" viewBox="0 0 48 48" fill="none"><circle cx="24" cy="24" r="20" stroke="#D1D5DB" strokeWidth="2" fill="none"/><path d="M18 30s2-4 6-4 6 4 6 4M19 19h.01M29 19h.01" stroke="#D1D5DB" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/></svg>
            <h3>Tidak ada relawan ditemukan</h3>
            <p>Coba ubah filter atau kata kunci pencarian</p>
          </div>
        )}
      </div>
      {toastShow && <div className={styles.toastMsg}>{toast}</div>}
    </div>
  );
}

