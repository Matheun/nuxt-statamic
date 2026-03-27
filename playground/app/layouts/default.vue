<script setup lang="ts">
const route = useRoute();
const appConfig = useAppConfig();
const colorMode = useColorMode();

const items = computed(() => appConfig.navigation.items);
const groups = computed(() => appConfig.navigation.groups);

const isDark = computed({
    get() {
        return colorMode.value === 'dark';
    },
    set(_isDark) {
        colorMode.preference = _isDark ? 'dark' : 'light';
    },
});
</script>

<template>
    <UApp :dir="appConfig.dir" :toaster="appConfig.toaster">
        <UDashboardGroup unit="rem">
            <UDashboardSidebar class="bg-elevated/25">
                <template #header>
                    <NuxtLink aria-label="Home" class="text-highlighted" to="/">
                        <ClientOnly>
                            <StatamicLogo :color="isDark ? 'lime-white' : 'lime'" class="h-6 w-auto" />
                        </ClientOnly>
                    </NuxtLink>

                    <div class="flex items-center ms-auto">
                        <UColorModeButton />
                    </div>
                </template>

                <UDashboardSearchButton />

                <UNavigationMenu :items="items" orientation="vertical" />

                <USeparator type="dashed" />

                <UNavigationMenu :items="groups" orientation="vertical" />
            </UDashboardSidebar>

            <UDashboardPanel :ui="{ body: ['justify-center items-center', route.path.startsWith('/components') && 'mt-16'] }">
                <template #body>
                    <slot />
                </template>
            </UDashboardPanel>
            <UDashboardSearch :fuse="{ resultLimit: 100 }" :groups="groups" />
        </UDashboardGroup>
    </UApp>
</template>
