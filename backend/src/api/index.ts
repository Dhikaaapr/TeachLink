import { Elysia } from "elysia";

import { authRoutes } from "./auth/auth.routes";
import { provinsiRoutes } from "./Provinsi/provinsi.routes";
import { kabupatenRoutes } from "./kabupaten/kabupaten.routes";
import { pelajaranRoutes } from "./pelajaran/pelajaran.routes";
import { kursusRoutes } from "./kursus/kursus.routes";
import { authenticatePlugin } from "../middleware/auth.middleware";
import { masterRoutes } from "./master/master.routes";

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
apiRoutes.use(provinsiRoutes);
apiRoutes.use(kabupatenRoutes);

/* -------------------------------------------------------------------------- */
/*                             🔐 Protected routes                            */
/* -------------------------------------------------------------------------- */

apiRoutes.use(authenticatePlugin);
apiRoutes.use(pelajaranRoutes);
apiRoutes.use(kursusRoutes);
apiRoutes.use(masterRoutes);

export default apiRoutes;
