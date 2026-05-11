import { queryDB } from "../../utils/queryDB";
import { formatResult } from '../../utils/formatResult';


export async function getAllKabupatenById(id_provinsi: number) {
  const sql = `
      SELECT 
        id_kabupaten,
        nama_kabupaten
      FROM kabupaten
      WHERE id_provinsi = $1
    `;

  const rows = await queryDB(sql, [id_provinsi]);

  return formatResult(rows, "getAll");
}

