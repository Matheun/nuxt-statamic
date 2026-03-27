<script setup lang="ts">
import { useStatamicClient } from '#imports';

const client = useStatamicClient();

const { data: dataValid } = await useAsyncData('pages-valid', () => client('/collections/pages/entries'));
const { data: dataInvalidRoute } = await useAsyncData('pages-invalid-route', () => client('/collections/pages/entries-invalid'));
const { data: dataInvalidFilter } = await useAsyncData('pages-invalid-filter', () => client('/collections/pages/entries?filter[test]=new'));

watchEffect(() => {
    console.log(dataValid.value);
    console.log(dataInvalidRoute.value);
    console.log(dataInvalidFilter.value);
});
</script>

<template>
    <div>
        <h1>useStatamicApi</h1>
    </div>
</template>
