"use client";
import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useAuth } from "../context/AuthContext";
import styles from "./login.module.css";

export default function LoginPage() {
  const router = useRouter();
  const { login, getDashboardPath } = useAuth();
  const [form, setForm] = useState({ email: "", password: "" });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      const res = await login(form.email, form.password);
      
      // Pakai pusat komando untuk tentukan arah dengan data terbaru
      router.push(getDashboardPath(res.data));
    } catch (err) {
      setError(err.message || "Email atau password salah");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className={styles.page}>
      {/* Left Panel */}
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
            Masuk untuk melanjutkan perjalanan belajar atau mengajarmu.
          </p>

          {/* Features */}
          <div className={styles.features}>
            <div className={styles.featureItem}>
              <div className={styles.featureIcon}>📚</div>
              <div>
                <p className={styles.featureTitle}>Belajar Gratis</p>
                <p className={styles.featureSub}>Akses relawan pengajar tanpa biaya</p>
              </div>
            </div>
            <div className={styles.featureItem}>
              <div className={styles.featureIcon}>🤝</div>
              <div>
                <p className={styles.featureTitle}>Volunteer Terverifikasi</p>
                <p className={styles.featureSub}>Semua relawan melewati proses verifikasi</p>
              </div>
            </div>
            <div className={styles.featureItem}>
              <div className={styles.featureIcon}>🎯</div>
              <div>
                <p className={styles.featureTitle}>Matching Tepat</p>
                <p className={styles.featureSub}>Cocokkan mapel, mode, dan lokasi</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Right Panel */}
      <div className={styles.rightPanel}>
        <div className={styles.formContainer}>
          <div className={styles.formHeader}>
            <h2>Selamat Datang Kembali</h2>
            <p>Masuk ke akunmu untuk melanjutkan</p>
          </div>

          {error && (
            <div className={styles.errorBox}>
              <svg width="16" height="16" viewBox="0 0 20 20" fill="none">
                <circle cx="10" cy="10" r="8" stroke="currentColor" strokeWidth="1.5"/>
                <path d="M10 6.5V11M10 13.5v.5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
              </svg>
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit}>
            <div className={styles.fields}>
              <div className={styles.field}>
                <label htmlFor="login-email">Email</label>
                <div className={styles.inputWrap}>
                  <svg width="18" height="18" viewBox="0 0 20 20" fill="none" className={styles.inputIcon}>
                    <path d="M2.5 5.833L10 11.667 17.5 5.833M2.5 5.833V14.167A1.667 1.667 0 004.167 15.833H15.833A1.667 1.667 0 0017.5 14.167V5.833M2.5 5.833A1.667 1.667 0 014.167 4.167H15.833A1.667 1.667 0 0117.5 5.833" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round" strokeLinejoin="round"/>
                  </svg>
                  <input
                    id="login-email"
                    type="email"
                    placeholder="nama@email.com"
                    value={form.email}
                    onChange={(e) => setForm({ ...form, email: e.target.value })}
                    required
                    autoComplete="email"
                  />
                </div>
              </div>
              <div className={styles.field}>
                <div className={styles.labelRow}>
                  <label htmlFor="login-password">Password</label>
                </div>
                <div className={styles.inputWrap}>
                  <svg width="18" height="18" viewBox="0 0 20 20" fill="none" className={styles.inputIcon}>
                    <rect x="4.167" y="8.333" width="11.667" height="8.333" rx="2" stroke="currentColor" strokeWidth="1.3"/>
                    <path d="M6.667 8.333V5.833a3.333 3.333 0 116.667 0v2.5" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round"/>
                  </svg>
                  <input
                    id="login-password"
                    type="password"
                    placeholder="Masukkan password"
                    value={form.password}
                    onChange={(e) => setForm({ ...form, password: e.target.value })}
                    required
                    autoComplete="current-password"
                    minLength={2}
                  />
                </div>
              </div>
            </div>

            <button type="submit" className={styles.submitBtn} disabled={loading}>
              {loading ? (
                <span className={styles.spinner}></span>
              ) : (
                <>
                  Masuk
                  <svg width="18" height="18" viewBox="0 0 20 20" fill="none">
                    <path d="M4 10H16M16 10L11 5M16 10L11 15" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                  </svg>
                </>
              )}
            </button>
          </form>

          <div className={styles.divider}>
            <span>Belum punya akun?</span>
          </div>

          <div className={styles.registerLinks}>
            <Link href="/register/siswa" className={styles.regLink}>
              <span className={styles.regIcon}>🎓</span>
              <div>
                <p className={styles.regTitle}>Daftar sebagai Siswa</p>
                <p className={styles.regSub}>Temukan relawan pengajar gratis</p>
              </div>
              <svg width="16" height="16" viewBox="0 0 20 20" fill="none">
                <path d="M7 4L13 10L7 16" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
            </Link>
            <Link href="/register/relawan" className={styles.regLink}>
              <span className={styles.regIcon}>🧑‍🏫</span>
              <div>
                <p className={styles.regTitle}>Daftar sebagai Relawan</p>
                <p className={styles.regSub}>Bantu anak Indonesia belajar</p>
              </div>
              <svg width="16" height="16" viewBox="0 0 20 20" fill="none">
                <path d="M7 4L13 10L7 16" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
