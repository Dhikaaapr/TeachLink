import { Elysia } from "elysia";

import { authRoutes } from "./auth/auth.routes";
import { provinsiRoutes } from "./Provinsi/provinsi.routes";
import { kabupatenRoutes } from "./kabupaten/kabupaten.routes";
import { pelajaranRoutes } from "./pelajaran/pelajaran.routes";
import { kursusRoutes } from "./kursus/kursus.routes";
import { authenticatePlugin } from "../middleware/auth.middleware";

/* -------------------------------------------------------------------------- */
/*                              🔓 Prefix Routes                              */
/* -------------------------------------------------------------------------- */

const apiRoutes = new Elysia({
    prefix: "/api",
});

/* -------------------------------------------------------------------------- */
/*                              🔓 Public routes                              */
/* -------------------------------------------------------------------------- */

apiRoutes.use(authRoutes);

/* -------------------------------------------------------------------------- */
/*                             🔐 Protected routes                            */
/* -------------------------------------------------------------------------- */

apiRoutes.use(authenticatePlugin);
apiRoutes.use(provinsiRoutes);
apiRoutes.use(kabupatenRoutes);
apiRoutes.use(pelajaranRoutes);
apiRoutes.use(kursusRoutes);

export default apiRoutes;
