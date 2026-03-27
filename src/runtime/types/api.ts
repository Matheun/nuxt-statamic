// ============================================================
// SECTION - Resource & Configuration Types
// Basic types and enums used throughout the API
// ============================================================

/**
 * Statamic resource types for standard and custom endpoints.
 */
export type StatamicApiResourceType = 'entries'
    | 'entry'
    | 'navigations'
    | 'navigation'
    | 'collections'
    | 'taxonomyTerms'
    | 'taxonomyTerm'
    | 'globals'
    | 'global'
    | 'forms'
    | 'form'
    | 'users'
    | 'user'
    | 'assets'
    | 'asset'
    | 'graphql'
    // For user-defined endpoints
    | (string & {});

/**
 * String condition constants with descriptions for Statamic API filtering.
 *
 * @see {@link https://statamic.dev/conditions#string-conditions|Statamic conditions documentation}
 */
export const STATAMIC_STRING_CONDITIONS = {
    /** Include if field **is equal** to value. */
    is: 'is',
    /** Include if field **is equal** to value. (alias for `is`) */
    equals: 'equals',
    /** Include if field is **not equal** to value. */
    not: 'not',
    /** Include if field is **not equal** to value. (alias for `not`) */
    isnt: 'isnt',
    /** Include if field **exists**. */
    exists: 'exists',
    /** Include if field **exists**. (alias for `exists`) */
    isset: 'isset',
    /** Include if field **doesn't exist**. */
    doesnt_exist: 'doesnt_exist',
    /** Include if field **doesn't exist**. (alias for `doesnt_exist`) */
    is_empty: 'is_empty',
    /** Include if field **doesn't exist**. (alias for `doesnt_exist`) */
    null: 'null',
    /** Include if field **contains** value. */
    contains: 'contains',
    /** Include if field **doesn't contain** value. */
    doesnt_contain: 'doesnt_contain',
    /** Include if field value is **in** the provided array. */
    in: 'in',
    /** Include if field value is **not in** the provided array. */
    not_in: 'not_in',
    /** Include if field **starts with** value. */
    starts_with: 'starts_with',
    /** Include if field **doesn't start** with value. */
    doesnt_start_with: 'doesnt_start_with',
    /** Include if field **ends with** value. */
    ends_with: 'ends_with',
    /** Include if field **doesn't end with** value. */
    doesnt_end_with: 'doesnt_end_with',
    /** Include if field is **greater than** value. */
    gt: 'gt',
    /** Include if field is **greater than or equal to** value. */
    gte: 'gte',
    /** Include if field is **less than** value. */
    lt: 'lt',
    /** Include if field is **less than or equal to** value. */
    lte: 'lte',
    /** Include if field **matches** case insensitive regex. */
    matches: 'matches',
    /** Include if field **matches** case insensitive regex. (alias for `matches`) */
    regex: 'regex',
    /** Include if field **doesn't match** case insensitive regex. */
    doesnt_match: 'doesnt_match',
    /** Include if field contains **only alphabetical characters**. */
    is_alpha: 'is_alpha',
    /** Include if field contains **only numeric characters**. */
    is_numeric: 'is_numeric',
    /** Include if field contains **only alphanumeric characters**. */
    is_alpha_numeric: 'is_alpha_numeric',
    /** Include if field **is a valid URL**. */
    is_url: 'is_url',
    /** Include if field **is an embeddable video URL**. */
    is_embeddable: 'is_embeddable',
    /** Include if field **is valid email address**. */
    is_email: 'is_email',
    /** Include if field **is after** date. */
    is_after: 'is_after',
    /** Include if field **is before** date. */
    is_before: 'is_before',
    /** Include if field **is numberwang**. */
    is_numberwang: 'is_numberwang',
} as const;

/**
 * All possible field filter conditions available in Statamic.
 *
 * @see {@link https://statamic.dev/conditions#string-conditions|Statamic conditions documentation}
 *
 * @remarks
 * The following conditions are available for filtering fields:
 *
 * #### Equality Conditions
 * - `is` / `equals` - Include if field **is equal** to value.
 * - `not` / `isnt` - Include if field is **not equal** to value.
 *
 * #### Existence Conditions
 * - `exists` / `isset` - Include if field **exists**.
 * - `doesnt_exist` / `is_empty` / `null` - Include if field **doesn't exist**.
 *
 * #### String Matching Conditions
 * - `contains` - Include if field **contains** value.
 * - `doesnt_contain` - Include if field **doesn't contain** value.
 * - `starts_with` - Include if field **starts with** value.
 * - `doesnt_start_with` - Include if field **doesn't start** with value.
 * - `ends_with` - Include if field **ends with** value.
 * - `doesnt_end_with` - Include if field **doesn't end with** value.
 *
 * #### Array Conditions
 * - `in` - Include if field value is **in** the provided array.
 * - `not_in` - Include if field value is **not in** the provided array.
 *
 * #### Comparison Conditions
 * - `gt` - Include if field is **greater than** value.
 * - `gte` - Include if field is **greater than or equal to** value.
 * - `lt` - Include if field is **less than** value.
 * - `lte` - Include if field is **less than or equal to** value.
 *
 * #### Regex Conditions
 * - `matches` / `regex` - Include if field **matches** case insensitive regex.
 * - `doesnt_match` - Include if field **doesn't match** case insensitive regex.
 *
 * #### Validation Conditions
 * - `is_alpha` - Include if field contains **only alphabetical characters**.
 * - `is_numeric` - Include if field contains **only numeric characters**.
 * - `is_alpha_numeric` - Include if field contains **only alphanumeric characters**.
 * - `is_url` - Include if field **is a valid URL**.
 * - `is_embeddable` - Include if field **is an embeddable video URL**.
 * - `is_email` - Include if field **is valid email address**.
 *
 * #### Date Conditions
 * - `is_after` - Include if field **is after** date.
 * - `is_before` - Include if field **is before** date.
 *
 * #### Special Conditions
 * - `is_numberwang` - Include if field **is numberwang**.
 */
