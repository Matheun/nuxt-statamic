import type { ConsolaInstance, ConsolaOptions } from 'consola';
import { createConsola } from 'consola';
import { colors } from 'consola/utils';

/**
 * Extended options for the logger, allowing standard Consola options
 * plus an optional `fancy` flag for user-defined formatting or behavior.
 */
export type LoggerOptions = Partial<ConsolaOptions & {
    /** Enables fancy output (can be used for custom formatting/themes). */
    fancy: boolean;
}>;

/**
 * Creates a tagged Consola logger instance with optional custom configuration.
 *
 * This utility standardizes logger naming and supports easy injection of options like log level or format.
 *
 * @param name - A tag name that identifies the logger (e.g., "AuthService").
 * @param options - Optional configuration, including all standard Consola options and a `fancy` mode.
 * @returns A `ConsolaInstance` tagged with the provided name.
 *
 * @example
 * ```ts
 * const logger = createLogger('MyModule', { level: 2 });
 * logger.info('Hello from MyModule!');
 * ```
 */
export function createLogger(
    name: string = 'statamic',
    options?: LoggerOptions,
): ConsolaInstance {
    const consolaInstance = createConsola({
        ...options,
    }).withTag(colors.whiteBright(name));

    return consolaInstance;
}
