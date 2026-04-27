import { Elysia } from "elysia";
import * as controller from "./provinsi.controller";
import { authenticate } from "../../middleware/auth.middleware";
import { defaultResponse } from "../../utils/formatResponse";

export const provinsiRoutes = new Elysia({
    prefix: "/provinsi",
})

    .get("/all", controller.getAllProvinsi, {
        beforeHandle: [authenticate()],
        response: { 200: defaultResponse() },
        detail: {
            tags: ["Provinsi"],
            summary: "Get All Provinsi",
            description: "Get a list of all provinsi"
        }
    });


