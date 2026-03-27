import type { ComputedRef } from 'vue';
import { computed, useNuxtApp } from '#imports';
import { useStatamicRuntimeConfig } from './useStatamicRuntimeConfig';

/**
 * Returns the current Statamic site identifier based on i18n locale.
 *
 * - When `i18n` is disabled → returns `undefined`
 * - When `i18n` is enabled → returns the locale's `language` or `code`
 *
 * The return value is reactive and updates on locale change.
 */
export function useStatamicSite(): ComputedRef<string | undefined> {
    const config = useStatamicRuntimeConfig();

    return computed(() => {
        if (!config.i18n)
            return undefined;

        const nuxtApp = useNuxtApp();
        const i18n = nuxtApp.$i18n as any;
        if (!i18n)
            return undefined;

        const { language, code } = i18n.localeProperties?.value ?? {};
        return language ?? code;
    });
}
