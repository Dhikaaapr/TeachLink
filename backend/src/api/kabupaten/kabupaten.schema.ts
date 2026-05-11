import { t } from "elysia";

export const getAllKabupatenParams = t.Object({
    id_provinsi: t.Number({ min: 1 }),
});

export type GetAllKabupatenParamsDTO = typeof getAllKabupatenParams.static;
