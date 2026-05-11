"use client";
import { useEffect, useRef } from "react";
import Image from "next/image";
import Link from "next/link";
import styles from "./Hero.module.css";

const stats = [
  { number: "2.400+", label: "Siswa terdaftar" },
  { number: "1.800+", label: "Relawan aktif" },
  { number: "12.000+", label: "Jam belajar" },
];

export default function Hero() {
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
      { threshold: 0.1 }
    );

    const el = sectionRef.current;
    if (el) observer.observe(el);
    return () => {
      if (el) observer.unobserve(el);
    };
  }, []);

  return (
    <section className={styles.hero} id="tentang" ref={sectionRef}>
      {/* Decorative elements */}
      <div className={styles.bgDot1}></div>
      <div className={styles.bgDot2}></div>
      <div className={styles.bgDot3}></div>

      <div className={`container ${styles.heroContainer}`}>
        {/* Left Content */}
        <div className={styles.heroContent}>
          <div className={styles.badge}>
            <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
              <path
                d="M8 1L10.1 5.3L15 6L11.5 9.4L12.3 14.2L8 12L3.7 14.2L4.5 9.4L1 6L5.9 5.3L8 1Z"
                fill="#D85A30"
              />
            </svg>
            <span>Platform Pendidikan SDG 4</span>
          </div>

          <h1 className={styles.headline}>
            Teman belajar yang tepat,{" "}
            <span className={styles.highlight}>untuk setiap anak Indonesia.</span>
          </h1>

          <p className={styles.subtext}>
            Platform gratis yang menghubungkan siswa putus sekolah dengan relawan
            pengajar berpengalaman. Bersama kita wujudkan pendidikan berkualitas.
          </p>

          <div className={styles.heroCta}>
            <Link href="/cari-relawan" className="btn btn-primary btn-lg" id="btn-cari-relawan">
              Cari Relawan
              <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
                <path
                  d="M4 10H16M16 10L11 5M16 10L11 15"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
            </Link>
            <Link href="/register/relawan" className="btn btn-coral btn-lg" id="btn-jadi-relawan">
              Jadi Relawan
              <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
                <path
                  d="M4 10H16M16 10L11 5M16 10L11 15"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
            </Link>
          </div>

          {/* Social Proof Stats */}
          <div className={styles.stats}>
            {stats.map((stat, i) => (
              <div
                className={styles.statItem}
                key={i}
                style={{ animationDelay: `${0.6 + i * 0.15}s` }}
              >
                <span className={styles.statNumber}>{stat.number}</span>
                <span className={styles.statLabel}>{stat.label}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Right Illustration */}
        <div className={styles.heroVisual}>
          <div className={styles.imageWrapper}>
            <Image
              src="/hero-illustration.png"
              alt="Siswa dan relawan belajar bersama"
              width={560}
              height={480}
              priority
              className={styles.heroImage}
            />
            {/* Floating card decorations */}
            <div className={styles.floatingCard1}>
              <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
                <path
                  d="M10 2L12.5 7.5L18 8L14 12L15 17.5L10 15L5 17.5L6 12L2 8L7.5 7.5L10 2Z"
                  fill="#FFD700"
                />
              </svg>
              <span>Sesi selesai!</span>
            </div>
            <div className={styles.floatingCard2}>
              <div className={styles.progressCircle}>
                <svg viewBox="0 0 36 36" width="28" height="28">
                  <path
                    d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                    fill="none"
                    stroke="#E5E7EB"
                    strokeWidth="3"
                  />
                  <path
                    d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                    fill="none"
                    stroke="#0F6E56"
                    strokeWidth="3"
                    strokeDasharray="85, 100"
                  />
                </svg>
              </div>
              <span>Progress 85%</span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
