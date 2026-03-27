import type { FetchError } from 'ofetch';
import type { StatamicError } from '../../types/hooks';
import { defineNuxtPlugin } from '#imports';
import { colors } from 'consola/utils';
import { createLogger } from '../shared/utils/createLogger';

const logger = createLogger();

export default defineNuxtPlugin({
    name: 'statamic:error-handler',
    hooks: {
        'statamic:error': (error: StatamicError) => {
            const name = error?.data?.name || error.name;

            logger.error([
                colors.whiteBright(error.statusCode?.toString() || 'Unknown status code'),
                colors.whiteBright(name?.toUpperCase() || 'Unknown name'),
                '-',
                colors.whiteBright(error.statusMessage || 'Unknown status message'),
            ].join(' '));
        },
        'statamic:request:error': (error: FetchError) => {
            logger.error('Error', error);
        },
        'statamic:response:error': (error: FetchError) => {
            const readableRequest = error?.response?.url?.replace(/%5B/g, '[').replace(/%5D/g, ']').replace(/%3A/g, ':').replace(/%2F/g, '/');

            logger.error([
                colors.whiteBright(error?.response?.status.toString() || 'Unknown status'),
                colors.whiteBright(error?.response?.statusText || 'Unknown status text'),
                '-',
                `Failed to fetch ${readableRequest}`,
                ...(error?.response?._data?.message ? [`\n\n${error?.response?._data?.message}`] : []),
            ].join(' '));
        },
    },
});
