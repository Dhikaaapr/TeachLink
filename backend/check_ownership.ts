
import pool from "./src/config/db.config";

async function checkOwnership() {
  try {
    const res = await pool.query(`
      SELECT k.id_kursus, p.full_name, pl.nama_pelajaran 
      FROM kursus k 
      JOIN pengguna p ON k.id_relawan = p.user_id
      JOIN pelajaran pl ON k.id_pelajaran = pl.id_pelajaran
    `);
    console.log(res.rows);
    process.exit(0);
  } catch (err) {
    console.error(err);
    process.exit(1);
  }
}

checkOwnership();
