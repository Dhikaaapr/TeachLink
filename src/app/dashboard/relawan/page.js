"use client";
import { useState } from "react";
import Link from "next/link";
import styles from "./dashboard-relawan.module.css";

const mockPending = [
  { id: 1, siswa: "Rafi Ahmad", subject: "Matematika", date: "9 Apr 2026", time: "16:00", mode: "Online", age: 15, city: "Jakarta" },
  { id: 2, siswa: "Dina Kusuma", subject: "Fisika", date: "10 Apr 2026", time: "10:00", mode: "Offline", age: 17, city: "Bekasi" },
];

const mockHistory = [
  { id: 1, siswa: "Bima Putra", subject: "Matematika", date: "5 Apr 2026", duration: "1.5 jam", rating: 5 },
  { id: 2, siswa: "Aisyah Nur", subject: "Fisika", date: "3 Apr 2026", duration: "2 jam", rating: 4 },
  { id: 3, siswa: "Rafi Ahmad", subject: "Matematika", date: "1 Apr 2026", duration: "1 jam", rating: 5 },
];

export default function DashboardRelawan() {
  const [activeTab, setActiveTab] = useState("overview");

  return (
    <div className={styles.layout}>
      {/* Sidebar */}
      <aside className={styles.sidebar}>
        <div className={styles.sidebarHeader}>
          <Link href="/" className={styles.brand}>
            <svg width="28" height="28" viewBox="0 0 36 36" fill="none"><rect width="36" height="36" rx="8" fill="#D85A30"/><path d="M10 11C10 10.4477 10.4477 10 11 10H17V26H11C10.4477 26 10 25.5523 10 25V11Z" fill="white" opacity="0.9"/><path d="M19 10H25C25.5523 10 26 10.4477 26 11V25C26 25.5523 25.5523 26 25 26H19V10Z" fill="white" opacity="0.7"/></svg>
            <span>TemanBelajar</span>
          </Link>
        </div>

        <nav className={styles.sideNav}>
          <button className={`${styles.navItem} ${activeTab === "overview" ? styles.active : ""}`} onClick={() => setActiveTab("overview")}>
            <svg width="20" height="20" viewBox="0 0 20 20" fill="none"><rect x="2.5" y="2.5" width="6" height="6" rx="1.5" stroke="currentColor" strokeWidth="1.5"/><rect x="11.5" y="2.5" width="6" height="6" rx="1.5" stroke="currentColor" strokeWidth="1.5"/><rect x="2.5" y="11.5" width="6" height="6" rx="1.5" stroke="currentColor" strokeWidth="1.5"/><rect x="11.5" y="11.5" width="6" height="6" rx="1.5" stroke="currentColor" strokeWidth="1.5"/></svg>
            Dashboard
          </button>
          <button className={`${styles.navItem} ${activeTab === "requests" ? styles.active : ""}`} onClick={() => setActiveTab("requests")}>
            <svg width="20" height="20" viewBox="0 0 20 20" fill="none"><path d="M17.5 12.5a1.667 1.667 0 01-1.667 1.667h-10L2.5 17.5V5.833A1.667 1.667 0 014.167 4.167h11.666A1.667 1.667 0 0117.5 5.833V12.5z" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/></svg>
            Permintaan
            <span className={styles.badge}>2</span>
          </button>
          <button className={`${styles.navItem} ${activeTab === "students" ? styles.active : ""}`} onClick={() => setActiveTab("students")}>
            <svg width="20" height="20" viewBox="0 0 20 20" fill="none"><path d="M14.167 17.5v-1.667a3.333 3.333 0 00-3.334-3.333H5.833a3.333 3.333 0 00-3.333 3.333V17.5M8.333 9.167a3.333 3.333 0 100-6.667 3.333 3.333 0 000 6.667zM17.5 17.5v-1.667a3.333 3.333 0 00-2.5-3.225M12.5 2.608a3.333 3.333 0 010 6.45" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/></svg>
            Siswa Saya
          </button>
          <button className={`${styles.navItem} ${activeTab === "schedule" ? styles.active : ""}`} onClick={() => setActiveTab("schedule")}>
            <svg width="20" height="20" viewBox="0 0 20 20" fill="none"><rect x="2.5" y="3.333" width="15" height="14.167" rx="2" stroke="currentColor" strokeWidth="1.5"/><path d="M13.333 1.667v3.333M6.667 1.667v3.333M2.5 8.333h15" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/></svg>
            Jadwal
          </button>
          <button className={`${styles.navItem} ${activeTab === "certificate" ? styles.active : ""}`} onClick={() => setActiveTab("certificate")}>
            <svg width="20" height="20" viewBox="0 0 20 20" fill="none"><path d="M10 12.5l-3.5 5 1-3.5-3-1.5L10 12.5zm0 0l3.5 5-1-3.5 3-1.5L10 12.5z" stroke="currentColor" strokeWidth="1.5" strokeLinejoin="round"/><circle cx="10" cy="7.5" r="5" stroke="currentColor" strokeWidth="1.5"/></svg>
            Sertifikat
          </button>
        </nav>

        <div className={styles.sidebarFooter}>
          <div className={styles.userInfo}>
            <div className={styles.userAvatar} style={{background: "#D85A30"}}>AP</div>
            <div>
              <p className={styles.userName}>Andi Pratama</p>
              <p className={styles.userRole}>Relawan ✓</p>
            </div>
          </div>
          <Link href="/login" className={styles.logoutBtn}>
            <svg width="18" height="18" viewBox="0 0 20 20" fill="none"><path d="M7.5 17.5H4.167A1.667 1.667 0 012.5 15.833V4.167A1.667 1.667 0 014.167 2.5H7.5M13.333 14.167L17.5 10l-4.167-4.167M17.5 10H7.5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/></svg>
          </Link>
        </div>
      </aside>

      {/* Main */}
      <main className={styles.main}>
        <header className={styles.topBar}>
          <div>
            <h1 className={styles.pageTitle}>Halo, Kak Andi! 🧡</h1>
            <p className={styles.pageDesc}>Terima kasih sudah berbagi ilmu hari ini</p>
          </div>
          <div className={styles.topActions}>
            <button className={styles.notifBtn}>
              <svg width="20" height="20" viewBox="0 0 20 20" fill="none"><path d="M15 6.667a5 5 0 10-10 0c0 5.833-2.5 7.5-2.5 7.5h15S15 12.5 15 6.667zM11.442 17.5a1.667 1.667 0 01-2.884 0" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/></svg>
              <span className={styles.notifDot}></span>
            </button>
          </div>
        </header>

        {/* Stats */}
        <div className={styles.statsGrid}>
          <div className={styles.statCard}>
            <div className={`${styles.statIcon} ${styles.statCoral}`}>
              <svg width="22" height="22" viewBox="0 0 20 20" fill="none"><path d="M17.5 10a7.5 7.5 0 11-15 0 7.5 7.5 0 0115 0z" stroke="currentColor" strokeWidth="1.5"/><path d="M10 5.833V10l3.333 1.667" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/></svg>
            </div>
            <div>
              <p className={styles.statValue}>120</p>
              <p className={styles.statLabel}>Total Jam</p>
            </div>
          </div>
          <div className={styles.statCard}>
            <div className={`${styles.statIcon} ${styles.statTeal}`}>
              <svg width="22" height="22" viewBox="0 0 20 20" fill="none"><path d="M14.167 17.5v-1.667a3.333 3.333 0 00-6.667 0V17.5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/><circle cx="10.833" cy="6.667" r="3.333" stroke="currentColor" strokeWidth="1.5"/></svg>
            </div>
            <div>
              <p className={styles.statValue}>12</p>
              <p className={styles.statLabel}>Siswa Dibantu</p>
            </div>
          </div>
          <div className={styles.statCard}>
            <div className={`${styles.statIcon} ${styles.statYellow}`}>
              <svg width="22" height="22" viewBox="0 0 20 20" fill="none"><path d="M10 2l2.5 5.3L18 8l-4 3.9.9 5.3L10 14.5 5.1 17.2l.9-5.3-4-3.9 5.5-.7L10 2z" stroke="currentColor" strokeWidth="1.5"/></svg>
            </div>
            <div>
              <p className={styles.statValue}>4.9</p>
              <p className={styles.statLabel}>Rating</p>
            </div>
          </div>
          <div className={styles.statCard}>
            <div className={`${styles.statIcon} ${styles.statBlue}`}>
              <svg width="22" height="22" viewBox="0 0 20 20" fill="none"><path d="M17.5 12.5a1.667 1.667 0 01-1.667 1.667h-10L2.5 17.5V5.833A1.667 1.667 0 014.167 4.167h11.666A1.667 1.667 0 0117.5 5.833V12.5z" stroke="currentColor" strokeWidth="1.5"/></svg>
            </div>
            <div>
              <p className={styles.statValue}>2</p>
              <p className={styles.statLabel}>Request Pending</p>
            </div>
          </div>
        </div>

        <div className={styles.contentGrid}>
          {/* Pending Requests */}
          <div className={styles.card}>
            <div className={styles.cardHeader}>
              <h3>Permintaan Sesi Baru</h3>
              <span className={styles.pendingCount}>2 menunggu</span>
            </div>
            <div className={styles.requestList}>
              {mockPending.map(req => (
                <div className={styles.requestCard} key={req.id}>
                  <div className={styles.requestTop}>
                    <div className={styles.requestAvatar}>{req.siswa.split(" ").map(n => n[0]).join("")}</div>
                    <div className={styles.requestInfo}>
                      <p className={styles.requestName}>{req.siswa}</p>
                      <p className={styles.requestDetail}>{req.subject} • Usia {req.age} • 📍 {req.city}</p>
                    </div>
                    <span className={styles.modeBadge}>{req.mode}</span>
                  </div>
                  <div className={styles.requestBottom}>
                    <span className={styles.requestTime}>📅 {req.date} • ⏰ {req.time}</span>
                    <div className={styles.requestActions}>
                      <button className={styles.declineBtn}>Tolak</button>
                      <button className={styles.acceptBtn}>Terima</button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* History */}
          <div className={styles.card}>
            <div className={styles.cardHeader}>
              <h3>Riwayat Mengajar</h3>
              <a href="#" className={styles.viewAll}>Lihat semua</a>
            </div>
            <div className={styles.historyList}>
              {mockHistory.map(h => (
                <div className={styles.historyItem} key={h.id}>
                  <div className={styles.historyIcon}>
                    <svg width="18" height="18" viewBox="0 0 20 20" fill="none"><path d="M6.667 10l2.5 2.5 5-5" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/></svg>
                  </div>
                  <div className={styles.historyInfo}>
                    <p className={styles.historyTitle}>{h.subject} — {h.siswa}</p>
                    <p className={styles.historyMeta}>{h.date} • {h.duration}</p>
                  </div>
                  <div className={styles.historyRating}>
                    {"⭐".repeat(h.rating)}
                  </div>
                </div>
              ))}
            </div>

            {/* Certificate CTA */}
            <div className={styles.certCta}>
              <div className={styles.certInfo}>
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none"><path d="M12 15l-3.5 5 1-3.5-3-1.5L12 15zm0 0l3.5 5-1-3.5 3-1.5L12 15z" stroke="#D85A30" strokeWidth="1.5" strokeLinejoin="round"/><circle cx="12" cy="9" r="5" stroke="#D85A30" strokeWidth="1.5"/></svg>
                <div>
                  <p className={styles.certTitle}>120 jam volunteer tercatat!</p>
                  <p className={styles.certDesc}>Kamu bisa download sertifikat</p>
                </div>
              </div>
              <button className="btn btn-coral" style={{fontSize: "13px", padding: "8px 16px"}}>Download</button>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
