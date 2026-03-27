export default defineNuxtConfig({
    modules: [
        'nuxtjs-statamic',
        '@nuxt/ui',
    ],

    devtools: {
        enabled: true,
    },

    compatibilityDate: 'latest',

    css: ['~/assets/css/main.css'],

    vite: {
        optimizeDeps: {
            include: [
                '@vue/devtools-core',
                '@vue/devtools-kit',
            ],
        },
    },

    statamic: {},
});
