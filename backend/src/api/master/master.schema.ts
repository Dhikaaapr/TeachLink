import { t } from "elysia";

export const keteranganRelawanParams = t.Object({
  keterangan: t.Enum({
    ACC: 'ACC',
    PENDING: 'PENDING',
    DECLINE: 'DECLINE'
  }, { default: 'ACC' })
})

export type KeteranganRelawanParamsDTO = typeof keteranganRelawanParams.static;

export const deleteRelawanParams = t.Object({
  id_relawan: t.Number()
})

export type DeleteRelawanParamsDTO = typeof deleteRelawanParams.static;

export const deleteSiswaParams = t.Object({
  id_siswa: t.Number()
})

export type DeleteSiswaParamsDTO = typeof deleteSiswaParams.static;

export const updateRequestRelawanParams = t.Object({
  id_relawan: t.Number()
});

export type UpdateRequestRelawanParamsDTO = typeof updateRequestRelawanParams.static;

export const getDetailUserParams = t.Object({
  id_user: t.Number()
});

export type GetDetailUserParamsDTO = typeof getDetailUserParams.static;