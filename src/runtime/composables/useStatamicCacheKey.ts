import type { ComputedRef, MaybeRef } from 'vue';
import { computed, toValue } from '#imports';
import { hash } from 'ohash';
import { useStatamicSite } from './useStatamicSite';

/**
 * Generates a deterministic, reactive cache key for `useAsyncData`.
 *
 * **Format:** `statamic:{site?}:{resource}:{identifier}:{contextHash?}`
 *
 * Since the return value is a `ComputedRef`, passing it to `useAsyncData`
 * enables automatic refetching when any input changes (e.g., locale switch).
 *
 * @param resource - The resource type (e.g., `'entries'`, `'global'`, `'nav'`).
 * @param identifier - A unique identifier (e.g., collection handle, entry ID).
 * @param context - Optional context for deduplication (e.g., query params, filters).
 *
 * @example
 * ```ts
 * const { data } = await useAsyncData(
 *   useStatamicCacheKey('entries', 'blogs'),
 *   () => api.entries('blogs'),
 * )
 * ```
 */
export function useStatamicCacheKey(
    resource: string,
    identifier: MaybeRef<string | number>,
    context?: MaybeRef<Record<string, any> | string>,
): ComputedRef<string> {
    const site = useStatamicSite();

    return computed(() => {
        const parts = ['statamic'];

        const siteValue = toValue(site);
        if (siteValue) {
            parts.push(siteValue);
        }

        parts.push(resource);
        parts.push(String(toValue(identifier)));

        const ctx = toValue(context);
        if (ctx && (typeof ctx === 'string' ? ctx : Object.keys(ctx).length > 0)) {
            parts.push(hash(ctx));
        }

        return parts.join(':');
    });
}
