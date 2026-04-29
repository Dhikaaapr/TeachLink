import * as service from "./kursus.service";
import { formatResponse } from "../../utils/formatResponse"
import { insertKursusBodyDTO } from "./kursus.schema";
import { InsertRequestKursusBodyDTO } from "./kursus.schema";
import { GetRequestKursusQueryDTO } from "./kursus.schema";
import { GetFilterKursusQueryDTO } from "./kursus.schema";
import { UpdateRequestKursusParamsDTO } from "./kursus.schema";

export async function insertKursus(ctx: any){
    const body = ctx.body as insertKursusBodyDTO;

    const result = await service.insertKursus(body)

    return formatResponse(ctx, result);
}

export async function getAllKursus(ctx: any) {
    const result = await service.getAllKursus();
    return formatResponse(ctx, result);
}

export async function getKursusByRelawan(ctx: any) {
     const result = await service.getKursusByRelawan(ctx.params.id_relawan);
    return formatResponse(ctx, result);
}

export async function insertRequestKursus(ctx: any){
    const body = ctx.body as InsertRequestKursusBodyDTO;

    const result = await service.insertRequestKursus(body)

    return formatResponse(ctx, result);
}


export async function getRequestKursus(ctx: any) {
   const { id_relawan, keterangan } = ctx.query as GetRequestKursusQueryDTO;

    const result = await service.getRequestKursus(id_relawan, keterangan);

    return formatResponse(ctx, result);
}

export async function getFilterKursus(ctx: any){
    const query = ctx.query as GetFilterKursusQueryDTO;
    
    const result = await service.getFilterKursus(query);
    
    return formatResponse(ctx, result);
}

export async function updateRequestKursus(ctx: any) {
    const { id_detail_kursus } = ctx.params as UpdateRequestKursusParamsDTO;
    const result = await service.updateRequestKursus(id_detail_kursus);
    return formatResponse(ctx, result);
}