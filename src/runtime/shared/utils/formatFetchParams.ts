/**
 * Formats query parameters into the shape expected by the Statamic REST API.
 *
 * - `fields` arrays are joined into a comma-separated string
 * - `filter` objects are flattened into `filter[key]` notation
 * - All other params pass through unchanged
 *
 * @example
 * ```ts
 * formatFetchParams({ fields: ['title', 'slug'], filter: { 'status:is': 'published' }, limit: 10 })
 * // → { fields: 'title,slug', 'filter[status:is]': 'published', limit: 10 }
 * ```
 */
export function formatFetchParams(
    params: Record<string, any> = {},
): Record<string, any> {
    const { fields, filter, ...rest } = params;

    const formatted: Record<string, any> = { ...rest };

    if (fields) {
        formatted.fields = Array.isArray(fields) ? fields.join(',') : fields;
    }

    if (filter && typeof filter === 'object') {
        for (const [key, value] of Object.entries(filter)) {
            formatted[`filter[${key}]`] = value;
        }
    }

    return formatted;
}
