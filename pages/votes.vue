<template>
  <div class="votes-page">
    <!-- Header -->
    <header class="votes-header">
      <h1 class="page-title">Mes Votes</h1>
      <p class="page-subtitle">Historique de vos réponses aux sondages</p>
    </header>

    <!-- Filtres -->
    <div class="filters-container">
      <button
        v-for="filter in filters"
        :key="filter.value"
        class="filter-btn"
        :class="{ active: activeFilter === filter.value }"
        @click="activeFilter = filter.value"
      >
        {{ filter.label }}
      </button>
    </div>

    <!-- Liste des votes -->
    <main class="votes-main">
      <div v-if="filteredVotes.length > 0" class="votes-grid">
        <div
          v-for="vote in filteredVotes"
          :key="vote.pollId"
          class="vote-card"
          @click="goToPollResults(vote.pollId)"
        >
          <!-- Image -->
          <div class="vote-image">
            <img
              v-if="vote.coverImage"
              :src="vote.coverImage"
              :alt="vote.pollTitle"
            />
            <div v-else class="vote-image-placeholder">
              <i class="pi pi-chart-bar"></i>
            </div>
          </div>

          <!-- Contenu -->
          <div class="vote-content">
            <h3 class="vote-title">{{ vote.pollTitle }}</h3>
            <p class="vote-group">
              <i class="pi pi-users"></i>
              {{ vote.groupName }}
            </p>

            <!-- Statistiques -->
            <div class="vote-stats">
              <div class="stat-item stat-like">
                <i class="pi pi-heart"></i>
                <span>{{ vote.likesCount }}</span>
              </div>
              <div class="stat-item stat-dislike">
                <i class="pi pi-times"></i>
                <span>{{ vote.dislikesCount }}</span>
              </div>
              <div class="stat-item stat-total">
                <i class="pi pi-list"></i>
                <span>{{ vote.totalVotes }} votes</span>
              </div>
            </div>

            <!-- Date -->
            <p class="vote-date">
              <i class="pi pi-calendar"></i>
              {{ formatDate(vote.votedAt) }}
            </p>

            <!-- Badge statut -->
            <div class="vote-badge" :class="`vote-badge-${vote.status}`">
              {{ vote.statusLabel }}
            </div>
          </div>
        </div>
      </div>

      <!-- État vide -->
      <div v-else class="empty-state">
        <i class="pi pi-inbox"></i>
        <p>Aucun vote {{ activeFilter !== 'all' ? filters.find(f => f.value === activeFilter)?.label.toLowerCase() : '' }}</p>
        <p class="empty-state-hint">Vos votes apparaîtront ici</p>
      </div>
    </main>

    <!-- Bottom Navigation -->
    <BottomNav />
  </div>
</template>

<script setup>
import { ref, computed } from 'vue'
import { useRouter } from 'vue-router'
import BottomNav from '~/components/layout/BottomNav.vue'

const router = useRouter()

/**
 * Configuration de la page
 */
definePageMeta({
  title: 'Mes Votes',
  layout: 'default'
})

/**
 * Filtres disponibles
 */
const filters = [
  { value: 'all', label: 'Tous' },
  { value: 'pending', label: 'En cours' },
  { value: 'completed', label: 'Terminés' }
]

const activeFilter = ref('all')

/**
 * Données de démonstration
 * TODO: Remplacer par un vrai appel API
 */
const votes = ref([
  {
    pollId: 'demo-1',
    pollTitle: '🍕 Où sortir ce weekend ?',
    groupName: 'Amis de la promo',
    likesCount: 5,
    dislikesCount: 3,
    totalVotes: 8,
    votedAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000),
    status: 'completed',
    statusLabel: 'Résultats disponibles',
    coverImage: 'https://images.unsplash.com/photo-1511795409834-ef04bbd61622?w=400&h=250&fit=crop'
  },
  {
    pollId: 'demo-2',
    pollTitle: '🏖️ Vacances d\'été 2025',
    groupName: 'Famille Martin',
    likesCount: 3,
    dislikesCount: 2,
    totalVotes: 5,
    votedAt: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000),
    status: 'pending',
    statusLabel: 'En attente des autres',
    coverImage: 'https://images.unsplash.com/photo-1506929562872-bb421503ef21?w=400&h=250&fit=crop'
  },
  {
    pollId: 'demo-3',
    pollTitle: '🎮 Soirée jeux vidéo',
    groupName: 'Gamers United',
    likesCount: 4,
    dislikesCount: 2,
    totalVotes: 6,
    votedAt: new Date(Date.now() - 14 * 24 * 60 * 60 * 1000),
    status: 'completed',
    statusLabel: 'Résultats disponibles',
    coverImage: 'https://images.unsplash.com/photo-1511512578047-dfb367046420?w=400&h=250&fit=crop'
  }
])

