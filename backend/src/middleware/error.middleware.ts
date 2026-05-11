import logger from "../utils/logger";

function basePayload(request: Request) {
    return {
        path: new URL(request.url).pathname,
        method: request.method,
        timestamp: new Date().toISOString(),
    };
}

/* -------------------------------------------------------------------------- */
/*                           ❌ Global Error Handler                          */
/* -------------------------------------------------------------------------- */

export function errorHandler(context: any) {
    const { error, request, set } = context;

    // ✅ Validation error dari Elysia
    if (error?.code === "VALIDATION") {
        set.status = 400;
        return {
            success: false,
            message: error.all[0].summary,
            ...basePayload(request),
        };
    }

    // 📦 Upload errors
    if (error?.code === "LIMIT_FILE_SIZE") {
        set.status = 400;
        return {
            success: false,
            message: "File terlalu besar. Maksimum 1MB.",
            ...basePayload(request),
        };
    }

    if (error?.code === "INVALID_FILE_TYPE") {
        set.status = 400;
        return {
            success: false,
            message: "Format file tidak valid (JPEG, JPG, PNG, HEIC, WEBP)",
            ...basePayload(request),
        };
    }

    // 🚨 Log error
    logger.error(`🔥 Error: ${error?.message}`, {
        path: basePayload(request).path,
        method: request.method,
        stack: error?.stack,
    });

    // 🚨 Default error
    set.status = error?.status || 500;

    return {
        success: false,
        message: error?.message || "Internal Server Error",
        ...basePayload(request),
    };
}
