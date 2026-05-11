"use client";
import { useState } from "react";
import Link from "next/link";
import styles from "./cari-relawan.module.css";

const allRelawan = [
  { id: 1, name: "Andi Pratama", expertise: ["Matematika", "Fisika"], city: "Jakarta Selatan", rating: 4.9, hours: 120, reviews: 34, avatar: "AP", online: true, mode: ["Online", "Offline"], bio: "Mahasiswa ITB semester 6, passionate mengajar Matematika & Fisika." },
  { id: 2, name: "Sari Dewi", expertise: ["Bahasa Inggris", "Bahasa Indonesia"], city: "Bandung", rating: 4.8, hours: 95, reviews: 28, avatar: "SD", online: false, mode: ["Online"], bio: "TOEFL tutor berpengalaman, siap bantu kamu mahir berbahasa Inggris." },
  { id: 3, name: "Budi Santoso", expertise: ["Kimia", "Biologi"], city: "Surabaya", rating: 4.7, hours: 80, reviews: 22, avatar: "BS", online: true, mode: ["Offline"], bio: "Guru SMA dengan 5 tahun pengalaman mengajar IPA." },
  { id: 4, name: "Rina Maharani", expertise: ["Komputer", "Matematika"], city: "Yogyakarta", rating: 4.9, hours: 150, reviews: 41, avatar: "RM", online: true, mode: ["Online", "Offline"], bio: "Software engineer yang senang berbagi ilmu coding & logika." },
  { id: 5, name: "Fajar Hidayat", expertise: ["Fisika", "Matematika"], city: "Semarang", rating: 4.6, hours: 65, reviews: 18, avatar: "FH", online: false, mode: ["Online"], bio: "Mahasiswa Fisika UGM, suka membuat konsep sulit jadi mudah." },
  { id: 6, name: "Lina Kusuma", expertise: ["Bahasa Inggris", "Sejarah"], city: "Malang", rating: 4.8, hours: 110, reviews: 30, avatar: "LK", online: true, mode: ["Online", "Offline"], bio: "Lulusan sastra Inggris, mengajar bahasa dan sejarah dengan metode cerita." },
];

const subjects = ["Semua", "Matematika", "Fisika", "Kimia", "Biologi", "Bahasa Inggris", "Bahasa Indonesia", "Komputer", "Sejarah"];

export default function CariRelawan() {
  const [search, setSearch] = useState("");
  const [selectedSubject, setSelectedSubject] = useState("Semua");
  const [modeFilter, setModeFilter] = useState("all");
  const [requestedIds, setRequestedIds] = useState([]);

  const filtered = allRelawan.filter(r => {
    const matchSearch = r.name.toLowerCase().includes(search.toLowerCase()) || r.city.toLowerCase().includes(search.toLowerCase());
    const matchSubject = selectedSubject === "Semua" || r.expertise.includes(selectedSubject);
    const matchMode = modeFilter === "all" || r.mode.includes(modeFilter === "online" ? "Online" : "Offline");
    return matchSearch && matchSubject && matchMode;
  });

  const handleRequest = (id) => {
    setRequestedIds(prev => [...prev, id]);
  };

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
          <p>{filtered.length} relawan tersedia</p>
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
              placeholder="Cari berdasarkan nama atau kota..."
              value={search}
              onChange={e => setSearch(e.target.value)}
              className={styles.searchInput}
            />
          </div>

          <div className={styles.filterRow}>
            <div className={styles.subjectFilter}>
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

            <div className={styles.modeFilter}>
              <button className={`${styles.modeBtn} ${modeFilter === "all" ? styles.modeActive : ""}`} onClick={() => setModeFilter("all")}>Semua</button>
              <button className={`${styles.modeBtn} ${modeFilter === "online" ? styles.modeActive : ""}`} onClick={() => setModeFilter("online")}>🟢 Online</button>
              <button className={`${styles.modeBtn} ${modeFilter === "offline" ? styles.modeActive : ""}`} onClick={() => setModeFilter("offline")}>📍 Offline</button>
            </div>
          </div>
        </div>

        {/* Results Grid */}
        <div className={styles.grid}>
          {filtered.map(r => (
            <div className={styles.card} key={r.id}>
              <div className={styles.cardTop}>
                <div className={styles.avatar}>
                  {r.avatar}
                  {r.online && <span className={styles.onlineDot}></span>}
                </div>
                <div className={styles.cardInfo}>
                  <h3 className={styles.name}>{r.name}</h3>
                  <p className={styles.city}>📍 {r.city}</p>
                </div>
                <div className={styles.ratingBadge}>
                  <svg width="14" height="14" viewBox="0 0 14 14" fill="none"><path d="M7 1l1.75 3.7L13 5.3 10 8.2l.7 3.8L7 10.2 3.3 12l.7-3.8L1 5.3l4.25-.6L7 1z" fill="#FBBF24"/></svg>
                  {r.rating}
                </div>
              </div>

              <p className={styles.bio}>{r.bio}</p>

              <div className={styles.tags}>
                {r.expertise.map(e => (
                  <span key={e} className={styles.tag}>{e}</span>
                ))}
              </div>

              <div className={styles.meta}>
                <span>⏱ {r.hours} jam</span>
                <span>💬 {r.reviews} review</span>
                <div className={styles.modes}>
                  {r.mode.map(m => (
                    <span key={m} className={styles.modeTag}>{m}</span>
                  ))}
                </div>
              </div>

              <div className={styles.cardActions}>
                <Link href={`/profil/${r.id}`} className={styles.profileLink}>Lihat Profil</Link>
                {requestedIds.includes(r.id) ? (
                  <button className={styles.requestedBtn} disabled>
                    <svg width="16" height="16" viewBox="0 0 16 16" fill="none"><path d="M4 8L7 11L12 5" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/></svg>
                    Terkirim
                  </button>
                ) : (
                  <button className={styles.requestBtn} onClick={() => handleRequest(r.id)}>
                    Request Sesi
                  </button>
                )}
              </div>
            </div>
          ))}
        </div>

        {filtered.length === 0 && (
          <div className={styles.empty}>
            <svg width="48" height="48" viewBox="0 0 48 48" fill="none"><circle cx="24" cy="24" r="20" stroke="#D1D5DB" strokeWidth="2" fill="none"/><path d="M18 30s2-4 6-4 6 4 6 4M19 19h.01M29 19h.01" stroke="#D1D5DB" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/></svg>
            <h3>Tidak ada relawan ditemukan</h3>
            <p>Coba ubah filter atau kata kunci pencarian</p>
          </div>
        )}
      </div>
    </div>
  );
}
