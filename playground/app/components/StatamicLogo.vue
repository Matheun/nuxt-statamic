<script setup lang="ts">
type MarkColor = 'black' | 'lime' | 'pink' | 'white';
type LogoColor = MarkColor | 'lime-black' | 'lime-solid' | 'lime-white' | 'yellow';

const {
    variant = 'logo',
    color = 'lime',
} = defineProps<{
    variant?: 'logo' | 'mark';
    color?: MarkColor | LogoColor;
}>();

const src = computed(() => {
    const prefix = variant === 'mark' ? 'statamic-mark' : 'statamic-logo';
    return `/logo/${prefix}-${color}.svg`;
});
</script>

<template>
    <img :src="src" alt="Statamic">
</template>
