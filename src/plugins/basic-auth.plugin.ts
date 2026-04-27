import { Elysia } from 'elysia';

export const basicAuth = (app: Elysia) =>
    app.onBeforeHandle(({ set, headers, path }) => {
        // Hanya proteksi jika path diawali dengan /docs
        // Ini memastikan /docs, /docs/json, /docs/scalar, dll semua kena
        if (path.startsWith('/docs')) {
            const auth = headers['authorization'];
            
            // Ganti credentials di sini
            const DOCS_USERNAME = process.env.DOCS_USERNAME as string;
            const DOCS_PASSWORD = process.env.DOCS_PASSWORD as string;
            const expectedAuth = 'Basic ' + Buffer.from(`${DOCS_USERNAME}:${DOCS_PASSWORD}`).toString('base64');

            if (!auth || auth !== expectedAuth) {
                set.headers['WWW-Authenticate'] = 'Basic realm="Secure Area"';
                set.status = 401;
                return 'Unauthorized: Masukkan Password!';
            }
        }
    });