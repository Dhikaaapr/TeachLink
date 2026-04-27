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

export const getPendingRequestKursusParams = t.Object({
    id_relawan: t.Number({ min: 1 }),
});

export type GetPendingRequestKursusParamsDTO = typeof getPendingRequestKursusParams.static;

export const getAccRequestKursusParams = t.Object({
    id_relawan: t.Number({ min: 1 }),
});

export type GetAccRequestKursusParamsDTO = typeof getAccRequestKursusParams.static;

export const getDeclineRequestKursusParams = t.Object({
    id_relawan: t.Number({ min: 1 }),
});

export type GetDeclineRequestKursusParamsDTO = typeof getDeclineRequestKursusParams.static;

export const getFilterKursusQuery = t.Object({
  id_pelajaran: t.Optional(t.Number({ min: 1 })),
  id_provinsi: t.Optional(t.Number({ min: 1 })),
  mode: t.Optional(t.Union([
    t.Literal("online"),
    t.Literal("offline")
  ]))
});

export type GetFilterKursusQueryDTO = typeof getFilterKursusQuery.static;