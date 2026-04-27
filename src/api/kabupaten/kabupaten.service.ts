import * as model from "./kabupaten.model";

export async function getAllKabupatenById(id_provinsi: number) {
    return await model.getAllKabupatenById(id_provinsi);
}