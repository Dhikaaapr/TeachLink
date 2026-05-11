"use client";
import { useEffect, useRef } from "react";
import styles from "./HowItWorks.module.css";

const siswaSteps = [
  {
    num: 1,
    icon: (
      <svg width="28" height="28" viewBox="0 0 28 28" fill="none">
        <path d="M14 3.5C8.2 3.5 3.5 8.2 3.5 14S8.2 24.5 14 24.5 24.5 19.8 24.5 14 19.8 3.5 14 3.5Z" stroke="currentColor" strokeWidth="2" fill="none"/>
        <path d="M14 9V14L17.5 17.5" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
        <circle cx="14" cy="9" r="2" fill="currentColor"/>
      </svg>
    ),
    title: "Daftar & isi profil",
    desc: "Buat akun gratis dan lengkapi profil belajarmu",
  },
  {
    num: 2,
    icon: (
      <svg width="28" height="28" viewBox="0 0 28 28" fill="none">
        <path d="M11.667 5.833H7a2.333 2.333 0 00-2.333 2.334V21a2.333 2.333 0 002.333 2.333h14A2.333 2.333 0 0023.333 21V8.167A2.333 2.333 0 0021 5.833h-4.667" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
        <path d="M18.667 9.333l-5.834 5.834-2.333-2.334" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
      </svg>
    ),
    title: "Lihat rekomendasi relawan",
    desc: "Sistem merekomendasikan relawan yang cocok untukmu",
  },
  {
    num: 3,
    icon: (
      <svg width="28" height="28" viewBox="0 0 28 28" fill="none">
        <path d="M23.333 17.5a2.333 2.333 0 01-2.333 2.333h-9.333L7 23.333V8.167A2.333 2.333 0 019.333 5.833H21A2.333 2.333 0 0123.333 8.167V17.5z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
      </svg>
    ),
    title: "Request sesi belajar",
    desc: "Ajukan permintaan sesi belajar kapan saja",
  },
  {
    num: 4,
    icon: (
      <svg width="28" height="28" viewBox="0 0 28 28" fill="none">
        <path d="M4.667 21V12.833l9.333-7 9.333 7V21a2.333 2.333 0 01-2.333 2.333H7A2.333 2.333 0 014.667 21z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
        <path d="M10.5 23.333V14h7v9.333" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
      </svg>
    ),
    title: "Belajar & catat progress",
    desc: "Mulai belajar dan pantau perkembangan belajarmu",
  },
];

const relawanSteps = [
  {
    num: 1,
    icon: (
      <svg width="28" height="28" viewBox="0 0 28 28" fill="none">
        <path d="M18.667 24.5v-2.333a4.667 4.667 0 00-4.667-4.667H9.333a4.667 4.667 0 00-4.666 4.667V24.5" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
        <circle cx="11.667" cy="9.333" r="4.667" stroke="currentColor" strokeWidth="2"/>
        <path d="M21 13.417V8.167M18.375 10.792h5.25" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
      </svg>
    ),
    title: "Daftar & verifikasi",
    desc: "Buat akun dan verifikasi identitas KTP/KTM",
  },
  {
    num: 2,
    icon: (
      <svg width="28" height="28" viewBox="0 0 28 28" fill="none">
        <circle cx="14" cy="14" r="10.5" stroke="currentColor" strokeWidth="2"/>
        <circle cx="14" cy="14" r="4" stroke="currentColor" strokeWidth="2"/>
        <circle cx="14" cy="14" r="1.5" fill="currentColor"/>
      </svg>
    ),
    title: "Lihat siswa di dekatnya",
    desc: "Temukan siswa yang butuh bantuan di sekitarmu",
  },
  {
    num: 3,
    icon: (
      <svg width="28" height="28" viewBox="0 0 28 28" fill="none">
        <path d="M21 14.583V8.167A2.333 2.333 0 0018.667 5.833H9.333A2.333 2.333 0 007 8.167v11.666l4.667-3.5h4.666" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
        <path d="M19.833 19.25l2.334 2.333 4.666-4.666" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
      </svg>
    ),
    title: "Terima sesi",
    desc: "Pilih dan terima permintaan sesi dari siswa",
  },
  {
    num: 4,
    icon: (
      <svg width="28" height="28" viewBox="0 0 28 28" fill="none">
        <rect x="4.667" y="4.667" width="18.667" height="18.667" rx="2.333" stroke="currentColor" strokeWidth="2"/>
        <path d="M4.667 11.667h18.666M11.667 4.667v18.666" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
      </svg>
    ),
    title: "Log jam volunteer",
    desc: "Catat jam mengajar dan dapatkan sertifikat",
  },
];

export default function HowItWorks() {
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
    <section className={`section ${styles.howItWorks}`} id="cara-kerja" ref={sectionRef}>
      <div className="container">
        <div className={styles.sectionHeader}>
          <span className={styles.label}>Cara Kerja</span>
          <h2 className="section-title">Cara kerjanya sederhana</h2>
          <p className="section-subtitle">
            Hanya beberapa langkah untuk mulai belajar atau mengajar secara gratis
          </p>
        </div>

        <div className={styles.columns}>
          {/* Siswa Column */}
          <div className={`${styles.column} ${styles.siswaColumn}`}>
            <div className={styles.columnHeader}>
              <div className={styles.columnIcon}>
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
                  <path d="M12 14l9-5-9-5-9 5 9 5z" fill="currentColor" opacity="0.3"/>
                  <path d="M12 14l9-5-9-5-9 5 9 5zM12 14l6.16-3.422a12.083 12.083 0 01.665 6.479A11.952 11.952 0 0012 20.055a11.952 11.952 0 00-6.824-2.998 12.078 12.078 0 01.665-6.479L12 14z" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
              </div>
              <h3 className={styles.columnTitle}>Untuk Siswa</h3>
            </div>
            <div className={styles.steps}>
              {siswaSteps.map((step) => (
                <div className={styles.step} key={step.num}>
                  <div className={styles.stepNum}>{step.num}</div>
                  <div className={styles.stepContent}>
                    <div className={styles.stepIcon}>{step.icon}</div>
                    <h4 className={styles.stepTitle}>{step.title}</h4>
                    <p className={styles.stepDesc}>{step.desc}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Relawan Column */}
          <div className={`${styles.column} ${styles.relawanColumn}`}>
            <div className={styles.columnHeader}>
              <div className={`${styles.columnIcon} ${styles.tealIcon}`}>
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
                  <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z" fill="currentColor" opacity="0.3"/>
                  <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z" stroke="currentColor" strokeWidth="1.5"/>
                </svg>
              </div>
              <h3 className={styles.columnTitle}>Untuk Relawan</h3>
            </div>
            <div className={styles.steps}>
              {relawanSteps.map((step) => (
                <div className={styles.step} key={step.num}>
                  <div className={`${styles.stepNum} ${styles.tealNum}`}>{step.num}</div>
                  <div className={styles.stepContent}>
                    <div className={`${styles.stepIcon} ${styles.tealStepIcon}`}>{step.icon}</div>
                    <h4 className={styles.stepTitle}>{step.title}</h4>
                    <p className={styles.stepDesc}>{step.desc}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