/**
 * Votes filtrés
 */
const filteredVotes = computed(() => {
  if (activeFilter.value === 'all') {
    return votes.value
  }
  return votes.value.filter(vote => vote.status === activeFilter.value)
})

/**
 * Naviguer vers les résultats d'un sondage
 */
const goToPollResults = (pollId) => {
  // TODO: Implémenter la page de résultats
  router.push(`/poll/${pollId}/results`)
}

/**
 * Formater la date
 */
const formatDate = (date) => {
  const options = { year: 'numeric', month: 'long', day: 'numeric' }
  return date.toLocaleDateString('fr-FR', options)
}
</script>

<style scoped lang="scss">
.votes-page {
  min-height: 100vh;
  background: var(--background-primary);
  padding-bottom: 80px; /* Espace pour la bottom nav */
}

/* Header */
.votes-header {
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

/* Filtres */
.filters-container {
  display: flex;
  gap: var(--spacing-md);
  padding: 0 var(--spacing-lg) var(--spacing-xl);
  justify-content: center;
  flex-wrap: wrap;
}

.filter-btn {
  padding: var(--spacing-sm) var(--spacing-lg);
  border: 2px solid var(--border-color-dark);
  background: var(--background-primary);
  color: var(--text-secondary);
  border-radius: var(--radius-full);
  font-weight: 600;
  cursor: pointer;
  transition: all var(--transition-base) var(--transition-ease);

  &:hover {
    border-color: var(--color-primary);
    color: var(--color-primary);
  }

  &.active {
    background: var(--color-primary);
    border-color: var(--color-primary);
    color: var(--text-primary);
  }
}

/* Main */
.votes-main {
  padding: 0 var(--spacing-lg) var(--spacing-2xl);
}

.votes-grid {
  max-width: 1200px;
  margin: 0 auto;
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
  gap: var(--spacing-lg);

  @media (max-width: 768px) {
    grid-template-columns: 1fr;
  }
}

.vote-card {
  background: var(--background-secondary);
  border-radius: var(--radius-lg);
  border: 2px solid var(--border-color);
  overflow: hidden;
  cursor: pointer;
  transition: all var(--transition-base) var(--transition-ease);
  box-shadow: var(--shadow-sm);
  position: relative;

  &:hover {
    transform: translateY(-4px);
    box-shadow: var(--shadow-lg);
    border-color: var(--color-primary);
  }
}

.vote-image {
  width: 100%;
  height: 150px;
  background: var(--background-tertiary);

  img {
    width: 100%;
    height: 100%;
    object-fit: cover;
  }
}

.vote-image-placeholder {
  width: 100%;
  height: 100%;
  display: flex;
  align-items: center;
  justify-content: center;

  i {
    font-size: 3rem;
    color: var(--text-muted);
  }
}

.vote-content {
  padding: var(--spacing-lg);
}

.vote-title {
  font-size: 1.25rem;
  font-weight: 700;
  color: var(--text-primary);
  margin: 0 0 var(--spacing-sm) 0;
}

.vote-group {
  display: flex;
  align-items: center;
  gap: var(--spacing-xs);
  font-size: 0.95rem;
  color: var(--text-secondary);
  margin: 0 0 var(--spacing-md) 0;

  i {
    color: var(--color-primary);
  }
}

.vote-stats {
  display: flex;
  gap: var(--spacing-md);
  margin-bottom: var(--spacing-md);
}

.stat-item {
  display: flex;
  align-items: center;
  gap: var(--spacing-xs);
  font-size: 0.9rem;
  font-weight: 600;

  &.stat-like {
    color: var(--color-success);
  }

  &.stat-dislike {
    color: var(--color-danger);
  }

  &.stat-total {
    color: var(--text-secondary);
  }
}

.vote-date {
  display: flex;
  align-items: center;
  gap: var(--spacing-xs);
  font-size: 0.85rem;
  color: var(--text-muted);
  margin: 0;
}

.vote-badge {
  position: absolute;
  top: var(--spacing-md);
  right: var(--spacing-md);
  padding: var(--spacing-xs) var(--spacing-md);
  border-radius: var(--radius-full);
  font-size: 0.75rem;
  font-weight: 700;
  box-shadow: var(--shadow-sm);

  &.vote-badge-completed {
    background: var(--color-success);
    color: white;
  }

  &.vote-badge-pending {
    background: var(--color-primary);
    color: var(--text-primary);
  }
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
    }
  }
}
</style>
