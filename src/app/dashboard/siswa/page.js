"use client";
import { useState } from "react";
import Link from "next/link";
import styles from "./dashboard-siswa.module.css";

const mockRelawan = [
  { id: 1, name: "Andi Pratama", expertise: ["Matematika", "Fisika"], city: "Jakarta Selatan", rating: 4.9, hours: 120, avatar: "AP", online: true },
  { id: 2, name: "Sari Dewi", expertise: ["Bahasa Inggris", "Bahasa Indonesia"], city: "Bandung", rating: 4.8, hours: 95, avatar: "SD", online: false },
  { id: 3, name: "Budi Santoso", expertise: ["Kimia", "Biologi"], city: "Surabaya", rating: 4.7, hours: 80, avatar: "BS", online: true },
];

const mockSessions = [
  { id: 1, relawan: "Andi Pratama", subject: "Matematika", date: "8 Apr 2026", time: "16:00", status: "upcoming", mode: "Online" },
  { id: 2, relawan: "Sari Dewi", subject: "Bahasa Inggris", date: "6 Apr 2026", time: "14:00", status: "completed", mode: "Offline" },
  { id: 3, relawan: "Budi Santoso", subject: "Kimia", date: "4 Apr 2026", time: "10:00", status: "completed", mode: "Online" },
];

