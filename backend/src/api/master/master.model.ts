import { updateRequestRelawanParams } from './master.schema';
import { queryDB } from "../../utils/queryDB";
import { formatResult } from "../../utils/formatResult";

export async function getAllRelawan(keterangan: string) {
  const sql = `
      SELECT 
        a.user_id,
        a.full_name,
        a.email,
        a.id_role,
        b.role
      FROM pengguna a
      INNER JOIN role b ON a.id_role = b.id_role
        WHERE a.id_role = 2 AND a.keterangan = $1
    `;

  const rows = await queryDB(sql, [keterangan]);

  return formatResult(rows, "getAll");
}

export async function getAllSiswa() {
  const sql = `
      SELECT 
        a.user_id,
        a.full_name,
        a.email,
        a.id_role,
        b.role
      FROM pengguna a
      INNER JOIN role b ON a.id_role = b.id_role
        WHERE a.id_role = 3
    `;

  const rows = await queryDB(sql);

  return formatResult(rows, "getAll");
}

export async function deleteRelawan(id_relawan: number) {
  const sql = `
    DELETE FROM pengguna
    WHERE user_id = $1 AND id_role = 2
  `;
  const result = await queryDB(sql, [id_relawan]);
  return formatResult(result, "delete");
}

export async function deleteSiswa(id_siswa: number) {
  const sql = `
    DELETE FROM pengguna
    WHERE user_id = $1 AND id_role = 3
  `;
  const result = await queryDB(sql, [id_siswa]);
  return formatResult(result, "delete");
}

export async function updateRequestRelawan(id_relawan: number) {
  const sql = `
    UPDATE pengguna
      SET keterangan = 'ACC'
    WHERE user_id = $1 
  `;

  const result = await queryDB(sql, [id_relawan]);
  return formatResult(result, "update");
}
