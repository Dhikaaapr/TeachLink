import pool from "../config/db.config";
import {
    Pool,
    PoolClient,
    QueryResult,
    QueryResultRow,
} from "pg";

type DBExecutor = Pool | PoolClient;

export type RawPgResult<T = any> = {
    rows: T[];
    rowCount: number;
};

export async function queryDB<T extends QueryResultRow = any>(
    sql: string,
    params: any[] = [],
    executor: DBExecutor = pool
): Promise<RawPgResult<T>> {
    const result: QueryResult<T> = await executor.query<T>(sql, params);

    return {
        rows: result.rows ?? [],
        rowCount: result.rowCount ?? 0, // 🔥 normalize di sini
    };
}