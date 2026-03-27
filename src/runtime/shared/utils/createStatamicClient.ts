import type { $Fetch, FetchOptions } from 'ofetch';
import { useRuntimeConfig } from '#imports';
import { defu } from 'defu';
import * as qs from 'qs-esm';
import { createLogger } from './createLogger';
import { mergeFetchHooks } from './mergeFetchHooks';

/**
 * Creates a configured `$fetch` instance for making requests to the Statamic API.
 *
 * **Features:**
 * - Pre-resolved base URL from runtime config
 * - `Accept: application/json` header
 * - `Authorization: Bearer <token>` when `apiToken` is set (server-only)
 * - Query serialization via `qs-esm` for nested filter objects
 * - Optional debug logging
 * - Caller-provided options merged via `defu` + hook merging
 *
 * Works in both client and server contexts. On the server, the private
 * `apiToken` is automatically included.
 *
 * @param options - Additional fetch options merged with defaults.
 */
export function createStatamicClient(options?: FetchOptions): $Fetch {
    const logger = createLogger();
    const config = useRuntimeConfig();

    const { apiUrl, debug } = config.public.statamic;

    const headers: Record<string, string> = {
        Accept: 'application/json',
    };

    const privateConfig = (config as any).statamic as { apiToken?: string } | undefined;
    if (privateConfig?.apiToken) {
        headers.Authorization = `Bearer ${privateConfig.apiToken}`;
    }

    const defaultOptions: FetchOptions = {
        baseURL: apiUrl,
        headers,
        onRequest({ request, options: reqOptions }) {
            if (debug) {
                const queryStr = qs.stringify(reqOptions.query || {}, { encode: false });
                logger.info(`Fetching ${request}${queryStr ? `?${queryStr}` : ''}`);
            }

            if (reqOptions.query) {
                const serialized = new URLSearchParams(
                    qs.stringify(reqOptions.query, { encode: true }),
                );
                reqOptions.query = Object.fromEntries(serialized);
            }
        },
    };

    return $fetch.create({
        ...defu(options, defaultOptions),
        ...mergeFetchHooks(defaultOptions, options || {}),
    }) as $Fetch;
}
