import { Elysia } from "elysia";
import * as controller from "./master.controller";
import { defaultResponse } from "../../utils/formatResponse";
import { authenticate } from "../../middleware/auth.middleware";
import { deleteRelawanParams } from "./master.schema";
import { deleteSiswaParams } from "./master.schema";
import { keteranganRelawanParams } from "./master.schema";
import { updateRequestRelawanParams } from "./master.schema";

export const masterRoutes = new Elysia({
  prefix: "/master",
})

  .get("/relawan/:keterangan", controller.getAllRelawan, {
    beforeHandle: [authenticate()],
    response: { 200: defaultResponse() },
    params: keteranganRelawanParams,
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
  })

   .patch("/acc/:id_relawan", controller.updateRequestRelawan, {
      beforeHandle: [authenticate()],
      response: { 200: defaultResponse() },
      params: updateRequestRelawanParams,
      detail: {
        tags: ["Master"],
        summary: "Update Request Relawan",
        description: "Update the status of a relawan request", 
      },
  });
