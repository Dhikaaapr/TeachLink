import { queryDB } from "../../utils/queryDB";
import { formatResult } from '../../utils/formatResult';

/* -------------------------------------------------------------------------- */
/*                                   LOGIN                                    */
/* -------------------------------------------------------------------------- */

export async function getUser(email: string) {
  const sql = `
    SELECT 
      a.user_id,
      a.full_name, 
      a.email,
      a.password,
      b.role 
    FROM pengguna a 
    INNER JOIN role b ON a.id_role = b.id_role  
    WHERE a.email = $1
    LIMIT 1
  `;

  const rows = await queryDB(sql, [email]);

  return formatResult(rows, "get");
}

/* -------------------------------------------------------------------------- */
/*                             GET CURRENT USER                               */
/* -------------------------------------------------------------------------- */

export async function getCurrentUserById(user_id: string) {
  const sql = `
      SELECT 
        a.user_id,
        a.full_name,
        a.email,
        b.role
      FROM pengguna a
      INNER JOIN role b ON a.id_role = b.id_role
      WHERE a.user_id = $1
    `;

  const rows = await queryDB(sql, [user_id]);

  return formatResult(rows, "get");
}

/* -------------------------------------------------------------------------- */
/*                                 REGISTER                                  */
/* -------------------------------------------------------------------------- */

export async function createUser(data: any) {
  const {
    full_name,
    email,
    password,
    id_role,
    nomor_telepon,
    tanggal_lahir,
    id_provinsi,
    id_kabupaten,
    pekerjaan,
    institusi,
    ktp,
    bidang_keahlian,
    bio,
  } = data;

  const sql = `
    INSERT INTO pengguna (
      full_name,
      email,
      password,
      id_role,
      nomor_telepon,
      tanggal_lahir,
      id_provinsi,
      id_kabupaten,
      pekerjaan,
      institusi,
      ktp,
      bidang_keahlian,
      bio
    ) VALUES (
      $1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13
    )
    RETURNING user_id, full_name, email;
  `;

  const rows = await queryDB(sql, [
    full_name,
    email,
    password,
    id_role,
    nomor_telepon,
    tanggal_lahir,
    id_provinsi,
    id_kabupaten,
    pekerjaan,
    institusi,
    ktp,
    bidang_keahlian,
    bio,
  ]);

  return formatResult(rows, "create");
}