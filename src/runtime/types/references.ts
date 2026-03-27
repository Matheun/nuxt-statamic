import type { TitledHandle } from './helpers';

// ============================================================
// Reference types for related resources in Statamic.
// These represent relationships to other entities.
// ============================================================

/**
 * Code language type for Code fieldtype.
 */
export type CodeLanguage = 'clike'
    | 'css'
    | 'diff'
    | 'go'
    | 'haml'
    | 'handlebars'
    | 'htmlmixed'
    | 'less'
    | 'markdown'
    | 'gfm'
    | 'nginx'
    | 'text/x-java'
    | 'javascript'
    | 'jsx'
    | 'text/x-objectivec'
    | 'php'
    | 'python'
    | 'ruby'
    | 'scss'
    | 'shell'
    | 'sql'
    | 'twig'
    | 'vue'
    | 'xml'
    | 'yaml-frontmatter';

/**
 * Asset reference structure returned by Statamic for asset fields.
 */
export type AssetReference = {
    alt: string | null;
    height: number;
    id: string;
    permalink: string | null;
    width: number;
};

/**
 * Entry reference structure returned by Statamic for entry relationship fields.
 */
export type EntryReference<T extends string = string> = {
    id: string;
    title: string;
    slug: string;
    uri: string;
    api_url: string;
    collection: TitledHandle<T>;
    slugs?: Record<string, string> | null;
};

/**
 * Form reference structure returned by Statamic for form relationship fields.
 */
export type FormReference<T extends string = string> = {
    handle: T;
    title: string;
    api_url: string;
};

/**
 * Site reference structure returned by Statamic for site relationship fields.
 */
export type SiteReference<T extends Record<string, any> = Record<string, any>> = {
    handle: string;
    name: string;
    lang: string;
    locale: string;
    short_locale: string;
    url: string;
    permalink: string;
    direction: 'ltr' | 'rtl';
    attributes: T | [];
};

/**
 * Taxonomy reference structure returned by Statamic for taxonomy relationship fields.
 */
export type TaxonomyReference<T extends string = string> = {
    url: string;
    uri: string;
    permalink: string;
} & TitledHandle<T>;

/**
 * Taxonomy term reference structure returned by Statamic for taxonomy term relationship fields.
 */
export type TermReference = {
    id: string;
    slug: string;
    url: string;
    permalink: string;
};

/**
 * User group reference structure returned by Statamic for user group relationship fields.
 */
export type UserGroupReference<T extends string = string> = TitledHandle<T> & {
    roles: {
        '*items': { [key: string]: TitledHandle<string> };
        '*escapeWhenCastingToString': boolean;
    };
};

/**
 * User reference structure returned by Statamic for user relationship fields.
 */
export type UserReference = {
    id: string;
    name: string;
    email: string;
    api_url: string;
};
