import * as service from "./auth.service";

/* -------------------------------------------------------------------------- */
/*                                   LOGIN                                    */
/* -------------------------------------------------------------------------- */

export async function login({ body, jwt, refreshJwt, cookie, set }: any) {
    const { email, password } = body;

    const result = await service.loginUser(email, password);

    if (!result.data) {
        set.status = 401;
        return {
            success: false,
            message: result.message,
            data: null,
        };
    }

    const user = result.data;

    const accessToken = await jwt.sign({
        user_id: user.user_id,
        full_name: user.full_name,
        email: user.email,
        role: user.role,
        type: "access",
    });

    const refreshToken = await refreshJwt.sign({
        user_id: user.user_id,
        type: "refresh",
        version: 1,
    });

    const isProd = process.env.NODE_ENV === "production";

    cookie.token.set({
        value: accessToken,
        httpOnly: true,
        secure: isProd,
        sameSite: isProd ? "none" : "lax",
        maxAge: 15 * 60,
    });

    cookie.refreshToken.set({
        value: refreshToken,
        httpOnly: true,
        secure: isProd,
        sameSite: isProd ? "none" : "lax",
        maxAge: 8 * 60 * 60,
    });

    return {
        success: true,
        message: "Login successful",
        data: user
    };
}

/* -------------------------------------------------------------------------- */
/*                                REFRESH TOKEN                               */
/* -------------------------------------------------------------------------- */

export async function refreshToken({ jwt, refreshJwt, cookie, set }: any) {
    const refreshToken = cookie.refreshToken?.value;

    if (!refreshToken) {
        set.status = 401;
        return {
            success: false,
            message: "Refresh token required",
            data: null,
        };
    }

    try {
        const decoded: any = await refreshJwt.verify(refreshToken);

        if (decoded.type !== "refresh") {
            set.status = 403;
            return {
                success: false,
                message: "Invalid token type",
                data: null,
            };
        }

        const result = await service.getCurrentUserById(decoded.user_id);

        if (!result.data) {
            set.status = 401;
            return {
                success: false,
                message: "User not found",
                data: null,
            };
        }

        const user = result.data;

        const newAccessToken = await jwt.sign({
            user_id: user.user_id,
            full_name: user.full_name,
            email: user.email,
            role: user.role,
            type: "access",
        });

        const isProd = process.env.NODE_ENV === "production";

        cookie.token.set({
            value: newAccessToken,
            httpOnly: true,
            secure: isProd,
            sameSite: isProd ? "none" : "lax",
            maxAge: 15 * 60,
        });

        return {
            success: true,
            message: "Token refreshed",
            data: null,
        };
    } catch (err: any) {
        if (err?.name === "TokenExpiredError") {
            cookie.refreshToken.remove();
            set.status = 401;
            return {
                success: false,
                message: "Refresh token expired",
                data: null,
            };
        }

        set.status = 403;
        return {
            success: false,
            message: "Invalid refresh token",
            data: null,
        };
    }
}

/* -------------------------------------------------------------------------- */
/*                                   Logout                                   */
/* -------------------------------------------------------------------------- */

export function logout({ cookie }: any) {
    cookie.token?.remove();
    cookie.refreshToken?.remove();

    return {
        success: true,
        message: "Logout successful",
        data: null,
    };
}

/* -------------------------------------------------------------------------- */
/*                                GET CURRENT USER                            */
/* -------------------------------------------------------------------------- */

export async function getCurrentUser({ store, set }: any) {
    if (!store.currentUser) {
        set.status = 401;
        return {
            success: false,
            message: "Unauthenticated",
            data: null,
        };
    }

    return {
        success: true,
        message: "Success",
        data: store.currentUser,
    };
}

/* -------------------------------------------------------------------------- */
/*                 ⚙️ DEBUG ONLY — Hoppscotch token generator                 */
/* -------------------------------------------------------------------------- */

export async function generateTokenDirect({ body, jwt }: any) {
    const payload = body?.payload || {
        user_id: 1,
        name: "Muhammad Fachrur Riza",
        username: "rizaganteng",
        role: "bd",
        type: "access",
    };

    const token = await jwt.sign(payload);

    return {
        success: true,
        message: "Token generated",
        data: { token },
    };
}

/* -------------------------------------------------------------------------- */
/*                                 REGISTER                                  */
/* -------------------------------------------------------------------------- */

export async function register({ body, set }: any) {
    const result = await service.registerUser(body);

    if (!result.data) {
        set.status = 400;
        return {
            success: false,
            message: result.message,
            data: null,
        };
    }

    set.status = 201;
    return {
        success: true,
        message: "User registered successfully",
        data: result.data,
    };
}
