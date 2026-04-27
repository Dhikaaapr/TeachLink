import { Elysia } from "elysia";
import * as controller from "./kabupaten.controller";
import { authenticate } from "../../middleware/auth.middleware";
import { defaultResponse } from "../../utils/formatResponse";
import { getAllKabupatenParams } from "./kabupaten.schema";

export const kabupatenRoutes = new Elysia({
    prefix: "/kabupaten",
})

    .get("/provinsi/:id_provinsi", controller.getAllKabupatenById,{
        beforeHandle: [authenticate()],
        response: { 200: defaultResponse() },
        params: getAllKabupatenParams,
        detail: {
            tags: ["Kabupaten"],
            summary: "Get All Kabupaten by Id Provinsi",
            description: "Get a list of all kabupaten by id provinsi"
        }
    });


