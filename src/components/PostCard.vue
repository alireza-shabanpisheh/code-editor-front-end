<script setup lang="ts">

const { likes = 100 } =  defineProps<{
    title: string;
    likes?: number;
}>()



</script>
<template>
    <div class="post-card">
        <h2>{{ title }}</h2>
        <p>Likes: {{ likes }}</p>
    </div>
</template>


<style scoped></style>
