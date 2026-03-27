import type { FieldValue, LabeledValue, NonNullableFieldValue, ObjectValue, TitledHandle } from './helpers';
import type { AssetReference, CodeLanguage, EntryReference, FormReference, SiteReference, TaxonomyReference, TermReference, UserGroupReference, UserReference } from './references';

// ============================================================
// SECTION - Text & Rich Content
// Fields that store strings of text, rich content, or both.
// ============================================================

/**
 * Bard Fieldtype - Rich content editor that stores a string, an array of custom records, or null.
 * @template T - Custom Bard item types (must have `type` property for discrimination)
 * @see {@link https://statamic.dev/fieldtypes/bard|Statamic Bard Fieldtype documentation}
 * @example
 * Define custom Bard content with specific block types.
 * ```ts
 * type MyBardSets =
 *     | BardFieldSet<{ type: "text"; text: string }>
 *     | BardFieldSet<{ type: "button", label: string, url: string, }>
 *     | BardFieldSet<{ type: "image", src: string, alt: string, }>;
 *
 * type MyBardField = BardField<MyBardItems>;
 * // Result: string | null | MyBardSets[]
 * ```
 * @example
 * Define bard content without any blocks.
 * ```ts
 * type MyBardField = BardField;
 * // Result: string | null
 * ```
 */
export type BardField<T extends BardFieldSet<{ type: string }> | string = string> = (T extends BardFieldSet<infer U> ? U[] : string) | null;

/**
 * Structure for Bard set instances with type discrimination.
 * @template T - The Bard set item type (must have `type` property for discrimination)
 * @example
 * Union of custom Bard item types.
 * ```ts
 * type MyBardSets =
 *     | BardFieldSet<{ type: "text"; text: string }>
 *     | BardFieldSet<{ type: "button", label: string, url: string, }>;
 *     | BardFieldSet<{ type: "image", src: string, alt: string, }>;
 * ```
 */
export type BardFieldSet<
    T extends (Record<string, any> & { type: string }) = (Record<string, any> & { type: string }),
> = { type: string } & T;

/**
 * Code Fieldtype - Code editor with syntax highlighting.
 * @template T - The programming language/mode (defaults to all supported modes)
 * @see {@link https://statamic.dev/fieldtypes/code|Statamic Code Fieldtype documentation}
 * @example
 * ```ts
 * type MyCodeField = CodeField<"javascript">;
 * // Result: {
 * //   code: string | null,
 * //   mode: "javascript",
 * //   value: string | null
 * // }
 * ```
 */
export type CodeField<T extends CodeLanguage = CodeLanguage> = {
    code: string | null;
    mode: T;
    value: string | null;
};

/**
 * Text Fieldtype - Single-line text input.
 * @see {@link https://statamic.dev/fieldtypes/text|Statamic Text Fieldtype documentation}
 * @example
 * Optional text field
 * ```ts
 * type Name = TextField;
 * // Result: string | null
 * ```
 * @example
 * Required text field
 * ```ts
 * type Name = NonNullable<TextField>;
 * // Result: string
 * ```
 */
export type TextField = string | null;

/**
 * TextArea Fieldtype - Multi-line text input.
 * @see {@link https://statamic.dev/fieldtypes/textarea|Statamic TextArea Fieldtype documentation}
 * @example
 * Optional text area field
 * ```ts
 * type Description = TextAreaField;
 * // Result: string | null
 * ```
 * @example
 * Required text area field
 * ```ts
 * type Description = NonNullable<TextAreaField>;
 * // Result: string
 * ```
 */
export type TextAreaField = string | null;

// ============================================================
// SECTION - Buttons & Controls
// Fields that provide selectable options or buttons that can control logic.
// ============================================================

/**
 * Button Group Fieldtype - Horizontal button group for single selection.
 * @template T - The value of the button group field
 * @see {@link https://statamic.dev/fieldtypes/button_group|Statamic Button Group Fieldtype documentation}
 * @example
 * Required button group field.
 * ```ts
 * type Alignment = ButtonGroupField<"left" | "center" | "right">;
 * // Result: {
 * //   value: "left" | "center" | "right",
 * //   label: string,
 * //   key: "left" | "center" | "right"
 * // }
 * ```
 * @example
 * Optional button group field.
 * ```ts
 * type Alignment = ButtonGroupField;
 * // Result: {
 * //   value: string | number | null,
 * //   label: string,
 * //   key: string | number | null,
 * // }
 * ```
 */
