import { Elysia } from "elysia";
import * as controller from "./pelajaran.controller";
import { authenticate } from "../../middleware/auth.middleware";
import { defaultResponse } from "../../utils/formatResponse";

export const pelajaranRoutes = new Elysia({
    prefix: "/pelajaran",
})

    .get("/all", controller.getAllPelajaran, {
        beforeHandle: [authenticate()],
        response: { 200: defaultResponse() },
        detail: {
            tags: ["Pelajaran"],
            summary: "Get All Pelajaran",
            description: "Get a list of all pelajaran"
        }
    });


