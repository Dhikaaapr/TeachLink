"use client";
import { useState, useMemo, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import styles from "../register.module.css";
import { apiRequest } from "../../../utils/api";
import { useAuth } from "../../context/AuthContext";
import { ROLES } from "../../../utils/constants";

/* ─────────────── KONSTANTA ─────────────── */
const EXPERTISE_LIST = [
  "Matematika", "Bahasa Indonesia", "Bahasa Inggris", "Fisika",
  "Kimia", "Biologi", "Komputer", "Desain", "Musik", "Olahraga",
];

// Ambil dari GET /api/registration-periods
const PERIODES = [
  {
    id: "p1",
    label: "Semester Genap 2025/2026",
    start: "2026-02-01",
    end: "2026-07-31",
    quota: 15,
    sisa: 8,
  },
  {
    id: "p2",
    label: "Semester Ganjil 2026/2027",
    start: "2026-08-01",
    end: "2027-01-31",
    quota: 20,
    sisa: 20,
  },
  {
    id: "p3",
    label: "Semester Genap 2026/2027",
    start: "2027-02-01",
    end: "2027-07-31",
    quota: 20,
    sisa: 20,
  },
];

const STEP_META = [
  { label: "Akun",     sub: "Data login"       },
  { label: "Profil",   sub: "Info pribadi"     },
  { label: "Keahlian", sub: "Mapel & motivasi" },
  { label: "Periode",  sub: "Pilih semester"   },
];

/* ─────────────── HELPERS ─────────────── */
function fmtDate(s) {
  return new Date(s + "T00:00:00").toLocaleDateString("id-ID", {
    day: "numeric", month: "long", year: "numeric",
  });
}

function getPeriodeStatus(p) {
  const today = new Date().toISOString().split("T")[0];
  if (today < p.start) return "soon";
  if (today <= p.end)  return "open";
  return "closed";
}

/* ─────────────── SUB-KOMPONEN ─────────────── */
function CheckIcon() {
  return (
    <svg width="13" height="13" viewBox="0 0 14 14" fill="none">
      <path d="M3 7L6 10L11 4" stroke="#D85A30" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round"/>
    </svg>
  );
}

function ArrowRight() {
  return (
    <svg width="18" height="18" viewBox="0 0 20 20" fill="none">
      <path d="M4 10H16M16 10L11 5M16 10L11 15" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
    </svg>
  );
}

function ArrowLeft() {
  return (
    <svg width="18" height="18" viewBox="0 0 20 20" fill="none">
      <path d="M16 10H4M4 10L9 5M4 10L9 15" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
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
            {n < 4 && (
              <div className={`${styles.stepConnector} ${isDone ? styles.doneConn : ""}`} />
            )}
          </div>
        );
      })}
    </div>
  );
}

function PeriodeBadge({ status }) {
  if (status === "open")
    return <span className={`${styles.pBadge} ${styles.pOpen}`}>Dibuka</span>;
  if (status === "soon")
    return <span className={`${styles.pBadge} ${styles.pSoon}`}>Segera Dibuka</span>;
  return <span className={`${styles.pBadge} ${styles.pClosed}`}>Ditutup</span>;
}

