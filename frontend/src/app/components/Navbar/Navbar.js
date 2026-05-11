"use client";
import { useState, useEffect } from "react";
import Link from "next/link";
import styles from "./Navbar.module.css";

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <nav
      className={`${styles.navbar} ${scrolled ? styles.scrolled : ""}`}
      id="navbar"
    >
      <div className={`container ${styles.navContainer}`}>
        {/* Logo */}
        <a href="#" className={styles.logo} id="nav-logo">
          <svg
            className={styles.logoIcon}
            width="36"
            height="36"
            viewBox="0 0 36 36"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <rect width="36" height="36" rx="8" fill="#0F6E56" />
            {/* Book shape */}
            <path
              d="M10 11C10 10.4477 10.4477 10 11 10H17V26H11C10.4477 26 10 25.5523 10 25V11Z"
              fill="white"
              opacity="0.9"
            />
            <path
              d="M19 10H25C25.5523 10 26 10.4477 26 11V25C26 25.5523 25.5523 26 25 26H19V10Z"
              fill="white"
              opacity="0.7"
            />
            {/* Person silhouette */}
            <circle cx="22" cy="8" r="3" fill="#D85A30" />
            <path
              d="M19 14C19 12.3431 20.3431 11 22 11C23.6569 11 25 12.3431 25 14V15H19V14Z"
              fill="#D85A30"
              opacity="0.8"
            />
          </svg>
          <span className={styles.logoText}>TemanBelajar.id</span>
        </a>

        {/* Desktop Nav Links */}
        <ul className={styles.navLinks} id="nav-links">
          <li>
            <a href="#tentang" className={styles.navLink}>
              Tentang
            </a>
          </li>
          <li>
            <a href="#cara-kerja" className={styles.navLink}>
              Cara Kerja
            </a>
          </li>
          <li>
            <a href="#bergabung" className={styles.navLink}>
              Bergabung
            </a>
          </li>
        </ul>

        {/* CTA Buttons */}
        <div className={styles.navActions}>
          <Link href="/login" className={styles.loginLink} id="btn-login-nav">
            Masuk
          </Link>
          <Link href="/register/siswa" className="btn btn-outline" id="btn-siswa-nav">
            Saya Siswa
          </Link>
          <Link href="/register/relawan" className="btn btn-primary" id="btn-relawan-nav">
            Saya Relawan
          </Link>
        </div>

        {/* Mobile Hamburger */}
        <button
          className={`${styles.hamburger} ${menuOpen ? styles.active : ""}`}
          onClick={() => setMenuOpen(!menuOpen)}
          aria-label="Toggle navigation menu"
          id="hamburger-btn"
        >
          <span></span>
          <span></span>
          <span></span>
        </button>

        {/* Mobile Menu */}
        <div
          className={`${styles.mobileMenu} ${menuOpen ? styles.open : ""}`}
          id="mobile-menu"
        >
          <ul className={styles.mobileLinks}>
            <li>
              <a
                href="#tentang"
                className={styles.mobileLink}
                onClick={() => setMenuOpen(false)}
              >
                Tentang
              </a>
            </li>
            <li>
              <a
                href="#cara-kerja"
                className={styles.mobileLink}
                onClick={() => setMenuOpen(false)}
              >
                Cara Kerja
              </a>
            </li>
            <li>
              <a
                href="#bergabung"
                className={styles.mobileLink}
                onClick={() => setMenuOpen(false)}
              >
                Bergabung
              </a>
            </li>
          </ul>
          <div className={styles.mobileCta}>
            <Link
              href="/login"
              className="btn btn-outline"
              onClick={() => setMenuOpen(false)}
            >
              Masuk
            </Link>
            <Link
              href="/register/siswa"
              className="btn btn-outline"
              onClick={() => setMenuOpen(false)}
            >
              Saya Siswa
            </Link>
            <Link
              href="/register/relawan"
              className="btn btn-primary"
              onClick={() => setMenuOpen(false)}
            >
              Saya Relawan
            </Link>
          </div>
        </div>
      </div>
    </nav>
  );
}
