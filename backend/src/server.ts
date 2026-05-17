import "dotenv/config";
import app from "./app";

const isProduction = process.env.NODE_ENV === "production";

/* -------------------------------------------------------------------------- */
/*                           Development Environment                          */
/* -------------------------------------------------------------------------- */

if (!isProduction) {
    const port = process.env.PORT
        ? Number(process.env.PORT)
        : 3000;

    app.listen(port);

    console.log(
        `🚀 Server running at http://localhost:${port}`
    );
}

/* -------------------------------------------------------------------------- */
/*                           Production Environment                           */
/* -------------------------------------------------------------------------- */

export default app;