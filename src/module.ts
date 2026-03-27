import type { ModuleOptions } from './types';
import process from 'node:process';
import {
    addImportsDir,
    addPlugin,
    addServerImportsDir,
    addVitePlugin,
    defineNuxtModule,
} from '@nuxt/kit';
import { defu } from 'defu';
import { withoutTrailingSlash } from 'ufo';
import { name, version } from '../package.json';
import { createModuleContext } from './context';
import { prepareOptions } from './prepare/options';
import { createLogger } from './runtime/shared/utils/createLogger';

export type * from './runtime/types';
export type * from './types';

export default defineNuxtModule<ModuleOptions>({
    meta: {
        name,
        version,
        configKey: 'statamic',
        compatibility: {
            nuxt: '>=4.4.2',
        },
    },

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
                globals: {
                    maxAge: 60 * 60, // 1 hour
                },
                navigations: {
                    maxAge: 60 * 60, // 1 hour
                },
            },
        },
    },

    onInstall() {
        createLogger('statamic').info('Setting up nuxt-statamic module for the first time!\n\nFor more information, please visit the documentation at {domain}');
    },

    async setup(options, nuxt) {
        const ctx = createModuleContext(options);
        const { logger } = ctx;

        const shouldContinue = await prepareOptions(ctx, nuxt);
        if (!shouldContinue) {
            logger.warn('Nuxt Statamic was not enabled due to incorrect configuration');
            return;
        }

        addServerImportsDir(ctx.resolver.resolve('./runtime/shared/utils'));

        addImportsDir(ctx.resolver.resolve('./runtime/composables'));
        addImportsDir(ctx.resolver.resolve('./runtime/shared/utils'));

        addPlugin(ctx.resolver.resolve('./runtime/plugins/error-handler'));
        addPlugin(ctx.resolver.resolve('./runtime/plugins/statamic'));

        /**
         * Optimize Vite deps
         */
        addVitePlugin(() => ({
            name: 'statamic-vite-plugin',
            config(config) {
                config.optimizeDeps ||= {};
                config.optimizeDeps.include ||= [];
                config.optimizeDeps.include.push('qs-esm');
            },
        }));

        /**
         * Allow other modules to register statamic hooks
         */
        nuxt.hook('modules:done', () => {
            const baseUrl = withoutTrailingSlash(options.baseUrl);
            const apiRoute = withoutTrailingSlash(options.apiRoute);
            const apiUrl = `${baseUrl}${apiRoute}`;

            /**
             * Expose statamic options via runtime config for use in app/server contexts
             */
            // @ts-expect-error generated type
            nuxt.options.runtimeConfig.public.statamic = defu(
                nuxt.options.runtimeConfig.public.statamic,
                {
                    baseUrl,
                    apiRoute,
                    apiUrl,
                    i18n: options.i18n,
                    preview: options.preview,
                    debug: options.debug,
                    server: options.server,
                },
            );

            // @ts-expect-error generated type
            nuxt.options.runtimeConfig.statamic = defu(
                nuxt.options.runtimeConfig.statamic,
                {
                    apiToken: options.apiToken,
                },
            );
        });
    },
});