/* ─────────────── KOMPONEN UTAMA ─────────────── */
export default function RegisterRelawan() {
  const router = useRouter();
  const { login } = useAuth();
  const [step, setStep]       = useState(1);
  const [loading, setLoading] = useState(false);
  const [done, setDone]       = useState(false);
  const [error, setError]     = useState("");

  const [form, setForm] = useState({
    name: "", email: "", password: "", confirmPass: "",
    phone: "", city: "", occupation: "", institution: "",
    expertise: [], motivation: "",
    selectedPeriode: null, mode: "",
    id_provinsi: "", id_kabupaten: "",
  });

  const [provinces, setProvinces] = useState([]);
  const [kabupatens, setKabupatens] = useState([]);
  
  // Validation touch state
  const [touched, setTouched] = useState({});

  const handleBlur = (field) => {
    setTouched(prev => ({ ...prev, [field]: true }));
  };

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

  const update = (key, val) => {
    setForm(prev => ({ ...prev, [key]: val }));
    setTouched(prev => ({ ...prev, [key]: true }));
  };

  const isStep1Complete = 
    form.name.trim() !== "" &&
    form.email.trim() !== "" &&
    form.password.length >= 8 &&
    form.confirmPass.trim() !== "" &&
    form.password === form.confirmPass;

  const isStep2Complete =
    form.phone.trim() !== "" &&
    form.occupation !== "" &&
    form.id_provinsi !== "" &&
    form.id_kabupaten !== "";

  const isStep3Complete = form.expertise.length > 0;

  const isStep4Complete = form.selectedPeriode !== null;

  const hasError = (field) => {
    if (!touched[field]) return false;
    switch (field) {
      case "name":
        return form.name.trim() === "";
      case "email":
        return form.email.trim() === "";
      case "password":
        return form.password.length < 8;
      case "confirmPass":
        return form.confirmPass.trim() === "" || form.password !== form.confirmPass;
      case "phone":
        return form.phone.trim() === "";
      case "occupation":
        return form.occupation === "";
      case "id_provinsi":
        return form.id_provinsi === "";
      case "id_kabupaten":
        return form.id_kabupaten === "";
      default:
        return false;
    }
  };

  const toggleExpertise = (exp) => {
    setForm(prev => ({
      ...prev,
      expertise: prev.expertise.includes(exp)
        ? prev.expertise.filter(e => e !== exp)
        : [...prev.expertise, exp],
    }));
  };

  const selectedPeriodeObj    = useMemo(() => PERIODES.find(p => p.id === form.selectedPeriode) || null, [form.selectedPeriode]);
  const selectedPeriodeStatus = selectedPeriodeObj ? getPeriodeStatus(selectedPeriodeObj) : null;

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
          id_role: ROLES.RELAWAN, // Gunakan konstanta agar tidak tertukar lagi
          nomor_telepon: form.phone || undefined,
          pekerjaan: form.occupation || undefined,
          institusi: form.institution || undefined,
          id_provinsi: parseInt(form.id_provinsi) || undefined,
          id_kabupaten: parseInt(form.id_kabupaten) || undefined,
          bidang_keahlian: form.expertise.join(", ") || undefined,
          bio: form.motivation || undefined,
        },
      });

      // Login otomatis setelah daftar
      await login(form.email, form.password);
      router.push("/dashboard/relawan");
    } catch (err) {
      setError(err.message || "Gagal mendaftar. Coba lagi.");
    } finally {
      setLoading(false);
    }
  };

  /* ── SUCCESS ── */
  if (done) {
    return (
      <div className={styles.page}>
        <div className={styles.leftPanel}>
          <div className={styles.panelContent}>
            <Link href="/" className={styles.backLink}><ArrowLeft /> Beranda</Link>
            <div className={styles.panelBrand}>
              <BrandIcon />
              <h1>TemanBelajar</h1>
            </div>
            <p className={styles.panelTagline}>Terima kasih sudah bergabung sebagai relawan!</p>
            <StepIndicator current={5} />
          </div>
        </div>
        <div className={styles.rightPanel}>
          <div className={styles.successState}>
            <div className={styles.successIcon}>
              <svg width="32" height="32" viewBox="0 0 24 24" fill="none">
                <path d="M5 13l4 4L19 7" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
            </div>
            <h2 className={styles.successTitle}>Pendaftaran berhasil!</h2>
            <p className={styles.successDesc}>
              Tim kami akan memverifikasi datamu dalam 1–3 hari kerja. Notifikasi akan dikirim ke emailmu.
            </p>
            <div className={styles.successDetail}>
              {[
                { l: "Nama",          v: form.name || "-" },
                { l: "Kota",          v: form.city || "-" },
                { l: "Mode mengajar", v: form.mode || "-" },
                { l: "Periode",       v: selectedPeriodeObj?.label || "-" },
                { l: "Mapel",         v: form.expertise.join(", ") || "-" },
                { l: "Status",        v: "Menunggu verifikasi" },
              ].map(row => (
                <div key={row.l} className={styles.successRow}>
                  <span>{row.l}</span>
                  <span>{row.v}</span>
                </div>
              ))}
            </div>
            <button className={styles.btnCoral} onClick={() => router.push("/")}>
              Kembali ke Beranda
            </button>
          </div>
        </div>
      </div>
    );
  }

  /* ── FORM ── */
  return (
    <div className={styles.page}>

      {/* ── PANEL KIRI ── */}
      <div className={styles.leftPanel}>
        <div className={styles.panelContent}>
          <Link href="/" className={styles.backLink}>
            <ArrowLeft /> Kembali
          </Link>
          <div className={styles.panelBrand}>
            <BrandIcon />
            <h1>Daftar Relawan</h1>
          </div>
          <p className={styles.panelTagline}>
            Berbagi ilmu dan pengalaman untuk membantu anak-anak Indonesia meraih masa depan yang lebih cerah.
          </p>
          <StepIndicator current={step} />
        </div>
      </div>

      {/* ── PANEL KANAN ── */}
      <div className={styles.rightPanel}>
        <div className={styles.formContainer}>
          <form onSubmit={handleSubmit}>

            {error && (
              <div style={{padding: "10px 14px", background: "#FEF2F2", border: "1px solid #FECACA", borderRadius: 8, color: "#DC2626", fontSize: 13, marginBottom: 16, animation: "fadeInUp 0.3s ease"}}>
                ⚠️ {error}
              </div>
            )}
             {/* ══ STEP 1 — AKUN ══ */}
            {step === 1 && (
              <div className={styles.stepContent}>
                <div className={styles.formHeader}>
                  <h2>Buat akun relawan</h2>
                  <p>Mulai perjalanan volunteer-mu di sini</p>
                </div>
                <div className={styles.fields}>
                  <div className={styles.field}>
                    <label>Nama Lengkap</label>
                    <input
                      type="text"
                      placeholder="Masukkan nama lengkap"
                      value={form.name}
                      onChange={e => update("name", e.target.value)}
                      onBlur={() => handleBlur("name")}
                      className={hasError("name") ? styles.inputError : ""}
                      required
                    />
                  </div>
                  <div className={styles.field}>
                    <label>Email</label>
                    <input
                      type="email"
                      placeholder="nama@email.com"
                      value={form.email}
                      onChange={e => update("email", e.target.value)}
                      onBlur={() => handleBlur("email")}
                      className={hasError("email") ? styles.inputError : ""}
                      required
                    />
                  </div>
                  <div className={styles.fieldRow}>
                    <div className={styles.field}>
                      <label>Password</label>
                      <input
                        type="password"
                        placeholder="Min. 8 karakter"
                        value={form.password}
                        onChange={e => update("password", e.target.value)}
                        onBlur={() => handleBlur("password")}
                        className={hasError("password") ? styles.inputError : ""}
                        required
                        minLength={8}
                      />
                      {touched.password && form.password.length < 8 && (
                        <p style={{ color: "#E24B4A", fontSize: "11px", margin: "2px 0 0" }}>Password minimal 8 karakter</p>
                      )}
                    </div>
                    <div className={styles.field}>
                      <label>Konfirmasi Password</label>
                      <input
                        type="password"
                        placeholder="Ulangi password"
                        value={form.confirmPass}
                        onChange={e => update("confirmPass", e.target.value)}
                        onBlur={() => handleBlur("confirmPass")}
                        className={hasError("confirmPass") ? styles.inputError : ""}
                        required
                      />
                      {touched.confirmPass && form.password !== form.confirmPass && (
                        <p style={{ color: "#E24B4A", fontSize: "11px", margin: "2px 0 0" }}>Password tidak cocok</p>
                      )}
                    </div>
                  </div>
                </div>
                <div className={styles.btnRow}>
                  <button
                    type="button"
                    className={styles.nextBtn}
                    onClick={() => setStep(2)}
                    disabled={!isStep1Complete}
                  >
                    Lanjut <ArrowRight />
                  </button>
                </div>
              </div>
            )}

            {/* ══ STEP 2 — PROFIL ══ */}
            {step === 2 && (
              <div className={styles.stepContent}>
                <div className={styles.formHeader}>
                  <h2>Profil relawan</h2>
                  <p>Informasi untuk verifikasi dan pencocokan</p>
                </div>
                
                <div className={styles.fields}>
                  <div className={styles.fieldRow}>
                    <div className={styles.field}>
                      <label>No. Telepon</label>
                      <input
                        type="tel"
                        placeholder="08xxxxxxxxxx"
                        value={form.phone}
                        onChange={e => update("phone", e.target.value)}
                        onBlur={() => handleBlur("phone")}
                        className={hasError("phone") ? styles.inputError : ""}
                        required
                      />
                    </div>
                    <div className={styles.field}>
                      <label>Pekerjaan / Status</label>
                      <select
                        value={form.occupation}
                        onChange={e => update("occupation", e.target.value)}
                        onBlur={() => handleBlur("occupation")}
                        className={hasError("occupation") ? styles.inputError : ""}
                        required
                      >
                        <option value="">Pilih status</option>
                        <option value="mahasiswa">Mahasiswa</option>
                        <option value="fresh-grad">Fresh Graduate</option>
                        <option value="profesional">Profesional</option>
                        <option value="guru">Guru / Pengajar</option>
                        <option value="lainnya">Lainnya</option>
                      </select>
                    </div>
                  </div>

                  <div className={styles.fieldRow}>
                    <div className={styles.field} style={{ position: "relative", zIndex: 5 }}>
                      <label>Provinsi</label>
                      <select
                        value={form.id_provinsi}
                        onChange={(e) => {
                          update("id_provinsi", e.target.value);
                          update("id_kabupaten", "");
                        }}
                        onBlur={() => handleBlur("id_provinsi")}
                        className={hasError("id_provinsi") ? styles.inputError : ""}
                        required
                      >
                        <option value="">Pilih Provinsi</option>
                        {provinces.map(p => (
                          <option key={p.id_provinsi} value={p.id_provinsi}>{p.nama_provinsi}</option>
                        ))}
                      </select>
                    </div>

                    <div className={styles.field} style={{ position: "relative", zIndex: 5 }}>
                      <label>Kabupaten </label>
                      <select
                        value={form.id_kabupaten}
                        onChange={(e) => update("id_kabupaten", e.target.value)}
                        onBlur={() => handleBlur("id_kabupaten")}
                        className={hasError("id_kabupaten") ? styles.inputError : ""}
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
                    <label>Institusi / Kampus (opsional)</label>
                    <input type="text" placeholder="Contoh: Universitas Indonesia" value={form.institution} onChange={e => update("institution", e.target.value)} />
                  </div>
                  
                  <div className={styles.field}>
                    <label>Upload KTP / KTM (opsional)</label>
                    <div className={styles.uploadArea}>
                      <svg width="32" height="32" viewBox="0 0 32 32" fill="none">
                        <path d="M16 6v14M9 13l7-7 7 7M6 22h20" stroke="#9CA3AF" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                      </svg>
                      <p>Drag & drop atau <span>pilih file</span></p>
                      <p style={{ fontSize: "12px", marginTop: "4px" }}>JPG, PNG, PDF — maks. 5MB</p>
                    </div>
                  </div>
                </div>
                <div className={styles.btnRow}>
                  <button type="button" className={styles.backBtn} onClick={() => setStep(1)}><ArrowLeft /></button>
                  <button
                    type="button"
                    className={styles.nextBtn}
                    onClick={() => setStep(3)}
                    disabled={!isStep2Complete}
                  >
                    Lanjut <ArrowRight />
                  </button>
                </div>
              </div>
            )}

            {/* ══ STEP 3 — KEAHLIAN ══ */}
            {step === 3 && (
              <div className={styles.stepContent}>
                <div className={styles.formHeader}>
                  <h2>Bidang keahlian</h2>
                  <p>Pilih mapel yang bisa kamu ajarkan (bisa lebih dari 1)</p>
                </div>
                <div className={styles.subjectGrid}>
                  {EXPERTISE_LIST.map(exp => (
                    <button
                      key={exp} type="button"
                      className={`${styles.subjectChip} ${form.expertise.includes(exp) ? styles.chipActive : ""}`}
                      onClick={() => toggleExpertise(exp)}
                    >
                      {exp}
                      {form.expertise.includes(exp) && <CheckIcon />}
                    </button>
                  ))}
                </div>
                <div className={styles.field}>
                  <label>Motivasi jadi relawan (opsional)</label>
                  <textarea
                    placeholder="Ceritakan kenapa kamu ingin menjadi relawan pengajar..."
                    value={form.motivation} onChange={e => update("motivation", e.target.value)}
                    rows={3}
                  />
                </div>
                <div className={styles.btnRow} style={{ marginTop: "var(--space-6)" }}>
                  <button type="button" className={styles.backBtn} onClick={() => setStep(2)}><ArrowLeft /></button>
                  <button
                    type="button"
                    className={styles.nextBtn}
                    onClick={() => setStep(4)}
                    disabled={!isStep3Complete}
                  >
                    Lanjut <ArrowRight />
                  </button>
                </div>
              </div>
            )}

            {/* ══ STEP 4 — PERIODE ══ */}
            {step === 4 && (
              <div className={styles.stepContent}>
                <div className={styles.formHeader}>
                  <h2>Pilih periode pendaftaran</h2>
                  <p>Pilih semester yang sesuai dengan ketersediaan waktumu</p>
                </div>

                {/* Daftar Periode */}
                <div className={styles.periodeBanner}>
                  <div className={styles.periodeBannerHd}>
                    <svg width="16" height="16" viewBox="0 0 20 20" fill="none">
                      <rect x="2.5" y="3.333" width="15" height="14.167" rx="2" stroke="currentColor" strokeWidth="1.5"/>
                      <path d="M13.333 1.667v3.333M6.667 1.667v3.333M2.5 8.333h15" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
                    </svg>
                    <span>Periode Pendaftaran Tersedia</span>
                  </div>
                  <div className={styles.periodeList}>
                    {PERIODES.map(p => {
                      const st       = getPeriodeStatus(p);
                      const isClosed = st === "closed";
                      const isSel    = form.selectedPeriode === p.id;
                      return (
                        <label
                          key={p.id}
                          className={`${styles.periodeOpt} ${isSel ? styles.periodeSelected : ""} ${isClosed ? styles.periodeClosed : ""}`}
                          onClick={() => !isClosed && update("selectedPeriode", p.id)}
                        >
                          <input
                            type="radio" name="periode" value={p.id}
                            checked={isSel} disabled={isClosed}
                            onChange={() => update("selectedPeriode", p.id)}
                          />
                          <div className={styles.periodeInfo}>
                            <div className={styles.periodeTitle}>
                              {p.label}
                              <PeriodeBadge status={st} />
                            </div>
                            <div className={styles.periodeMeta}>
                              <span>{fmtDate(p.start)} — {fmtDate(p.end)}</span>
                           
                              
                            </div>
                          </div>
                        </label>
                      );
                    })}
                  </div>
                </div>

                {/* Warning jika periode belum buka */}
                {selectedPeriodeStatus === "soon" && (
                  <div className={styles.warnBox}>
                    <svg width="16" height="16" viewBox="0 0 20 20" fill="none">
                      <path d="M10 2L2 17h16L10 2zm0 5v5m0 2.5v.5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                    </svg>
                    <p>
                      Periode ini belum dibuka. Pendaftaranmu akan disimpan dan diproses mulai{" "}
                      <strong>{fmtDate(selectedPeriodeObj.start)}</strong>.
                    </p>
                  </div>
                )}

                <div className={styles.btnRow} style={{ marginTop: "var(--space-6)" }}>
                  <button type="button" className={styles.backBtn} onClick={() => setStep(3)}><ArrowLeft /></button>
                  <button
                    type="submit"
                    className={styles.nextBtn}
                    disabled={loading || !isStep4Complete}
                  >
                    {loading ? <span className={styles.spinner} /> : <>Daftar Sekarang 🚀</>}
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

function BrandIcon() {
  return (
    <svg width="48" height="48" viewBox="0 0 36 36" fill="none">
      <rect width="36" height="36" rx="8" fill="white" fillOpacity="0.15"/>
      <path d="M10 11C10 10.4477 10.4477 10 11 10H17V26H11C10.4477 26 10 25.5523 10 25V11Z" fill="white" opacity="0.9"/>
      <path d="M19 10H25C25.5523 10 26 10.4477 26 11V25C26 25.5523 25.5523 26 25 26H19V10Z" fill="white" opacity="0.7"/>
    </svg>
  );
}