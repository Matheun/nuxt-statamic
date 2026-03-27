import type { Nuxt } from '@nuxt/schema';
import type { StatamicNuxtContext } from '../context';
import process from 'node:process';
import { hasNuxtModule } from '@nuxt/kit';

export function prepareOptions(
    ctx: StatamicNuxtContext,
    _nuxt: Nuxt,
): boolean {
    const { options, logger } = ctx;

    if (!options.baseUrl) {
        logger.warn('Missing `baseUrl`. Set `NUXT_PUBLIC_STATAMIC_BASE_URL` in your `.env` or configure `statamic.baseUrl`.');
    }

    // Check for required environment variable
    if (!process.env.NUXT_PUBLIC_STATAMIC_BASE_URL) {
        if (options.baseUrl) {
            logger.warn('Missing `baseUrl`. Set `NUXT_PUBLIC_STATAMIC_BASE_URL` in your `.env` or configure `statamic.baseUrl`.');
        }
        else {
            logger.error('Missing `statamic.baseUrl`. Set `NUXT_PUBLIC_STATAMIC_BASE_URL` in your `.env` or configure `statamic.baseUrl`.');
        }
    }

    if (options.i18n && !hasNuxtModule('@nuxtjs/i18n')) {
        logger.error('`statamic.i18n` requires `@nuxtjs/i18n` to be installed and enabled.');
        return false;
    }

    return true;
}