export type ButtonGroupField<T extends FieldValue = FieldValue> = LabeledValue<T>;

/**
 * Checkboxes Fieldtype - Multiple checkbox options.
 * @template T - The value type for each checkbox
 * @see {@link https://statamic.dev/fieldtypes/checkboxes|Statamic Checkboxes Fieldtype documentation}
 * @example
 * ```ts
 * type Features = CheckboxesField<"wifi" | "parking" | "pool">;
 * // Result: {
 * //   value: "wifi" | "parking" | "pool",
 * //   label: string,
 * //   key: "wifi" | "parking" | "pool"
 * // }[] | []
 * ```
 */
export type CheckboxesField<T extends NonNullableFieldValue = NonNullableFieldValue> = NonNullable<LabeledValue<T>>[];

/**
 * Dictionary Fieldtype - Select from predefined dictionary values.
 * @template T - The dictionary item structure (must include `value` property)
 * @see {@link https://statamic.dev/fieldtypes/dictionary|Statamic Dictionary Fieldtype documentation}
 * @example
 * ```ts
 * type Country = { value: string; name: string; code: string };
 * type Countries = DictionaryField<Country>;
 * // Result: {
 * //   value: string;
 * //   name: string;
 * //   code: string;
 * // }[]
 * ```
 */
export type DictionaryField<T extends ObjectValue<{ value: any }>> = T[];

/**
 * Radio Fieldtype - Radio button group for single selection.
 * @template T - The value type
 * @see {@link https://statamic.dev/fieldtypes/radio|Statamic Radio Fieldtype documentation}
 * @example
 * ```ts
 * type Gender = RadioField<"male" | "female">;
 * // Result: {
 * //   value: "left" | "center" | "right",
 * //   label: string,
 * //   key: "left" | "center" | "right"
 * // }[] | []
 * ```
 */
export type RadioField<T extends FieldValue = FieldValue> = LabeledValue<T>[];

/**
 * Range Fieldtype - Slider input for numeric values.
 * @see {@link https://statamic.dev/fieldtypes/range|Statamic Range Fieldtype documentation}
 * @example
 * ```ts
 * type Rating = RangeField;
 * // Result: number
 * ```
 */
export type RangeField = number;

/**
 * Revealer Fieldtype - Conditional field visibility control. (no data stored)
 * @see {@link https://statamic.dev/fieldtypes/revealer|Statamic Revealer Fieldtype documentation}
 * @example
 * ```ts
 * type Revealer = RevealerField;
 * // Result: null
 * ```
 */
export type RevealerField = null;

/**
 * Select Fieldtype - Dropdown select input.
 * @template T - The value type
 * @see {@link https://statamic.dev/fieldtypes/select|Statamic Select Fieldtype documentation}
 * @example
 * ```ts
 * type Category = SelectField<"news" | "blog" | "events">;
 * // Result: {
 * //   value: "news" | "blog" | "events",
 * //   label: string,
 * //   key: "news" | "blog" | "events"
 * // }[] | []
 *
 * type Tags = SelectField<string>;
 * // Result: {
 * //   value: string,
 * //   label: string,
 * //   key: string
 * // }[] | []
 * ```
 */
export type SelectField<T extends FieldValue> = SelectFieldSingle<T> | SelectFieldSingle<T>[];

/**
 * Select Fieldtype - Single select input.
 * @template T - The value type
 * @see {@link https://statamic.dev/fieldtypes/select|Statamic Select Fieldtype documentation}
 * @example
 * Single select field
 * ```ts
 * type Category = SelectFieldSingle<"news" | "blog" | "events">;
 * // Result: {
 * //   value: "news" | "blog" | "events",
 * //   label: string,
 * //   key: "news" | "blog" | "events"
 * // }
 */
export type SelectFieldSingle<T extends FieldValue> = LabeledValue<T>;

/**
 * Toggle Fieldtype - Boolean switch/toggle.
 * @see {@link https://statamic.dev/fieldtypes/toggle|Statamic Toggle Fieldtype documentation}
 * @example
 * ```ts
 * type IsActive = ToggleField;
 * // Result: boolean
 * ```
 */
export type ToggleField = boolean;

