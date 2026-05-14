import { updateRequestKursusParams } from './kursus.schema';
import { queryDB } from "../../utils/queryDB";
import { formatResult } from "../../utils/formatResult";

export async function insertKursus(data: any) {
  const {
    id_relawan,
    tanggal_mengajar,
    waktu_mulai,
    waktu_selesai,
    id_pelajaran,
    mode,
  } = data;

  const sql = `
    INSERT INTO kursus (
      id_relawan,
      tanggal_mengajar,
      waktu_mulai,
      waktu_selesai,
      id_pelajaran,
      mode
    ) VALUES (
      $1, $2, $3, $4, $5, $6
    )
    RETURNING 
      id_kursus,
      id_relawan,
      tanggal_mengajar,
      waktu_mulai,
      waktu_selesai,
      id_pelajaran,
      mode;
  `;

  const rows = await queryDB(sql, [
    id_relawan,
    tanggal_mengajar,
    waktu_mulai,
    waktu_selesai,
    id_pelajaran,
    mode,
  ]);

  return formatResult(rows, "create");
}

export async function getAllKursus() {
  const sql = `
        SELECT 
          kursus.id_kursus,
          pengguna.full_name,
          provinsi.nama_provinsi,
          kabupaten.nama_kabupaten,
          pelajaran.nama_pelajaran,
          kursus.tanggal_mengajar,
          kursus.waktu_mulai,
          kursus.waktu_selesai,
          kursus.mode
        FROM kursus
        INNER JOIN pengguna 
            ON kursus.id_relawan = pengguna.user_id
        INNER JOIN provinsi 
            ON pengguna.id_provinsi = provinsi.id_provinsi
        INNER JOIN kabupaten 
            ON pengguna.id_kabupaten = kabupaten.id_kabupaten
        INNER JOIN pelajaran 
          ON kursus.id_pelajaran = pelajaran.id_pelajaran
      `;

  const rows = await queryDB(sql);

  return formatResult(rows, "getAll");
}

export async function getKursusByRelawan(id_relawan: number) {
  const sql = `
    SELECT 
      k.id_kursus,
      p.full_name,
      pr.nama_provinsi,
      kb.nama_kabupaten,
      pl.nama_pelajaran,
      k.tanggal_mengajar,
      k.waktu_mulai,
      k.waktu_selesai,
      k.mode
    FROM kursus k
    INNER JOIN pengguna p 
      ON k.id_relawan = p.user_id
    INNER JOIN provinsi pr 
      ON p.id_provinsi = pr.id_provinsi
    INNER JOIN kabupaten kb 
      ON p.id_kabupaten = kb.id_kabupaten
    INNER JOIN pelajaran pl 
      ON k.id_pelajaran = pl.id_pelajaran
    WHERE k.id_relawan = $1
      AND k.tanggal_mengajar >= CURRENT_DATE
    ORDER BY k.tanggal_mengajar ASC, k.waktu_mulai ASC
  `;

  const rows = await queryDB(sql, [id_relawan]);

  return formatResult(rows, "getAll");
}
  
export async function insertRequestKursus(data: any) {
  const { id_siswa, id_kursus } = data;

  const sql = `
    INSERT INTO detail_kursus (
      id_siswa,
      id_kursus
    ) VALUES (
      $1, $2
    )
    RETURNING 
      id_kursus,
      id_siswa
  `;

  const rows = await queryDB(sql, [id_siswa, id_kursus]);

  return formatResult(rows, "create");
}

