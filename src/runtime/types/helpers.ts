// ============================================================
// Helper types and common structures used throughout Statamic types.
// ============================================================

/**
 * Helper type for field values.
 * @template T - The value type
 * @example
 * ```ts
 * type Category = FieldValue<"news" | "blog" | "events">;
 * // Result: "news" | "blog" | "events"
 * ```
 */
export type FieldValue<T extends string | number | null = string | number | null> = T;

/**
 * Helper type for non-nullable field values.
 * @template T - The value type
 * @example
 * ```ts
 * type Category = NonNullableFieldValue<"news" | "blog" | "events">;
 * // Result: "news" | "blog" | "events"
 * ```
 */
export type NonNullableFieldValue<T extends FieldValue = FieldValue> = NonNullable<T>;

/**
 * Helper type for creating objects with a specific structure and additional unknown properties.
 * @template T - The value type
 * @example
 * ```ts
 * type Category = ObjectValue<{ value: string; label: string }>;
 * // Result: { value: string; label: string; [key: string]: any }
 * ```
 */
export type ObjectValue<T extends Record<string, any>> = T & { [key: string]: any };

/**
 * Labeled value structure returned by Statamic for fields that have a value and label.
 * @template T - The value type
 * @example
 * ```ts
 * type Category = LabeledValue<"news" | "blog" | "events">;
 * // Result: {
 * //   value: "news" | "blog" | "events";
 * //   label: string;
 * //   key: "news" | "blog" | "events";
 * // }
 * ```
 */
export type LabeledValue<T extends FieldValue = FieldValue> = {
    value: T;
    label: string | null;
    key: T;
};

/**
 * Titled handle structure returned by Statamic for fields that have a title and handle.
 * @template T - The handle type
 * @example
 * ```ts
 * type Category = TitledHandle<"news" | "blog" | "events">;
 * // Result: {
 * //   title: string;
 * //   handle: "news" | "blog" | "events";
 * // }
 * ```
 */
export type TitledHandle<T extends string = string> = {
    title: string;
    handle: T;
};