/**
 * Width Fieldtype - Width selector (typically for layout/grid systems).
 * @template T - The width value type
 * @see {@link https://statamic.dev/fieldtypes/width|Statamic Width Fieldtype documentation}
 * @example
 * ```ts
 * type ColumnWidth = Width<25 | 33 | 50 | 66 | 75 | 100>;
 * // Result: {
 * //   value: 25 | 33 | 50 | 66 | 75 | 100,
 * //   label: string,
 * //   key: 25 | 33 | 50 | 66 | 75 | 100
 * // }
 * ```
 */
export type WidthField<T extends FieldValue = FieldValue> = LabeledValue<T>;

// ============================================================
// SECTION - Media
// Fields that store images, videos, or other media.
// ============================================================

/**
 * Asset Fieldtype - Single asset selector.
 * @template T - Extended asset properties beyond the base AssetReference
 * @see {@link https://statamic.dev/fieldtypes/assets|Statamic Assets Fieldtype documentation}
 * @example
 * ```ts
 * type CustomAsset = { caption: string; credits: string };
 * type FeaturedImage = AssetField<CustomAsset>;
 * ```
 * @example
 * Required asset field
 * ```ts
 * type FeaturedImage = NonNullable<AssetField>;
 * // Result: {
 * //   alt: string;
 * //   height: number;
 * //   id: string;
 * //   permalink: string;
 * //   width: number;
 * // }
 */
export type AssetField<T extends Record<string, any> = Record<string, never>> = (AssetReference & T) | null;

/**
 * Assets Fieldtype - Multiple asset selector.
 * @template T - Extended asset properties beyond the base AssetReference
 * @see {@link https://statamic.dev/fieldtypes/assets|Statamic Assets Fieldtype documentation}
 * @example
 * ```ts
 * type FeaturedImage = AssetsField<{ caption: string; credits: string }>;
 * // Result: {
 * //  alt: string | null;
 * //  height: number;
 * //  id: string;
 * //  permalink: string | null;
 * //  width: number;
 * //  caption: string;
 * //  credits: string;
 * // }[] | []
 * ```
 * @example
 * Required assets field
 * ```ts
 * type FeaturedImages = NonNullable<AssetsField>;
 * // Result: {
 * //   alt: string;
 * //   height: number;
 * //   id: string;
 * //   permalink: string;
 * //   width: number;
 * // }[]
 * ```
 */
export type AssetsField<T extends Record<string, any> = Record<string, never>> = AssetField<T>[] | [];

/**
 * Icon Fieldtype - Icon selector (typically from an icon library).
 * @template T - Specific icon names for autocomplete
 * @see {@link https://statamic.dev/fieldtypes/icon|Statamic Icon Fieldtype documentation}
 * @example
 * ```ts
 * type HeroIcon = IconField<"home" | "user" | "settings" | "menu">;
 * ```
 */
export type IconField<T extends string = string> = T | null;

/**
 * Video Fieldtype - Video URL input with embed support.
 * @see {@link https://statamic.dev/fieldtypes/video|Statamic Video Fieldtype documentation}
 */
export type VideoField = string | null;

// ============================================================
// SECTION - Number
// Fields that store numbers.
// ============================================================

/**
 * Float Fieldtype - Decimal number input.
 * @template T - Specific float values or number type
 * @see {@link https://statamic.dev/fieldtypes/float|Statamic Float Fieldtype documentation}
 * @example
 * ```ts
 * type Price = FloatField;
 * // Result: number | null
 * ```
 */
export type FloatField = number | null;

/**
 * Integer Fieldtype - Whole number input.
 * @see {@link https://statamic.dev/fieldtypes/integer|Statamic Integer Fieldtype documentation}
 * @example
 * ```ts
 * type Age = IntegerField;
 * // Result: number | null
 * ```
 */
export type IntegerField = number | null;

// ============================================================
// SECTION - Relationship
// Fields that store relationships to other resources.
// ============================================================

/**
 * Collections Fieldtype - Collection selector.
 * @template T - Specific collection handles
 * @see {@link https://statamic.dev/fieldtypes/collections|Statamic Collections Fieldtype documentation}
 * @example
 * ```ts
 * type AllowedCollections = CollectionsField<"blog" | "news" | "pages">;
 * // Result: {
 * //   title: string,
 * //   handle: "blog" | "news" | "pages"
 * // }[] | []
 * ```
 */
