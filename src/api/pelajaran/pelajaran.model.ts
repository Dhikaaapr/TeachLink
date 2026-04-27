import { queryDB } from "../../utils/queryDB";
import { formatResult } from '../../utils/formatResult';


export async function getAllPelajaran() {
  const sql = `
      SELECT 
        id_pelajaran,
        nama_pelajaran
      FROM pelajaran
    `;

  const rows = await queryDB(sql);

  return formatResult(rows, "getAll");
}

