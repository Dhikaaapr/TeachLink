import { insertKursusBodyDTO, getKursusBySiswaQuery} from './kursus.schema';
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

export async function getRequestKursus(id_relawan: number, keterangan: string) {
    return await model.getRequestKursus(id_relawan, keterangan);
}

export async function getFilterKursus(filters: GetFilterKursusQueryDTO) {
    return await model.getFilterKursus(filters);
}

export async function updateRequestKursus(id_detail_kursus: number) {
  return await model.updateRequestKursus(id_detail_kursus);
}

export async function getKursusBySiswa(id_siswa: number, status: string) {
    return await model.getKursusBySiswa(id_siswa, status);
}