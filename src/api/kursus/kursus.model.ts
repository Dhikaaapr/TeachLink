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
