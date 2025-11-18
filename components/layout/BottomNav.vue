<template>
  <nav class="bottom-nav">
    <NuxtLink
      v-for="item in navItems"
      :key="item.path"
      :to="item.path"
      class="nav-item"
      :class="{ 'nav-item-active': isActive(item.path) }"
    >
      <i :class="item.icon"></i>
      <span class="nav-label">{{ item.label }}</span>
    </NuxtLink>
  </nav>
</template>

<script setup>
import { computed } from 'vue'
import { useRoute } from 'vue-router'

const route = useRoute()

/**
 * Items de navigation
 */
const navItems = [
  {
    path: '/home',
    icon: 'pi pi-home',
    label: 'Accueil'
  },
  {
    path: '/votes',
    icon: 'pi pi-chart-bar',
    label: 'Mes Votes'
  },
  {
    path: '/groups',
    icon: 'pi pi-users',
    label: 'Groupes'
  },
  {
    path: '/profile',
    icon: 'pi pi-user',
    label: 'Profil'
  }
]

/**
 * Vérifie si un item est actif
 */
const isActive = (path) => {
  return route.path === path || route.path.startsWith(path + '/')
}
</script>

<style scoped lang="scss">
.bottom-nav {
  position: fixed;
  bottom: 0;
  left: 0;
  right: 0;
  background: var(--background-primary);
  border-top: 2px solid var(--border-color);
  display: flex;
  justify-content: space-around;
  align-items: center;
  padding: var(--spacing-sm) 0;
  z-index: 1000;
  box-shadow: 0 -4px 20px rgba(0, 0, 0, 0.08);

  @supports (padding-bottom: env(safe-area-inset-bottom)) {
    padding-bottom: calc(var(--spacing-sm) + env(safe-area-inset-bottom));
  }
}

.nav-item {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: var(--spacing-xs);
  padding: var(--spacing-sm) var(--spacing-md);
  border-radius: var(--radius-md);
  text-decoration: none;
  color: var(--text-secondary);
  transition: all var(--transition-base) var(--transition-ease);
  min-width: 70px;

  i {
    font-size: 1.5rem;
    transition: all var(--transition-base) var(--transition-ease);
  }

  &:hover {
    background: var(--background-tertiary);
    color: var(--color-primary);

    i {
      transform: scale(1.1);
    }
  }

  &.nav-item-active {
    color: var(--color-primary);

    i {
      font-size: 1.6rem;
      font-weight: 700;
    }

    .nav-label {
      font-weight: 700;
    }
  }
}

.nav-label {
  font-size: 0.75rem;
  font-weight: 600;
  text-align: center;
  white-space: nowrap;
}
</style>
