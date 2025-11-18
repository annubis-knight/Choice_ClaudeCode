<template>
  <div class="groups-page">
    <!-- Header -->
    <header class="groups-header">
      <h1 class="page-title">Mes Groupes</h1>
      <p class="page-subtitle">Gérez vos groupes de sondage</p>
    </header>

    <!-- Bouton créer un groupe -->
    <div class="create-button-container">
      <button class="btn-create" @click="showCreateModal = true">
        <i class="pi pi-plus"></i>
        Créer un groupe
      </button>
    </div>

    <!-- Liste des groupes -->
    <main class="groups-main">
      <div v-if="groups.length > 0" class="groups-grid">
        <div
          v-for="group in groups"
          :key="group.id"
          class="group-card"
          @click="goToGroup(group.id)"
        >
          <!-- Avatar du groupe -->
          <div class="group-avatar">
            <img
              v-if="group.avatar"
              :src="group.avatar"
              :alt="group.name"
            />
            <div v-else class="group-avatar-placeholder">
              {{ getInitials(group.name) }}
            </div>
          </div>

          <!-- Contenu -->
          <div class="group-content">
            <h3 class="group-name">{{ group.name }}</h3>
            <p class="group-description">{{ group.description }}</p>

            <!-- Métadonnées -->
            <div class="group-meta">
              <span class="meta-item">
                <i class="pi pi-users"></i>
                {{ group.memberCount }} membre{{ group.memberCount > 1 ? 's' : '' }}
              </span>
              <span class="meta-item">
                <i class="pi pi-chart-line"></i>
                {{ group.pollCount }} sondage{{ group.pollCount > 1 ? 's' : '' }}
              </span>
            </div>

            <!-- Badge admin -->
            <div v-if="group.isAdmin" class="group-badge">
              <i class="pi pi-shield"></i>
              Admin
            </div>
          </div>
        </div>
      </div>

      <!-- État vide -->
      <div v-else class="empty-state">
        <i class="pi pi-users"></i>
        <p>Vous n'avez pas encore de groupe</p>
        <p class="empty-state-hint">Créez votre premier groupe ou demandez à être invité</p>
        <button class="btn-primary" @click="showCreateModal = true">
          <i class="pi pi-plus"></i>
          Créer mon premier groupe
        </button>
      </div>
    </main>

    <!-- Modal création (placeholder) -->
    <div v-if="showCreateModal" class="modal-overlay" @click="showCreateModal = false">
      <div class="modal-content" @click.stop>
        <div class="modal-header">
          <h2>Créer un groupe</h2>
          <button class="modal-close" @click="showCreateModal = false">
            <i class="pi pi-times"></i>
          </button>
        </div>
        <div class="modal-body">
          <p class="modal-hint">
            <i class="pi pi-info-circle"></i>
            Cette fonctionnalité sera bientôt disponible
          </p>
        </div>
      </div>
    </div>

    <!-- Bottom Navigation -->
    <BottomNav />
  </div>
</template>

<script setup>
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import BottomNav from '~/components/layout/BottomNav.vue'

const router = useRouter()

/**
 * Configuration de la page
 */
definePageMeta({
  title: 'Mes Groupes',
  layout: 'default'
})

/**
 * État du modal de création
 */
const showCreateModal = ref(false)

/**
 * Données de démonstration
 * TODO: Remplacer par un vrai appel API
 */
const groups = ref([
  {
    id: 'g1',
    name: 'Amis de la promo',
    description: 'Les copains du BTS 2024',
    memberCount: 12,
    pollCount: 5,
    isAdmin: true,
    avatar: null
  },
  {
    id: 'g2',
    name: 'Famille Martin',
    description: 'La famille au complet',
    memberCount: 6,
    pollCount: 3,
    isAdmin: false,
    avatar: null
  },
  {
    id: 'g3',
    name: 'Gamers United',
    description: 'Team gaming du vendredi soir',
    memberCount: 8,
    pollCount: 12,
    isAdmin: true,
    avatar: null
  },
  {
    id: 'g4',
    name: 'Collègues Bureau 3',
    description: 'L\'équipe marketing',
    memberCount: 15,
    pollCount: 7,
    isAdmin: false,
    avatar: null
  }
])

/**
 * Obtenir les initiales d'un nom
 */
const getInitials = (name) => {
  return name
    .split(' ')
    .map(word => word[0])
    .join('')
    .toUpperCase()
    .slice(0, 2)
}

/**
 * Naviguer vers un groupe
 */
const goToGroup = (groupId) => {
  // TODO: Créer une page de détails du groupe
  console.log('Naviguer vers le groupe:', groupId)
}
</script>

<style scoped lang="scss">
.groups-page {
  min-height: 100vh;
  background: var(--background-primary);
  padding-bottom: 80px; /* Espace pour la bottom nav */
}

/* Header */
.groups-header {
  padding: var(--spacing-2xl) var(--spacing-lg);
  text-align: center;
}

.page-title {
  font-size: 2.5rem;
  font-weight: 800;
  margin: 0 0 var(--spacing-sm) 0;
  color: var(--text-primary);

  @media (max-width: 768px) {
    font-size: 2rem;
  }
}

.page-subtitle {
  font-size: 1.125rem;
  color: var(--text-secondary);
  margin: 0;
}

/* Bouton créer */
.create-button-container {
  padding: 0 var(--spacing-lg) var(--spacing-xl);
  display: flex;
  justify-content: center;
}