export async function getRequestKursus(id_relawan: number, keterangan: string) {
  let sql = `
    SELECT  
      dk.id_detail_kursus,
      dk.keterangan,
      p.full_name,
      p.tanggal_lahir,
      DATE_PART('year', AGE(p.tanggal_lahir)) AS usia,
      k.tanggal_mengajar,
      k.waktu_mulai,
      k.waktu_selesai,
      k.mode,
      k.url_gmeet,
      pr.nama_provinsi,
      kb.nama_kabupaten,
      pl.nama_pelajaran
    FROM detail_kursus dk
    INNER JOIN pengguna p 
      ON dk.id_siswa = p.user_id
    INNER JOIN kursus k 
      ON dk.id_kursus = k.id_kursus
    INNER JOIN provinsi pr 
      ON p.id_provinsi = pr.id_provinsi
    INNER JOIN kabupaten kb 
      ON p.id_kabupaten = kb.id_kabupaten
    INNER JOIN pelajaran pl 
      ON k.id_pelajaran = pl.id_pelajaran
    WHERE k.id_relawan = $1
  `;

  const params: any[] = [id_relawan];

  // Tambahin filter kalau bukan "All"
  if (keterangan !== "ALL") {
    sql += ` AND dk.keterangan = $2`;
    params.push(keterangan);
  }

  sql += ` ORDER BY k.tanggal_mengajar ASC`;  

  const rows = await queryDB(sql, params);

  return formatResult(rows, "getAll");
}

export async function getFilterKursus(filters: {
  nama_pelajaran?: string;
  id_provinsi?: number;
  id_kabupaten?: number;
  mode?: "online" | "offline" | "all";
}) {
  let sql = `
        SELECT 
          kursus.id_kursus,
          pengguna.full_name,
          provinsi.nama_provinsi,
          provinsi.id_provinsi,
          kabupaten.nama_kabupaten,
          pelajaran.id_pelajaran,
          pelajaran.nama_pelajaran,
          kursus.tanggal_mengajar,
          kursus.waktu_mulai,
          kursus.waktu_selesai,
          kursus.mode
        FROM kursus
        INNER JOIN pengguna 
            ON kursus.id_relawan = pengguna.user_id
        INNER JOIN provinsi 
            ON pengguna.id_provinsi = provinsi.id_provinsi
        INNER JOIN kabupaten 
            ON pengguna.id_kabupaten = kabupaten.id_kabupaten
        INNER JOIN pelajaran 
            ON kursus.id_pelajaran = pelajaran.id_pelajaran
        WHERE 1=1
    `;

  const values: any[] = [];
  let idx = 1;
       
  if (filters.nama_pelajaran) {
    sql += ` AND pelajaran.nama_pelajaran ILIKE $${idx}`;
    values.push(`%${filters.nama_pelajaran}%`);
    idx++;
  }

  if (filters.id_provinsi) {
    sql += ` AND pengguna.id_provinsi = $${idx}`;
    values.push(filters.id_provinsi);
    idx++;
  }

  if (filters.id_kabupaten) {
    sql += ` AND pengguna.id_kabupaten = $${idx}`;
    values.push(filters.id_kabupaten);
    idx++;
  }

  if (filters.mode) {
    if (filters.mode === "all") {
      // Do nothing, include all modes
    } else {
      sql += ` AND kursus.mode = $${idx}`;
      values.push(filters.mode);
      idx++;
    }
  }

  sql += ` AND kursus.tanggal_mengajar >= CURRENT_DATE`;

  sql += ` ORDER BY kursus.tanggal_mengajar ASC, kursus.waktu_mulai ASC`;

  const rows = await queryDB(sql, values);

  return formatResult(rows, "getAll");
}

export async function updateRequestKursus(id_detail_kursus: number) {
  const result = await queryDB(
    `SELECT id_kursus 
     FROM detail_kursus 
     WHERE id_detail_kursus = $1`,
    [id_detail_kursus]
  );

  if (result.rows.length === 0) {
    throw new Error("Data tidak ditemukan");
  }

  const id_kursus = result.rows[0].id_kursus;

  // cek sudah ada ACC atau belum
  const check = await queryDB(
    `SELECT 1 FROM detail_kursus
     WHERE id_kursus = $1 
     AND keterangan = 'ACC'`,
    [id_kursus]
  );

  if (check.rows.length > 0) {
    throw new Error("Sudah ada siswa yang di-ACC");
  }

  await queryDB("BEGIN");

  try {
    // ACC yang dipilih
    await queryDB(
      `UPDATE detail_kursus
       SET keterangan = 'ACC'
       WHERE id_detail_kursus = $1`,
      [id_detail_kursus]
    );

    // DECLINE yang lain
    await queryDB(
      `UPDATE detail_kursus
       SET keterangan = 'DECLINE'
       WHERE id_kursus = $1
       AND id_detail_kursus != $2`,
      [id_kursus, id_detail_kursus]
    );

    await queryDB("COMMIT");

    return {
      message: "Berhasil ACC, yang lain otomatis DECLINE",
    };

  } catch (error) {
    await queryDB("ROLLBACK");
    throw error;
  }
}

