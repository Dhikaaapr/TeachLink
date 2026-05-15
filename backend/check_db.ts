
import pool from "./src/config/db.config";

async function checkData() {
  try {
    const resPengguna = await pool.query("SELECT COUNT(*) FROM pengguna WHERE id_role = 2");
    console.log("Total Relawan (Role 2):", resPengguna.rows[0].count);

    const resKursus = await pool.query("SELECT COUNT(*) FROM kursus");
    console.log("Total Kursus:", resKursus.rows[0].count);

    const resFilter = await pool.query(`
        SELECT 
          k.id_kursus,
          p.full_name,
          pl.nama_pelajaran
        FROM kursus k
        INNER JOIN pengguna p ON k.id_relawan = p.user_id
        INNER JOIN pelajaran pl ON k.id_pelajaran = pl.id_pelajaran
    `);
    console.log("Kursus dengan Relawan & Pelajaran:", resFilter.rowCount);
    
    process.exit(0);
  } catch (err) {
    console.error(err);
    process.exit(1);
  }
}

checkData();
