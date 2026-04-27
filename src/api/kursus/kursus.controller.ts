import * as service from "./kursus.service";
import { formatResponse } from "../../utils/formatResponse"
import { insertKursusBodyDTO } from "./kursus.schema";
import { InsertRequestKursusBodyDTO } from "./kursus.schema";
import { GetFilterKursusQueryDTO } from "./kursus.schema";

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


export async function getPendingRequestKursus(ctx: any) {
    const id_relawan = Number(ctx.store?.user?.user_id);

    if (!id_relawan) {
        ctx.set.status = 401;
        throw new Error("UNAUTHORIZED: User not found in request context");
    }

    const result = await service.getPendingRequestKursus(id_relawan);

    return formatResponse(ctx, result);
}

export async function getAccRequestKursus(ctx: any) {
    const id_relawan = Number(ctx.store?.user?.user_id);

    if (!id_relawan) {
        ctx.set.status = 401;
        throw new Error("UNAUTHORIZED: User not found in request context");
    }
    const result = await service.getAccRequestKursus(id_relawan);

    return formatResponse(ctx, result);
}

export async function getDeclineRequestKursus(ctx: any) {
    const id_relawan = Number(ctx.store?.user?.user_id);

    if (!id_relawan) {
        ctx.set.status = 401;
        throw new Error("UNAUTHORIZED: User not found in request context");
    }
    const result = await service.getDeclineRequestKursus(id_relawan);

    return formatResponse(ctx, result);
}

export async function getFilterKursus(ctx: any){
    const query = ctx.query as GetFilterKursusQueryDTO;
    
    const result = await service.getFilterKursus(query);
    
    return formatResponse(ctx, result);
}