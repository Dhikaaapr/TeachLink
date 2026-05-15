import { t } from "elysia";

export const deleteRelawanParams = t.Object({
    id_relawan: t.Number()
})

export type DeleteRelawanParamsDTO = typeof deleteRelawanParams.static;

export const deleteSiswaParams = t.Object({
    id_siswa: t.Number()
})

export type DeleteSiswaParamsDTO = typeof deleteSiswaParams.static;