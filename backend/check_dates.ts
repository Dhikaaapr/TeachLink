
import pool from "./src/config/db.config";

async function checkDates() {
  try {
    const res = await pool.query("SELECT id_kursus, tanggal_mengajar, CURRENT_DATE FROM kursus");
    console.log(res.rows);
    process.exit(0);
  } catch (err) {
    console.error(err);
    process.exit(1);
  }
}

checkDates();
