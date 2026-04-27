import { insertKursusBodyDTO } from './kursus.schema';
import { InsertRequestKursusBodyDTO } from './kursus.schema';
import { GetFilterKursusQueryDTO } from "./kursus.schema";
import * as model from "./kursus.model";

export async function insertKursus(body: insertKursusBodyDTO) {
    return await model.insertKursus(body);
}

export async function getAllKursus() {
    return await model.getAllKursus();
}

export async function getKursusByRelawan(id_relawan: number) {
    return await model.getKursusByRelawan(id_relawan);
}

export async function insertRequestKursus(body: InsertRequestKursusBodyDTO) {
    return await model.insertRequestKursus(body);
}

export async function getPendingRequestKursus(id_relawan: number) {
    return await model.getPendingRequestKursus(id_relawan);
}

export async function getAccRequestKursus(id_relawan: number) {
    return await model.getAccRequestKursus(id_relawan);
}

export async function getDeclineRequestKursus(id_relawan: number) {
    return await model.getDeclineRequestKursus(id_relawan);
}

export async function getFilterKursus(filters: GetFilterKursusQueryDTO) {
    return await model.getFilterKursus(filters);
}