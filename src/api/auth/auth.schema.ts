import { t } from "elysia";

export const loginBody = t.Object({
  email: t.String({ minLength: 2 }),
  password: t.String({ minLength: 2 }),
});

export const registerBody = t.Object({
  full_name: t.String({ minLength: 3, maxLength: 100 }),
  email: t.String({ format: "email" }),
  password: t.String({ minLength: 6, maxLength: 255 }),
  id_role: t.Optional(t.Number()),
  nomor_telepon: t.Optional(t.String({ maxLength: 20 })),
  tanggal_lahir: t.Optional(t.String({ format: "date" })),
  id_provinsi: t.Optional(t.Number()),
  id_kabupaten: t.Optional(t.Number()),
  pekerjaan: t.Optional(t.String({ maxLength: 100 })),
  institusi: t.Optional(t.String({ maxLength: 100 })),
  ktp: t.Optional(t.String({ maxLength: 50 })),
  bidang_keahlian: t.Optional(t.String({ maxLength: 100 })),
  bio: t.Optional(t.String()),
});
