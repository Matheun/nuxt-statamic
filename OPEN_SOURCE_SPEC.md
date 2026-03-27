# nuxtjs-statamic — Open Source Module Specification

> Implementation-aligned specification for the current `nuxtjs-statamic` codebase.
> This document reflects behavior in `src/` today, including implemented paths and configured-but-pending surfaces.

---

## Table of Contents

1. [Scope and Current Status](#1-scope-and-current-status)
2. [Canonical Module Configuration Contract](#2-canonical-module-configuration-contract)
3. [Defaults, Env Mapping, and Option Resolution](#3-defaults-env-mapping-and-option-resolution)
4. [Setup Lifecycle and Runtime Injection](#4-setup-lifecycle-and-runtime-injection)
5. [Statamic Fetch Client Behavior](#5-statamic-fetch-client-behavior)
6. [Nuxt Plugins and Runtime Hooks](#6-nuxt-plugins-and-runtime-hooks)
7. [Composables: Implemented vs Placeholder](#7-composables-implemented-vs-placeholder)
8. [Server Proxy and Caching Configuration State](#8-server-proxy-and-caching-configuration-state)
9. [Type Surfaces](#9-type-surfaces)
10. [Dependencies and Compatibility](#10-dependencies-and-compatibility)
11. [Reference Configurations](#11-reference-configurations)
12. [Gaps and Roadmap Notes](#12-gaps-and-roadmap-notes)

---

## 1. Scope and Current Status

This specification describes the module as currently implemented in:

- `src/module.ts`
- `src/prepare/options.ts`
- runtime plugins/composables/utilities in `src/runtime`
- module/runtime type declarations in `src/types` and `src/runtime/types`

Current implementation status:

- Module setup, runtime config wiring, plugin provisioning, and utility composables are implemented.
- `useStatamicApi` is still a placeholder (`TODO`) and does not expose typed endpoint methods.
- Server proxy/cache options exist in config and types, but module setup does not register server route handlers.

---

## 2. Canonical Module Configuration Contract

### 2.1 Config key and Nuxt meta

- Nuxt config key: `statamic`
- Module name: `nuxtjs-statamic` (from package metadata)
- Module compatibility: Nuxt `>=4.4.2`

### 2.2 Effective options interface

Source of truth: `src/types/module.ts`.

```ts
export interface CacheOptions {
  maxAge?: number
}

export interface ServerOptions {
  proxy?: boolean
  cache?: {
    globals?: CacheOptions | false
    navigations?: CacheOptions | false
  }
}

export interface ModuleOptions {
  baseUrl?: string
  apiRoute?: string
  apiToken?: string
  i18n?: boolean
  preview?: boolean
  debug?: boolean
  server?: ServerOptions
}
```

### 2.3 Semantic intent of each option

- `baseUrl`
  - Base Statamic origin (for example, `https://cms.example.com`).
  - Trailing slash is stripped before runtime config is finalized.
- `apiRoute`
  - Statamic REST route prefix.
  - Defaults to `/api`.
  - Trailing slash is stripped before composing `apiUrl`.
- `apiToken`
  - Bearer token for authenticated requests.
  - Written to private runtime config (`runtimeConfig.statamic.apiToken`).
- `i18n`
  - Enables i18n-aware behavior in composables.
  - Validation requires `@nuxtjs/i18n` to be installed/enabled.
- `preview`
  - Enables preview-mode activation checks in `useStatamicPreview`.
- `debug`
  - Enables debug logs and sets module logger verbosity to debug level.
- `server.proxy` and `server.cache`
  - Typed/configured surface for proxy/cache behavior.
  - Persisted into runtime config; route implementation is pending.

---

## 3. Defaults, Env Mapping, and Option Resolution

### 3.1 Defaults set in module definition

Module defaults are defined in `src/module.ts`:

```ts
defaults: {
  debug: process.env.NUXT_STATAMIC_DEBUG === 'true' || false,
  baseUrl: process.env.NUXT_PUBLIC_STATAMIC_BASE_URL || '',
  apiRoute: '/api',
  apiToken: process.env.NUXT_STATAMIC_API_TOKEN || '',
  i18n: false,
  preview: true,
  server: {
    proxy: false,
    cache: {
      globals: { maxAge: 60 * 60 },
      navigations: { maxAge: 60 * 60 },
    },
  },
}
```

### 3.2 Environment variable mapping

| Env var | Resolved option | Runtime visibility |
|---|---|---|
| `NUXT_PUBLIC_STATAMIC_BASE_URL` | `statamic.baseUrl` | Public |
| `NUXT_STATAMIC_API_TOKEN` | `statamic.apiToken` | Private |
| `NUXT_STATAMIC_DEBUG` (`'true'`) | `statamic.debug` | Public |

### 3.3 Validation behavior during setup

Validation is implemented in `prepareOptions(ctx, _nuxt)`:

- Missing `options.baseUrl`
  - Logs warning: missing `baseUrl`.
  - Does not stop setup.
- Missing `process.env.NUXT_PUBLIC_STATAMIC_BASE_URL`
  - If `options.baseUrl` is set, logs warning.
  - If `options.baseUrl` is not set, logs error for missing `statamic.baseUrl`.
  - Does not stop setup.
- `i18n: true` without `@nuxtjs/i18n`
  - Logs error and returns `false`.
  - Module setup exits early and logs:
    - `Nuxt Statamic was not enabled due to incorrect configuration`

Notes:

- `baseUrl` validation currently checks both resolved options and process env, which can produce repeated warning messages in some configurations.
- `debug` resolves to `true` only when env is exactly `'true'`.

---

## 4. Setup Lifecycle and Runtime Injection

### 4.1 High-level setup sequence

1. Module context and logger are created via `createModuleContext`.
2. `prepareOptions` runs validation.
3. Imports and plugins are registered.
4. A Vite plugin injects `qs-esm` into `optimizeDeps.include`.
5. On `modules:done`, runtime config is normalized and merged.

### 4.2 Registered imports and plugins

Module setup registers:

- `addServerImportsDir`
  - `src/runtime/shared/utils`
- `addImportsDir`
  - `src/runtime/composables`
  - `src/runtime/shared/utils`
- `addPlugin`
  - `src/runtime/plugins/error-handler`
  - `src/runtime/plugins/statamic`

### 4.3 Vite integration

The module adds a Vite plugin (`statamic-vite-plugin`) that ensures:

- `config.optimizeDeps.include` contains `qs-esm`.

### 4.4 Runtime config merge contract

During `modules:done`:

- `baseUrl = withoutTrailingSlash(options.baseUrl)`
- `apiRoute = withoutTrailingSlash(options.apiRoute)`
- `apiUrl = \`${baseUrl}${apiRoute}\``

Then merge:

- `runtimeConfig.public.statamic`
  - `baseUrl`
  - `apiRoute`
  - `apiUrl`
  - `i18n`
  - `preview`
  - `debug`
  - `server`
- `runtimeConfig.statamic`
  - `apiToken`

### 4.5 Install-time log behavior

`onInstall()` logs an informational setup message through `createLogger('statamic')`.

---

## 5. Statamic Fetch Client Behavior

`createStatamicClient(options?: FetchOptions)` in `src/runtime/shared/utils/createStatamicClient.ts` defines the transport layer.

### 5.1 Base defaults

- `baseURL` uses `runtimeConfig.public.statamic.apiUrl`.
- Default header includes `Accept: application/json`.
- If private runtime token exists, it adds `Authorization: Bearer <token>`.

### 5.2 Query serialization strategy

Inside `onRequest`:

- When `reqOptions.query` exists, it serializes query via `qs-esm`.
- Serialized output is converted to `URLSearchParams` and reassigned as a plain object.
- This supports nested/filter query structures required by Statamic.

### 5.3 Debug logging behavior

When `runtimeConfig.public.statamic.debug` is truthy:

- Logger writes the request target plus serialized query string.

### 5.4 Hook merge strategy

`mergeFetchHooks(defaultOptions, userOptions)` merges:

- `onRequest`
- `onResponse`
- `onRequestError`
- `onResponseError`

Each hook slot becomes an ordered callback array so both default and caller hooks execute.

---

## 6. Nuxt Plugins and Runtime Hooks

### 6.1 Registered runtime plugins

The module registers two runtime plugins:

- `src/runtime/plugins/error-handler.ts`
- `src/runtime/plugins/statamic.ts`

`statamic` declares:

- `name: 'statamic'`
- `dependsOn: ['statamic:error-handler']`
- `enforce: 'post'`

### 6.2 App injection

`statamic` plugin provides:

- `nuxtApp.$statamic` as a configured `$fetch` instance from `createStatamicClient`.

### 6.3 Hook emission behavior

The statamic client hooks map fetch errors to app runtime hooks:

- `onRequestError` -> `statamic:request:error`
- `onResponseError` -> `statamic:response:error`

### 6.4 Error handler behavior

`error-handler` subscribes to:

- `statamic:error`
- `statamic:request:error`
- `statamic:response:error`

Behavior:

- `statamic:error`: logs status, name, and status message.
- `statamic:request:error`: logs the full error object.
- `statamic:response:error`: logs status/status text and a decoded request URL, plus API message when present.

### 6.5 Hook typing contract

From `src/types/hooks.ts`:

`#app` hook augmentation includes:

- `statamic:error` -> `StatamicError`
- `statamic:request` -> `FetchContext`
- `statamic:response` -> `Omit<FetchContext, 'response'> & { response: FetchResponse<any> }`
- `statamic:request:error` -> `FetchError`
- `statamic:response:error` -> `FetchError`

`nitropack/types` hook augmentation includes the same logical events with Nitro-specific payload variants for request/response errors.

---

## 7. Composables: Implemented vs Placeholder

### 7.1 Implemented composables

- `useStatamicClient()`
  - Returns `useNuxtApp().$statamic`.
- `useStatamicCacheKey(resource, identifier, context?)`
  - Returns deterministic `ComputedRef<string>`.
  - Format: `statamic:{site?}:{resource}:{identifier}:{hash?}`.
- `useStatamicSite()`
  - Returns reactive site identifier when i18n is enabled.
  - Uses `i18n.localeProperties.value.language ?? code`.
- `useStatamicPreview()`
  - Uses Nuxt `usePreviewMode`.
  - Enables when `config.preview` is true and route query contains `live-preview` or `preview=true`.
- `useStatamicRuntimeConfig(event?)`
  - Returns typed public runtime config (`runtimeConfig.public.statamic`).

### 7.2 Placeholder composable

- `useStatamicApi.ts` currently contains only a TODO comment and no implementation.

Practical impact:

- Consumers can use `useStatamicClient` (or injected `$statamic`) plus utility helpers today.
- Endpoint-focused typed API composable methods are pending.

---

## 8. Server Proxy and Caching Configuration State

The module exposes `server.proxy` and `server.cache` in options/types and carries them into runtime config.

Current runtime state:

- Proxy/cache behavior is currently configuration-only.
- Module setup does not register `defineEventHandler` or `defineCachedEventHandler`.
- `src/runtime/server` currently contains only `tsconfig.json`; no route handlers are implemented there.

---

## 9. Type Surfaces

### 9.1 Module and Nuxt augmentation types

`src/types/module.ts` augments:

- `NuxtConfig.statamic?: Partial<ModuleOptions>`
- `NuxtOptions.statamic: ModuleOptions`
- `PublicRuntimeConfig` with `statamic` shape (including optional `apiUrl`)
- `RuntimeConfig` with private `statamic.apiToken`

### 9.2 Runtime type exports

`src/runtime/types/index.ts` exports:

- `api`
- `fields`
- `helpers`
- `references`
- `seo`
- `sitemap`

### 9.3 Runtime hook type exports

`src/types/hooks.ts` exports runtime hook contracts for:

- app hooks (`#app`)
- Nitro runtime hooks (`nitropack/types`)

### 9.4 API type vocabulary status

`src/runtime/types/api.ts` defines:

- resource identifiers
- filter condition constants and unions
- parameter contracts (`base`, `single`, `multiple`, `tree`, `uri`)
- formatted query contracts
- response contracts for single/multiple/tree payloads
- redirect and server-response helper types

This type vocabulary is production-ready for userland typing and future `useStatamicApi` implementation.

---

## 10. Dependencies and Compatibility

### 10.1 Runtime dependencies used by implementation

- `@nuxt/kit`
- `consola`
- `defu`
- `ohash`
- `qs-esm`
- `ufo`

### 10.2 Engine/framework metadata

- Node engine (`package.json`): `>=22`
- Nuxt module compatibility: `>=4.4.2`
- pnpm engine (`package.json`): `>=10.28`

---

## 11. Reference Configurations

### 11.1 Minimal module configuration

```ts
export default defineNuxtConfig({
  modules: ['nuxtjs-statamic'],
  statamic: {},
})
```

This expects `NUXT_PUBLIC_STATAMIC_BASE_URL` or `statamic.baseUrl` to be set.

### 11.2 Explicit full options example

```ts
export default defineNuxtConfig({
  modules: ['nuxtjs-statamic'],
  statamic: {
    baseUrl: 'https://cms.example.com',
    apiRoute: '/api',
    apiToken: process.env.NUXT_STATAMIC_API_TOKEN,
    i18n: false,
    preview: true,
    debug: false,
    server: {
      proxy: false,
      cache: {
        globals: { maxAge: 3600 },
        navigations: { maxAge: 3600 },
      },
    },
  },
})
```

### 11.3 Runtime config shape after setup

```ts
runtimeConfig: {
  statamic: {
    apiToken: '***'
  },
  public: {
    statamic: {
      baseUrl: 'https://cms.example.com',
      apiRoute: '/api',
      apiUrl: 'https://cms.example.com/api',
      i18n: false,
      preview: true,
      debug: false,
      server: {
        proxy: false,
        cache: {
          globals: { maxAge: 3600 },
          navigations: { maxAge: 3600 },
        },
      },
    },
  },
}
```

---

## 12. Gaps and Roadmap Notes

Important gaps for engineering reference:

- `useStatamicApi` remains unimplemented.
- Proxy/cache route behavior is not wired, despite available option/type surfaces.
- Missing `baseUrl` does not currently hard-fail setup unless i18n validation fails.
- Hook names in active runtime behavior use `statamic:request:error` / `statamic:response:error` (colon-separated segments).

Recommended interpretation:

- Treat the options schema and runtime config shape as stable integration contracts.
- Treat endpoint-level composable APIs and server-route proxy behavior as active implementation areas.

---

This specification is implementation-first and should be updated whenever module setup logic, runtime hooks, runtime config shape, composable availability, or server route registration behavior changes.
