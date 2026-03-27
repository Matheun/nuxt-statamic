// ============================================================
// SEO-related types for Statamic.
// ============================================================

export type StatamicSeoObjectType = {
    value: string;
    label: string;
    key: string;
};

export type StatamicSeoJsonLd = {
    value: string;
    code: string;
    mode: string;
};

export type StatamicSeoImage = {
    id: string;
    title: string;
    path: string;
    filename: string;
    basename: string;
    extension: string;
    is_asset: boolean;
    is_audio: boolean;
    is_previewable: boolean;
    is_image: boolean;
    is_svg: boolean;
    is_video: boolean;
    blueprint: {
        title: string;
        handle: string;
    };
    edit_url: string;
    container: {
        id: string;
        title: string;
        handle: string;
        disk: string;
        blueprint: {
            title: string;
            handle: string;
        };
        search_index: any;
        api_url: any;
    };
    folder: string;
    url: string;
    permalink: string;
    api_url: string;
    size: string;
    size_bytes: number;
    size_kilobytes: number;
    size_megabytes: number;
    size_gigabytes: number;
    size_b: number;
    size_kb: number;
    size_mb: number;
    size_gb: number;
    last_modified: string;
    last_modified_timestamp: number;
    last_modified_instance: string;
    focus: string;
    has_focus: boolean;
    focus_css: string;
    height: number;
    width: number;
    orientation: string;
    ratio: number;
    mime_type: string;
    duration: any;
    duration_seconds: any;
    duration_minutes: any;
    duration_sec: any;
    duration_min: any;
    playtime: string;
    alt: string | null;
};

export type StatamicSeoSitemapPriority = StatamicSeoObjectType;
export type StatamicSeoSiteNamePosition = StatamicSeoObjectType;
export type StatamicSeoTwitterCard = StatamicSeoObjectType;

export type StatamicSeoData = {
    seo_canonical_custom: string | null;
    seo_canonical_entry: Record<string, any> | null;
    seo_canonical_type: StatamicSeoObjectType;
    seo_description: string;
    seo_json_ld: StatamicSeoJsonLd;
    seo_nofollow: boolean;
    seo_noindex: boolean;
    seo_og_description: string;
    seo_og_image: StatamicSeoImage;
    seo_og_title: string;
    seo_site_name_position: StatamicSeoSiteNamePosition;
    seo_sitemap_change_frequency: StatamicSeoObjectType;
    seo_sitemap_enabled: boolean;
    seo_sitemap_priority: StatamicSeoSitemapPriority;
    seo_title: string;
    seo_twitter_card: StatamicSeoTwitterCard;
    seo_twitter_description: string;
    seo_twitter_summary_image: StatamicSeoImage;
    seo_twitter_summary_large_image: StatamicSeoImage | null;
    seo_twitter_title: string;
};
