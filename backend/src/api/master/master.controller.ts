import * as service from "./master.service";
import { formatResponse } from "../../utils/formatResponse"
import { DeleteRelawanParamsDTO } from "./master.schema";
import { DeleteSiswaParamsDTO } from "./master.schema";

export async function getAllRelawan(ctx: any) {
    const result = await service.getAllRelawan();
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
console.log("ID Siswa yang akan dihapus:", id_siswa); // Debug log
    const result = await service.deleteSiswa(id_siswa);

    return formatResponse(ctx, result);
}