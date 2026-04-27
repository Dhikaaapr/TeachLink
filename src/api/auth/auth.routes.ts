import { Elysia } from "elysia";
import * as controller from "./auth.controller";
import { authenticate } from "../../middleware/auth.middleware";
import { loginBody, registerBody } from "./auth.schema";
import { defaultResponse } from "../../utils/formatResponse";

export const authRoutes = new Elysia({
    prefix: "/auth",
})
    .post("/login", controller.login, {
        body: loginBody,
        response: { 200: defaultResponse() },
        detail: {  // ← Tambahkan detail untuk swagger
            tags: ["Auth"],
            summary: "User Login",
            description: "Authenticate user and get access token"
        }
    })

    .post("/refresh", controller.refreshToken, {
        response: { 200: defaultResponse() },
        detail: {
            tags: ["Auth"],
            summary: "Refresh Access Token",
            description: "Get new access token using refresh token"
        }
    })

    .post("/logout", controller.logout, {
        response: { 200: defaultResponse() },
        detail: {
            tags: ["Auth"],
            summary: "User Logout",
            description: "Invalidate user session"
        }
    })

    .post("/generate-token", controller.generateTokenDirect, {
        response: { 200: defaultResponse() },
        detail: {
            tags: ["Auth"],
            summary: "Generate Token",
            description: "Generate token directly"
        }
    })

    .get("/me", controller.getCurrentUser, {
        beforeHandle: [authenticate()],
        response: { 200: defaultResponse() },
        detail: {
            tags: ["Auth"],
            summary: "Get Current User",
            description: "Get authenticated user profile"
        }
    })

        .post("/register", controller.register, {
        body: registerBody,
        response: { 200: defaultResponse() },
        detail: {
            tags: ["Auth"],
            summary: "User Register",
            description: "Register a new user with profile data"
        }
    });

