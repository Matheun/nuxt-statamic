export default defineAppConfig({
    dir: 'ltr',
    toaster: {
        position: 'bottom-right' as const,
        duration: 5000,
        max: 5,
        expand: true,
        disableSwipe: false,
    },
    ui: {
        colors: {
            primary: 'green',
            neutral: 'zinc',
        },
    },
    navigation: {
        items: [
            {
                label: 'Home',
                icon: 'i-lucide-home',
                to: '/',
            },
        ],
        groups: [
            {
                label: 'Composables',
                icon: 'i-lucide:arrow-right-left',
                children: [
                    {
                        label: 'useStatamicApi',
                        to: '/composables/useStatamicApi',
                    },
                ],
            },
        ],
    },
});
