/* -------------------------------------------------------------------------- */
/*                        PostgreSQL Result Formatter                          */
/* -------------------------------------------------------------------------- */

export type RawPgResult<T = any> = {
    rows: T[];
    rowCount: number;
};

export type PaginationInput = {
    total: number;
    page: number;
    limit: number;
};

export type ResultType = "get" | "getAll" | "create" | "update" | "delete";

/* -------------------------------------------------------------------------- */
/*                              Response Types                                 */
/* -------------------------------------------------------------------------- */

type BaseResponse<T> = {
    success: boolean;
    data?: T | T[] | null;
    meta?: any;
};

type PaginationMeta = {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
};

/* -------------------------------------------------------------------------- */
/*                         Internal Normalization                              */
/* -------------------------------------------------------------------------- */

function normalizeResult<T>(input: Partial<RawPgResult<T>>): RawPgResult<T> {
    return {
        rows: input.rows ?? [],
        rowCount: input.rowCount ?? 0,
    };
}

/* -------------------------------------------------------------------------- */
/*                             Helper Functions                                */
/* -------------------------------------------------------------------------- */

function buildPaginationMeta(paging: PaginationInput): PaginationMeta {
    const { page, limit, total } = paging;

    return {
        page,
        limit,
        total,
        totalPages: limit > 0 ? Math.ceil(total / limit) : 0,
    };
}

/* -------------------------------------------------------------------------- */
/*                             Public Formatter                                */
/* -------------------------------------------------------------------------- */

export function formatResult<T = any>(
    raw: RawPgResult<T>,
    type: ResultType = "get",
    paging?: PaginationInput
): BaseResponse<T> {
    const { rows, rowCount } = normalizeResult(raw);

    switch (type) {
        case "get":
            return {
                success: true,
                data: rows[0] ?? null,
            };

        case "getAll":
            return {
                success: true,
                data: rows,
                ...(paging && {
                    meta: buildPaginationMeta(paging),
                }),
            };

        case "create":
            return {
                success: rowCount > 0,
                data: rows[0] ?? null, // works if using RETURNING
                meta: { rowCount },
            };

        case "update":
            return {
                success: rowCount > 0,
                data: rows.length ? rows : null, // use RETURNING if available
                meta: { rowCount },
            };

        case "delete":
            return {
                success: rowCount > 0,
                data: rows.length ? rows : null,
                meta: { rowCount },
            };

        default:
            return {
                success: true,
                data: rows[0] ?? null,
            };
    }
}