import { Elysia } from "elysia";
import { swagger } from "@elysiajs/swagger";
import { jwt } from '@elysiajs/jwt';
import { cors } from "@elysiajs/cors";
import { cookie } from "@elysiajs/cookie";
import { securityHeaders } from "./plugins/security.plugin";
import { errorHandler } from "./middleware/error.middleware";
import { basicAuth } from "./plugins/basic-auth.plugin";
import apiRoutes from "./api";
import { uploadPlugin } from './plugins/upload.plugin'

const app = new Elysia();

/* -------------------------------------------------------------------------- */
/*         ❌ Global error handler (Harus inisialisasi di paling atas)        */
/* -------------------------------------------------------------------------- */

app.onError(errorHandler);
app.use(uploadPlugin)

/* -------------------------------------------------------------------------- */
/*                          📚 OpenAPI documentation                          *
/* -------------------------------------------------------------------------- */

const isProduction = process.env.NODE_ENV === 'production';

if (!isProduction) {
    app.use(basicAuth); // Ini buat proteksi /docs

    app.use(
        swagger({
            path: "/docs",
            documentation: {
                info: {
                    title: "API Documentation",           // ← Title di sini
                    version: "1.0.0",                    // ← Version di sini
                    description: "API Documentation for the application",
                    contact: {
                        name: "Riza Ganteng",
                        email: "dev.mfriza.com",
                    }
                },
                tags: [                                   // ← Optional: Grouping routes
                    { name: "Auth", description: "Authentication endpoints", },
                    { name: "Provinsi", description: "Provinsi endpoints", },
                    { name: "Kabupaten", description: "Kabupaten endpoints", },
                    { name: "Pelajaran", description: "Pelajaran endpoints", },
                    { name: "Kursus", description: "Kursus endpoints", },
                ],
                components: {
                    securitySchemes: {
                        bearerAuth: {
                            type: "http",
                            scheme: "bearer",
                            bearerFormat: "JWT"
                        }
                    }
                },
                security: [{ bearerAuth: [] }]
            },
            // Optional: Theme customization
            theme: "dark", // or "dark"
            // Optional: Exclude specific paths
            exclude: ["/health", "/docs", "/docs/json"]
        })
    );
}

/* -------------------------------------------------------------------------- */
/*                🔐 Security headers (replacement for helmet)                */
/* -------------------------------------------------------------------------- */

app.use(securityHeaders);

/* -------------------------------------------------------------------------- */
/*                            🌍 CORS configuration                           */
/* -------------------------------------------------------------------------- */

// Allowed origins untuk CORS
const allowedOrigins = [
    "http://localhost:5173",
    "http://localhost:3005",
    "http://localhost:3000"
];

app.use(
    cors({
        origin: (request: any) => {
            const origin = request.headers.get("origin");

            // Izinkan request tanpa origin (Postman, server-to-server, dll)
            if (!origin) return true;

            return allowedOrigins.includes(origin);
        },
        credentials: true,
        methods: ["GET", "POST", "PUT", "DELETE", "PATCH", "OPTIONS"],
        allowedHeaders: ["Content-Type", "Authorization"],
    })
);

/* -------------------------------------------------------------------------- */
/*                              🍪 Cookie parser                              */
/* -------------------------------------------------------------------------- */

app.use(cookie());

/* -------------------------------------------------------------------------- */
/*                            🔑 JWT configuration                           */
/* -------------------------------------------------------------------------- */

app.use(
    jwt({
        name: "jwt", // Ini buat Access Token
        secret: process.env.SECRET_KEY as string,
        exp: '15m'
    })
);

app.use(
    jwt({
        name: "refreshJwt", // Ini buat Refresh Token
        secret: process.env.REFRESH_SECRET as string,
        exp: '8h'
    })
);

/* -------------------------------------------------------------------------- */
/*                         🔹 Route dasar (cek server)                        */
/* -------------------------------------------------------------------------- */

app.get("/health", () => ({
    message: "Server is running successfully!",
}));

/* -------------------------------------------------------------------------- */
/*                           🔹 Route API utama                               */
/* -------------------------------------------------------------------------- */

app.use(apiRoutes);

export default app;