.btn-create {
  display: flex;
  align-items: center;
  gap: var(--spacing-sm);
  padding: var(--spacing-md) var(--spacing-xl);
  background: var(--color-primary);
  color: var(--text-primary);
  border: none;
  border-radius: var(--radius-lg);
  font-weight: 700;
  font-size: 1rem;
  cursor: pointer;
  transition: all var(--transition-base) var(--transition-ease);
  box-shadow: var(--shadow-md);

  i {
    font-size: 1.2rem;
  }

  &:hover {
    transform: translateY(-2px);
    box-shadow: var(--shadow-lg);
  }

  &:active {
    transform: translateY(0);
  }
}

/* Main */
.groups-main {
  padding: 0 var(--spacing-lg) var(--spacing-2xl);
}

.groups-grid {
  max-width: 1200px;
  margin: 0 auto;
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
  gap: var(--spacing-lg);

  @media (max-width: 768px) {
    grid-template-columns: 1fr;
  }
}

.group-card {
  background: var(--background-secondary);
  border-radius: var(--radius-lg);
  border: 2px solid var(--border-color);
  padding: var(--spacing-lg);
  cursor: pointer;
  transition: all var(--transition-base) var(--transition-ease);
  box-shadow: var(--shadow-sm);
  display: flex;
  gap: var(--spacing-lg);
  align-items: flex-start;
  position: relative;

  &:hover {
    transform: translateY(-4px);
    box-shadow: var(--shadow-lg);
    border-color: var(--color-primary);
  }
}

.group-avatar {
  flex-shrink: 0;
  width: 60px;
  height: 60px;
  border-radius: var(--radius-full);
  overflow: hidden;

  img {
    width: 100%;
    height: 100%;
    object-fit: cover;
  }
}

.group-avatar-placeholder {
  width: 100%;
  height: 100%;
  background: linear-gradient(135deg, var(--color-primary) 0%, #f0a500 100%);
  color: var(--text-primary);
  display: flex;
  align-items: center;
  justify-content: center;
  font-weight: 800;
  font-size: 1.5rem;
}

.group-content {
  flex: 1;
}

.group-name {
  font-size: 1.25rem;
  font-weight: 700;
  color: var(--text-primary);
  margin: 0 0 var(--spacing-xs) 0;
}

.group-description {
  font-size: 0.95rem;
  color: var(--text-secondary);
  margin: 0 0 var(--spacing-md) 0;
}

.group-meta {
  display: flex;
  gap: var(--spacing-md);
  flex-wrap: wrap;
}

.meta-item {
  display: flex;
  align-items: center;
  gap: var(--spacing-xs);
  font-size: 0.9rem;
  color: var(--text-secondary);
  font-weight: 500;

  i {
    color: var(--color-primary);
  }
}

.group-badge {
  position: absolute;
  top: var(--spacing-md);
  right: var(--spacing-md);
  display: flex;
  align-items: center;
  gap: var(--spacing-xs);
  padding: var(--spacing-xs) var(--spacing-sm);
  background: var(--color-primary);
  color: var(--text-primary);
  border-radius: var(--radius-sm);
  font-size: 0.75rem;
  font-weight: 700;
}

/* État vide */
.empty-state {
  text-align: center;
  padding: var(--spacing-3xl) var(--spacing-lg);
  color: var(--text-secondary);

  i {
    font-size: 5rem;
    color: var(--text-muted);
    margin-bottom: var(--spacing-lg);
  }

  p {
    font-size: 1.25rem;
    margin: var(--spacing-md) 0;

    &.empty-state-hint {
      font-size: 1rem;
      color: var(--text-muted);
      margin-bottom: var(--spacing-xl);
    }
  }
}

.btn-primary {
  display: inline-flex;
  align-items: center;
  gap: var(--spacing-sm);
  padding: var(--spacing-md) var(--spacing-xl);
  background: var(--color-primary);
  color: var(--text-primary);
  border: none;
  border-radius: var(--radius-lg);
  font-weight: 700;
  font-size: 1rem;
  cursor: pointer;
  transition: all var(--transition-base) var(--transition-ease);

  &:hover {
    transform: translateY(-2px);
    box-shadow: var(--shadow-lg);
  }
}

/* Modal */
.modal-overlay {
  position: fixed;
  inset: 0;
  background: rgba(0, 0, 0, 0.5);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 2000;
  padding: var(--spacing-lg);
}

.modal-content {
  background: var(--background-primary);
  border-radius: var(--radius-xl);
  max-width: 500px;
  width: 100%;
  box-shadow: var(--shadow-2xl);
}

.modal-header {
  padding: var(--spacing-xl);
  border-bottom: 2px solid var(--border-color);
  display: flex;
  justify-content: space-between;
  align-items: center;

  h2 {
    font-size: 1.5rem;
    font-weight: 800;
    margin: 0;
    color: var(--text-primary);
  }
}

.modal-close {
  width: 36px;
  height: 36px;
  border-radius: var(--radius-full);
  background: transparent;
  border: none;
  color: var(--text-secondary);
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: all var(--transition-base);

  &:hover {
    background: var(--background-tertiary);
    color: var(--text-primary);
  }

  i {
    font-size: 1.2rem;
  }
}

.modal-body {
  padding: var(--spacing-xl);
}

.modal-hint {
  display: flex;
  align-items: center;
  gap: var(--spacing-md);
  padding: var(--spacing-lg);
  background: var(--background-tertiary);
  border-radius: var(--radius-md);
  color: var(--text-secondary);
  font-size: 1rem;

  i {
    font-size: 1.5rem;
    color: var(--color-primary);
  }
}
</style>
