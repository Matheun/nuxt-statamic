import { usePreviewMode, useRoute } from '#imports';
import { useStatamicRuntimeConfig } from './useStatamicRuntimeConfig';

/**
 * Manages Statamic live preview mode.
 * Checks for `?live-preview` or `?preview=true` query params.
 *
 * When preview mode is active, the token from `state.token` is
 * auto-injected into all API requests made through `useStatamicApi`.
 */
export function useStatamicPreview() {
    const config = useStatamicRuntimeConfig();
    const route = useRoute();

    return usePreviewMode({
        shouldEnable: () => {
            if (!config.preview)
                return false;
            return !!route.query['live-preview'] || route.query.preview === 'true';
        },
    });
}
