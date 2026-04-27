import * as service from "./pelajaran.service";
import { formatResponse } from "../../utils/formatResponse"

/* -------------------------------------------------------------------------- */
/*                        GET ALL PELAJARAN                         */
/* -------------------------------------------------------------------------- */

export async function getAllPelajaran(ctx: any) {

    const result = await service.getAllPelajaran();

    return formatResponse(ctx, result);
}