import type { NuxtError } from '#app';
import type { HookResult } from '@nuxt/schema';
import type { H3Error, H3Event } from 'h3';
import type { FetchContext, FetchError, FetchResponse } from 'ofetch';

export interface StatamicError extends Partial<NuxtError> {
    data?: {
        name?: string;
    };
};

declare module '#app' {
    interface RuntimeNuxtHooks {
        'statamic:error': (error: StatamicError) => HookResult;
        'statamic:request': (options: FetchContext) => HookResult;
        'statamic:response': (options: Omit<FetchContext, 'response'> & { response: FetchResponse<any> }) => HookResult;
        'statamic:request:error': (error: FetchError) => HookResult;
        'statamic:response:error': (error: FetchError) => HookResult;
    }
}
declare module 'nitropack/types' {
    interface NitroRuntimeHooks {
        'statamic:error': (error: StatamicError) => HookResult;
        'statamic:request': (options: FetchContext, event: H3Event) => HookResult;
        'statamic:response': (options: Omit<FetchContext, 'response'> & { response: FetchResponse<any> }, event: H3Event) => HookResult;
        'statamic:request:error': (error: H3Error) => HookResult;
        'statamic:response:error': (error: H3Error) => HookResult;
    }
}
