<script setup>
/**
 * Page d'index - Redirige automatiquement vers la page d'accueil
 */
definePageMeta({
  middleware: (to) => {
    return navigateTo('/home', { redirectCode: 301 })
  }
})
</script>

<template>
  <!-- La redirection se fait via le middleware -->
  <div></div>
</template>
