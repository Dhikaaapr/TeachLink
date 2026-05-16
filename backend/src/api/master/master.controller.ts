import * as service from "./master.service";
import { formatResponse } from "../../utils/formatResponse"
import { DeleteRelawanParamsDTO, GetDetailUserParamsDTO } from "./master.schema";
import { DeleteSiswaParamsDTO } from "./master.schema";
import { KeteranganRelawanParamsDTO } from "./master.schema";
import { UpdateRequestRelawanParamsDTO } from "./master.schema";
import { getDetailUserParams } from "./master.schema";

export async function getAllRelawan(ctx: any) {
    const { keterangan } = ctx.params as KeteranganRelawanParamsDTO;
    const result = await service.getAllRelawan(keterangan);
    return formatResponse(ctx, result);
}

export async function getAllSiswa(ctx: any) {
    const result = await service.getAllSiswa();
    return formatResponse(ctx, result);
}

export async function deleteRelawan (ctx: any) {
   const { id_relawan } = ctx.params as DeleteRelawanParamsDTO;

    const result = await service.deleteRelawan(id_relawan);

    return formatResponse(ctx, result);
    
}

export async function deleteSiswa (ctx: any) {
   const { id_siswa } = ctx.params as DeleteSiswaParamsDTO;

    const result = await service.deleteSiswa(id_siswa);

    return formatResponse(ctx, result);
}

export async function updateRequestRelawan(ctx: any) {
  const { id_relawan } =ctx.params as UpdateRequestRelawanParamsDTO;

  const result = await service.updateRequestRelawan(id_relawan);

  return formatResponse(ctx, result);
}

export async function getDetailUser(ctx: any) {
  const { id_user } = ctx.params as GetDetailUserParamsDTO;

  const result = await service.getDetailUser(id_user);

  return formatResponse(ctx, result);
}
