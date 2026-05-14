"use client";
import { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useAuth } from "../../context/AuthContext";
import styles from "./Navbar.module.css";

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const { user, isAuthenticated, logout, loading, getDashboardPath } = useAuth();
  const router = useRouter();

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Close dropdown on outside click
  useEffect(() => {
    const handleClick = (e) => {
      if (!e.target.closest(`.${styles.userMenu}`)) {
        setDropdownOpen(false);
      }
    };
    document.addEventListener("click", handleClick);
    return () => document.removeEventListener("click", handleClick);
  }, []);

  const handleLogout = async () => {
    await logout();
    setDropdownOpen(false);
    router.push("/");
  };

  const dashboardPath = getDashboardPath();

  const getInitials = (name) => {
    if (!name) return "?";
    return name.split(" ").map(n => n[0]).join("").slice(0, 2).toUpperCase();
  };

  return (
    <nav
      className={`${styles.navbar} ${scrolled ? styles.scrolled : ""}`}
      id="navbar"
    >
      <div className={`container ${styles.navContainer}`}>
        {/* Logo */}
        <Link href="/" className={styles.logo} id="nav-logo">
          <svg
            className={styles.logoIcon}
            width="36"
            height="36"
            viewBox="0 0 36 36"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <rect width="36" height="36" rx="8" fill="#0F6E56" />
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
            <circle cx="22" cy="8" r="3" fill="#D85A30" />
            <path
              d="M19 14C19 12.3431 20.3431 11 22 11C23.6569 11 25 12.3431 25 14V15H19V14Z"
              fill="#D85A30"
              opacity="0.8"
            />
          </svg>
          <span className={styles.logoText}>TemanBelajar.id</span>
        </Link>

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

        {/* CTA Buttons — Auth-aware */}
        <div className={styles.navActions}>
          {loading ? (
            <div className={styles.navSkeleton}></div>
          ) : isAuthenticated ? (
            /* ── Logged-in state ── */
            <div className={styles.userMenu}>
              <button
                className={styles.userBtn}
                onClick={() => setDropdownOpen(!dropdownOpen)}
              >
                <div className={styles.userAvatar}>
                  {getInitials(user?.full_name)}
                </div>
                <span className={styles.userNameText}>{user?.full_name?.split(" ")[0]}</span>
                <svg width="12" height="12" viewBox="0 0 12 12" fill="none" style={{transform: dropdownOpen ? "rotate(180deg)" : "none", transition: "transform 0.2s"}}>
                  <path d="M3 4.5L6 7.5L9 4.5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
              </button>

              {dropdownOpen && (
                <div className={styles.dropdown}>
                  <div className={styles.dropdownHeader}>
                    <p className={styles.dropdownName}>{user?.full_name}</p>
                    <p className={styles.dropdownRole}>{user?.role}</p>
                  </div>
                  <div className={styles.dropdownDivider}></div>
                  <Link href={dashboardPath} className={styles.dropdownItem} onClick={() => setDropdownOpen(false)}>
                    <svg width="16" height="16" viewBox="0 0 20 20" fill="none"><rect x="2" y="2" width="7" height="7" rx="1.5" stroke="currentColor" strokeWidth="1.5"/><rect x="11" y="2" width="7" height="7" rx="1.5" stroke="currentColor" strokeWidth="1.5"/><rect x="2" y="11" width="7" height="7" rx="1.5" stroke="currentColor" strokeWidth="1.5"/><rect x="11" y="11" width="7" height="7" rx="1.5" stroke="currentColor" strokeWidth="1.5"/></svg>
                    Dashboard
                  </Link>
                  <button className={styles.dropdownItem} onClick={handleLogout}>
                    <svg width="16" height="16" viewBox="0 0 20 20" fill="none"><path d="M7.5 17.5H4.167A1.667 1.667 0 012.5 15.833V4.167A1.667 1.667 0 014.167 2.5H7.5M13.333 14.167L17.5 10l-4.167-4.167M17.5 10H7.5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/></svg>
                    Keluar
                  </button>
                </div>
              )}
            </div>
          ) : (
            /* ── Guest state ── */
            <>
              <Link href="/login" className={styles.loginLink} id="btn-login-nav">
                Masuk
              </Link>
              <Link href="/register/siswa" className="btn btn-outline" id="btn-siswa-nav">
                Saya Siswa
              </Link>
              <Link href="/register/relawan" className="btn btn-primary" id="btn-relawan-nav">
                Saya Relawan
              </Link>
            </>
          )}
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
              <a href="#tentang" className={styles.mobileLink} onClick={() => setMenuOpen(false)}>
                Tentang
              </a>
            </li>
            <li>
              <a href="#cara-kerja" className={styles.mobileLink} onClick={() => setMenuOpen(false)}>
                Cara Kerja
              </a>
            </li>
            <li>
              <a href="#bergabung" className={styles.mobileLink} onClick={() => setMenuOpen(false)}>
                Bergabung
              </a>
            </li>
          </ul>
          <div className={styles.mobileCta}>
            {isAuthenticated ? (
              <>
                <Link href={dashboardPath} className="btn btn-primary" onClick={() => setMenuOpen(false)}>
                  Dashboard
                </Link>
                <button className="btn btn-outline" onClick={() => { handleLogout(); setMenuOpen(false); }}>
                  Keluar
                </button>
              </>
            ) : (
              <>
                <Link href="/login" className="btn btn-outline" onClick={() => setMenuOpen(false)}>
                  Masuk
                </Link>
                <Link href="/register/siswa" className="btn btn-outline" onClick={() => setMenuOpen(false)}>
                  Saya Siswa
                </Link>
                <Link href="/register/relawan" className="btn btn-primary" onClick={() => setMenuOpen(false)}>
                  Saya Relawan
                </Link>
              </>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
}
