import { Elysia } from "elysia";
import { getCurrentUserById } from "../api/auth/auth.service.js";

export type JwtPayload = {
    user_id: string;
    type: "access" | "refresh";
    role?: string;
    name?: string;
    username?: string;
};

export class HttpError extends Error {
    status: number;
    constructor(status: number, message: string) {
        super(message);
        this.status = status;
    }
}

// Middleware authenticate
export const authenticate = () => {
    return async ({ request, cookie, jwt, set, store }: any) => {
        const authHeader = request.headers.get("authorization");
        const bearerToken = authHeader?.startsWith("Bearer ") ? authHeader.split(" ")[1] : null;
        const cookieToken = cookie.token?.value;

        const token = bearerToken ?? cookieToken;

        if (!token) {
            throw new HttpError(401, "UNAUTHORIZED: No token provided");
        }

        // 🔐 Elysia JWT: verify() return null jika invalid/expired
        const decoded = await jwt.verify(token);

        if (!decoded) {
            set.status = 401;
            // Di sini kemungkinan besar token expired atau signature salah
            throw new HttpError(401, "UNAUTHORIZED: Token expired or invalid");
        }

        if (decoded.type !== "access") {
            throw new HttpError(403, "FORBIDDEN: Invalid token type")
        }

        // 👤 Ambil user dari database
        const user = await getCurrentUserById(decoded.user_id);

        if (!user?.data) {
            throw new HttpError(401, "UNAUTHORIZED: User no longer exists");
        }

        // ✅ Inject ke store
        store.user = decoded; // Payload JWT
        store.currentUser = user.data; // Data lengkap dari DB
    };
};

// Plugin authenticate
export const authenticatePlugin = () => {
  return new Elysia().onBeforeHandle(authenticate());
};

export const authorize = ({ roles = [] }: { roles?: string[] } = {}) => {
    return async ({ store, set }: any) => {
        const user = store.user;
        if (!user) {
            set.status = 401;
            throw new Error("USER NOT FOUND");
        }

        const isRoleAllowed = roles.length === 0 || roles.includes(user.role?.toUpperCase());
        if (!isRoleAllowed) {
            set.status = 403;
            throw new Error("FORBIDDEN ROLE");
        }
    };
};