export type StatamicApiStringConditions = typeof STATAMIC_STRING_CONDITIONS[keyof typeof STATAMIC_STRING_CONDITIONS];

/**
 * Default entry fields that Statamic returns.
 */
export type StatamicApiEntryDefaultFieldsKeys = 'api_url'
    | 'blocks'
    | 'blueprint'
    | 'collection'
    | 'date'
    | 'id'
    | 'locale'
    | 'slug'
    | 'status'
    | 'title'
    | 'updated_at'
    | 'uri'
    | 'url'
// SEO fields
    | 'seo_canonical_entry'
    | 'seo_canonical_type'
    | 'seo_description'
    | 'seo_json_ld'
    | 'seo_nofollow'
    | 'seo_noindex'
    | 'seo_og_description'
    | 'seo_og_image'
    | 'seo_og_title'
    | 'seo_site_name_position'
    | 'seo_title'
    | 'seo_twitter_card'
    | 'seo_twitter_description'
    | 'seo_twitter_summary_image'
    | 'seo_twitter_summary_large_image'
    | 'seo_twitter_title'
// i18n fields
    | 'slugs';

export type StatamicApiEntryDefaultFields = Record<StatamicApiEntryDefaultFieldsKeys, any>;

/**
 * Union type for field names with optional filter conditions.
 *
 * Allows both plain field names and field names with condition suffix using the pattern `{field}:{condition}`
 *
 * @template T - Object type containing the fields
 */
export type StatamicApiFieldOrCondition<T extends Record<string, any>>
    = | Extract<keyof T, string>
        | `${Extract<keyof T, string>}:${StatamicApiStringConditions}`;

// ============================================================
// SECTION - Request Parameter Types
// Types for parameters sent to the Statamic API
// ============================================================

/**
 * Base parameters available for most Statamic API requests.
 * This is extended by specific parameter types below.
 */
export type StatamicApiParamsBase<T extends Record<string, any> = StatamicApiEntryDefaultFields> = {
    /**
     * The top level fields that should be included in the response.
     *
     * @example
     * ```ts
     * { fields: ["id", "title", "content"] }
     * ```
     */
    fields: (keyof T)[];

    /**
     * Filters results based on the specified field conditions.
     *
     * You may specify filters following the pattern:
     * `{field_name}:{condition}={value}`
     *
     * Union type for filter keys:
     * - Plain field name: `{field}` → will apply the `"is"` condition by default.
     * - Field with condition: `{field}:{condition}` → applies the specified condition.
     *
     * @see {@link https://statamic.dev/conditions#syntax|Statamic string conditions syntax}
     * @example
     * Filter where title contains "awesome" and featured is true
     * ```ts
     * { filter: { "title:contains": "awesome", featured: true } }
     * ```
     */
    filter: {
        [K in StatamicApiFieldOrCondition<T>]?: any;
    };

    /**
     * Sorts results based on the specified fields.
     * Prefix with hyphen for descending order.
     *
     * Fields can be prexied with a hyphen to sort descending.
     *
     * @example
     * Single field
     * ```ts
     * { sort: "fieldName" }
     * ```
     * @example
     * Multiple fields
     * ```ts
     * { sort: "fieldName,anotherfield" }
     * ```
     * @example
     * Multiple fields in custom order
     * ```ts
     * { sort: "fieldNameOne,-fieldNameTwo,fieldNameThree" }
     * ```
     * @example
     * Reverse order
     * ```ts
     * { sort: "-fieldName" }
     * ```
     * @example
     * Nested field
     * ```ts
     * { sort: "fieldName->nestedFieldName" }
     * ```
     */
    sort: string;

    /**
     * The number of results to fetch per page.
     * @defaultValue `25`
     */
    limit: number;

    /**
     * The page number to fetch.
     * @defaultValue `1`
     */
    page: number;

    /**
     * The site to fetch data from.
     */
    site: string;

    /**
     * Live preview token. Used to retrieve unpublished/draft content.
     */
    token: string;
};

