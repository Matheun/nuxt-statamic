import type { $Fetch } from 'ofetch';
import type { StatamicError } from '../../types/hooks';
import { defineNuxtPlugin, useNuxtApp } from '#imports';
import { consola } from 'consola';
import { createStatamicClient } from '../shared/utils/createStatamicClient';

interface StatamicNuxtApp {
    $statamic: $Fetch;
}

declare module '#app' {
    interface NuxtApp extends StatamicNuxtApp {}
}

const logger = consola.withTag('statamic');

export default defineNuxtPlugin({
    name: 'statamic',
    dependsOn: ['statamic:error-handler'],
    enforce: 'post',
    setup() {
        const nuxtApp = useNuxtApp();

        const client = createStatamicClient({
            onRequestError(ctx: any) {
                const fetchError = Object.assign(ctx.error ?? new Error('Request failed'), {
                    request: ctx.request,
                    options: ctx.options,
                });
                nuxtApp.hooks.callHook('statamic:request:error', fetchError);
            },
            onResponseError(ctx: any) {
                const fetchError = Object.assign(new Error(ctx.response?.statusText ?? 'Response error'), {
                    request: ctx.request,
                    response: ctx.response,
                    options: ctx.options,
                });
                nuxtApp.hooks.callHook('statamic:response:error', fetchError);
            },
        });

        // nuxtApp.hooks.hook('statamic:error', (error: StatamicError) => {
        //     logger.error(`${error.statusCode ?? 'ERR'} ${error.name ?? 'Unknown'} — ${error.message}`);
        // });

        // nuxtApp.hooks.hook('statamic:request:error', (error) => {
        //     logger.error('Request failed:', error.message);
        // });

        // nuxtApp.hooks.hook('statamic:response:error', (error) => {
        //     const url = error.response?.url;
        //     const status = error.response?.status;
        //     logger.error(`${status ?? 'ERR'} ${error.message}${url ? ` — ${url}` : ''}`);
        // });

        return {
            provide: {
                statamic: client,
            },
        };
    },
});
