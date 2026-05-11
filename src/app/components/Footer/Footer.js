import styles from "./Footer.module.css";

export default function Footer() {
  return (
    <footer className={styles.footer} id="footer">
      <div className={`container ${styles.footerContainer}`}>
        {/* Top Row */}
        <div className={styles.footerTop}>
          {/* Brand */}
          <div className={styles.brand}>
            <a href="#" className={styles.logo}>
              <svg
                width="32"
                height="32"
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
              </svg>
              <span className={styles.logoText}>TemanBelajar.id</span>
            </a>
            <p className={styles.tagline}>
              Menghubungkan siswa dengan relawan pengajar untuk Indonesia yang lebih cerdas.
            </p>
          </div>

          {/* Links */}
          <div className={styles.linksGroup}>
            <h4 className={styles.linkTitle}>Platform</h4>
            <ul className={styles.linkList}>
              <li><a href="#tentang">Tentang Kami</a></li>
              <li><a href="#cara-kerja">Cara Kerja</a></li>
              <li><a href="#bergabung">Bergabung</a></li>
            </ul>
          </div>

          <div className={styles.linksGroup}>
            <h4 className={styles.linkTitle}>Dukungan</h4>
            <ul className={styles.linkList}>
              <li><a href="#faq">FAQ</a></li>
              <li><a href="#hubungi">Hubungi Kami</a></li>
              <li><a href="#bantuan">Pusat Bantuan</a></li>
            </ul>
          </div>

          <div className={styles.linksGroup}>
            <h4 className={styles.linkTitle}>Legal</h4>
            <ul className={styles.linkList}>
              <li><a href="#privacy">Kebijakan Privasi</a></li>
              <li><a href="#terms">Syarat & Ketentuan</a></li>
            </ul>
          </div>
        </div>

        {/* Divider */}
        <div className={styles.divider}></div>

        {/* Bottom Row */}
        <div className={styles.footerBottom}>
          <p className={styles.copyright}>
            &copy; {new Date().getFullYear()} TemanBelajar.id. Hak cipta dilindungi.
          </p>

          {/* SDG Badge */}
          <div className={styles.sdgBadge}>
            <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
              <circle cx="10" cy="10" r="9" stroke="#4CAF50" strokeWidth="1.5" fill="none" />
              <path d="M6 10L9 13L14 7" stroke="#4CAF50" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
            <span>Didukung SDG 4 — Pendidikan Berkualitas</span>
          </div>
        </div>
      </div>
    </footer>
  );
}
