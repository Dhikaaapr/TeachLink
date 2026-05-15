import * as model from "./master.model";

export async function getAllRelawan() {
    return await model.getAllRelawan();
}

export async function getAllSiswa() {
    return await model.getAllSiswa();
}

export async function deleteRelawan(id_relawan: number) {
    return await model.deleteRelawan(id_relawan);
}

export async function deleteSiswa(id_siswa: number) {
    return await model.deleteSiswa(id_siswa);
}