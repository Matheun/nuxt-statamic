<script setup lang="ts">
import type { NuxtError } from '#app';

defineProps<{
    error: NuxtError;
}>();
</script>

<template>
    <NuxtLayout>
        <UDashboardNavbar class="border-b-0" />

        <UError :error="error" />
    </NuxtLayout>
</template>