export default function DashboardSiswa() {
  const [activeTab, setActiveTab] = useState("overview");

  return (
    <div className={styles.layout}>
      {/* Sidebar */}
      <aside className={styles.sidebar}>
        <div className={styles.sidebarHeader}>
          <Link href="/" className={styles.brand}>
            <svg width="28" height="28" viewBox="0 0 36 36" fill="none"><rect width="36" height="36" rx="8" fill="#0F6E56"/><path d="M10 11C10 10.4477 10.4477 10 11 10H17V26H11C10.4477 26 10 25.5523 10 25V11Z" fill="white" opacity="0.9"/><path d="M19 10H25C25.5523 10 26 10.4477 26 11V25C26 25.5523 25.5523 26 25 26H19V10Z" fill="white" opacity="0.7"/></svg>
            <span>TemanBelajar</span>
          </Link>
        </div>

        <nav className={styles.sideNav}>
          <button className={`${styles.navItem} ${activeTab === "overview" ? styles.active : ""}`} onClick={() => setActiveTab("overview")}>
            <svg width="20" height="20" viewBox="0 0 20 20" fill="none"><rect x="2.5" y="2.5" width="6" height="6" rx="1.5" stroke="currentColor" strokeWidth="1.5"/><rect x="11.5" y="2.5" width="6" height="6" rx="1.5" stroke="currentColor" strokeWidth="1.5"/><rect x="2.5" y="11.5" width="6" height="6" rx="1.5" stroke="currentColor" strokeWidth="1.5"/><rect x="11.5" y="11.5" width="6" height="6" rx="1.5" stroke="currentColor" strokeWidth="1.5"/></svg>
            Dashboard
          </button>
          <button className={`${styles.navItem} ${activeTab === "sessions" ? styles.active : ""}`} onClick={() => setActiveTab("sessions")}>
            <svg width="20" height="20" viewBox="0 0 20 20" fill="none"><path d="M17.5 10a7.5 7.5 0 11-15 0 7.5 7.5 0 0115 0z" stroke="currentColor" strokeWidth="1.5"/><path d="M10 5.833V10l3.333 1.667" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/></svg>
            Sesi Belajar
          </button>
          <button className={`${styles.navItem} ${activeTab === "find" ? styles.active : ""}`} onClick={() => setActiveTab("find")}>
            <svg width="20" height="20" viewBox="0 0 20 20" fill="none"><circle cx="8.333" cy="8.333" r="5.833" stroke="currentColor" strokeWidth="1.5"/><path d="M17.5 17.5l-4.167-4.167" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/></svg>
            Cari Relawan
          </button>
          <button className={`${styles.navItem} ${activeTab === "progress" ? styles.active : ""}`} onClick={() => setActiveTab("progress")}>
            <svg width="20" height="20" viewBox="0 0 20 20" fill="none"><path d="M2.5 15l4.167-5.833L10 12.5l3.333-5L17.5 15" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/></svg>
            Progress
          </button>
        </nav>

        <div className={styles.sidebarFooter}>
          <div className={styles.userInfo}>
            <div className={styles.userAvatar}>RA</div>
            <div>
              <p className={styles.userName}>Rafi Ahmad</p>
              <p className={styles.userRole}>Siswa</p>
            </div>
          </div>
          <Link href="/login" className={styles.logoutBtn}>
            <svg width="18" height="18" viewBox="0 0 20 20" fill="none"><path d="M7.5 17.5H4.167A1.667 1.667 0 012.5 15.833V4.167A1.667 1.667 0 014.167 2.5H7.5M13.333 14.167L17.5 10l-4.167-4.167M17.5 10H7.5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/></svg>
          </Link>
        </div>
      </aside>

      {/* Main Content */}
      <main className={styles.main}>
        <header className={styles.topBar}>
          <div>
            <h1 className={styles.pageTitle}>Selamat Datang, Rafi! 👋</h1>
            <p className={styles.pageDesc}>Yuk lanjutkan belajarmu hari ini</p>
          </div>
          <div className={styles.topActions}>
            <button className={styles.notifBtn}>
              <svg width="20" height="20" viewBox="0 0 20 20" fill="none"><path d="M15 6.667a5 5 0 10-10 0c0 5.833-2.5 7.5-2.5 7.5h15S15 12.5 15 6.667zM11.442 17.5a1.667 1.667 0 01-2.884 0" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/></svg>
              <span className={styles.notifDot}></span>
            </button>
            <Link href="/cari-relawan" className="btn btn-primary" style={{fontSize: "14px", padding: "8px 20px"}}>
              + Cari Relawan
            </Link>
          </div>
        </header>

        {/* Stats Cards */}
        <div className={styles.statsGrid}>
          <div className={styles.statCard}>
            <div className={`${styles.statIcon} ${styles.statTeal}`}>
              <svg width="22" height="22" viewBox="0 0 20 20" fill="none"><path d="M17.5 10a7.5 7.5 0 11-15 0 7.5 7.5 0 0115 0z" stroke="currentColor" strokeWidth="1.5"/><path d="M10 5.833V10l3.333 1.667" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/></svg>
            </div>
            <div>
              <p className={styles.statValue}>24</p>
              <p className={styles.statLabel}>Jam Belajar</p>
            </div>
          </div>
          <div className={styles.statCard}>
            <div className={`${styles.statIcon} ${styles.statCoral}`}>
              <svg width="22" height="22" viewBox="0 0 20 20" fill="none"><path d="M10 2l2.5 5.3L18 8l-4 3.9.9 5.3L10 14.5 5.1 17.2l.9-5.3-4-3.9 5.5-.7L10 2z" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/></svg>
            </div>
            <div>
              <p className={styles.statValue}>8</p>
              <p className={styles.statLabel}>Sesi Selesai</p>
            </div>
          </div>
          <div className={styles.statCard}>
            <div className={`${styles.statIcon} ${styles.statBlue}`}>
              <svg width="22" height="22" viewBox="0 0 20 20" fill="none"><path d="M13.333 2.5H6.667C5.747 2.5 5 3.247 5 4.167v11.666c0 .92.746 1.667 1.667 1.667h6.666c.92 0 1.667-.746 1.667-1.667V4.167c0-.92-.746-1.667-1.667-1.667z" stroke="currentColor" strokeWidth="1.5"/><path d="M8.333 14.167h3.334" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/></svg>
            </div>
            <div>
              <p className={styles.statValue}>3</p>
              <p className={styles.statLabel}>Mata Pelajaran</p>
            </div>
          </div>
          <div className={styles.statCard}>
            <div className={`${styles.statIcon} ${styles.statGreen}`}>
              <svg width="22" height="22" viewBox="0 0 20 20" fill="none"><path d="M16.667 10.833v-1.5a1.667 1.667 0 00-1.667-1.666H5a1.667 1.667 0 00-1.667 1.666v5c0 .92.747 1.667 1.667 1.667h4.167" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/><path d="M13.333 17.5l2.5-2.5m0 0l2.5-2.5m-2.5 2.5l-2.5-2.5m2.5 2.5l2.5 2.5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/></svg>
            </div>
            <div>
              <p className={styles.statValue}>85%</p>
              <p className={styles.statLabel}>Progress</p>
            </div>
          </div>
        </div>

        {/* Content Grid */}
        <div className={styles.contentGrid}>
          {/* Upcoming Sessions */}
          <div className={styles.card}>
            <div className={styles.cardHeader}>
              <h3>Sesi Mendatang</h3>
              <Link href="#" className={styles.viewAll}>Lihat semua</Link>
            </div>
            <div className={styles.sessionList}>
              {mockSessions.map(session => (
                <div className={styles.sessionItem} key={session.id}>
                  <div className={styles.sessionDate}>
                    <span className={styles.sessionDay}>{session.date.split(" ")[0]}</span>
                    <span className={styles.sessionMonth}>{session.date.split(" ")[1]}</span>
                  </div>
                  <div className={styles.sessionInfo}>
                    <p className={styles.sessionSubject}>{session.subject}</p>
                    <p className={styles.sessionMeta}>dengan {session.relawan} • {session.time} • {session.mode}</p>
                  </div>
                  <span className={`${styles.sessionBadge} ${styles[session.status]}`}>
                    {session.status === "upcoming" ? "Akan Datang" : "Selesai"}
                  </span>
                </div>
              ))}
            </div>
          </div>

          {/* Recommended Relawan */}
          <div className={styles.card}>
            <div className={styles.cardHeader}>
              <h3>Relawan Untukmu</h3>
              <Link href="/cari-relawan" className={styles.viewAll}>Lihat semua</Link>
            </div>
            <div className={styles.relawanList}>
              {mockRelawan.map(r => (
                <div className={styles.relawanCard} key={r.id}>
                  <div className={styles.relawanAvatar}>
                    {r.avatar}
                    {r.online && <span className={styles.onlineDot}></span>}
                  </div>
                  <div className={styles.relawanInfo}>
                    <p className={styles.relawanName}>{r.name}</p>
                    <p className={styles.relawanExp}>{r.expertise.join(", ")}</p>
                    <div className={styles.relawanMeta}>
                      <span>⭐ {r.rating}</span>
                      <span>📍 {r.city}</span>
                      <span>⏱ {r.hours} jam</span>
                    </div>
                  </div>
                  <button className="btn btn-outline" style={{fontSize: "12px", padding: "6px 14px"}}>Request</button>
                </div>
              ))}
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