/**
 * Parameters for fetching a single resource by ID.
 * Excludes pagination, filtering, and sorting options.
 */
export type StatamicApiParamsSingle<T extends Record<string, any> = StatamicApiEntryDefaultFields>
    = Omit<StatamicApiParamsBase<T>, 'fields' | 'filter' | 'sort' | 'limit' | 'page' | 'site'>;

/**
 * Parameters for fetching multiple resources.
 * Includes full pagination, filtering, and sorting support.
 */
export type StatamicApiParamsMultiple<T extends Record<string, any> = StatamicApiEntryDefaultFields>
    = StatamicApiParamsBase<T>;

/**
 * Parameters for fetching tree-structured data (navigations, structured collections, etc.).
 */
export type StatamicApiParamsTree<T extends Record<string, any> = StatamicApiEntryDefaultFields>
    = Pick<StatamicApiParamsBase<T>, 'fields' | 'site'> & {
    /**
     * The maximum nesting depth of the tree.
     */
        max_depth: number;
    };

/**
 * Parameters for fetching an entry by its URI path.
 */
export type StatamicApiParamsUri<T extends Record<string, any> = StatamicApiEntryDefaultFields>
    = Partial<Omit<StatamicApiParamsBase<T>, 'fields' | 'filter' | 'sort' | 'limit' | 'page'>> & {
    /**
     * The URI path to fetch data from.
     */
        uri: string;
    };

/**
 * Formatted filter object.
 */
export type StatamicApiFormattedParamsFilter = Record<`filter[${string}:${StatamicApiStringConditions}]` | `filter[${string}]`, any>;

/**
 * Complete formatted parameters object.
 */
export type StatamicApiFormattedParams = {
    fields?: string;
    sort?: string;
    limit?: number;
    page?: number;
    site?: string;
    token?: string;
    max_depth?: number;
    uri?: string;
    [key: string]: any;
} & StatamicApiFormattedParamsFilter;

// ============================================================
// SECTION - Response Types
// Types for data returned from the Statamic REST API
// ============================================================

/**
 * Response for fetching a single resource from Statamic API.
 * Returns the resource data directly.
 */
export type StatamicApiResponseSingle<DataType extends Record<string, any> = StatamicApiEntryDefaultFields> = DataType;

/**
 * Response for fetching multiple resources from Statamic API.
 * Includes pagination metadata and links.
 */
export type StatamicApiResponseMultiple<DataType extends Record<string, any> = StatamicApiEntryDefaultFields> = {
    data: DataType[];
    links: {
        first: string;
        last: string;
        prev: string | null;
        next: string | null;
    };
    meta: {
        current_page: number;
        last_page: number;
        links: {
            active: boolean;
            label: string;
            url: string | null;
        };
        from: number;
        to: number;
        total: number;
        per_page: number;
        path: string;
    };
};

/**
 * Response for fetching tree-structured data from Statamic API (navigations, structured collections).
 * Returns a tree node with nested children.
 */
export type StatamicApiResponseTree<DataType extends Record<string, any> = StatamicApiEntryDefaultFields>
    = StatamicApiTreeNode<DataType>;

/**
 * A single node in a tree structure from Statamic API (navigation or structured collection).
 * Contains the page data, depth level, and nested children.
 */
export type StatamicApiTreeNode<DataType extends Record<string, any> = StatamicApiEntryDefaultFields> = {
    page: DataType;
    depth: number;
    children: StatamicApiTreeNode<DataType>[];
};

// ============================================================
// SECTION - Redirects
// Types for redirect data returned from the Statamic REST API
// ============================================================

/**
 * A single redirect entry from Statamic API.
 */
export type StatamicApiRedirect = {
    id: string;
    title: string;
    enabled: boolean;
    source: string;
    destination: string;
    type: '301' | '302' | '410'; // Permanent, Temporary, Gone
    match_type: 'exact' | 'regex';
    site: string;
    order: number;
    description: string;
    delete_url: string;
};

/**
 * Response for fetching multiple redirects from Statamic API.
 */
export type StatamicApiResponseRedirects = StatamicApiRedirect[];

/**
 * Filtered redirect data returned by our server routes.
 * Contains only the essential fields needed for routing.
 */
export type StatamicApiFilteredRedirects = Pick<StatamicApiRedirect, 'source' | 'destination' | 'type' | 'match_type' | 'site'>;

// ============================================================
// SECTION - Server API Response Types
// Types for data returned from our Nitro server routes.
// These wrap the Statamic API responses for caching purposes.
// ============================================================

/**
 * Server API response for globals data.
 * Returns a key-value object of all globals or a single global.
 */
export type StatamicServerApiResponseGlobals = {
    data: Record<string, any>;
};

/**
 * Server API response for tree data (navigations, structured collections).
 * Wraps the Statamic API tree response in a data property for consistency.
 */
export type StatamicServerApiResponseTree<DataType extends Record<string, any> = StatamicApiEntryDefaultFields> = {
    data: StatamicApiResponseTree<DataType>;
};
