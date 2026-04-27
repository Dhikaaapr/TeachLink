import * as service from "./provinsi.service";
import { formatResponse } from "../../utils/formatResponse"

/* -------------------------------------------------------------------------- */
/*                        GET ALL PROVINSI                         */
/* -------------------------------------------------------------------------- */

export async function getAllProvinsi(ctx: any) {

    const result = await service.getAllProvinsi();

    return formatResponse(ctx, result);
}