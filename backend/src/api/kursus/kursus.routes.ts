import { Elysia } from "elysia";
import * as controller from "./kursus.controller";
import { defaultResponse } from "../../utils/formatResponse";
import { authenticate } from "../../middleware/auth.middleware";
import { kursusBody } from "./kursus.schema";
import { getKursusByRelawanParams } from "../kursus/kursus.schema";
import { insertRequestKursusBody } from "./kursus.schema";
import { getRequestKursusQuery } from "./kursus.schema";
import { getFilterKursusQuery } from "./kursus.schema";
import { updateRequestKursusParams } from "./kursus.schema";
import { getKursusBySiswaQuery } from "./kursus.schema";

export const kursusRoutes = new Elysia({
  prefix: "/kursus",
})

  .post("/kursus", controller.insertKursus, {
    body: kursusBody,
    response: { 200: defaultResponse() },
    detail: {
      tags: ["Kursus"],
      summary: "Add Kursus",
      description: "Add a new kursus to the database",
    },
  })

  .get("/all", controller.getAllKursus, {
    beforeHandle: [authenticate()],
    response: { 200: defaultResponse() },
    detail: {
      tags: ["Kursus"],
      summary: "Get All Kursus",
      description: "Get a list of all kursus",
    },
  })

  .get("/relawan/:id_relawan", controller.getKursusByRelawan, {
    beforeHandle: [authenticate()],
    response: { 200: defaultResponse() },
    params: getKursusByRelawanParams,
    detail: {
      tags: ["Kursus"],
      summary: "Get Kursus by Id Relawan",
      description: "Get a list of all kursus by id relawan",
    },
  })

  .post("/request-kursus", controller.insertRequestKursus, {
    body: insertRequestKursusBody,
    response: { 200: defaultResponse() },
    detail: {
      tags: ["Kursus"],
      summary: "Add Request Kursus",
      description: "Add a new kursus request to the database",
    },
  })

  .get("/requests", controller.getRequestKursus, {
    beforeHandle: [authenticate()],
    response: { 200: defaultResponse() },
    query: getRequestKursusQuery,
    detail: {
      tags: ["Kursus"],
      summary: "Get Requests",
      description: "Get all requests kursus for relawan",
    },
  })

  .get("/filter", controller.getFilterKursus, {
    beforeHandle: [authenticate()],
    response: { 200: defaultResponse() },
    query: getFilterKursusQuery,
    detail: {
      tags: ["Kursus"],
      summary: "Filter Kursus",
      description: "Filter kursus based on specified criteria", 
    },
  })

  .patch("/acc/:id_detail_kursus", controller.updateRequestKursus, {
    beforeHandle: [authenticate()],
    response: { 200: defaultResponse() },
    params: updateRequestKursusParams,
    detail: {
      tags: ["Kursus"],
      summary: "Update Request Kursus",
      description: "Update the status of a kursus request", 
    },
  })
  
  .get("/siswa", controller.getKursusBySiswa, {
    beforeHandle: [authenticate()],
    response: { 200: defaultResponse() },
    query: getKursusBySiswaQuery,
    detail: {
      tags: ["Kursus"],
      summary: "Get Kursus by Id Siswa",
      description: "Get a list of all kursus by id siswa",
    },
  })
  
  .get("/recommendations", controller.getRecommendations, {
    beforeHandle: [authenticate()],
    response: { 200: defaultResponse() },
    detail: {
      tags: ["Kursus"],
      summary: "Get Recommended Kursus",
      description: "Get a list of recommended kursus for student based on interests",
    },
  });

