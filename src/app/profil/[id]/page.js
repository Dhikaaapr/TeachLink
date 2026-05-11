"use client";
import { useState } from "react";
import Link from "next/link";
import { useParams } from "next/navigation";
import styles from "./profil.module.css";

const relawanData = {
  1: { name: "Andi Pratama", avatar: "AP", city: "Jakarta Selatan", expertise: ["Matematika", "Fisika"], rating: 4.9, hours: 120, reviews: 34, online: true, mode: ["Online", "Offline"], occupation: "Mahasiswa", institution: "Institut Teknologi Bandung", bio: "Mahasiswa Teknik semester 6 di ITB. Saya percaya setiap anak berhak mendapat pendidikan yang berkualitas. Sudah 2 tahun menjadi relawan pengajar dan sangat menikmati proses berbagi ilmu.", joined: "Jan 2024", students: 12 },
  2: { name: "Sari Dewi", avatar: "SD", city: "Bandung", expertise: ["Bahasa Inggris", "Bahasa Indonesia"], rating: 4.8, hours: 95, reviews: 28, online: false, mode: ["Online"], occupation: "Fresh Graduate", institution: "Universitas Padjadjaran", bio: "TOEFL tutor berpengalaman dengan skor 600+. Mengajar bahasa Inggris dengan metode yang menyenangkan dan mudah dipahami.", joined: "Mar 2024", students: 9 },
  3: { name: "Budi Santoso", avatar: "BS", city: "Surabaya", expertise: ["Kimia", "Biologi"], rating: 4.7, hours: 80, reviews: 22, online: true, mode: ["Offline"], occupation: "Guru SMA", institution: "SMAN 5 Surabaya", bio: "Guru IPA dengan 5 tahun pengalaman. Senang mengajar dengan eksperimen sederhana agar siswa lebih mudah memahami konsep sains.", joined: "Jun 2024", students: 8 },
  4: { name: "Rina Maharani", avatar: "RM", city: "Yogyakarta", expertise: ["Komputer", "Matematika"], rating: 4.9, hours: 150, reviews: 41, online: true, mode: ["Online", "Offline"], occupation: "Software Engineer", institution: "Tokopedia", bio: "Software engineer yang passionate mengajarkan dasar-dasar programming dan logika matematika.", joined: "Dec 2023", students: 15 },
  5: { name: "Fajar Hidayat", avatar: "FH", city: "Semarang", expertise: ["Fisika", "Matematika"], rating: 4.6, hours: 65, reviews: 18, online: false, mode: ["Online"], occupation: "Mahasiswa", institution: "Universitas Gadjah Mada", bio: "Mahasiswa Fisika UGM yang suka membuat konsep sulit jadi mudah dipahami.", joined: "Aug 2024", students: 6 },
  6: { name: "Lina Kusuma", avatar: "LK", city: "Malang", expertise: ["Bahasa Inggris", "Sejarah"], rating: 4.8, hours: 110, reviews: 30, online: true, mode: ["Online", "Offline"], occupation: "Guru", institution: "Universitas Brawijaya", bio: "Lulusan sastra Inggris, mengajar bahasa dan sejarah dengan metode cerita yang menarik.", joined: "Feb 2024", students: 11 },
};

const mockReviews = [
  { id: 1, name: "Rafi Ahmad", date: "2 Apr 2026", rating: 5, text: "Kak Andi sangat sabar mengajarkan materi yang sulit. Sekarang saya sudah lebih paham matematika!" },
  { id: 2, name: "Dina Kusuma", date: "28 Mar 2026", rating: 5, text: "Penjelasannya sangat jelas dan mudah dipahami. Terima kasih banyak!" },
  { id: 3, name: "Bima Putra", date: "20 Mar 2026", rating: 4, text: "Sesi belajarnya menyenangkan, tidak membosankan. Recommended!" },
];

