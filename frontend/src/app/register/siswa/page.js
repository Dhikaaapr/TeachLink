"use client";
import { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import styles from "../register.module.css";
import { apiRequest } from "../../../utils/api";
import { useAuth } from "../../context/AuthContext";
import { ROLES } from "../../../utils/constants";

const subjects = [
  "Matematika", "Bahasa Indonesia", "Bahasa Inggris", "Fisika",
  "Kimia", "Biologi", "Sejarah", "Geografi", "Ekonomi", "Komputer"
];

const STEP_META = [
  { label: "Akun",     sub: "Data login"       },
  { label: "Profil",   sub: "Info pribadi"     },
  { label: "Pelajaran", sub: "Mapel favorit" },
];

function CheckIcon() {
  return (
    <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
      <path d="M3 7L6 10L11 4" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
    </svg>
  );
}

function StepIndicator({ current }) {
  return (
    <div className={styles.stepsIndicator}>
      {STEP_META.map((s, i) => {
        const n      = i + 1;
        const isDone = n < current;
        const isAct  = n === current;
        return (
          <div key={n}>
            <div className={styles.stepItem}>
              <div className={`${styles.stepDot} ${isDone ? styles.doneDot : ""} ${isAct ? styles.activeDot : ""}`}>
                {isDone ? <CheckIcon /> : n}
              </div>
              <div className={styles.stepMeta}>
                <p className={`${styles.stepLabel} ${isAct ? styles.activeLabel : ""} ${isDone ? styles.doneLabel : ""}`}>
                  {s.label}
                </p>
                <p className={`${styles.stepSub} ${isAct ? styles.activeLabel : ""}`}>
                  {s.sub}
                </p>
              </div>
            </div>
            {n < 3 && (
              <div className={`${styles.stepConnector} ${isDone ? styles.doneConn : ""}`} />
            )}
          </div>
        );
      })}
    </div>
  );
}

export default function RegisterSiswa() {
  const router = useRouter();
  const { login } = useAuth();
  const [step, setStep] = useState(1);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [form, setForm] = useState({
    name: "", email: "", password: "", confirmPass: "",
    age: "", phone: "", city: "", school: "",
    province: "", id_provinsi: "", id_kabupaten: "",
    subjects: [], goals: ""
  });

  const [provinces, setProvinces] = useState([]);
  const [kabupatens, setKabupatens] = useState([]);

  useEffect(() => {
    const fetchProvinces = async () => {
      try {
        const res = await apiRequest("/provinsi/all");
        if (res.success) setProvinces(res.data || []);
      } catch (err) { console.error("Failed to fetch provinces", err); }
    };
    fetchProvinces();
  }, []);

  useEffect(() => {
    if (form.id_provinsi) {
      const fetchKabupaten = async () => {
        try {
          const res = await apiRequest(`/kabupaten/provinsi/${form.id_provinsi}`);
          if (res.success) setKabupatens(res.data || []);
        } catch (err) { console.error("Failed to fetch kabupaten", err); }
      };
      fetchKabupaten();
    } else {
      setKabupatens([]);
    }
  }, [form.id_provinsi]);

  const updateForm = (key, val) => setForm(prev => ({...prev, [key]: val}));

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
          id_role: ROLES.SISWA,
          nomor_telepon: form.phone || undefined,
          tanggal_lahir: form.age || undefined,
          id_provinsi: parseInt(form.id_provinsi) || undefined,
          id_kabupaten: parseInt(form.id_kabupaten) || undefined,
          institusi: form.school || undefined,
          bidang_keahlian: form.subjects.join(", ") || undefined,
          bio: form.goals || undefined,
        },
      });

      // Login otomatis setelah daftar
      await login(form.email, form.password);
      router.push("/dashboard/siswa");
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className={`${styles.page} ${styles.siswaPage}`}>
      <div className={styles.leftPanel}>
        <div className={styles.panelContent}>
          <Link href="/" className={styles.backLink}>
            <svg width="20" height="20" viewBox="0 0 20 20" fill="none"><path d="M16 10H4M4 10L9 5M4 10L9 15" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/></svg>
            Kembali
          </Link>
          <div className={styles.panelBrand}>
            <svg width="48" height="48" viewBox="0 0 36 36" fill="none">
              <rect width="36" height="36" rx="8" fill="white" fillOpacity="0.15"/>
              <path d="M10 11C10 10.4477 10.4477 10 11 10H17V26H11C10.4477 26 10 25.5523 10 25V11Z" fill="white" opacity="0.9"/>
              <path d="M19 10H25C25.5523 10 26 10.4477 26 11V25C26 25.5523 25.5523 26 25 26H19V10Z" fill="white" opacity="0.7"/>
              <circle cx="22" cy="8" r="3" fill="#0F6E56"/>
            </svg>
            <h1>Daftar Siswa</h1>
          </div>
          <p className={styles.panelTagline}>Temukan relawan pengajar terbaik untuk membantumu belajar — sepenuhnya gratis!</p>

          <StepIndicator current={step} />
        </div>
      </div>

      <div className={styles.rightPanel}>
        <div className={styles.formContainer}>
          <form onSubmit={handleSubmit}>
            {error && (
              <div style={{padding: "10px 14px", background: "#FEF2F2", border: "1px solid #FECACA", borderRadius: 8, color: "#DC2626", fontSize: 13, marginBottom: 16}}>
                ⚠️ {error}
              </div>
            )}

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
                      <label>Tanggal Lahir</label>
                      <input type="date" value={form.age} onChange={e => updateForm("age", e.target.value)} required />
                    </div>
                    <div className={styles.field}>
                      <label>No. Telepon</label>
                      <input type="tel" placeholder="08xxxxxxxxxx" value={form.phone} onChange={e => updateForm("phone", e.target.value)} />
                    </div>
                  </div>
                  
                  <div className={styles.fieldRow}>
                    <div className={styles.field} style={{ position: "relative", zIndex: 5 }}>
                      <label>Provinsi</label>
                      <select
                        value={form.id_provinsi}
                        onChange={(e) => {
                          const id = e.target.value;
                          updateForm("id_provinsi", id);
                          updateForm("id_kabupaten", "");
                        }}
                        required
                      >
                        <option value="">Pilih Provinsi</option>
                        {provinces.map(p => (
                          <option key={p.id_provinsi} value={p.id_provinsi}>{p.nama_provinsi}</option>
                        ))}
                      </select>
                    </div>

                    <div className={styles.field} style={{ position: "relative", zIndex: 5 }}>
                      <label>Kabupaten</label>
                      <select
                        value={form.id_kabupaten}
                        onChange={(e) => updateForm("id_kabupaten", e.target.value)}
                        required
                        disabled={!form.id_provinsi}
                      >
                        <option value="">Pilih Kabupaten</option>
                        {kabupatens.map(k => (
                          <option key={k.id_kabupaten} value={k.id_kabupaten}>{k.nama_kabupaten}</option>
                        ))}
                      </select>
                    </div>
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
