import type { $Fetch } from 'ofetch';
import { useNuxtApp } from '#imports';

/**
 * Returns the configured Statamic `$fetch` instance.
 * Use this for custom endpoints not covered by `useStatamicApi`.
 *
 * @example
 * ```ts
 * const client = useStatamicClient()
 * const data = await client('/custom-addon-endpoint')
 * ```
 */
export function useStatamicClient(): $Fetch {
    return useNuxtApp().$statamic;
}
