"use client";
import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import styles from "../register.module.css";

const expertiseList = [
  "Matematika", "Bahasa Indonesia", "Bahasa Inggris", "Fisika",
  "Kimia", "Biologi", "Komputer", "Desain", "Musik", "Olahraga"
];

export default function RegisterRelawan() {
  const router = useRouter();
  const [step, setStep] = useState(1);
  const [loading, setLoading] = useState(false);
  const [form, setForm] = useState({
    name: "", email: "", password: "", confirmPass: "",
    phone: "", city: "", occupation: "", institution: "",
    expertise: [], motivation: ""
  });

  const updateForm = (key, val) => setForm({...form, [key]: val});

  const toggleExpertise = (exp) => {
    setForm(prev => ({
      ...prev,
      expertise: prev.expertise.includes(exp)
        ? prev.expertise.filter(e => e !== exp)
        : [...prev.expertise, exp]
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      router.push("/dashboard/relawan");
    }, 1500);
  };

  return (
    <div className={styles.page}>
      <div className={styles.leftPanel} style={{background: "linear-gradient(135deg, #D85A30 0%, #B84A27 50%, #9A3D20 100%)"}}>
        <div className={styles.panelContent}>
          <Link href="/" className={styles.backLink}>
            <svg width="20" height="20" viewBox="0 0 20 20" fill="none"><path d="M16 10H4M4 10L9 5M4 10L9 15" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/></svg>
            Kembali
          </Link>
          <div className={styles.panelBrand}>
            <svg width="48" height="48" viewBox="0 0 36 36" fill="none"><rect width="36" height="36" rx="8" fill="white" fillOpacity="0.15"/><path d="M10 11C10 10.4477 10.4477 10 11 10H17V26H11C10.4477 26 10 25.5523 10 25V11Z" fill="white" opacity="0.9"/><path d="M19 10H25C25.5523 10 26 10.4477 26 11V25C26 25.5523 25.5523 26 25 26H19V10Z" fill="white" opacity="0.7"/><circle cx="22" cy="8" r="3" fill="white"/></svg>
            <h1>Daftar Relawan</h1>
          </div>
          <p className={styles.panelTagline}>Berbagi ilmu dan pengalaman untuk membantu anak-anak Indonesia meraih masa depan yang lebih cerah.</p>

          <div className={styles.stepsIndicator}>
            {[1,2,3].map(s => (
              <div key={s} className={`${styles.stepDot} ${step >= s ? styles.activeDot : ""}`} style={step >= s ? {background: "white", color: "#D85A30"} : {}}>
                {step > s ? <svg width="14" height="14" viewBox="0 0 14 14" fill="none"><path d="M3 7L6 10L11 4" stroke="#D85A30" strokeWidth="2" strokeLinecap="round"/></svg> : s}
              </div>
            ))}
            <div className={styles.stepLine}><div className={styles.stepLineFill} style={{width: `${((step-1)/2)*100}%`}}/></div>
          </div>
          <div className={styles.stepLabels}>
            <span className={step >= 1 ? styles.activeLabel : ""}>Akun</span>
            <span className={step >= 2 ? styles.activeLabel : ""}>Profil</span>
            <span className={step >= 3 ? styles.activeLabel : ""}>Keahlian</span>
          </div>
        </div>
      </div>

      <div className={styles.rightPanel}>
        <div className={styles.formContainer}>
          <form onSubmit={handleSubmit}>
            {step === 1 && (
              <div className={styles.stepContent}>
                <div className={styles.formHeader}>
                  <h2>Buat Akun Relawan</h2>
                  <p>Mulai perjalanan volunteer-mu di sini</p>
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
                <button type="button" className={`btn btn-coral ${styles.nextBtn}`} onClick={() => setStep(2)}>
                  Lanjut
                  <svg width="18" height="18" viewBox="0 0 20 20" fill="none"><path d="M4 10H16M16 10L11 5M16 10L11 15" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/></svg>
                </button>
              </div>
            )}

            {step === 2 && (
              <div className={styles.stepContent}>
                <div className={styles.formHeader}>
                  <h2>Profil Relawan</h2>
                  <p>Informasi untuk verifikasi dan pencocokan</p>
                </div>
                <div className={styles.fields}>
                  <div className={styles.fieldRow}>
                    <div className={styles.field}>
                      <label>No. Telepon</label>
                      <input type="tel" placeholder="08xxxxxxxxxx" value={form.phone} onChange={e => updateForm("phone", e.target.value)} required />
                    </div>
                    <div className={styles.field}>
                      <label>Kota / Kabupaten</label>
                      <input type="text" placeholder="Contoh: Bandung" value={form.city} onChange={e => updateForm("city", e.target.value)} required />
                    </div>
                  </div>
                  <div className={styles.field}>
                    <label>Pekerjaan / Status</label>
                    <select value={form.occupation} onChange={e => updateForm("occupation", e.target.value)} required>
                      <option value="">Pilih status</option>
                      <option value="mahasiswa">Mahasiswa</option>
                      <option value="fresh-grad">Fresh Graduate</option>
                      <option value="profesional">Profesional</option>
                      <option value="guru">Guru / Pengajar</option>
                      <option value="lainnya">Lainnya</option>
                    </select>
                  </div>
                  <div className={styles.field}>
                    <label>Institusi / Kampus</label>
                    <input type="text" placeholder="Contoh: Universitas Indonesia" value={form.institution} onChange={e => updateForm("institution", e.target.value)} />
                  </div>
                  <div className={styles.field}>
                    <label>Upload KTP / KTM</label>
                    <div className={styles.uploadArea}>
                      <svg width="32" height="32" viewBox="0 0 32 32" fill="none"><path d="M16 6v14M9 13l7-7 7 7M6 22h20" stroke="#9CA3AF" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/></svg>
                      <p>Drag & drop atau <span>pilih file</span></p>
                      <p style={{fontSize: "12px", marginTop: "4px"}}>JPG, PNG, PDF — maks. 5MB</p>
                    </div>
                  </div>
                </div>
                <div className={styles.btnRow}>
                  <button type="button" className={`btn btn-outline ${styles.backBtn}`} onClick={() => setStep(1)}>Kembali</button>
                  <button type="button" className={`btn btn-coral ${styles.nextBtn}`} onClick={() => setStep(3)}>
                    Lanjut
                    <svg width="18" height="18" viewBox="0 0 20 20" fill="none"><path d="M4 10H16M16 10L11 5M16 10L11 15" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/></svg>
                  </button>
                </div>
              </div>
            )}

            {step === 3 && (
              <div className={styles.stepContent}>
                <div className={styles.formHeader}>
                  <h2>Bidang Keahlian</h2>
                  <p>Pilih bidang yang bisa kamu ajarkan</p>
                </div>
                <div className={styles.subjectGrid}>
                  {expertiseList.map(exp => (
                    <button key={exp} type="button"
                      className={`${styles.subjectChip} ${form.expertise.includes(exp) ? styles.chipActive : ""}`}
                      style={form.expertise.includes(exp) ? {background: "#D85A30", borderColor: "#D85A30"} : {}}
                      onClick={() => toggleExpertise(exp)}
                    >
                      {exp}
                      {form.expertise.includes(exp) && <svg width="14" height="14" viewBox="0 0 14 14" fill="none"><path d="M3 7L6 10L11 4" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/></svg>}
                    </button>
                  ))}
                </div>
                <div className={styles.field}>
                  <label>Motivasi jadi relawan</label>
                  <textarea placeholder="Ceritakan kenapa kamu ingin menjadi relawan pengajar..." value={form.motivation} onChange={e => updateForm("motivation", e.target.value)} rows={3} />
                </div>
                <div className={styles.btnRow}>
                  <button type="button" className={`btn btn-outline ${styles.backBtn}`} onClick={() => setStep(2)}>Kembali</button>
                  <button type="submit" className={`btn btn-coral ${styles.nextBtn}`} disabled={loading}>
                    {loading ? <span className={styles.spinner}></span> : "Daftar Sekarang  🚀"}
                  </button>
                </div>
              </div>
            )}
          </form>
          <p className={styles.loginLink}>Sudah punya akun? <Link href="/login">Masuk di sini</Link></p>
        </div>
      </div>
    </div>
  );
}
