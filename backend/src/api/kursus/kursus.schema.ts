import { t } from "elysia";

export const kursusBody = t.Object({
  id_relawan: t.Number(),
  tanggal_mengajar: t.String({ format: "date" }),
  waktu_mulai: t.String({ pattern: "^([01]\\d|2[0-3]):([0-5]\\d)$" }), // HH:mm
  waktu_selesai: t.String({ pattern: "^([01]\\d|2[0-3]):([0-5]\\d)$" }), // HH:mm
  id_pelajaran: t.Number(),
  mode: t.Union([
    t.Literal("online"),
    t.Literal("offline")
  ])
});

export type insertKursusBodyDTO = typeof kursusBody.static;

export const getKursusByRelawanParams = t.Object({
    id_relawan: t.Number({ min: 1 }),
});

export type GetKursusByRelawanParamsDTO = typeof getKursusByRelawanParams.static;

export const insertRequestKursusBody = t.Object({
    id_siswa: t.Number({ min: 1 }),
    id_kursus: t.Number({ min: 1 }),
});

export type InsertRequestKursusBodyDTO = typeof insertRequestKursusBody.static;

export const getRequestKursusQuery = t.Object({
    id_relawan: t.Number({ min: 1 }),
    keterangan: t.Union([
        t.Literal("PENDING"),
        t.Literal("ACC"),
        t.Literal("DECLINE"),
        t.Literal("ALL")
    ])
});

export type GetRequestKursusQueryDTO = typeof getRequestKursusQuery.static;

export const getFilterKursusQuery = t.Object({
  nama_pelajaran: t.Optional(t.String()),
  id_provinsi: t.Optional(t.Number({ min: 1 })),
  id_kabupaten: t.Optional(t.Number({ min: 1 })),
  mode: t.Union([
    t.Literal("online"),
    t.Literal("offline"),
    t.Literal("all")
  ])
});

export type GetFilterKursusQueryDTO = typeof getFilterKursusQuery.static;

export const updateRequestKursusParams = t.Object({
  id_detail_kursus: t.Number({ min: 1 }),
});

export type UpdateRequestKursusParamsDTO = typeof updateRequestKursusParams.static;

export const getKursusBySiswaQuery = t.Object({
    id_siswa: t.Number({ min: 1 }),
    status: t.Union([
        t.Literal("ALL"),
        t.Literal("SELESAI"),
        t.Literal("BELUM")
    ])
});

export type GetKursusBySiswaQueryDTO = typeof getKursusBySiswaQuery.static;

export const updateWaktuMengajarBody = t.Object({
  id_kursus: t.Number({ min: 1 }),
  waktu_mulai: t.String({ pattern: "^([01]\\d|2[0-3]):([0-5]\\d)$" }), // HH:mm
  waktu_selesai: t.String({ pattern: "^([01]\\d|2[0-3]):([0-5]\\d)$" }), // HH:mm
});

export type UpdateWaktuMengajarBodyDTO = typeof updateWaktuMengajarBody.static;