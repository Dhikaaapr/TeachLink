"use client";
import { useState, useMemo } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import styles from "../register.module.css";

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
  const [step, setStep]       = useState(1);
  const [loading, setLoading] = useState(false);
  const [done, setDone]       = useState(false);

  const [form, setForm] = useState({
    name: "", email: "", password: "", confirmPass: "",
    phone: "", city: "", occupation: "", institution: "",
    expertise: [], motivation: "",
    selectedPeriode: null, mode: "",
  });

  const update = (key, val) => setForm(prev => ({ ...prev, [key]: val }));

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

  const handleSubmit = (e) => {
    e.preventDefault();
    setLoading(true);
    // TODO: POST /api/register-relawan
    setTimeout(() => { setLoading(false); setDone(true); }, 1500);
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
                    <input type="text" placeholder="Masukkan nama lengkap" value={form.name} onChange={e => update("name", e.target.value)} required />
                  </div>
                  <div className={styles.field}>
                    <label>Email</label>
                    <input type="email" placeholder="nama@email.com" value={form.email} onChange={e => update("email", e.target.value)} required />
                  </div>
                  <div className={styles.fieldRow}>
                    <div className={styles.field}>
                      <label>Password</label>
                      <input type="password" placeholder="Min. 8 karakter" value={form.password} onChange={e => update("password", e.target.value)} required minLength={8} />
                    </div>
                    <div className={styles.field}>
                      <label>Konfirmasi Password</label>
                      <input type="password" placeholder="Ulangi password" value={form.confirmPass} onChange={e => update("confirmPass", e.target.value)} required />
                    </div>
                  </div>
                </div>
                <div className={styles.btnRow}>
                  <button type="button" className={styles.nextBtn} onClick={() => setStep(2)}>
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
                      <input type="tel" placeholder="08xxxxxxxxxx" value={form.phone} onChange={e => update("phone", e.target.value)} required />
                    </div>
                    <div className={styles.field}>
                      <label>Kota / Kabupaten</label>
                      <input type="text" placeholder="Contoh: Bandung" value={form.city} onChange={e => update("city", e.target.value)} required />
                    </div>
                  </div>
                  <div className={styles.field}>
                    <label>Pekerjaan / Status</label>
                    <select value={form.occupation} onChange={e => update("occupation", e.target.value)} required>
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
                    <input type="text" placeholder="Contoh: Universitas Indonesia" value={form.institution} onChange={e => update("institution", e.target.value)} />
                  </div>
                  <div className={styles.field}>
                    <label>Upload KTP / KTM</label>
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
                  <button type="button" className={styles.nextBtn} onClick={() => setStep(3)}>Lanjut <ArrowRight /></button>
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
                  <label>Motivasi jadi relawan</label>
                  <textarea
                    placeholder="Ceritakan kenapa kamu ingin menjadi relawan pengajar..."
                    value={form.motivation} onChange={e => update("motivation", e.target.value)}
                    rows={3}
                  />
                </div>
                <div className={styles.btnRow} style={{ marginTop: "var(--space-6)" }}>
                  <button type="button" className={styles.backBtn} onClick={() => setStep(2)}><ArrowLeft /></button>
                  <button type="button" className={styles.nextBtn} onClick={() => setStep(4)}>Lanjut <ArrowRight /></button>
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
                              {st === "open" && <span className={styles.quotaWarn}>{p.sisa} kuota tersisa</span>}
                              {st === "soon" && <span>Dibuka mulai {fmtDate(p.start)}</span>}
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

                {/* Mode mengajar */}
                <div className={styles.field}>
                  <label>Mode mengajar yang diinginkan</label>
                  <select value={form.mode} onChange={e => update("mode", e.target.value)} required>
                    <option value="">Pilih mode</option>
                    <option value="Online">Online</option>
                    <option value="Offline">Offline</option>
                    <option value="Online & Offline">Online & Offline</option>
                  </select>
                </div>

                <div className={styles.btnRow} style={{ marginTop: "var(--space-6)" }}>
                  <button type="button" className={styles.backBtn} onClick={() => setStep(3)}><ArrowLeft /></button>
                  <button
                    type="submit" className={styles.nextBtn}
                    disabled={loading || !form.selectedPeriode}
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