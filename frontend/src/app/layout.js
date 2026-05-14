import { Inter } from "next/font/google";
import "./globals.css";
import { AuthProvider } from "./context/AuthContext";

const inter = Inter({
  subsets: ["latin"],
  display: "swap",
  variable: "--font-inter",
});

export const metadata = {
  title: "TemanBelajar.id — Platform Pendidikan Gratis Indonesia",
  description:
    "Platform gratis yang menghubungkan siswa putus sekolah dengan relawan pengajar berpengalaman. Dukung SDG 4 — Pendidikan Berkualitas untuk semua anak Indonesia.",
  keywords: [
    "pendidikan gratis",
    "relawan pengajar",
    "belajar gratis",
    "SDG 4",
    "pendidikan Indonesia",
    "volunteer teacher",
    "tutoring",
  ],
  openGraph: {
    title: "TemanBelajar.id — Platform Pendidikan Gratis Indonesia",
    description:
      "Platform gratis yang menghubungkan siswa putus sekolah dengan relawan pengajar berpengalaman.",
    type: "website",
    locale: "id_ID",
  },
};

export default function RootLayout({ children }) {
  return (
    <html lang="id" className={inter.variable}>
      <body className={inter.className}>
        <AuthProvider>{children}</AuthProvider>
      </body>
    </html>
  );
}