export type CollectionsField<T extends string = string> = TitledHandle<T> | TitledHandle<T>[];

/**
 * Entries Fieldtype - Entry relationship field.
 * @template T - Collection handle of the entries
 * @template F - Extended entry properties beyond the base EntryReference (optional)
 * @see {@link https://statamic.dev/fieldtypes/entries|Statamic Entries Fieldtype documentation}
 * @example
 * ```ts
 * type RelatedPosts = EntriesField<"blog", { excerpt: string; featured_image: Asset }>;
 * // Result: {
 * //   id: string;
 * //   title: string;
 * //   slug: string;
 * //   uri: string;
 * //   api_url: string;
 * //   collection: {
 * //     title: string;
 * //     handle: "blog";
 * //   };
 * //   slugs?: Record<string, string> | null;
 * //   excerpt: string;
 * //   featured_image: Asset;
 * // } | {
 * //   id: string;
 * //   title: string;
 * //   slug: string;
 * //   uri: string;
 * //   api_url: string;
 * //   collection: {
 * //     title: string;
 * //     handle: "blog";
 * //   };
 * //   slugs?: Record<string, string> | null;
 * //   excerpt: string;
 * //   featured_image: Asset;
 * // }[]
 * ```
 */
export type EntriesField<
    T extends string = string,
    F extends Record<string, any> = Record<string, any>,
> = EntriesFieldSingle<T, F> | EntriesFieldSingle<T, F>[];

/**
 * Entries Fieldtype - Single entry relationship field.
 * @template T - The collection handle
 * @template F - Extended entry properties beyond the base EntryReference (optional)
 * @see {@link https://statamic.dev/fieldtypes/entries|Statamic Entries Fieldtype documentation}
 * @example
 * Single entry relationship field
 * ```ts
 * type RelatedPost = EntriesFieldSingle<"blog", { excerpt: string; featured_image: Asset }>;
 * // Result: {
 * //   id: string;
 * //   title: string;
 * //   slug: string;
 * //   uri: string;
 * //   api_url: string;
 * //   collection: {
 * //     title: string;
 * //     handle: "blog";
 * //   };
 * //   slugs?: Record<string, string> | null;
 * //   excerpt: string;
 * //   featured_image: Asset;
 * // }
 * ```
 */
export type EntriesFieldSingle<
    T extends string = string,
    F extends Record<string, any> = Record<string, any>,
> = (EntryReference<T> & F);

/**
 * Form Fieldtype - Form selector.
 * @template T - Specific form handles
 * @template F - Extended form properties beyond the base FormReference (optional)
 * @see {@link https://statamic.dev/fieldtypes/form|Statamic Form Fieldtype documentation}
 * @example
 * Single form handle
 * ```ts
 * type ContactForm = FormField<"contact">;
 * // Result: {
 * //   handle: "contact";
 * //   title: string;
 * //   api_url: string;
 * // } | null
 * ```
 * @example
 * Multiple form handles
 * ```ts
 * type AllowedForms = FormField<"contact" | "newsletter">;
 * // Result: {
 * //   handle: "contact" | "newsletter";
 * //   title: string;
 * //   api_url: string;
 * // } | null
 * ```
 * @example
 * Extended form properties
 * ```ts
 * type NewsletterForm = FormField<"newsletter", { email: string }>;
 * // Result: {
 * //   handle: "newsletter";
 * //   title: string;
 * //   api_url: string;
 * //   email: string;
 * // } | null
 * ```
 */
export type FormField<
    T extends string = string,
    F extends Record<string, any> = Record<string, any>,
> = (ObjectValue<FormReference<T>> & F) | null;

/**
 * Link Fieldtype - Flexible link field supporting multiple link types.
 * @see {@link https://statamic.dev/fieldtypes/link|Statamic Link Fieldtype documentation}
 */
export type LinkField = string | null;

/**
 * Navs Fieldtype - Navigation selector.
 * @template T - Navigation handle
 * @see {@link https://statamic.dev/fieldtypes/navs|Statamic Navs Fieldtype documentation}
 * @example
 * Single nav handle
 * ```ts
 * type MainNav = NavsField<"main">;
 * // Result: {
 * //   title: string;
 * //   handle: "main";
 * // } | {
 * //   title: string;
 * //   handle: "main";
 * // }[]
 * ```
 * @example
 * Multiple nav handles
 * ```ts
 * type AllowedNavs = NavsField<"main" | "footer">;
 * // Result: {
 * //   title: string;
 * //   handle: "main" | "footer";
 * // } | {
 * //   title: string;
 * //   handle: "main" | "footer";
 * // }[]
 * ```
 */