const schedule = [
  { day: "Senin", time: "15:00 - 17:00", available: true },
  { day: "Selasa", time: "15:00 - 17:00", available: false },
  { day: "Rabu", time: "15:00 - 17:00", available: true },
  { day: "Kamis", time: "16:00 - 18:00", available: true },
  { day: "Jumat", time: "10:00 - 12:00", available: true },
  { day: "Sabtu", time: "09:00 - 12:00", available: true },
  { day: "Minggu", time: "-", available: false },
];

export default function ProfilRelawan({ params }) {
  const { id } = useParams();
  const [requested, setRequested] = useState(false);
  const [activeTab, setActiveTab] = useState("about");

  const relawan = relawanData[id] || relawanData[1];

  return (
    <div className={styles.page}>
      {/* Header */}
      <header className={styles.header}>
        <div className={`container ${styles.headerInner}`}>
          <Link href="/cari-relawan" className={styles.backBtn}>
            <svg width="20" height="20" viewBox="0 0 20 20" fill="none"><path d="M16 10H4M4 10L9 5M4 10L9 15" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/></svg>
            Kembali
          </Link>
        </div>
      </header>

      <div className={`container ${styles.content}`}>
        <div className={styles.grid}>
          {/* Left - Profile Info */}
          <div className={styles.profileCard}>
            <div className={styles.profileTop}>
              <div className={styles.avatarLarge}>
                {relawan.avatar}
                {relawan.online && <span className={styles.onlineDot}></span>}
              </div>
              <h1 className={styles.profileName}>{relawan.name}</h1>
              <p className={styles.profileMeta}>
                {relawan.occupation} • {relawan.institution}
              </p>
              <p className={styles.profileCity}>📍 {relawan.city}</p>

              <div className={styles.profileStats}>
                <div className={styles.pStat}>
                  <span className={styles.pStatVal}>⭐ {relawan.rating}</span>
                  <span className={styles.pStatLbl}>Rating</span>
                </div>
                <div className={styles.pStatDivider}></div>
                <div className={styles.pStat}>
                  <span className={styles.pStatVal}>{relawan.hours}</span>
                  <span className={styles.pStatLbl}>Jam</span>
                </div>
                <div className={styles.pStatDivider}></div>
                <div className={styles.pStat}>
                  <span className={styles.pStatVal}>{relawan.students}</span>
                  <span className={styles.pStatLbl}>Siswa</span>
                </div>
                <div className={styles.pStatDivider}></div>
                <div className={styles.pStat}>
                  <span className={styles.pStatVal}>{relawan.reviews}</span>
                  <span className={styles.pStatLbl}>Review</span>
                </div>
              </div>

              <div className={styles.profileTags}>
                {relawan.expertise.map(e => (
                  <span key={e} className={styles.profileTag}>{e}</span>
                ))}
              </div>

              <div className={styles.profileModes}>
                {relawan.mode.map(m => (
                  <span key={m} className={styles.profileMode}>
                    {m === "Online" ? "🟢" : "📍"} {m}
                  </span>
                ))}
              </div>

              <div className={styles.profileActions}>
                {requested ? (
                  <button className={styles.requestedBtn} disabled>
                    <svg width="18" height="18" viewBox="0 0 18 18" fill="none"><path d="M4 9L7.5 12.5L14 5.5" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/></svg>
                    Request Terkirim
                  </button>
                ) : (
                  <button className={styles.requestBtn} onClick={() => setRequested(true)}>
                    Request Sesi Belajar
                  </button>
                )}
                <button className={styles.chatBtn}>
                  <svg width="18" height="18" viewBox="0 0 20 20" fill="none"><path d="M17.5 12.5a1.667 1.667 0 01-1.667 1.667h-10L2.5 17.5V5.833A1.667 1.667 0 014.167 4.167h11.666A1.667 1.667 0 0117.5 5.833V12.5z" stroke="currentColor" strokeWidth="1.5"/></svg>
                  Chat
                </button>
              </div>

              <p className={styles.joinDate}>Bergabung sejak {relawan.joined}</p>
            </div>
          </div>

          {/* Right - Details */}
          <div className={styles.detailsArea}>
            {/* Tabs */}
            <div className={styles.tabs}>
              <button className={`${styles.tab} ${activeTab === "about" ? styles.tabActive : ""}`} onClick={() => setActiveTab("about")}>Tentang</button>
              <button className={`${styles.tab} ${activeTab === "schedule" ? styles.tabActive : ""}`} onClick={() => setActiveTab("schedule")}>Jadwal</button>
              <button className={`${styles.tab} ${activeTab === "reviews" ? styles.tabActive : ""}`} onClick={() => setActiveTab("reviews")}>Review ({relawan.reviews})</button>
            </div>

            {/* About Tab */}
            {activeTab === "about" && (
              <div className={styles.tabContent}>
                <div className={styles.section}>
                  <h3 className={styles.sectionTitle}>Tentang Saya</h3>
                  <p className={styles.bioText}>{relawan.bio}</p>
                </div>

                <div className={styles.section}>
                  <h3 className={styles.sectionTitle}>Bidang Keahlian</h3>
                  <div className={styles.expertiseGrid}>
                    {relawan.expertise.map(e => (
                      <div key={e} className={styles.expertiseCard}>
                        <svg width="24" height="24" viewBox="0 0 24 24" fill="none"><path d="M12 14l9-5-9-5-9 5 9 5zM12 14v7.5M21 9v7" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/></svg>
                        <span>{e}</span>
                      </div>
                    ))}
                  </div>
                </div>

                <div className={styles.section}>
                  <h3 className={styles.sectionTitle}>Statistik</h3>
                  <div className={styles.achievementGrid}>
                    <div className={styles.achievement}>
                      <div className={styles.achIcon} style={{background: "#FEF3C7", color: "#D97706"}}>🏆</div>
                      <div><p className={styles.achTitle}>Top Relawan</p><p className={styles.achDesc}>Rating 4.5+ konsisten</p></div>
                    </div>
                    <div className={styles.achievement}>
                      <div className={styles.achIcon} style={{background: "#ECFDF5", color: "#10B981"}}>📚</div>
                      <div><p className={styles.achTitle}>100+ Jam</p><p className={styles.achDesc}>Jam volunteer tercatat</p></div>
                    </div>
                    <div className={styles.achievement}>
                      <div className={styles.achIcon} style={{background: "#FDF0EB", color: "#D85A30"}}>❤️</div>
                      <div><p className={styles.achTitle}>{relawan.students} Siswa</p><p className={styles.achDesc}>Terbantu belajar</p></div>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Schedule Tab */}
            {activeTab === "schedule" && (
              <div className={styles.tabContent}>
                <div className={styles.section}>
                  <h3 className={styles.sectionTitle}>Jadwal Ketersediaan</h3>
                  <div className={styles.scheduleList}>
                    {schedule.map(s => (
                      <div key={s.day} className={`${styles.scheduleItem} ${!s.available ? styles.unavailable : ""}`}>
                        <span className={styles.scheduleDay}>{s.day}</span>
                        <span className={styles.scheduleTime}>{s.time}</span>
                        <span className={`${styles.scheduleBadge} ${s.available ? styles.available : styles.notAvailable}`}>
                          {s.available ? "Tersedia" : "Tidak tersedia"}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}

            {/* Reviews Tab */}
            {activeTab === "reviews" && (
              <div className={styles.tabContent}>
                <div className={styles.section}>
                  <h3 className={styles.sectionTitle}>Review dari Siswa</h3>
                  <div className={styles.reviewList}>
                    {mockReviews.map(r => (
                      <div key={r.id} className={styles.reviewCard}>
                        <div className={styles.reviewTop}>
                          <div className={styles.reviewAvatar}>{r.name.split(" ").map(n => n[0]).join("")}</div>
                          <div className={styles.reviewInfo}>
                            <p className={styles.reviewName}>{r.name}</p>
                            <p className={styles.reviewDate}>{r.date}</p>
                          </div>
                          <div className={styles.reviewRating}>{"⭐".repeat(r.rating)}</div>
                        </div>
                        <p className={styles.reviewText}>{r.text}</p>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
