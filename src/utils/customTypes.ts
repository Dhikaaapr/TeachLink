import { t, type Static, type TSchema } from "elysia";
import { TString } from "@sinclair/typebox";

/* -------------------------------------------------------------------------- */
/*                         Upper Case String Schema                            */
/* -------------------------------------------------------------------------- */

// Helper ini ngebungkus t.String biar otomatis Uppercase pas data masuk
export const UpperCaseString = (options?: Partial<TString>) =>
    t
        .Transform(t.String(options))
        .Decode((value) => value.toUpperCase()) // Logic UpperCase disini
        .Encode((value) => value);

/* -------------------------------------------------------------------------- */
/*                     Create Refined Schema                                  */
/* -------------------------------------------------------------------------- */

export const createRefinedSchema = <T extends TSchema>(schema: T, checkFn: (value: Static<T>) => void) => {
    return t
        .Transform(schema)
        .Decode((value) => {
            // Jalankan validasi logic
            checkFn(value);
            // Kalau lolos, return value as is
            return value;
        })
        .Encode((value) => value);
};

/* -------------------------------------------------------------------------- */
/*                              Create Enum                                   */
/* -------------------------------------------------------------------------- */

export function createEnum<T extends string>(values: readonly T[]): TSchema {
    const literals = values.map((v) => t.Literal(v)) as TSchema[];
    return t.Union(literals);
}