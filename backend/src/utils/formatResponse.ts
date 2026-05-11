import { t, type Context } from "elysia";

/* -------------------------------------------------------------------------- */
/*                       DEFAULT RESPONSE UNTUK SWAGGER                       */
/* -------------------------------------------------------------------------- */
const PaginationObject = t.Object({
    total: t.Number(),
    page: t.Number(),
    limit: t.Number(),
    totalPages: t.Number(),
});

const CursorPaginationObject = t.Object({
    prev: t.Union([t.String(), t.Null()]),
    next: t.Union([t.String(), t.Null()]),
    has_next: t.Boolean(),
    has_prev: t.Boolean(),
});

export const defaultResponse = (dataSchema = t.Any(), withPagination = false, withCursor = false) =>{
    
    // 1. Bikin object dasar dulu
    const responseShape: Record<string, any> = {
        success: t.Boolean(),
        message: t.String(),
        data: dataSchema,
    };

    // 2. Kalau butuh pagination, baru kita suntik key-nya
    if (withPagination) {
        responseShape.pagination = PaginationObject;
    }

    if (withCursor) {
        responseShape.cursor = CursorPaginationObject;
    }

    // 3. Return t.Object
    return t.Object(responseShape);
};

/* -------------------------------------------------------------------------- */
/*                           FORMAT RETURN RESPONSE                           */
/* -------------------------------------------------------------------------- */

const response = {
    success(ctx: Context, data: any = null, message = "Success", code = 200, pagination?: PaginationMeta, cursor?: CursorPaginationMeta) {
        ctx.set.status = code;
        // Bikin object return dasar
        const responseBody: any = {
            success: true,
            message,
            data,
        };

        // Kalau ada pagination, selipin ke response
        if (pagination) {
            responseBody.pagination = pagination;
        }

        // Kalau ada cursor pagination, selipin ke response
        if (cursor) {
            responseBody.cursor = cursor;
        }

        return responseBody;
    },

    created(ctx: Context, data: any = null, message = "Created") {
        ctx.set.status = 201;
        return {
            success: true,
            message,
            data,
        };
    },

    badRequest(ctx: Context, message = "Bad request", code = 400) {
        ctx.set.status = code;
        return {
            success: false,
            message,
            data: null,
        };
    },

    serverError(ctx: Context, message = "Internal server error", error?: unknown) {
        console.error("[ServerError]", error);
        ctx.set.status = 500;

        return {
            success: false,
            message,
            data: null,
            error: error instanceof Error ? error.message : null,
        };
    },
};

/* -------------------------------------------------------------------------- */
/*      HANDLE RESPONSE DARI CONTROLLER (SEBELUM DIKEMBALIKAN KE CLIENT)      */
/* -------------------------------------------------------------------------- */

type CrudResult = {
    data?: any;
    message?: string;
    created?: boolean;
    updated?: boolean;
    deleted?: boolean;
    pagination?: PaginationMeta;
    cursor?: CursorPaginationMeta;
};

// 1️⃣ Definisikan Type Pagination (Biar Type Safe)
export type PaginationMeta = {
    total: number;
    page: number;
    limit: number;
    totalPages: number;
};

// 2️⃣ Definisikan Type Cursor Pagination (Biar Type Safe)
export type CursorPaginationMeta = {
    prev: string | null;
    next: string | null;
    has_next: boolean;
    has_prev: boolean;
};

export function formatResponse(ctx: Context, result: CrudResult) {
    if (!result || typeof result !== "object") {
        return response.serverError(ctx, "Invalid service result");
    }

    // CREATE
    if (result.created !== undefined) {
        if (result.created) {
            return response.created(ctx, result.data ?? null, result.message || "Data created");
        }

        return response.success(ctx, null, result.message || "No data created");
    }

    // UPDATE
    if (result.updated !== undefined) {
        return response.success(ctx, result.updated ? result.data ?? null : null, result.message || (result.updated ? "Data updated" : "No data updated"));
    }

    // DELETE
    if (result.deleted !== undefined) {
        return response.success(ctx, result.deleted ? result.data ?? null : null, result.message || (result.deleted ? "Data deleted" : "No data deleted"));
    }

    // GET / GET ALL
    if ("data" in result) {
        return response.success(
            ctx, 
            result.data ?? null, 
            result.message || "Success", 
            200, 
            result.pagination,
            result.cursor
        );
    }

    // FALLBACK
    return response.success(ctx, null, "Success");
}