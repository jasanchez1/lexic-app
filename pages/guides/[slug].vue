<template>
  <div class="min-h-screen bg-gray-50">
    <GuideComponent :slug="Array.isArray($route.params.slug) ? $route.params.slug[0] : $route.params.slug" />
  </div>
</template>

<script setup lang="ts">
import GuideComponent from '~/components/guides/GuideComponent.vue'
</script>
