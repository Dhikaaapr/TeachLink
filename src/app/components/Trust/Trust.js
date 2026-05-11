"use client";
import { useEffect, useRef } from "react";
import styles from "./Trust.module.css";

const features = [
  {
    icon: (
      <svg width="32" height="32" viewBox="0 0 32 32" fill="none">
        <path
          d="M16 3L4 9V15C4 22.18 9.04 28.86 16 30.32C22.96 28.86 28 22.18 28 15V9L16 3Z"
          stroke="currentColor"
          strokeWidth="2"
          fill="none"
        />
        <path
          d="M12 16L15 19L21 13"
          stroke="currentColor"
          strokeWidth="2.5"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </svg>
    ),
    title: "Relawan Terverifikasi",
    desc: "Setiap relawan melalui proses verifikasi identitas KTP/KTM untuk keamanan siswa.",
    color: "teal",
  },
  {
    icon: (
      <svg width="32" height="32" viewBox="0 0 32 32" fill="none">
        <circle cx="16" cy="16" r="12" stroke="currentColor" strokeWidth="2" fill="none" />
        <path d="M11 16H21M16 12V19" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
        <path d="M12 12L10 10M20 12L22 10" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
      </svg>
    ),
    title: "Gratis Sepenuhnya",
    desc: "Tidak ada biaya apapun. Pendidikan berkualitas harus bisa diakses semua anak Indonesia.",
    color: "coral",
  },
  {
    icon: (
      <svg width="32" height="32" viewBox="0 0 32 32" fill="none">
        <rect x="6" y="8" width="12" height="16" rx="2" stroke="currentColor" strokeWidth="2" fill="none" />
        <path d="M18 12H26V24C26 25.1046 25.1046 26 24 26H20C18.8954 26 18 25.1046 18 24V12Z" stroke="currentColor" strokeWidth="2" fill="none" />
        <circle cx="12" cy="19" r="1.5" fill="currentColor" />
        <circle cx="22" cy="19" r="1.5" fill="currentColor" />
        <path d="M10 6V8M14 6V8" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
      </svg>
    ),
    title: "Online & Offline",
    desc: "Fleksibel memilih sesi belajar secara daring atau bertemu langsung sesuai kebutuhan.",
    color: "blue",
  },
];

export default function Trust() {
  const sectionRef = useRef(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add(styles.visible);
          }
        });
      },
      { threshold: 0.15 }
    );

    const el = sectionRef.current;
    if (el) observer.observe(el);
    return () => {
      if (el) observer.unobserve(el);
    };
  }, []);

  return (
    <section className={`section ${styles.trust}`} id="bergabung" ref={sectionRef}>
      <div className="container">
        <div className={styles.sectionHeader}>
          <span className={styles.label}>Kenapa Kami?</span>
          <h2 className="section-title">Belajar dengan aman dan nyaman</h2>
          <p className="section-subtitle">
            Kami berkomitmen menciptakan lingkungan belajar yang aman, gratis, dan fleksibel untuk semua
          </p>
        </div>

        <div className={styles.cards}>
          {features.map((feature, i) => (
            <div
              className={`${styles.card} ${styles[feature.color]}`}
              key={i}
              style={{ animationDelay: `${i * 0.15}s` }}
            >
              <div className={`${styles.iconWrap} ${styles[`icon_${feature.color}`]}`}>
                {feature.icon}
              </div>
              <h3 className={styles.cardTitle}>{feature.title}</h3>
              <p className={styles.cardDesc}>{feature.desc}</p>
            </div>
          ))}
        </div>

        {/* CTA Banner */}
        <div className={styles.ctaBanner}>
          <div className={styles.ctaContent}>
            <h3 className={styles.ctaTitle}>Siap untuk membuat perubahan?</h3>
            <p className={styles.ctaDesc}>
              Bergabung bersama ribuan siswa dan relawan lainnya untuk mewujudkan pendidikan berkualitas di Indonesia.
            </p>
          </div>
          <div className={styles.ctaActions}>
            <a href="#siswa" className="btn btn-outline btn-lg" id="btn-siswa-cta" style={{ borderColor: 'white', color: 'white' }}>
              Saya Siswa
            </a>
            <a href="#relawan" className="btn btn-lg" id="btn-relawan-cta" style={{ background: 'white', color: '#0F6E56' }}>
              Saya Relawan
            </a>
          </div>
        </div>
      </div>
    </section>
  );
}