export type NavsField<T extends string = string> = TitledHandle<T> | TitledHandle<T>[];

/**
 * Sites Fieldtype - Site selector.
 * @template T - Additional site properties beyond the base Site
 * @see {@link https://statamic.dev/fieldtypes/sites|Statamic Sites Fieldtype documentation}
 * @example
 * ```ts
 * type AllSites = SitesField<{ is_active: boolean }>;
 * // Result: {
 * //  handle: string;
 * //  name: string;
 * //  lang: string;
 * //  locale: string;
 * //  short_locale: string;
 * //  url: string;
 * //  permalink: string;
 * //  direction: "ltr" | "rtl";
 * //  attributes: { is_active: boolean };
 * // } | {
 * //  handle: string;
 * //  name: string;
 * //  lang: string;
 * //  locale: string;
 * //  short_locale: string;
 * //  url: string;
 * //  permalink: string;
 * //  direction: "ltr" | "rtl";
 * //  attributes: { is_active: boolean };
 * // }[]
 * ```
 */
export type SitesField<T extends Record<string, any>> = SiteReference<T> | SiteReference<T>[];

/**
 * Structures Fieldtype - Structure selector.
 * @template T - Specific structure handles
 * @see {@link https://statamic.dev/fieldtypes/structures|Statamic Structures Fieldtype documentation}
 * @example
 * Single structure handle
 * ```ts
 * type MainStructure = StructuresField<"main">;
 * // Result: {
 * //   handle: "main";
 * //   title: string;
 * // } | {
 * //   handle: "main";
 * //   title: string;
 * // }[]
 * ```
 * @example
 * Multiple structure handles
 * ```ts
 * type AllStructures = StructuresField<"main" | "secondary">;
 * // Result: {
 * //   handle: "main" | "secondary";
 * //   title: string;
 * // } | {
 * //   handle: "main" | "secondary";
 * //   title: string;
 * // }[]
 * ```
 */
export type StructuresField<T extends string = string> = TitledHandle<T> | TitledHandle<T>[];

/**
 * Taxonomies Fieldtype - Taxonomy selector.
 * @template T - Specific taxonomy handles
 * @template F - Extended taxonomy properties beyond the base TaxonomyReference (optional)
 * @see {@link https://statamic.dev/fieldtypes/taxonomies|Statamic Taxonomies Fieldtype documentation}
 * @example
 * Single taxonomy handle
 * ```ts
 * type MainTaxonomy = TaxonomiesField<"main">;
 * // Result: {
 * //   handle: "main";
 * //   title: string;
 * //   url: string;
 * //   uri: string;
 * //   permalink: string;
 * //   color: string;
 * // } | {
 * //   handle: "main";
 * //   title: string;
 * //   url: string;
 * //   uri: string;
 * //   permalink: string;
 * //   color: string;
 * // }[]
 * ```
 * @example
 * Multiple taxonomy handles
 * ```ts
 * type AllTaxonomies = TaxonomiesField<"main" | "secondary">;
 * // Result: {
 * //   handle: "main" | "secondary";
 * //   title: string;
 * //   url: string;
 * //   uri: string;
 * //   permalink: string;
 * //   color: string;
 * // } | {
 * //   handle: "main" | "secondary";
 * //   title: string;
 * //   url: string;
 * //   uri: string;
 * //   permalink: string;
 * //   color: string;
 * // }[]
 * ```
 * @example
 * Extended taxonomy properties
 * ```ts
 * type MainTaxonomy = TaxonomiesField<"main", { color: string }>;
 * // Result: {
 * //   handle: "main";
 * //   title: string;
 * //   url: string;
 * //   uri: string;
 * //   permalink: string;
 * //   color: string;
 * // } | {
 * //   handle: "main";
 * //   title: string;
 * //   url: string;
 * //   uri: string;
 * //   permalink: string;
 * //   color: string;
 * // }[]
 * ```
 */
export type TaxonomiesField<
    T extends string = string,
    F extends Record<string, any> = Record<string, any>,
> = TaxonomiesFieldSingle<T, F> | TaxonomiesFieldSingle<T, F>[];