export async function getKursusBySiswa(id_siswa: number, status: string) {
  let whereClause = ``;

  if (status === "SELESAI") {
    whereClause += ` AND k.tanggal_mengajar <= CURRENT_DATE`;
  } else if (status === "BELUM") {
    whereClause += ` AND k.tanggal_mengajar >= CURRENT_DATE`;
  }

  let sql = `
    SELECT 
      k.id_kursus,
      p.full_name,
      pr.nama_provinsi,
      kb.nama_kabupaten,
      pl.nama_pelajaran,
      k.tanggal_mengajar,
      k.waktu_mulai,
      k.waktu_selesai,
      k.mode
    FROM detail_kursus dk
    INNER JOIN kursus k 
      ON dk.id_kursus = k.id_kursus 
    INNER JOIN pengguna p 
      ON k.id_relawan = p.user_id
    INNER JOIN provinsi pr 
      ON p.id_provinsi = pr.id_provinsi
    INNER JOIN kabupaten kb 
      ON p.id_kabupaten = kb.id_kabupaten
    INNER JOIN pelajaran pl 
      ON k.id_pelajaran = pl.id_pelajaran
    WHERE dk.id_siswa = $1
      ${whereClause}
      AND dk.keterangan = 'ACC'
    ORDER BY k.tanggal_mengajar ASC, k.waktu_mulai ASC
  `;

  const rows = await queryDB(sql, [id_siswa]);

  return formatResult(rows, "getAll");
}

export async function getRecommendations(id_siswa: string) {
  // Query ini mencari Relawan yang cocok minat, tapi kalau nggak ada tetap tampilin Relawan lain
  const sql = `
    WITH student_interests AS (
      SELECT unnest(string_to_array(bidang_keahlian, ',')) AS interest
      FROM pengguna 
      WHERE user_id = $1
    ),
    all_volunteers AS (
      SELECT 
        p.user_id,
        p.full_name,
        p.bidang_keahlian,
        kab.nama_kabupaten,
        -- Score 2 kalau keahlian di profil cocok minat siswa
        CASE WHEN EXISTS (
          SELECT 1 FROM student_interests si 
          WHERE p.bidang_keahlian ILIKE '%' || trim(si.interest) || '%'
        ) THEN 2 ELSE 0 END as match_score
      FROM pengguna p
      LEFT JOIN kabupaten kab ON p.id_kabupaten = kab.id_kabupaten
      WHERE p.id_role = 2 -- Role Relawan
    )
    SELECT 
      v.user_id as id_relawan,
      v.full_name,
      v.bidang_keahlian as relawan_exp,
      v.nama_kabupaten,
      k.id_kursus,
      k.tanggal_mengajar,
      k.waktu_mulai,
      k.mode,
      pel.nama_pelajaran,
      -- Tambah score kalau beneran ada jadwal kursus yang cocok
      (v.match_score + CASE WHEN pel.nama_pelajaran ILIKE ANY (SELECT '%' || trim(interest) || '%' FROM student_interests) THEN 3 ELSE 0 END) as final_score
    FROM all_volunteers v
    LEFT JOIN kursus k ON v.user_id = k.id_relawan AND k.tanggal_mengajar >= CURRENT_DATE
    LEFT JOIN pelajaran pel ON k.id_pelajaran = pel.id_pelajaran
    ORDER BY final_score DESC, k.tanggal_mengajar ASC NULLS LAST
    LIMIT 6;
  `;

  const rows = await queryDB(sql, [id_siswa]);
  return formatResult(rows, "getAll");
}