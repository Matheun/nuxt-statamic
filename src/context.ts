import type { Resolver } from '@nuxt/kit';
import type { ConsolaInstance } from 'consola';
import type { ModuleOptions } from './types';
import { fileURLToPath } from 'node:url';
import { createResolver } from '@nuxt/kit';
import { dirname } from 'pathe';
import { createLogger } from './runtime/shared/utils/createLogger';

export interface StatamicNuxtContext {
    options: Required<ModuleOptions>;
    userOptions: ModuleOptions;
    resolver: Resolver;
    logger: ConsolaInstance;
    distDir: string;
    runtimeDir: string;
}

const resolver = createResolver(import.meta.url);
const distDir = dirname(fileURLToPath(import.meta.url));
const runtimeDir = fileURLToPath(new URL('./runtime', import.meta.url));

export function createModuleContext(moduleOptions: ModuleOptions): StatamicNuxtContext {
    const options = moduleOptions as Required<ModuleOptions>;

    const logger = createLogger('statamic');
    /**
     * Set log level based on `debug` option
     * @see https://github.com/unjs/consola#log-level
     * level 3: (default) Informational logs, success, fail, ready, start, ...
     * level 4: Debug logs, useful for development
     */
    logger.level = options.debug ? 4 : 3;

    return {
        options,
        userOptions: moduleOptions,
        resolver,
        distDir,
        runtimeDir,
        logger,
    };
}
