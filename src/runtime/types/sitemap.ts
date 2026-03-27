// ============================================================
// Sitemap-related types for Statamic.
// ============================================================

export type StatamicSitemapChangefreq = 'always' | 'hourly' | 'daily' | 'weekly' | 'monthly' | 'yearly' | 'never';

export type StatamicSitemapUrl = {
    loc: string;
    lastmod?: string | Date;
    changefreq?: StatamicSitemapChangefreq;
    priority?: 0 | 0.1 | 0.2 | 0.3 | 0.4 | 0.5 | 0.6 | 0.7 | 0.8 | 0.9 | 1;
    alternatives?: StatamicSitemapAlternativeEntry[];
    _i18nTransform?: boolean;
    _sitemap?: string | false;
};

export type StatamicSitemapAlternativeEntry = {
    hreflang: string;
    href: string | URL;
};
