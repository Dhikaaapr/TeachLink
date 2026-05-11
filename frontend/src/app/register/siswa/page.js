"use client";
import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import styles from "../register.module.css";
import { apiRequest } from "../../../utils/api";

const subjects = [
  "Matematika", "Bahasa Indonesia", "Bahasa Inggris", "Fisika",
  "Kimia", "Biologi", "Sejarah", "Geografi", "Ekonomi", "Komputer"
];

export default function RegisterSiswa() {
  const router = useRouter();
  const [step, setStep] = useState(1);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);
  const [form, setForm] = useState({
    name: "", email: "", password: "", confirmPass: "",
    age: "", phone: "", city: "", school: "",
    subjects: [], goals: ""
  });

  const updateForm = (key, val) => setForm({...form, [key]: val});

  const toggleSubject = (subj) => {
    setForm(prev => ({
      ...prev,
      subjects: prev.subjects.includes(subj)
        ? prev.subjects.filter(s => s !== subj)
        : [...prev.subjects, subj]
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (form.password !== form.confirmPass) {
      setError("Password tidak cocok");
      return;
    }
    
    setLoading(true);
    setError("");

    try {
      await apiRequest("/auth/register", {
        method: "POST",
        body: {
          full_name: form.name,
          email: form.email,
          password: form.password,
          id_role: 2, // 2 for Siswa
          nomor_telepon: form.phone,
          institusi: form.school,
          bio: form.goals,
          // age is not in schema, so we skip it or map it if needed
        },
      });

      setSuccess(true);
      setTimeout(() => {
        router.push("/login");
      }, 2000);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className={styles.page}>
      <div className={styles.leftPanel}>
        <div className={styles.panelContent}>
          <Link href="/" className={styles.backLink}>
            <svg width="20" height="20" viewBox="0 0 20 20" fill="none"><path d="M16 10H4M4 10L9 5M4 10L9 15" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/></svg>
            Kembali
          </Link>
          <div className={styles.panelBrand}>
            <svg width="48" height="48" viewBox="0 0 36 36" fill="none"><rect width="36" height="36" rx="8" fill="white" fillOpacity="0.15"/><path d="M10 11C10 10.4477 10.4477 10 11 10H17V26H11C10.4477 26 10 25.5523 10 25V11Z" fill="white" opacity="0.9"/><path d="M19 10H25C25.5523 10 26 10.4477 26 11V25C26 25.5523 25.5523 26 25 26H19V10Z" fill="white" opacity="0.7"/><circle cx="22" cy="8" r="3" fill="#D85A30"/></svg>
            <h1>Daftar Siswa</h1>
          </div>
          <p className={styles.panelTagline}>Temukan relawan pengajar terbaik untuk membantumu belajar — sepenuhnya gratis!</p>

          {/* Steps indicator */}
          <div className={styles.stepsIndicator}>
            {[1,2,3].map(s => (
              <div key={s} className={`${styles.stepDot} ${step >= s ? styles.activeDot : ""}`}>
                {step > s ? (
                  <svg width="14" height="14" viewBox="0 0 14 14" fill="none"><path d="M3 7L6 10L11 4" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/></svg>
                ) : s}
              </div>
            ))}
            <div className={styles.stepLine}><div className={styles.stepLineFill} style={{width: `${((step-1)/2)*100}%`}}/></div>
          </div>
          <div className={styles.stepLabels}>
            <span className={step >= 1 ? styles.activeLabel : ""}>Akun</span>
            <span className={step >= 2 ? styles.activeLabel : ""}>Profil</span>
            <span className={step >= 3 ? styles.activeLabel : ""}>Pelajaran</span>
          </div>
        </div>
      </div>

      <div className={styles.rightPanel}>
        <div className={styles.formContainer}>
          <form onSubmit={handleSubmit}>
            {/* Step 1: Account */}
            {step === 1 && (
              <div className={styles.stepContent}>
                <div className={styles.formHeader}>
                  <h2>Buat Akun</h2>
                  <p>Isi data dasar untuk mendaftar</p>
                </div>
                <div className={styles.fields}>
                  <div className={styles.field}>
                    <label>Nama Lengkap</label>
                    <input type="text" placeholder="Masukkan nama lengkap" value={form.name} onChange={e => updateForm("name", e.target.value)} required />
                  </div>
                  <div className={styles.field}>
                    <label>Email</label>
                    <input type="email" placeholder="nama@email.com" value={form.email} onChange={e => updateForm("email", e.target.value)} required />
                  </div>
                  <div className={styles.field}>
                    <label>Password</label>
                    <input type="password" placeholder="Min. 8 karakter" value={form.password} onChange={e => updateForm("password", e.target.value)} required minLength={8} />
                  </div>
                  <div className={styles.field}>
                    <label>Konfirmasi Password</label>
                    <input type="password" placeholder="Masukkan ulang password" value={form.confirmPass} onChange={e => updateForm("confirmPass", e.target.value)} required />
                  </div>
                </div>
                <button type="button" className={`btn btn-primary ${styles.nextBtn}`} onClick={() => setStep(2)}>
                  Lanjut
                  <svg width="18" height="18" viewBox="0 0 20 20" fill="none"><path d="M4 10H16M16 10L11 5M16 10L11 15" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/></svg>
                </button>
              </div>
            )}

            {/* Step 2: Profile */}
            {step === 2 && (
              <div className={styles.stepContent}>
                <div className={styles.formHeader}>
                  <h2>Profil Kamu</h2>
                  <p>Bantu kami mengenalmu lebih baik</p>
                </div>
                <div className={styles.fields}>
                  <div className={styles.fieldRow}>
                    <div className={styles.field}>
                      <label>Usia</label>
                      <input type="number" placeholder="Contoh: 15" value={form.age} onChange={e => updateForm("age", e.target.value)} min="10" max="21" required />
                    </div>
                    <div className={styles.field}>
                      <label>No. Telepon</label>
                      <input type="tel" placeholder="08xxxxxxxxxx" value={form.phone} onChange={e => updateForm("phone", e.target.value)} />
                    </div>
                  </div>
                  <div className={styles.field}>
                    <label>Kota / Kabupaten</label>
                    <input type="text" placeholder="Contoh: Jakarta Selatan" value={form.city} onChange={e => updateForm("city", e.target.value)} required />
                  </div>
                  <div className={styles.field}>
                    <label>Nama Sekolah (opsional)</label>
                    <input type="text" placeholder="Kosongkan jika tidak bersekolah" value={form.school} onChange={e => updateForm("school", e.target.value)} />
                  </div>
                </div>
                <div className={styles.btnRow}>
                  <button type="button" className={`btn btn-outline ${styles.backBtn}`} onClick={() => setStep(1)}>Kembali</button>
                  <button type="button" className={`btn btn-primary ${styles.nextBtn}`} onClick={() => setStep(3)}>
                    Lanjut
                    <svg width="18" height="18" viewBox="0 0 20 20" fill="none"><path d="M4 10H16M16 10L11 5M16 10L11 15" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/></svg>
                  </button>
                </div>
              </div>
            )}

            {/* Step 3: Subjects */}
            {step === 3 && (
              <div className={styles.stepContent}>
                <div className={styles.formHeader}>
                  <h2>Mata Pelajaran</h2>
                  <p>Pilih mata pelajaran yang ingin kamu pelajari</p>
                </div>
                <div className={styles.subjectGrid}>
                  {subjects.map(subj => (
                    <button
                      key={subj}
                      type="button"
                      className={`${styles.subjectChip} ${form.subjects.includes(subj) ? styles.chipActive : ""}`}
                      onClick={() => toggleSubject(subj)}
                    >
                      {subj}
                      {form.subjects.includes(subj) && (
                        <svg width="14" height="14" viewBox="0 0 14 14" fill="none"><path d="M3 7L6 10L11 4" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/></svg>
                      )}
                    </button>
                  ))}
                </div>
                <div className={styles.field}>
                  <label>Tujuan Belajar (opsional)</label>
                  <textarea placeholder="Ceritakan apa yang ingin kamu capai..." value={form.goals} onChange={e => updateForm("goals", e.target.value)} rows={3} />
                </div>
                <div className={styles.btnRow}>
                  <button type="button" className={`btn btn-outline ${styles.backBtn}`} onClick={() => setStep(2)}>Kembali</button>
                  <button type="submit" className={`btn btn-primary ${styles.nextBtn}`} disabled={loading}>
                    {loading ? <span className={styles.spinner}></span> : "Daftar Sekarang  🎉"}
                  </button>
                </div>
              </div>
            )}
          </form>

          <p className={styles.loginLink}>
            Sudah punya akun? <Link href="/login">Masuk di sini</Link>
          </p>
        </div>
      </div>
    </div>
  );
}
