import type { FetchHooks } from 'ofetch';

type HookKey = keyof FetchHooks;
type HookFn<K extends HookKey> = NonNullable<FetchHooks[K]>;
type HookEntry<K extends HookKey> = HookFn<K> extends ((...args: any[]) => any) | Array<(...args: any[]) => any> ? HookFn<K> : never;

const HOOK_KEYS: HookKey[] = ['onRequest', 'onResponse', 'onRequestError', 'onResponseError'];

function collectHooks<K extends HookKey>(key: K, sources: FetchHooks[]): Array<(...args: any[]) => any> {
    const collected: Array<(...args: any[]) => any> = [];
    for (const source of sources) {
        const hook = source[key] as HookEntry<K> | undefined;
        if (!hook)
            continue;
        if (Array.isArray(hook)) {
            collected.push(...hook);
        }
        else {
            collected.push(hook as (...args: any[]) => any);
        }
    }
    return collected;
}

/**
 * Merges multiple ofetch hook objects into a single hook object.
 * Each hook slot (`onRequest`, `onResponse`, etc.) is combined into
 * an array so all callbacks execute in order.
 * Empty arrays are omitted to avoid overriding default behavior.
 */
export function mergeFetchHooks(...sources: FetchHooks[]): FetchHooks {
    const result: FetchHooks = {};

    for (const key of HOOK_KEYS) {
        const hooks = collectHooks(key, sources);
        if (hooks.length > 0) {
            ;(result as any)[key] = hooks;
        }
    }

    return result;
}