/**
 * Taxonomies Fieldtype - Single taxonomy relationship field.
 * @template T - The collection handle
 * @template F - Extended taxonomy properties beyond the base TaxonomyReference (optional)
 * @see {@link https://statamic.dev/fieldtypes/taxonomies|Statamic Taxonomies Fieldtype documentation}
 * @example
 * Single taxonomy relationship field
 * ```ts
 * type RelatedTaxonomy = TaxonomiesFieldSingle<"main", { color: string }>;
 * // Result: {
 * //   id: string;
 * //   title: string;
 * //   url: string;
 * //   uri: string;
 * //   permalink: string;
 * //   color: string;
 * // }
 * ```
 */
export type TaxonomiesFieldSingle<
    T extends string = string,
    F extends Record<string, any> = Record<string, any>,
> = (TaxonomyReference<T> & F);

/**
 * Terms Fieldtype - Taxonomy term selector.
 * @template T - Extended term properties beyond the base TermReference
 * @see {@link https://statamic.dev/fieldtypes/terms|Statamic Terms Fieldtype documentation}
 * @example
 * Extended term properties
 * ```ts
 * type MainTerm = TermsField<{ color: string }>;
 * // Result: {
 * //   id: string;
 * //   url: string;
 * //   slug: string;
 * //   permalink: string;
 * //   color: string;
 * // } | {
 * //   id: string;
 * //   url: string;
 * //   slug: string;
 * //   permalink: string;
 * //   color: string;
 * // }[]
 * ```
 */
export type TermsField<T extends Record<string, any> = Record<string, any>> = (TermsFieldSingle<T>) | (TermsFieldSingle<T>)[];

/**
 * Terms Fieldtype - Single term relationship field.
 * @template T - Extended term properties beyond the base TermReference
 * @see {@link https://statamic.dev/fieldtypes/terms|Statamic Terms Fieldtype documentation}
 * @example
 * Single term relationship field
 * ```ts
 * type MainTerm = TermsFieldSingle<{ color: string }>;
 * // Result: {
 * //   id: string;
 * //   url: string;
 * //   slug: string;
 * //   permalink: string;
 * //   color: string;
 * // }
 * ```
 */
export type TermsFieldSingle<T extends Record<string, any> = Record<string, any>> = (TermReference & T);

/**
 * UserGroups Fieldtype - User group selector.
 * @template T - Specific user group handles
 * @see {@link https://statamic.dev/fieldtypes/user-groups|Statamic User Groups Fieldtype documentation}
 * @example
 * ```ts
 * type AdminsUserGroup = UserGroupsField<"admins">;
 * // Result: {
 * //   handle: "admins";
 * //   title: string;
 * //   roles: {
 * //     "*items": {
 * //       [key: string]: {
 * //         title: string;
 * //         handle: string;
 * //       };
 * //     "*escapeWhenCastingToString": boolean;
 * //   };
 * // } | {
 * //   handle: "admins";
 * //   title: string;
 * //   roles: {
 * //     "*items": {
 * //       [key: string]: {
 * //         title: string;
 * //         handle: string;
 * //       };
 * //     "*escapeWhenCastingToString": boolean;
 * //   };
 * // }[]
 * ```
 */
export type UserGroupsField<T extends string = string> = UserGroupReference<T> | UserGroupReference<T>[];

/**
 * UserRoles Fieldtype - User role selector.
 * @template T - Specific user role handles
 * @see {@link https://statamic.dev/fieldtypes/user-roles|Statamic User Roles Fieldtype documentation}
 * @example
 * ```ts
 * type AdminsUserRole = UserRolesField<"admin">;
 * // Result: {
 * //   handle: "admin";
 * //   title: string;
 * // } | {
 * //   handle: "admin";
 * //   title: string;
 * // }[]
 * ```
 */
export type UserRolesField<T extends string = string> = TitledHandle<T> | TitledHandle<T>[];

/**
 * Users Fieldtype - User selector.
 * @see {@link https://statamic.dev/fieldtypes/users|Statamic Users Fieldtype documentation}
 * @example
 * ```ts
 * type Users = UsersField;
 * // Result: {
 * //   id: string;
 * //   name: string;
 * //   email: string;
 * //   api_url: string;
 * // } | {
 * //   id: string;
 * //   name: string;
 * //   email: string;
 * //   api_url: string;
 * // }[]
 * ```
 */
