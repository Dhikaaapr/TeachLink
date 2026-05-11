import { GetAllKabupatenParamsDTO } from './kabupaten.schema';
import * as service from "./kabupaten.service"
import { formatResponse } from "../../utils/formatResponse"

/* -------------------------------------------------------------------------- */
/*                          GET DETAIL KABUPATEN                              */
/* -------------------------------------------------------------------------- */

export async function getAllKabupatenById(ctx: any) {
    const { id_provinsi } = ctx.params as GetAllKabupatenParamsDTO;

    const result = await service.getAllKabupatenById(id_provinsi);

    return formatResponse(ctx, result);
}
