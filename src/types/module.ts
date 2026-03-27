export interface CacheOptions {
    /**
     * Nitro cache duration in seconds.
     * @default 3600
     */
    maxAge?: number;
}

export interface ServerOptions {
    /**
     * Route Statamic API requests through Nuxt server routes instead of
     * calling Statamic directly from the client.
     *
     * When enabled, composables like `useStatamicApi` send requests to
     * internal Nuxt server routes (e.g. `/api/_statamic/globals`) which
     * then forward them to your Statamic instance. This keeps the
     * Statamic URL and any auth tokens hidden from the browser.
     *
     * The proxy routes benefit from the cache settings below, but caching
     * also applies to the always-available server routes independently.
     *
     * @default false
     */
    proxy?: boolean;

    /**
     * Cache configuration for server-side Statamic API responses.
     * Controls Nitro's `defineCachedEventHandler` `maxAge` per resource.
     * Set a resource to `false` to disable caching for it entirely.
     */
    cache?: {
        globals?: CacheOptions | false;
        navigations?: CacheOptions | false;
    };
}

export interface ModuleOptions {
    /**
     * Base URL of the Statamic CMS instance.
     * Trailing slashes are stripped automatically.
     * @default process.env.NUXT_PUBLIC_STATAMIC_BASE_URL
     */
    baseUrl?: string;

    /**
     * Custom API route prefix. Change this if you configured a
     * different `STATAMIC_API_ROUTE` on the Statamic side.
     * @see https://statamic.dev/frontend/rest-api#customizing-the-api-url
     * @default '/api'
     */
    apiRoute?: string;

    /**
     * Bearer token for authenticated API access.
     * Stored in **private** runtime config (server-only, never sent to client).
     * @default process.env.NUXT_STATAMIC_API_TOKEN
     */
    apiToken?: string;

    /**
     * Enable i18n-aware site filtering.
     * When true, composables auto-inject the current locale as the `site` param.
     * Requires `@nuxtjs/i18n` to be installed.
     * @default false
     */
    i18n?: boolean;

    /**
     * Enable live preview mode support.
     * When true, preview tokens from `?live-preview` or `?preview=true`
     * are auto-forwarded to API requests.
     * @default true
     */
    preview?: boolean;

    /**
     * Enable debug logging for all API requests.
     * @default false
     */
    debug?: boolean;

    /**
     * Server-side proxy and caching configuration.
     */
    server?: ServerOptions;
}

export interface ModulePublicRuntimeConfig {
    statamic: Partial<ModuleOptions> & {
        /** Resolved API URL (`baseUrl` + `apiRoute`, trailing slash stripped). Set by the module at setup time. */
        apiUrl?: string;
    };
}

export interface ModulePrivateRuntimeConfig {
    statamic: Pick<ModuleOptions, 'apiToken'>;
}

declare module '@nuxt/schema' {
    interface NuxtConfig {
        statamic?: Partial<ModuleOptions>;
    }

    interface NuxtOptions {
        statamic: ModuleOptions;
    }

    interface PublicRuntimeConfig extends ModulePublicRuntimeConfig {}
    interface RuntimeConfig extends ModulePrivateRuntimeConfig {}
}
