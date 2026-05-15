import { Elysia } from "elysia";
import * as controller from "./master.controller";
import { defaultResponse } from "../../utils/formatResponse";
import { authenticate } from "../../middleware/auth.middleware";
import { deleteRelawanParams } from "./master.schema";
import { deleteSiswaParams } from "./master.schema";

export const masterRoutes = new Elysia({
  prefix: "/master",
})

  .get("/relawan", controller.getAllRelawan, {
    beforeHandle: [authenticate()],
    response: { 200: defaultResponse() },
    detail: {
      tags: ["Master"],
      summary: "Get All Relawan",
      description: "Get a list of all relawan",
    },
  })

  .get("/siswa", controller.getAllSiswa, {
    beforeHandle: [authenticate()],
    response: { 200: defaultResponse() },
    detail: {
      tags: ["Master"],
      summary: "Get All Siswa",
      description: "Get a list of all siswa",
    },
  })

  .delete("/relawan/:id_relawan", controller.deleteRelawan, {
    beforeHandle: [authenticate()],
    response: { 200: defaultResponse() },
    params: deleteRelawanParams,
    detail: {
      tags: ["Master"],
      summary: "Delete Relawan",
      description: "Delete a relawan by ID",
    },
  })

  .delete("/siswa/:id_siswa", controller.deleteSiswa, {
    beforeHandle: [authenticate()],
    response: { 200: defaultResponse() },
    params: deleteSiswaParams,
    detail: {
      tags: ["Master"],
      summary: "Delete Siswa",
      description: "Delete a siswa by ID",
    },
  });
