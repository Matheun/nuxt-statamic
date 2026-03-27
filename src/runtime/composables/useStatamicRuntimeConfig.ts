import type { H3Event } from 'h3';
import type { ModulePublicRuntimeConfig } from '../../types';
import { useRuntimeConfig } from '#imports';

/**
 * Returns the public Statamic runtime config.
 * Works in both client and server contexts.
 *
 * @param event - Optional H3 event for server-side usage.
 */
export function useStatamicRuntimeConfig(event?: H3Event): ModulePublicRuntimeConfig['statamic'] {
    return useRuntimeConfig(event).public.statamic as ModulePublicRuntimeConfig['statamic'];
}
