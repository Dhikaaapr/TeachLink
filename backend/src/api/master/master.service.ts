import * as model from "./master.model";

export async function getAllRelawan(keterangan: string) {
    return await model.getAllRelawan(keterangan);
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

export async function updateRequestRelawan(id_relawan: number) {
  return await model.updateRequestRelawan(id_relawan);
}

export async function getDetailUser(id_user: number) {
  return await model.getDetailUser(id_user);
}