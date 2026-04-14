"use client";
import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import styles from "./login.module.css";

export default function LoginPage() {
  const router = useRouter();
  const [form, setForm] = useState({ email: "", password: "" });
  const [showPass, setShowPass] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    setLoading(true);
    // Mock login — simulate delay then redirect
    setTimeout(() => {
      setLoading(false);
      router.push("/dashboard/siswa");
    }, 1200);
  };

  return (
    <div className={styles.page}>
      {/* Left decorative panel */}
      <div className={styles.leftPanel}>
        <div className={styles.panelContent}>
          <Link href="/" className={styles.backLink}>
            <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
              <path d="M16 10H4M4 10L9 5M4 10L9 15" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
            Kembali
          </Link>
          <div className={styles.panelBrand}>
            <svg width="48" height="48" viewBox="0 0 36 36" fill="none">
              <rect width="36" height="36" rx="8" fill="white" fillOpacity="0.15"/>
              <path d="M10 11C10 10.4477 10.4477 10 11 10H17V26H11C10.4477 26 10 25.5523 10 25V11Z" fill="white" opacity="0.9"/>
              <path d="M19 10H25C25.5523 10 26 10.4477 26 11V25C26 25.5523 25.5523 26 25 26H19V10Z" fill="white" opacity="0.7"/>
              <circle cx="22" cy="8" r="3" fill="#D85A30"/>
            </svg>
            <h1>TemanBelajar.id</h1>
          </div>
          <p className={styles.panelTagline}>
            Belajar jadi lebih mudah dengan teman yang tepat.
          </p>
          <div className={styles.panelStats}>
            <div className={styles.pStat}>
              <span className={styles.pStatNum}>2.400+</span>
              <span className={styles.pStatLabel}>Siswa aktif</span>
            </div>
            <div className={styles.pStat}>
              <span className={styles.pStatNum}>1.800+</span>
              <span className={styles.pStatLabel}>Relawan terverifikasi</span>
            </div>
          </div>
        </div>
      </div>

      {/* Right form panel */}
      <div className={styles.rightPanel}>
        <div className={styles.formContainer}>
          <div className={styles.formHeader}>
            <h2>Selamat Datang Kembali</h2>
            <p>Masuk ke akun TemanBelajar kamu</p>
          </div>

          {/* Google login */}
          <button className={styles.googleBtn} type="button">
            <svg width="20" height="20" viewBox="0 0 20 20">
              <path d="M19.6 10.23c0-.68-.06-1.36-.17-2H10v3.8h5.4a4.6 4.6 0 01-2 3.02v2.5h3.24c1.9-1.74 2.96-4.3 2.96-7.32z" fill="#4285F4"/>
              <path d="M10 20c2.7 0 4.96-.9 6.62-2.42l-3.23-2.5c-.9.6-2.04.95-3.4.95-2.62 0-4.83-1.76-5.62-4.13H1.04v2.58A9.99 9.99 0 0010 20z" fill="#34A853"/>
              <path d="M4.38 12.9A6 6 0 014.06 10c0-.7.12-1.37.32-2l.01-.01V5.4H1.04A9.99 9.99 0 000 10c0 1.61.39 3.14 1.04 4.5l3.34-2.6z" fill="#FBBC05"/>
              <path d="M10 3.96c1.47 0 2.8.51 3.84 1.5l2.88-2.88C14.96.99 12.7 0 10 0A9.99 9.99 0 001.04 5.5l3.34 2.6C5.17 5.73 7.38 3.96 10 3.96z" fill="#EA4335"/>
            </svg>
            Masuk dengan Google
          </button>

          <div className={styles.divider}>
            <span>atau masuk dengan email</span>
          </div>

          <form onSubmit={handleSubmit} className={styles.form}>
            <div className={styles.field}>
              <label htmlFor="email">Email</label>
              <div className={styles.inputWrap}>
                <svg width="18" height="18" viewBox="0 0 20 20" fill="none" className={styles.inputIcon}>
                  <path d="M2.5 6.667L9.025 11.108c.604.388 1.346.388 1.95 0L17.5 6.667M4.167 15.833h11.666c.92 0 1.667-.746 1.667-1.666V5.833c0-.92-.746-1.666-1.667-1.666H4.167c-.92 0-1.667.746-1.667 1.666v8.334c0 .92.746 1.666 1.667 1.666z" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
                <input
                  id="email"
                  type="email"
                  placeholder="nama@email.com"
                  value={form.email}
                  onChange={(e) => setForm({...form, email: e.target.value})}
                  required
                />
              </div>
            </div>

            <div className={styles.field}>
              <label htmlFor="password">Password</label>
              <div className={styles.inputWrap}>
                <svg width="18" height="18" viewBox="0 0 20 20" fill="none" className={styles.inputIcon}>
                  <rect x="3.333" y="9.167" width="13.333" height="8.333" rx="2" stroke="currentColor" strokeWidth="1.5"/>
                  <path d="M6.667 9.167V5.833a3.333 3.333 0 116.666 0v3.334" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
                </svg>
                <input
                  id="password"
                  type={showPass ? "text" : "password"}
                  placeholder="Masukkan password"
                  value={form.password}
                  onChange={(e) => setForm({...form, password: e.target.value})}
                  required
                />
                <button type="button" className={styles.togglePass} onClick={() => setShowPass(!showPass)}>
                  {showPass ? (
                    <svg width="18" height="18" viewBox="0 0 20 20" fill="none"><path d="M2.5 10s3-6.667 7.5-6.667S17.5 10 17.5 10s-3 6.667-7.5 6.667S2.5 10 2.5 10z" stroke="currentColor" strokeWidth="1.5"/><circle cx="10" cy="10" r="2.5" stroke="currentColor" strokeWidth="1.5"/></svg>
                  ) : (
                    <svg width="18" height="18" viewBox="0 0 20 20" fill="none"><path d="M8.82 8.82a1.667 1.667 0 002.36 2.36M14.95 14.95A8.15 8.15 0 0110 16.667C5.833 16.667 2.5 10 2.5 10a14.24 14.24 0 013.55-4.95m2.7-1.47A7.26 7.26 0 0110 3.333c4.167 0 7.5 6.667 7.5 6.667a14.33 14.33 0 01-1.47 2.2M2.5 2.5l15 15" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/></svg>
                  )}
                </button>
              </div>
            </div>

            <div className={styles.formOptions}>
              <label className={styles.checkbox}>
                <input type="checkbox" />
                <span className={styles.checkmark}></span>
                Ingat saya
              </label>
              <a href="#" className={styles.forgotLink}>Lupa password?</a>
            </div>

            <button type="submit" className={`btn btn-primary ${styles.submitBtn}`} disabled={loading}>
              {loading ? (
                <span className={styles.spinner}></span>
              ) : (
                "Masuk"
              )}
            </button>
          </form>

          <p className={styles.signupLink}>
            Belum punya akun?{" "}
            <Link href="/register/siswa">Daftar sebagai Siswa</Link>
            {" "}atau{" "}
            <Link href="/register/relawan">Relawan</Link>
          </p>
        </div>
      </div>
    </div>
  );
}