export type UsersField = UserReference | UserReference[];

// ============================================================
// SECTION - Structured Fields
// Fields that store structured data. Some can even nest other fields inside themselves.
// ============================================================

/**
 * Array Fieldtype - Key-value array field.
 *
 * Supports both dynamic keys (when keys aren't known ahead of time) and specific keyed values.
 * @template T - Array of specific keys, or string for dynamic keys
 * @see {@link https://statamic.dev/fieldtypes/array|Statamic Array Fieldtype documentation}
 * @example
 * Dynamic keys
 * ```ts
 * type DynamicArray = ArrayField;
 * // Result: Record<string, string | null> | []
 * ```
 * @example
 * Specific keys
 * ```ts
 * type SocialLinks = ArrayField<["twitter", "facebook", "linkedin"]>;
 * // Result: Record<"twitter" | "facebook" | "linkedin", string> | null
 * ```
 */
export type ArrayField<T extends string[] | string = string>
    = T extends string[]
        ? Partial<{ [key in T[number]]: string }> | [] // Keyed array
        : { [key: string]: string } | null; // Dynamic array

/**
 * Grid Fieldtype - Tabular data with defined columns.
 * @template T - The structure of each row (fields beyond the required id)
 * @see {@link https://statamic.dev/fieldtypes/grid|Statamic Grid Fieldtype documentation}
 * @example
 * ```ts
 * type Grid = GridField<{ title: string; content: string }>;
 * // Result: {
 * //   id: string;
 * //   title: string;
 * //   content: string;
 * // }[]
 * ```
 */
export type GridField<T extends Record<string, any> = Record<string, any>> = ({ id: string } & T)[];

/**
 * Group Fieldtype - Groups multiple fields together.
 * @template T - The structure of fields within the group
 * @see {@link https://statamic.dev/fieldtypes/group|Statamic Group Fieldtype documentation}
 * @example
 * ```ts
 * type Author = GroupField<{ name: TextField, bio: TextAreaField, avatar: AssetField }>;
 * // Result: {
 * //   name: string;
 * //   bio: string;
 * //   avatar: {
 * //     alt: string | null;
 * //     height: number;
 * //     id: string;
 * //     permalink: string | null;
 * //     width: number;
 * //   };
 * // }
 * ```
 */
export type GroupField<T extends Record<string, any> = Record<string, any>> = T;

/**
 * List Fieldtype - Simple list of items.
 * @see {@link https://statamic.dev/fieldtypes/list|Statamic List Fieldtype documentation}
 * @example
 * ```ts
 * type List = ListField;
 * // Result: string[]
 * ```
 */
export type ListField = string[];

/**
 * Replicator Fieldtype - Flexible content builder with repeatable sets.
 * @template T - Union of set types (must include `type` and `id` properties)
 * @see {@link https://statamic.dev/fieldtypes/replicator|Statamic Replicator Fieldtype documentation}
 * @example
 * ```ts
 * type TextBlock = ReplicatorFieldSet<{ type: "text"; content: Text }>;
 * type ImageBlock = ReplicatorFieldSet<{ type: "image"; image: Asset; caption: Text }>;
 * type ButtonBlock = ReplicatorFieldSet<{ type: "button"; label: Text; url: Text }>;
 *
 * type ContentBlocks = ReplicatorField<TextBlock | ImageBlock | ButtonBlock>;
 * ```
 */
export type ReplicatorField<T extends Record<string, any> = Record<string, any>> = ReplicatorFieldSet<T>[];

/**
 * Replicator set structure with type discrimination.
 * @template T - The structure of the replicator set
 * @example
 * ```ts
 * type TextBlock = ReplicatorFieldSet<{ type: "text"; content: Text }>;
 * type ImageBlock = ReplicatorFieldSet<{ type: "image"; image: Asset; caption: Text }>;
 * type ButtonBlock = ReplicatorFieldSet<{ type: "button"; label: Text; url: Text }>;
 * ```
 */
export type ReplicatorFieldSet<T extends Record<string, any> = Record<string, any>> = { type: string; id: string } & T;

/**
 * Table Fieldtype - Spreadsheet-like table data.
 * @see {@link https://statamic.dev/fieldtypes/table|Statamic Table Fieldtype documentation}
 * @example
 * ```ts
 * type Table = TableField;
 * // Result: {
 * //   cells: string[];
 * // }[]
 * ```
 */
