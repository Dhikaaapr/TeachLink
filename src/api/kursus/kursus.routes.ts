import { Elysia } from "elysia";
import * as controller from "./kursus.controller";
import { defaultResponse } from "../../utils/formatResponse";
import { authenticate } from "../../middleware/auth.middleware";
import { kursusBody } from "./kursus.schema";
import { getKursusByRelawanParams} from "../kursus/kursus.schema";
import { insertRequestKursusBody } from "./kursus.schema";
import { getPendingRequestKursusParams } from "./kursus.schema";
import { getAccRequestKursusParams } from "./kursus.schema";  
import { getDeclineRequestKursusParams } from "./kursus.schema";  
import { getFilterKursusQuery } from "./kursus.schema";

export const kursusRoutes = new Elysia({
    prefix: "/kursus",
})

    .post("/kursus", controller.insertKursus, {
        body: kursusBody,
        response: { 200: defaultResponse() },
        detail: {
            tags: ["Kursus"],
            summary: "Add Kursus",
            description: "Add a new kursus to the database"
        }
    })

    .get("/all", controller.getAllKursus, {
        beforeHandle: [authenticate()],
        response: { 200: defaultResponse() },
        detail: {
            tags: ["Kursus"],
            summary: "Get All Kursus",
            description: "Get a list of all kursus"
        }
    })

    .get("/relawan/:id_relawan", controller.getKursusByRelawan,{
            beforeHandle: [authenticate()],
            response: { 200: defaultResponse() },
            params: getKursusByRelawanParams,
            detail: {
                tags: ["Kursus"],
                summary: "Get Kursus by Id Relawan",
                description: "Get a list of all kursus by id relawan"
            }
    })

    .post("/request-kursus", controller.insertRequestKursus, {
        body: insertRequestKursusBody,
        response: { 200: defaultResponse() },
        detail: {
            tags: ["Kursus"],
            summary: "Add Request Kursus",
            description: "Add a new kursus request to the database"
        }
    })

    .get("/pending-requests", controller.getPendingRequestKursus, {
    beforeHandle: [authenticate()],
    response: { 200: defaultResponse() },
    detail: {
        tags: ["Kursus"],
        summary: "Get Pending Requests",
        description: "Get all pending kursus requests for relawan"
    }
    })

    .get("/acc-requests", controller.getAccRequestKursus, {
    beforeHandle: [authenticate()],
    response: { 200: defaultResponse() },
    detail: {
        tags: ["Kursus"],
        summary: "Get Accepted Requests",
        description: "Get all accepted kursus requests for relawan"
    }
    })

    .get("/decline-requests", controller.getDeclineRequestKursus, {
    beforeHandle: [authenticate()],
    response: { 200: defaultResponse() },
    detail: {
        tags: ["Kursus"],
        summary: "Get Declined Requests",
        description: "Get all declined kursus requests for relawan"
    }
    })

    .get("/filter", controller.getFilterKursus, {
    // beforeHandle: [authenticate()], // ← COMMENT INI DULU
    query: getFilterKursusQuery,
    response: { 200: defaultResponse() },
    detail: {
        tags: ["Kursus"],
        summary: "Filter Kursus",
    }
})
    
   

