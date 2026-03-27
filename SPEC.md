# @nobears-front-end/nuxt-statamic — Internal Module Specification

> Comprehensive spec of the internal Nuxt Statamic module (`@nobears-front-end/nuxt-statamic` v1.1.2).
> Use this document to understand all features, APIs, and architecture for building an open-source alternative.
>
> Source: code analysis + [internal documentation](https://docs.nobearshosting.nl/modules/statamic/getting-started/introduction).
> The docs were last updated for v1.1.1; code analysis covers v1.1.2 additions.

---

## Table of Contents

1. [Overview](#1-overview)
2. [Module Configuration](#2-module-configuration)
3. [Module Setup & Lifecycle](#3-module-setup--lifecycle)
4. [Runtime Plugins](#4-runtime-plugins)
5. [Composables](#5-composables)
6. [Server Routes (Nitro)](#6-server-routes-nitro)
7. [Middleware](#7-middleware)
8. [Components & CSS](#8-components--css)
9. [Shared Utilities](#9-shared-utilities)
10. [Type System](#10-type-system)
11. [Error Handling](#11-error-handling)
12. [Feature Flags & Integrations](#12-feature-flags--integrations)
13. [Dependencies](#13-dependencies)
14. [Usage Patterns & Examples](#14-usage-patterns--examples)
15. [Changelog](#15-changelog)

---

## 1. Overview

A Nuxt 4+ module that integrates [Statamic CMS](https://statamic.dev/) into Nuxt projects using custom composables, utilities, and routes. It is the successor to the legacy `@nobears/statamic` module. Requires **Nuxt >= 4.1.0**. It handles:

- **API client** — configured `$fetch` instance with base URL, query serialization, debug logging, and error hooks
- **Data composables** — typed wrappers for entries, collections, navigations, globals, forms, taxonomies, GraphQL, redirects, sitemaps
- **Page composable** — fetch-by-URI pattern with cache keys, preview mode, error handling
- **Server-side caching** — Nitro cached event handlers for globals, navigations, redirects, and sitemap URLs
- **SEO integration** — maps Statamic SEO Pro fields to `useSeoMeta`, `useHead`, `useRobotsRule`, `defineOgImage`
- **i18n integration** — site/locale resolution, URI prefix stripping, i18n route params
- **Redirect middleware** — global route middleware matching Statamic redirect rules (exact + regex)
- **Multi-tenancy** — optional tenant-aware site resolution via a separate multi-tenancy module
- **Sitemap integration** — parses Statamic's XML sitemap and feeds URLs to `@nuxtjs/sitemap`
- **Preview mode** — live preview token forwarding via `usePreviewMode`
- **Component + CSS** — `StatamicBlock` for rendering replicator/bard sets with data attributes + shipped Tailwind CSS layer for responsive block spacing
- **Runtime hooks** — typed error hooks (`nuxt-statamic:error`, `nuxt-statamic:error:api-request`, `nuxt-statamic:error:api-response`)
- **Comprehensive TypeScript types** — 50+ field types, API params/responses, SEO data, sitemap URLs, references
- **Reactive cache keys** — `ComputedRef`-based keys that trigger automatic refetches when params change (leverages Nuxt v3.17+ reactive keys)

---

## 2. Module Configuration

### Config Key

`statamic` on `nuxt.config.ts` (augments `@nuxt/schema`).

### `NuxtStatamicOptions`

```ts
{
  debug?: boolean              // Default: false (or NUXT_DEBUG env)
  baseUrl?: string             // Default: NUXT_PUBLIC_STATAMIC_URL env
  navigations?: NavigationsOptions
  i18n?: boolean               // Default: false
  redirects?: boolean          // Default: false
  seo?: SeoOptions | boolean   // Default: false
  server?: ServerOptions
  multiTenancy?: boolean       // Default: false
}
```

### `NavigationsOptions`

```ts
type NavigationsOptions = Array<SingleNavigationsOption | string>;
type SingleNavigationsOption = { handle: string; fields?: string[] };
```

### `SeoOptions`

```ts
type SeoOptions = {
    sitemap?: { path?: string } | boolean; // Default path: "/sitemap.xml"
    titleTemplate?: string; // Default: "%s"
    ogImageTemplate?: string; // Component name for OG image generation
} | boolean;
```

### `ServerOptions`

```ts
type ServerOptions = {
    api?: {
        globals?: CacheOptions; // Default maxAge: 3600 (1 hour)
        navigations?: CacheOptions; // Default maxAge: 3600 (1 hour)
        redirects?: CacheOptions; // Default maxAge: 86400 (24 hours)
        sitemap?: CacheOptions; // Default maxAge: 86400 (24 hours)
    };
};
type CacheOptions = { maxAge?: number }; // Nitro cache duration in seconds
```

### Runtime Config

Options are merged into `runtimeConfig.public.statamic` via `defu`, making them accessible at runtime through `useRuntimeConfig().public.statamic`.

---

## 3. Module Setup & Lifecycle

### Entry Point: `src/module.ts`

Uses `defineNuxtModule` with:

| Aspect | Detail |
|--------|--------|
| **configKey** | `statamic` |
| **compatibility** | `nuxt >= 4.4.2` |
| **defaults** | Debug off, empty baseUrl, all features disabled, 1h/24h cache defaults |
| **onInstall** | Logs setup message with docs link |
| **moduleDependencies** | `@nuxtjs/i18n >=10` (optional), `@nuxtjs/seo >=3.1.0` (optional), `@nuxtjs/sitemap >=7.4.0` (optional), `@nobears-front-end/nuxt-multi-tenancy` (optional) |
| **hooks** | `devtools:customTabs` — adds NOBEARS docs iframe tab |

### Setup Flow

1. **Merge SEO defaults** — if `seo` is truthy, merge `{ sitemap: { path: "/sitemap.xml" }, titleTemplate: "%s" }`
2. **Create context** — `createStatamicNuxtContext(options)` → logger, resolver, runtimeDir, distDir
3. **Validate options** (`prepareOptions`) — checks env vars, validates module dependencies (i18n requires `@nuxtjs/i18n`, seo requires `@nuxtjs/seo`, etc.)
4. **Register auto-imports** (`prepareAutoImports`) — composables, components, shared utils, server imports, conditional i18n/seo/redirect imports
5. **Add Vite plugin** — optimizes `xml2js` dep
6. **Register runtime plugins** (`prepareRuntime`) — error-handler, statamic, globals, navigations, conditionally redirects
7. **On `modules:done` hook:**
   - Merge runtime config (`prepareRuntimeConfig`)
   - Register server handlers (`setupNitro`) — globals, navigations, conditionally redirects and sitemap

### Context Object (`StatamicNuxtContext`)

```ts
interface StatamicNuxtContext {
    options: Required<ModuleOptions>;
    userOptions: ModuleOptions;
    resolver: Resolver;
    logger: ConsolaInstance; // log level 4 if debug, else 3
    distDir: string;
    runtimeDir: string;
}
```

### Auto-Imports Registration

| What | Condition |
|------|-----------|
| Components dir (`runtime/components`) | Always |
| Root composables (8): `useStatamicApi`, `useStatamicCacheKey`, `useStatamicPage`, `useStatamicPageData`, `useStatamicPageErrorHandler`, `useStatamicPageUri`, `useStatamicPreviewMode`, `useStatamicRuntimeConfig` | Always |
| Template: `useStatamicFetch` (wraps `createUseFetch` with `$api`) | Always |
| `useStatamicSite` OR `useStatamicMultiTenancySite` (aliased as `useStatamicSite`) | Based on `multiTenancy` flag |
| `runtime/utils`, `runtime/shared`, `runtime/shared/utils` | Always (client + server) |
| `composables/i18n/` dir | If `i18n` enabled |
| `composables/seo/` dir | If `seo` enabled |
| Global redirect middleware | If `redirects` enabled |

### Nitro Server Handlers

| Route | Handler | Condition |
|-------|---------|-----------|
| `GET /api/globals` | `server/api/globals/index.get` | Always |
| `GET /api/globals/:handle` | `server/api/globals/[handle].get` | Always |
| `GET /api/navs/:nav/tree` | `server/api/navs/[nav]/tree.get` | Always |
| `GET /api/redirects` | `server/api/redirects/index.get` | If `redirects` enabled |
| `GET /api/sitemap/urls` | `server/api/sitemap/urls.get` | If `seo.sitemap` enabled |
| Nitro plugin: sitemap source | `server/plugins/sitemap` | If `seo.sitemap` enabled |

---

## 4. Runtime Plugins

All plugins use the named/ordered plugin system (`dependsOn`, `parallel`).

### 4.1 `error-handler` (runs first)

- **Name:** `nuxt-statamic:error-handler`
- **Provides:** `$logger` (consola instance tagged `nuxt-statamic`)
- **Hooks:**
  - `nuxt-statamic:error` → logs status code + name + message
  - `nuxt-statamic:error:api-request` → logs fetch request errors
  - `nuxt-statamic:error:api-response` → logs response errors with decoded URL

### 4.2 `statamic` (main API plugin)

- **Name:** `nuxt-statamic:plugin`
- **Depends on:** `nuxt-statamic:error-handler`
- **Provides:** `$api` — a `$fetch` instance from `createFetchInstance` with error hooks that call `nuxt-statamic:error:api-request` and `nuxt-statamic:error:api-response`
- **Augments `NuxtApp`** with `$api` and `$logger` types

### 4.3 `globals`

- **Name:** `nuxt-statamic:globals`
- **Depends on:** `nuxt-statamic:plugin`
- **Parallel:** true
- **Behavior:** Fetches all globals via `useStatamicApi().globals()`, stores in `useState("globals")`, uses `useAsyncData` with cache key

### 4.4 `navigations`

- **Name:** `nuxt-statamic:navigations`
- **Depends on:** `nuxt-statamic:plugin`
- **Parallel:** true
- **Behavior:** Fetches all configured navigations via `useStatamicApi().navigations()`, stores in `useState("navigations")`, uses `useAsyncData` with cache key

### 4.5 `redirects` (conditional)

- **Name:** `nuxt-statamic:redirects`
- **Depends on:** `nuxt-statamic:plugin`
- **Parallel:** true
- **Condition:** Only registered if `options.redirects` is true
- **Behavior:** Fetches redirects via `useStatamicApi().redirects()`, cached via `useAsyncData`

---

## 5. Composables

### 5.1 `useStatamicApi()`

The central API composable. Returns an object with methods for all Statamic REST endpoints.

**Dependencies:** `$api` from NuxtApp, `useStatamicSite`, `useStatamicRuntimeConfig`, `useStatamicPreviewMode`

**Shared behavior:**
- All requests auto-include site filter (from i18n locale)
- All requests auto-include live preview token when preview mode is active
- Query params are formatted via `formatFetchParams` (fields → comma string, filter → `filter[key]` notation)
- Options merged with `defu`
- Response hooks merged via `mergeFetchHooks`

**Returned methods:**

| Method | Signature | Statamic Endpoint | Notes |
|--------|-----------|-------------------|-------|
| `entries` | `(collection, params?, fetchOptions?) → Promise<ResponseMultiple<T>>` | `GET /api/collections/{collection}/entries` | Auto-adds site filter |
| `entry` | `(collection, entryId, params?, fetchOptions?) → Promise<ResponseSingle<T>>` | `GET /api/collections/{collection}/entries/{id}` | Unwraps `.data` |
| `entryByUri` | `(params, fetchOptions?) → Promise<ResponseSingle<T>>` | `GET /api/entries-by-uri` | Custom endpoint, unwraps `.data` |
| `collection` | `(handle, params?, fetchOptions?) → Promise<ResponseTree<T>>` | `GET /api/collections/{handle}/tree` | Tree structure |
| `navigations` | `(params?, fetchOptions?) → Promise<Record<string, any>>` | Multiple nav calls | Fetches all configured navs in parallel, returns keyed object |
| `navigation` | `(handle, params?, fetchOptions?) → Promise<ResponseTree<T>>` | `GET /api/navs/{handle}/tree` | Routes through server cache (baseURL="") |
| `globals` | `(params?, fetchOptions?) → Promise<Record<string, any>>` | `GET /api/globals` | Routes through server cache, transforms to `{handle: data}` |
| `global` | `(handle, params?, fetchOptions?) → Promise<ResponseSingle<T>>` | `GET /api/globals/{handle}` | Routes through server cache |
| `forms` | `(fetchOptions?) → Promise<Record<string, any>>` | `GET /api/forms` | Unwraps `.data` |
| `form` | `(handle, fetchOptions?) → Promise<Record<string, any>>` | `GET /api/forms/{handle}` | Unwraps `.data` |
| `submitForm` | `(handle, data, fetchOptions?) → Promise<Record<string, any>>` | `POST /!/forms/{handle}` | POST with body |
| `taxonomyTerms` | `(taxonomy, params?, fetchOptions?) → Promise<ResponseSingle<T>[]>` | `GET /api/taxonomies/{taxonomy}/terms` | Auto-adds site filter |
| `taxonomyTerm` | `(taxonomy, slug, params?, fetchOptions?) → Promise<ResponseSingle<T>>` | `GET /api/taxonomies/{taxonomy}/terms/{slug}` | Auto-adds site filter |
| `graphql` | `(query, fetchOptions?) → Promise<Record<string, any>>` | `POST /graphql` | Wraps query in `query { ... }` |
| `redirects` | `(params?, fetchOptions?) → Promise<ResponseRedirects>` | `GET /api/redirects` | Routes through server cache |
| `sitemapUrls` | `(fetchOptions?) → Promise<SitemapUrl[]>` | `GET /api/sitemap/urls` | Routes through server cache |

**Server-cached routes:** `navigations`, `globals`, `global`, `redirects`, and `sitemapUrls` set `baseURL: ""` to route through the Nuxt server's cached handlers instead of hitting Statamic directly from the client. To force **client-side** requests (bypassing server cache), callers can provide a `baseURL` in `fetchOptions`:

```ts
api.navigation('header', {}, { baseURL: config.public.statamic.baseUrl });
```

### 5.2 `useStatamicPage<T>(options?)`

Fetches a page entry by URI using `useAsyncData`.

```ts
function useStatamicPage<T>(options?: {
    uri?: MaybeRefOrGetter<string>;
    params?: Partial<Omit<StatamicApiParamsUri<T>, 'uri'>>;
    fetchOptions?: Omit<FetchOptions, 'params'>;
    asyncDataOptions?: AsyncDataOptions<T>;
}): AsyncData<T, NuxtError>;
```

**Behavior:**
- Resolves URI via `useStatamicPageUri` (handles i18n prefix stripping)
- Generates cache key via `useStatamicCacheKey("page", uri, params, { fetchOptions, asyncDataOptions })`
- Calls `api.entryByUri` under the hood
- On empty response → throws fatal 404 error with `PAGE_NOT_FOUND` name
- Stores result in `useState("page")`

### 5.3 `useStatamicPageData<T>(options?)`

Read-only accessor for cached page data (no fetch). Uses `useNuxtData` with the same cache key as `useStatamicPage`.

```ts
function useStatamicPageData<T>(options?): Ref<T | undefined>;
```

### 5.4 `useStatamicPageUri(uri?)`

Generates a computed URI ref from the current route, stripping i18n locale prefix if enabled.

```ts
function useStatamicPageUri(uri?: MaybeRefOrGetter<string>): ComputedRef<string>;
```

**Behavior:**
- If `i18n` disabled → returns `uri || route.path`
- If `i18n` enabled → strips locale prefix (e.g., `/nl/about` → `/about`) via regex

### 5.5 `useStatamicPageErrorHandler(requestError)`

Watches for errors and triggers the `nuxt-statamic:error` hook before throwing.

```ts
function useStatamicPageErrorHandler(requestError: MaybeRefOrGetter<NuxtError | undefined>): void;
```

### 5.6 `useStatamicCacheKey(resource, identifier, context?, dataFetchOptions?)`

Generates deterministic, reactive cache keys for `useAsyncData`/`useNuxtData`.

```ts
function useStatamicCacheKey(
  resource: StatamicApiResourceType,
  identifier: MaybeRef<string | number>,
  context?: MaybeRef<Record<string, any> | string>,
  dataFetchOptions?: MaybeRef<...>
): ComputedRef<string>
```

**Format:** `{site}:{resource}:{identifier}::{contextHash}:{optionsHash}`

- Uses `ohash` for deterministic hashing of context and options objects.
- Returns a `ComputedRef<string>` — since Nuxt v3.17 introduced reactive keys, passing this directly to `useAsyncData` will **automatically refetch** data whenever any input parameter changes (locale switch, filter change, etc.).
- The `{site}` prefix comes from `useStatamicSite()` (locale or tenant+locale).
- Cached data can be retrieved elsewhere via `useNuxtData(useStatamicCacheKey(...))`.
- The globals, navigations, and redirects plugins use this to auto-refresh data on locale/site change.

### 5.7 `useStatamicPreviewMode()`

Wraps Nuxt's `usePreviewMode` with Statamic-specific detection.

```ts
function useStatamicPreviewMode(): ReturnType<typeof usePreviewMode>;
```

**Enables when:** `?live-preview` or `?preview=true` query params are present.

### 5.8 `useStatamicSite()`

Returns the current Statamic site identifier from i18n locale.

```ts
function useStatamicSite(): ComputedRef<string | undefined>;
```

**Behavior:**
- If `i18n` disabled → returns `undefined`
- If `i18n` enabled → returns `localeProperties.language ?? localeProperties.code`

### 5.9 `useStatamicMultiTenancySite()` (multi-tenancy variant)

Tenant-aware site resolution. Replaces `useStatamicSite` when `multiTenancy` is enabled.

```ts
function useStatamicMultiTenancySite(): ComputedRef<string | undefined>;
```

**Behavior:** Uses `useSiteConfig().tenant.site[language ?? code]` to resolve the site for the current tenant + locale.

### 5.10 `useStatamicRuntimeConfig(event?)`

Typed accessor for `runtimeConfig.public.statamic`.

```ts
function useStatamicRuntimeConfig(event?: H3Event): Required<ModuleOptions>;
```

Works in both client and server contexts (passes event for server-side `useRuntimeConfig`).

### 5.11 `useStatamicFetch` (generated template)

A `createUseFetch` wrapper pre-configured with the `$api` instance.

```ts
const useStatamicFetch = createUseFetch(() => ({
    $fetch: useNuxtApp().$api as typeof globalThis.$fetch,
}));
```

Supports all `useFetch` options but always uses the Statamic `$fetch` instance.

### 5.12 `useStatamicI18n()`

Simple wrapper returning `useNuxtApp().$i18n` (the i18n Composer object).

### 5.13 `useStatamicI18nParams(slugs)`

Sets i18n route params for all locales based on Statamic slug data.

```ts
function useStatamicI18nParams(slugs: Record<string, string>): { params: Record<string, any> };
```

**Behavior:**
- Extracts dynamic route segments from matched route pattern
- Maps each locale's slug to the corresponding param names
- Handles both regular dynamic routes (`:slug`) and catch-all routes (`[...slug]`)
- Calls `useSetI18nParams` to apply

### 5.14 `useStatamicSeo(pageData, options?)`

Maps Statamic SEO Pro fields to Nuxt SEO meta.

```ts
function useStatamicSeo(
    pageData: Ref<(Record<string, any> & Partial<StatamicSeoData>) | undefined>,
    options?: { titleTemplate?: string; ogImageTemplate?: string },
): void;
```

**Maps the following:**

| Statamic Field | Nuxt Integration |
|----------------|------------------|
| `seo_title` | `useSeoMeta({ title })` |
| `seo_description` | `useSeoMeta({ description })` |
| `seo_og_title/description/image` | `useSeoMeta({ ogTitle, ogDescription, ogImage })` |
| `seo_twitter_*` | `useSeoMeta({ twitterTitle, twitterDescription, twitterCard, twitterImage })` |
| `seo_canonical_custom/entry/type` | `useHead({ link: [{ rel: "canonical" }] })` |
| `seo_json_ld` | `useHead({ script: [{ type: "application/ld+json" }] })` |
| `seo_noindex/nofollow` | `useRobotsRule({ noindex, nofollow })` |
| `seo_og_image` + `ogImageTemplate` | `defineOgImageComponent()` / `defineOgImage()` |
| `titleTemplate` from options | `useSeoMeta({ titleTemplate })` |

---

## 6. Server Routes (Nitro)

All server handlers use `defineCachedEventHandler` with configurable `maxAge` from runtime config. All use `varies: ["host", "x-forwarded-host"]` for multi-host caching.

### 6.1 `GET /api/globals`

- **Cache name:** `statamic-globals`
- **Default maxAge:** 3600 (1 hour)
- **Statamic call:** `GET {baseUrl}/api/globals`
- **Response:** `{ data: Record<string, any> }`
- **Query passthrough:** Yes (entire query forwarded)

### 6.2 `GET /api/globals/:handle`

- **Cache name:** `statamic-global`
- **Default maxAge:** 3600 (1 hour)
- **Statamic call:** `GET {baseUrl}/api/globals/{handle}`
- **Response:** `{ data: Record<string, any> }`

### 6.3 `GET /api/navs/:nav/tree`

- **Cache name:** `statamic-navigation`
- **Default maxAge:** 3600 (1 hour)
- **Statamic call:** `GET {baseUrl}/api/navs/{nav}/tree`
- **Response:** `{ data: StatamicApiResponseTree }`

### 6.4 `GET /api/redirects` (conditional)

- **Cache name:** `statamic-redirects`
- **Default maxAge:** 86400 (24 hours)
- **Statamic call:** `GET {baseUrl}/api/redirects`
- **Response processing:**
  1. Fetches all redirects (paginated with max safe integer)
  2. Filters by site (if `?site` query param provided)
  3. Filters to enabled-only
  4. Filters to those with both source and destination
  5. Maps to `{ source, destination, type, match_type, site }`

### 6.5 `GET /api/sitemap/urls` (conditional)

- **Cache name:** `statamic-sitemap-urls`
- **Default maxAge:** 86400 (24 hours)
- **Statamic call:** Fetches the Statamic sitemap XML from `seo.sitemap.path` (default `/sitemap.xml`)
- **Response processing:**
  1. Parses XML with `xml2js`
  2. Recursively resolves sitemap index files
  3. Returns array of `{ loc, lastmod, _sitemap }` objects
  4. If i18n enabled, determines `_sitemap` value per URL based on locale matching

**i18n sitemap requirement:** For correct multi-locale sitemap generation, `i18n.locales` objects must include a `site` key matching the Statamic site handle. Each site should have its own sitemap generated in Statamic:

```ts
// nuxt.config.ts
i18n: {
  locales: [{
    code: 'nl-NL',
    site: 'tenant-nl-NL', // must match the Statamic site handle
  }],
}
```

### 6.6 Nitro Plugin: `sitemap`

Hooks into `sitemap:sources` to register `/api/sitemap/urls` as a source for `@nuxtjs/sitemap` module.

---

## 7. Middleware

### `redirects` (global route middleware, conditional)

- **Condition:** Registered when `options.redirects` is true
- **Behavior:**
  1. Gets cached redirects from `useNuxtData`
  2. Matches current path (without trailing slash, decoded) against redirect rules
  3. Supports exact match and regex match types
  4. Guards against circular redirects
  5. Navigates to destination with appropriate status code (301, 302, etc.)
  6. Handles external URLs

---

## 8. Components & CSS

### `StatamicBlock`

A generic wrapper component for Statamic replicator/bard sets. Uses the `Primitive` component from `@nobears-front-end/utils` for polymorphic rendering.

**Props:**

```ts
type StatamicBlockProps<T, O = Partial<StatamicBlockOptions>> = {
    block: { id: TextField; type: NonNullable<TextField> } & O & T;
    as?: AsTag | Component; // Default: "section"
    asChild?: boolean; // Reka UI primitive pattern
    [key: string]: any; // v1.1.2: dynamic additional props
};
```

**Default block options (from Statamic starter kit):**

| Option | Type | Data Attribute |
|--------|------|---------------|
| `background_color` | `SelectFieldSingle<string>` | `data-background-color` |
| `padding_bottom` | `ButtonGroupField<"none" \| "small" \| "medium" \| "large">` | `data-spacing-bottom` |
| `padding_top` | `ButtonGroupField<"none" \| "small" \| "medium" \| "large">` | `data-spacing-top` |
| `anchor` | `TextField` | Overrides `id` if present |

**Note:** Block options are optional as of v1.1.2.

**Renders as:** `<Primitive>` with `as`, `asChild` support, data attributes, and slot for children.

**Intended usage pattern:** Blocks are not rendered directly. Instead, pages loop over `data.blocks` and resolve each block type to a globally-registered component:

```vue
<component
  :is="resolveComponent(useChangeCase(block.type, 'pascalCase'))"
  v-for="block in data?.blocks"
  :key="block.id"
  :block="block"
/>
```

This requires global component registration in `nuxt.config.ts`:

```ts
export default defineNuxtConfig({
    components: [
        { path: '~/components/blocks', global: true },
        '~/components',
    ],
});
```

**Building custom blocks:** Each block component uses `StatamicBlockProps` and wraps content in `<StatamicBlock>`:

```vue
<script lang="ts">
import type { StatamicBlockProps, TextField } from '@nobears-front-end/nuxt-statamic';

export type TextImageProps = StatamicBlockProps<{ title: TextField }>;
</script>

<script setup lang="ts">
defineProps<TextImageProps>();
</script>

<template>
    <StatamicBlock :block>
    <!-- Content here -->
    </StatamicBlock>
</template>
```

### CSS / Tailwind Integration

The module ships a CSS file that must be imported in the app's stylesheet:

```css
@import "tailwindcss";
@import "@nobears-front-end/nuxt-statamic";
```

This provides a `@layer components` with responsive spacing for `StatamicBlock` via `[data-spacing-top]` and `[data-spacing-bottom]` selectors.

**CSS Variables (default spacing):**

| CSS Variable | Value |
|-------------|-------|
| `--spacing-statamic-block-none` | `--spacing(0)` |
| `--spacing-statamic-block-small` | `--spacing(6)` |
| `--spacing-statamic-block-small--sm` | `--spacing(10)` |
| `--spacing-statamic-block-small--md` | `--spacing(12)` |
| `--spacing-statamic-block-medium` | `--spacing(12)` |
| `--spacing-statamic-block-medium--sm` | `--spacing(20)` |
| `--spacing-statamic-block-medium--md` | `--spacing(24)` |
| `--spacing-statamic-block-large` | `--spacing(24)` |
| `--spacing-statamic-block-large--sm` | `--spacing(40)` |
| `--spacing-statamic-block-large--md` | `--spacing(48)` |

**Variable pattern:** `--spacing-statamic-block-{spacing}` and `--spacing-statamic-block-{spacing}--{breakpoint}`

**Custom spacings** can be added by defining new CSS variables and `@layer components` rules:

```css
@theme default inline {
  --spacing-statamic-block-extra-large: --spacing(48);
  --spacing-statamic-block-extra-large--sm: --spacing(64);
  --spacing-statamic-block-extra-large--md: --spacing(80);
}
@layer components {
  [data-spacing-top="extra-large"] {
    @apply pt-statamic-block-extra-large sm:pt-statamic-block-extra-large--sm md:pt-statamic-block-extra-large--md;
  }
}
```

**Custom background colors** use `[data-background-color]` attribute selectors:

```css
@layer components {
  [data-background-color="primary"] { @apply bg-primary; }
}
```

---

## 9. Shared Utilities

### 9.1 `createFetchInstance(options?)`

Creates a configured `$fetch` instance for the Statamic API.

**Features:**
- Base URL from `runtimeConfig.public.statamic.baseUrl` (trailing slash removed)
- `Accept: application/json` header
- Query serialization via `qs-esm` (handles nested objects, array notation)
- Debug logging via consola when `statamic.debug` is true
- Hook merging via `mergeFetchHooks`
- Options merged via `defu`

### 9.2 `formatFetchParams(params)`

Transforms Statamic API query params:
- `fields: ["title", "content"]` → `fields: "title,content"`
- `filter: { status: "published" }` → `"filter[status]": "published"`
- All other params pass through unchanged

### 9.3 `mergeFetchHooks(...hooks)`

Merges multiple `ofetch` hook objects into one. Each hook slot (`onRequest`, `onResponse`, `onRequestError`, `onResponseError`) becomes an array of callbacks. Empty arrays are filtered out to avoid overwriting defaults.

### 9.4 `createLogger(name, options?)`

Factory for a tagged consola instance with white-bright coloring.

---

## 10. Type System

### 10.1 Helper Types (`runtime/types/helpers.ts`)

| Type | Description |
|------|-------------|
| `FieldValue<T>` | Base scalar type: `string \| number \| null` |
| `NonNullableFieldValue<T>` | Non-nullable variant |
| `ObjectValue<T>` | Object with index signature for extra Statamic keys |
| `LabeledValue<T>` | `{ value, label, key }` — select/button group shape |
| `TitledHandle<T>` | `{ title, handle }` — collections, navs, etc. |

### 10.2 Reference Types (`runtime/types/references.ts`)

| Type | Description |
|------|-------------|
| `CodeLanguage` | String union of supported code editor modes |
| `AssetReference` | `{ alt, height, id, permalink, width }` |
| `EntryReference<T>` | Entry stub with `id, title, slug, uri, api_url, collection, slugs?` |
| `FormReference<T>` | `{ handle, title, api_url }` |
| `SiteReference<T>` | Multi-site metadata with `attributes: T \| []` |
| `TaxonomyReference<T>` | URLs + TitledHandle |
| `TermReference` | `{ id, slug, url, permalink }` |
| `UserGroupReference<T>` | TitledHandle + roles |
| `UserReference` | `{ id, name, email, api_url }` |

### 10.3 Field Types (`runtime/types/fields.ts` — 1079 lines, 50+ types)

Maps every Statamic fieldtype to a TypeScript type. Key categories:

**Text/Rich Text:**
`BardField`, `BardFieldSet`, `CodeField`, `TextField`, `TextAreaField`

**Controls:**
`ButtonGroupField`, `CheckboxesField`, `DictionaryField`, `RadioField`, `RangeField`, `RevealerField`, `SelectField`, `SelectFieldSingle`, `ToggleField`, `WidthField`

**Media:**
`AssetField`, `AssetsField`, `IconField`, `VideoField`

**Numbers:**
`FloatField`, `IntegerField`

**Relationships:**
`CollectionsField`, `EntriesField`, `EntriesFieldSingle`, `FormField`, `LinkField`, `NavsField`, `SitesField`, `StructuresField`, `TaxonomiesField`, `TaxonomiesFieldSingle`, `TermsField`, `TermsFieldSingle`, `UserGroupsField`, `UserRolesField`, `UsersField`

**Structured:**
`ArrayField`, `GridField`, `GroupField`, `ListField`, `ReplicatorField`, `ReplicatorFieldSet`, `TableField`, `TaggableField`

**Special:**
`AdvancedSEOField`, `ColorField`, `DateField`, `HiddenField`, `HTMLField`, `SectionField`, `SlugField`, `SpacerField`, `TemplateField`, `TimeField`, `YamlField`

### 10.4 API Types (`runtime/types/api.ts` — 470 lines)

**Resource types:** `StatamicApiResourceType` — union of known endpoints + `string & {}` for extension

**Filter conditions:** `STATAMIC_STRING_CONDITIONS` — const object with 30+ filter operators (is, not, contains, starts_with, gt, gte, lt, lte, matches, regex, etc.)

**Request params:**

| Type | For |
|------|-----|
| `StatamicApiParamsBase<T>` | Base: fields, filter, sort, limit (default 25), page (default 1), site, token |
| `StatamicApiParamsSingle<T>` | Single resource (fewer filters) |
| `StatamicApiParamsMultiple<T>` | List with pagination |
| `StatamicApiParamsTree<T>` | Tree: fields, site, max_depth |
| `StatamicApiParamsUri<T>` | URI fetch: uri + partial base |
| `StatamicApiFormattedParams` | Flat query object after formatting |
| `StatamicApiFieldOrCondition<T>` | `keyof T \| \`${keyof T}:${condition}\`` |

**Response types:**

| Type | Shape |
|------|-------|
| `StatamicApiResponseSingle<T>` | Raw entry/object |
| `StatamicApiResponseMultiple<T>` | `{ data, links: { prev, next }, meta: { current_page, from, last_page, ... } }` |
| `StatamicApiResponseTree<T>` | `StatamicApiTreeNode<T>` root |
| `StatamicApiTreeNode<T>` | `{ page, depth, children[] }` |
| `StatamicApiRedirect` | Full redirect row |
| `StatamicApiResponseRedirects` | `StatamicApiRedirect[]` |
| `StatamicApiFilteredRedirects` | Subset: source, destination, type, match_type, site |
| `StatamicServerApiResponseGlobals` | `{ data: Record<string, any> }` |
| `StatamicServerApiResponseTree<T>` | `{ data: StatamicApiResponseTree<T> }` |

**Default entry fields:** `StatamicApiEntryDefaultFieldsKeys` — union of 30+ field names including core fields (id, title, slug, uri, etc.), SEO fields, and i18n `slugs`.

**API parameter details (from docs):**

| Parameter | Type | Description |
|-----------|------|-------------|
| `fields` | `string[]` | Top-level fields to include in response |
| `filter` | `Record<string, any>` | Filter using `{field}:{condition}` pattern (e.g., `"title:contains": "awesome"`) |
| `sort` | `string` | Sort by field(s); prefix with `-` for descending; comma-separated for multiple (e.g., `"-date,title"`) |
| `limit` | `number` | Results per page (default: 25) |
| `page` | `number` | Page number (default: 1) |
| `site` | `string` | Site handle (auto-set by `useStatamicSite()`) |
| `token` | `string` | Live preview token (auto-set by `useStatamicPreviewMode()`) |
| `max_depth` | `number` | Max nesting depth for tree endpoints |
| `uri` | `string` | URI for entry-by-URI lookups |

### 10.5 SEO Types (`runtime/types/seo.ts`)

| Type | Description |
|------|-------------|
| `StatamicSeoObjectType` | `{ value, label, key }` |
| `StatamicSeoJsonLd` | `{ value, code, mode }` |
| `StatamicSeoImage` | Full asset-like shape (50+ properties) |
| `StatamicSeoData` | Complete SEO Pro field set (20 fields) |

### 10.6 Sitemap Types (`runtime/types/sitemap.ts`)

| Type | Description |
|------|-------------|
| `StatamicSitemapChangefreq` | `always \| hourly \| daily \| weekly \| monthly \| yearly \| never` |
| `StatamicSitemapUrl` | `{ loc, lastmod?, changefreq?, priority?, alternatives?, _i18nTransform?, _sitemap? }` |
| `StatamicSitemapAlternativeEntry` | `{ hreflang, href }` |

### 10.7 Module Types (`types/module.ts`)

All option types documented in [Section 2](#2-module-configuration). Also augments `@nuxt/schema` for `NuxtConfig.statamic` and `PublicRuntimeConfig.statamic`.

### 10.8 Hook Types (`types/hooks.ts`)

| Type | Description |
|------|-------------|
| `NuxtStatamicError` | `Partial<NuxtError>` + optional `data.name` |
| `NuxtStatamicApiRequestError` | `FetchError` with required `error: Error` |
| `NuxtStatamicApiResponseError` | `FetchError` marker |
| `ModuleRuntimeHooks` | Three hooks: `nuxt-statamic:error`, `nuxt-statamic:error:api-request`, `nuxt-statamic:error:api-response` |

Augments `#app` `RuntimeNuxtHooks`.

---

## 11. Error Handling

### Architecture

```
Error occurs in $fetch
  → onRequestError / onResponseError (in statamic plugin)
    → callHook("nuxt-statamic:error:api-request" / "nuxt-statamic:error:api-response")
      → error-handler plugin logs the error with context

useStatamicApi() initialized without $api
  → callHook("nuxt-statamic:error") with USE_STATAMIC_API_NOT_AVAILABLE
  → throws createError(500)

useStatamicPage() gets empty response
  → throws createError(404) with PAGE_NOT_FOUND

useStatamicPageErrorHandler() watches for errors
  → callHook("nuxt-statamic:error")
  → throws createError(requestError)

useStatamicSeo() gets no pageData
  → callHook("nuxt-statamic:error") with PAGE_DATA_NOT_AVAILABLE
```

### Error Names (data.name)

- `USE_STATAMIC_API_NOT_AVAILABLE` — API composable used before plugin init
- `PAGE_NOT_FOUND` — Page entry not found for URI
- `PAGE_DATA_NOT_AVAILABLE` — SEO composable called without page data
- `FetchRequestError` — Network/request error
- `FetchResponseError` — Non-2xx response

---

## 12. Feature Flags & Integrations

| Feature | Config | Required Module | What It Enables |
|---------|--------|-----------------|-----------------|
| **i18n** | `statamic.i18n: true` | `@nuxtjs/i18n >=10` | Locale-aware site resolution, URI prefix stripping, i18n params composable, i18n composables auto-import |
| **SEO** | `statamic.seo: true \| {...}` | `@nuxtjs/seo >=3.1.0` | SEO composable auto-import, title template, OG image template |
| **Sitemap** | `statamic.seo.sitemap: true \| {...}` | `@nuxtjs/seo` or `@nuxtjs/sitemap >=7.4.0` | XML sitemap parsing server route, Nitro sitemap source plugin |
| **Redirects** | `statamic.redirects: true` | None | Redirects server route, redirects plugin, global route middleware |
| **Multi-tenancy** | `statamic.multiTenancy: true` | `@nobears-front-end/nuxt-multi-tenancy` | Tenant-aware site resolution (replaces `useStatamicSite`) |
| **Debug** | `statamic.debug: true` | None | Verbose fetch logging via consola |

---

## 13. Dependencies

### Runtime

| Package | Usage |
|---------|-------|
| `@nuxt/kit` | Module definition, auto-imports, server handlers |
| `consola` | Logging |
| `defu` | Deep defaults merging |
| `ofetch` | HTTP client (fetch hooks types) |
| `ohash` | Cache key hashing |
| `pathe` | Path utilities |
| `qs-esm` | Query string serialization (nested objects) |
| `ufo` | URL utilities (trailing slash, resolve) |
| `xml2js` | Sitemap XML parsing |
| `@nobears-front-end/utils` | Logger factory, `mergeFetchHooks`, `Primitive` component, `AsTag` type |

### Dev / Peer (notable)

| Package | Role |
|---------|------|
| `@nuxtjs/i18n` | Optional peer for i18n features |
| `@nuxtjs/seo` | Optional peer for SEO features |
| `@nuxtjs/sitemap` | Optional peer for sitemap features |
| `@nobears-front-end/nuxt-multi-tenancy` | Optional peer for multi-tenancy |
| `vitest` | Testing |
| `@nuxt/test-utils` | E2E testing |

---

## Architecture Diagram

```
nuxt.config.ts
  └─ statamic: { baseUrl, i18n, seo, redirects, ... }

Module Setup (src/module.ts)
  ├─ prepareOptions        → validate config + module deps
  ├─ prepareAutoImports    → register composables, components, utils, middleware
  ├─ prepareRuntime        → register 4-5 plugins
  ├─ prepareRuntimeConfig  → merge into public.statamic
  └─ setupNitro            → register 3-5 server handlers

Plugins (client + SSR)
  ├─ error-handler         → provides $logger, hooks for errors
  ├─ statamic              → provides $api (createFetchInstance)
  ├─ globals               → fetches globals into useState
  ├─ navigations           → fetches navs into useState
  └─ redirects?            → fetches redirects into useAsyncData

Server Routes (Nitro, cached)
  ├─ /api/globals          → proxy + cache Statamic globals
  ├─ /api/globals/:handle  → proxy + cache specific global
  ├─ /api/navs/:nav/tree   → proxy + cache nav tree
  ├─ /api/redirects?       → fetch + filter + cache redirects
  ├─ /api/sitemap/urls?    → parse XML + cache sitemap URLs
  └─ sitemap plugin?       → register source with @nuxtjs/sitemap

Composables
  ├─ useStatamicApi()      → all API methods
  ├─ useStatamicPage()     → fetch page by URI
  ├─ useStatamicPageData() → read cached page data
  ├─ useStatamicSeo()      → map SEO fields to meta
  ├─ useStatamicSite()     → current locale/site
  └─ ... (12+ total)

Components
  └─ StatamicBlock         → replicator set wrapper

Middleware
  └─ redirects?            → global redirect matching
```

---

## 14. Usage Patterns & Examples

This section documents the recommended usage patterns from the internal documentation.

### Installation

```bash
pnpm add @nobears-front-end/nuxt-statamic
```

Requires `.env`:

```dotenv
NUXT_PUBLIC_STATAMIC_URL="https://your-statamic-api-url.com"
```

### When to Use Which Data Fetching Method

| Method | Use Case |
|--------|----------|
| `$api` | Server-side requests or early lifecycle hooks; raw `$fetch` access to Statamic endpoints not covered by composables |
| `useStatamicApi()` | Almost always; provides typed methods for entries, globals, navigations, forms, taxonomies, etc. |
| `useStatamicFetch()` | When you need `useFetch`-style reactivity for Statamic endpoints not covered by `useStatamicApi` (e.g., custom endpoints like `/tenants`) |
| `useStatamicPage()` | Fetching the current page entry based on the current route URI |

### Typical Page Pattern

```vue
<script setup lang="ts">
// Fetch page data
const { data, error } = await useStatamicPage();
useStatamicPageErrorHandler(error);

// SEO (if seo option enabled)
useStatamicSeo(data);

// i18n params (if i18n option enabled)
useStatamicI18nParams(data.value?.slugs);
</script>

<template>
    <component
        :is="resolveComponent(useChangeCase(block.type, 'pascalCase'))"
        v-for="block in data?.blocks"
        :key="block.id"
        :block="block"
    />
</template>
```

### Collection Entries Pattern

```vue
<script setup lang="ts">
const api = useStatamicApi();
const { data: blogs } = await useAsyncData(
    useStatamicCacheKey('entries', 'blogs'),
    () => api.entries('blogs'),
);
</script>
```

### Filtering Pattern

```ts
const { data } = await useAsyncData(
    useStatamicCacheKey('entries', 'blogs', { filter: { 'title:contains': 'awesome' } }),
    () => api.entries('blogs', {
        filter: { 'title:contains': 'awesome', 'featured': true },
        fields: ['title', 'slug', 'content'],
        sort: '-date',
        limit: 10,
    }),
);
```

### Server-Side Custom Fetch

```ts
// server/api/tenants.ts
export default defineCachedEventHandler(async (event: H3Event) => {
    const api = createFetchInstance();
    const data = await api('/api/tenants');
    return data;
});
```

### Accessing Globals & Navigations

Globals and navigations are auto-fetched by plugins and stored in `useState`:

```vue
<script setup lang="ts">
const globals = useState('globals');
const navigations = useState('navigations');
</script>
```

### Accessing `$api` Directly

```vue
<script setup lang="ts">
const { $api } = useNuxtApp();
const data = await $api('/api/custom-endpoint');
</script>
```

### Custom useStatamicFetch Usage

```vue
<script setup lang="ts">
const { data } = await useStatamicFetch('/api/tenants');
</script>
```

### Default Auto-Fetched Resources

The module automatically fetches the following on app init (via plugins):

| Resource | Condition | Cache Duration |
|----------|-----------|---------------|
| **Globals** | Always | 1 hour (server-side) |
| **Navigations** | When `navigations` config is set | 1 hour (server-side) |
| **Redirects** | When `redirects: true` | 24 hours (server-side) |
| **Sitemap URLs** | When `seo.sitemap` is truthy | 24 hours (server-side) |

These auto-refresh when cache key parameters change (e.g., locale switch).

---

## 15. Changelog

### v1.1.2 (March 21, 2026)

**Improvements:**
- `StatamicBlock`: allow dynamic additional props
- `TaxonomiesFieldSingle`: new single type for `TaxonomiesField`
- `useStatamicFetch`: now uses `createUseFetch` (Nuxt 4+ API)

**Bug Fixes:**
- Block options are now optional

### v1.1.1 (January 5, 2026)

**Improvements:**
- `EntriesFieldSingle`: added single variant for `EntriesField`
- `TermsFieldSingle`: added single variant for `TermsField`

**Bug Fixes:**
- Fixed incorrect import path (multi-tenancy)
- `useStatamicPage` cache key is now less sensitive (race condition fix)
- `useStatamicPageData` is now exported correctly

### v1.1.0 (December 3, 2025)

**Features:**
- Multi-tenancy support via `@nobears-front-end/nuxt-multi-tenancy`

### v1.0.3 (November 27, 2025)

- Updated utils package (`Primitive` component fix)

### v1.0.2 (November 25, 2025)

- `StatamicBlock` now uses `Primitive` component (from `@nobears-front-end/utils`)

### v1.0.1 (November 18, 2025)

**Improvements:**
- `useStatamicPageData` cache key now matches `useStatamicPage`

**Bug Fixes:**
- i18n: plugins now initialize after dependent external plugins
- `useStatamicPage` now correctly sets the page state

### v1.0.0 (November 12, 2025)

Initial release with: `$api` fetch instance, `useStatamicApi`, `useStatamicCacheKey`, `useStatamicPage`, i18n support, preview mode, redirects, SEO composable.

### Pre-release Highlights (beta.0 – beta.19)

- beta.0: Core feature set (API composable, page fetching, i18n, preview mode, redirects, SEO)
- beta.4: `StatamicBlock` component migrated
- beta.15 – beta.18: `qs` dependency migrated through `query-string` to final `qs-esm`
- beta.3: Sitemap can generate without i18n