export type TableField = { cells: string[] }[];

/**
 * Taggable Fieldtype - Tag input (manual or from taxonomy).
 * @template T - Specific tag values for autocomplete
 * @see {@link https://statamic.dev/fieldtypes/taggable|Statamic Taggable Fieldtype documentation}
 * @example
 * ```ts
 * type PostTags = TaggableField<"featured" | "popular" | "trending">;
 * // Result: ("featured" | "popular" | "trending" | string)[]
 * ```
 */
export type TaggableField<T extends string = string> = (T | (string & {}))[];

// ============================================================
// SECTION - Special Fields
// These fields are special, each in their own way.
// ============================================================

// AdvancedSEO
export type AdvancedSEOField<T> = T | null;

/**
 * Color Fieldtype - Color picker with hex format.
 * @see {@link https://statamic.dev/fieldtypes/color|Statamic Color Fieldtype documentation}
 * @example
 * ```ts
 * type ThemeColor = ColorField; // "#ff0000"
 * // Result: string | null
 * ```
 */
export type ColorField = string | null;

/**
 * Date Fieldtype - Date picker.
 * @see {@link https://statamic.dev/fieldtypes/date|Statamic Date Fieldtype documentation}
 * @example
 * ```ts
 * type PublishDate = DateField; // "2025-10-08T22:00:00.000000Z"
 * // Result: string | null
 * ```
 */
export type DateField = string | null;

/**
 * Hidden Fieldtype - Hidden field. (no data stored)
 * @see {@link https://statamic.dev/fieldtypes/hidden|Statamic Hidden Fieldtype documentation}
 * @example
 * ```ts
 * type Hidden = HiddenField;
 * // Result: null
 * ```
 */
export type HiddenField = null;

/**
 * HTML Fieldtype - HTML displayed in the CMS. (no data stored)
 * @see {@link https://statamic.dev/fieldtypes/html|Statamic HTML Fieldtype documentation}
 * @example
 * ```ts
 * type HTML = HTMLField;
 * // Result: null
 * ```
 */
export type HTMLField = null;

/**
 * Section Fieldtype - Visual section divider. (no data stored)
 * @see {@link https://statamic.dev/fieldtypes/section|Statamic Section Fieldtype documentation}
 * @example
 * ```ts
 * type Section = SectionField;
 * // Result: null
 * ```
 */
export type SectionField = null;

/**
 * Slug Fieldtype - URL-friendly slug.
 * @see {@link https://statamic.dev/fieldtypes/slug|Statamic Slug Fieldtype documentation}
 * @example
 * ```ts
 * type Slug = SlugField;
 * // Result: string | null
 * ```
 */
export type SlugField = string | null;

/**
 * Spacer Fieldtype - Visual spacer. (no data stored)
 * @see {@link https://statamic.dev/fieldtypes/spacer|Statamic Spacer Fieldtype documentation}
 * @example
 * ```ts
 * type Spacer = SpacerField;
 * // Result: null
 * ```
 */
export type SpacerField = null;

/**
 * Template Fieldtype - Template selector.
 *
 * Default available string values are `default` and `@blueprint`.
 * @template T - Specific template names
 * @see {@link https://statamic.dev/fieldtypes/template|Statamic Template Fieldtype documentation}
 * @example
 * ```ts
 * type Template = TemplateField;
 * // Result: "default" | "@blueprint" | string | null
 * ```
 */
export type TemplateField<T extends string = never>
    = [T] extends [never]
        ? (string & {}) | 'default' | '@blueprint' | null
        : string extends T
            ? string | null
            : (T | 'default' | '@blueprint') | null;

/**
 * Time Fieldtype - Time picker.
 * @see {@link https://statamic.dev/fieldtypes/time|Statamic Time Fieldtype documentation}
 * @example
 * ```ts
 * type Time = TimeField;
 * // Result: string | null
 * ```
 */
export type TimeField = string | null;

/**
 * YAML Fieldtype - YAML editor.
 * @see {@link https://statamic.dev/fieldtypes/yaml|Statamic YAML Fieldtype documentation}
 * @example
 * ```ts
 * type Yaml = YamlField;
 * // Result: Record<string, any> | string | null
 * ```
 */
export type YamlField = Record<string, any> | string | null;
