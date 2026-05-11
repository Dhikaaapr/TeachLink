import { queryDB } from "../../utils/queryDB";
import { formatResult } from '../../utils/formatResult';


export async function getAllProvinsi() {
  const sql = `
      SELECT 
        id_provinsi,
        nama_provinsi
      FROM provinsi
    `;

  const rows = await queryDB(sql);

  return formatResult(rows, "getAll");
}

