<template>
  <div class="home-page">
    <!-- Header -->
    <header class="home-header">
      <h1 class="home-title">Choice</h1>
      <p class="home-subtitle">Votez ensemble, décidez mieux</p>
    </header>

    <!-- Onglets -->
    <div class="tabs-container">
      <button
        v-for="tab in tabs"
        :key="tab.value"
        class="tab-btn"
        :class="{ active: activeTab === tab.value }"
        @click="activeTab = tab.value"
      >
        {{ tab.label }}
        <span v-if="tab.count > 0" class="tab-badge">{{ tab.count }}</span>
      </button>
    </div>

    <!-- Liste des sondages -->
    <main class="polls-main">
      <div v-if="filteredPolls.length > 0" class="polls-list">
        <div
          v-for="poll in filteredPolls"
          :key="poll.id"
          class="poll-card"
          @click="goToPoll(poll)"
        >
          <!-- Image de gauche -->
          <div class="poll-image" :style="{ backgroundImage: `url(${poll.coverImage})` }">
            <div class="poll-image-overlay"></div>
          </div>

          <!-- Contenu principal -->
          <div class="poll-content">
            <div class="poll-header">
              <h3 class="poll-title">{{ poll.title }}</h3>
              <div class="poll-badge" :class="`badge-${poll.status}`">
                {{ poll.statusLabel }}
              </div>
            </div>

            <p class="poll-description">{{ poll.description }}</p>

            <!-- Métadonnées -->
            <div class="poll-meta">
              <span class="meta-item">
                <i class="pi pi-users"></i>
                {{ poll.groupName }}
              </span>
              <span class="meta-item">
                <i class="pi pi-list"></i>
                {{ poll.proposalCount }} options
              </span>
              <span v-if="poll.deadline && activeTab === 'current'" class="meta-item meta-deadline">
                <i class="pi pi-clock"></i>
                {{ formatDeadline(poll.deadline) }}
              </span>
            </div>

            <!-- Progression si commencé -->
            <div v-if="poll.userProgress > 0 && poll.userProgress < 100" class="poll-progress">
              <div class="progress-bar">
                <div class="progress-fill" :style="{ width: `${poll.userProgress}%` }"></div>
              </div>
              <span class="progress-text">{{ poll.userProgress }}% complété</span>
            </div>

            <!-- État spécial si en attente -->
            <div v-if="poll.userProgress === 100 && poll.status === 'current'" class="waiting-badge">
              <i class="pi pi-clock"></i>
              En attente des autres participants
            </div>
          </div>

          <!-- Chevron -->
          <div class="poll-arrow">
            <i class="pi pi-chevron-right"></i>
          </div>
        </div>
      </div>

      <!-- État vide -->
      <div v-else class="empty-state">
        <i class="pi pi-inbox"></i>
        <p>{{ activeTab === 'current' ? 'Aucun sondage en cours' : 'Aucun sondage passé' }}</p>
        <p class="empty-hint">
          {{ activeTab === 'current'
            ? 'Créez un sondage ou attendez d\'être invité'
            : 'Vos sondages terminés apparaîtront ici' }}
        </p>
      </div>
    </main>

    <!-- Bouton FAB pour créer un sondage -->
    <button class="fab-button" @click="createPoll" title="Créer un sondage">
      <i class="pi pi-plus"></i>
    </button>

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
  title: 'Accueil',
  layout: 'default'
})

/**
 * Onglet actif
 */
const activeTab = ref('current')

/**
 * Onglets disponibles
 */
const tabs = computed(() => [
  {
    value: 'current',
    label: 'En cours',
    count: polls.value.filter(p => p.status === 'current').length
  },
  {
    value: 'past',
    label: 'Terminés',
    count: polls.value.filter(p => p.status === 'completed').length
  }
])

/**
 * Données de démonstration
 * TODO: Remplacer par un vrai appel API
 */
const polls = ref([
  {
    id: 'demo-1',
    title: '🍕 Où sortir ce weekend ?',
    description: 'Votez pour vos activités préférées !',
    groupName: 'Amis de la promo',
    proposalCount: 8,
    status: 'current',
    statusLabel: 'À voter',
    userProgress: 0, // L'utilisateur n'a pas encore voté
    deadline: new Date(Date.now() + 2 * 24 * 60 * 60 * 1000),
    coverImage: 'https://images.unsplash.com/photo-1511795409834-ef04bbd61622?w=400&h=300&fit=crop'
  },
  {
    id: 'demo-2',
    title: '🏖️ Vacances d\'été 2025',
    description: 'Choisissons notre destination ensemble',
    groupName: 'Famille Martin',
    proposalCount: 5,
    status: 'current',
    statusLabel: 'En cours',
    userProgress: 60, // L'utilisateur a voté sur 3/5
    deadline: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
    coverImage: 'https://images.unsplash.com/photo-1506929562872-bb421503ef21?w=400&h=300&fit=crop'
  },
  {
    id: 'demo-4',
    title: '🎬 Film de la soirée',
    description: 'Quel film regarder ensemble ?',
    groupName: 'Cinéphiles',
    proposalCount: 4,
    status: 'current',
    statusLabel: 'En attente',
    userProgress: 100, // L'utilisateur a terminé, attend les autres
    deadline: new Date(Date.now() + 1 * 24 * 60 * 60 * 1000),
    coverImage: 'https://images.unsplash.com/photo-1489599849927-2ee91cede3ba?w=400&h=300&fit=crop'
  },
  {
    id: 'demo-3',
    title: '🎮 Soirée jeux vidéo',
    description: 'Le jeu qui a gagné la LAN party',
    groupName: 'Gamers United',
    proposalCount: 6,
    status: 'completed',
    statusLabel: 'Terminé',
    userProgress: 100,
    coverImage: 'https://images.unsplash.com/photo-1511512578047-dfb367046420?w=400&h=300&fit=crop'
  }
])

/**
 * Sondages filtrés par onglet
 */
const filteredPolls = computed(() => {
  if (activeTab.value === 'current') {
    return polls.value.filter(p => p.status === 'current')
  } else {
    return polls.value.filter(p => p.status === 'completed')
  }
})

/**
 * Naviguer vers un sondage
 */
const goToPoll = (poll) => {
  if (poll.status === 'completed') {
    // Sondage terminé → Page de résultats
    router.push(`/poll/${poll.id}/results`)
  } else {
    // Sondage en cours
    if (poll.userProgress === 100) {
      // Utilisateur a terminé → Page summary (en attente des autres)
      router.push(`/poll/summary?pollId=${poll.id}`)
    } else {
      // Utilisateur n'a pas terminé → Page de vote
      router.push(`/poll/${poll.id}`)
    }
  }
}

/**
 * Créer un nouveau sondage
 */
const createPoll = () => {
  // TODO: Implémenter la création de sondage
  console.log('Créer un sondage')
  alert('Fonctionnalité bientôt disponible !')
}

/**
 * Formater la date limite
 */
const formatDeadline = (deadline) => {
  const now = new Date()
  const diff = deadline - now
  const days = Math.floor(diff / (1000 * 60 * 60 * 24))
  const hours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60))

  if (days > 0) {
    return `${days}j restant${days > 1 ? 's' : ''}`
  } else if (hours > 0) {
    return `${hours}h restantes`
  } else {
    return 'Expire bientôt'
  }
}
</script>

<style scoped lang="scss">
.home-page {
  min-height: 100vh;
  background: var(--background-primary);
  padding-bottom: 80px; /* Espace pour la bottom nav */
}

/* Header */
.home-header {
  padding: var(--spacing-2xl) var(--spacing-lg) var(--spacing-xl);
  text-align: center;
  background: linear-gradient(135deg, var(--color-primary) 0%, #f0a500 100%);
  color: var(--text-primary);
}

.home-title {
  font-size: 2.5rem;
  font-weight: 700;
  margin: 0 0 var(--spacing-xs) 0;
  letter-spacing: -0.02em;

  @media (max-width: 768px) {
    font-size: 2rem;
  }
}

.home-subtitle {
  font-size: 1rem;
  margin: 0;
  opacity: 0.9;
  font-weight: 400;
}

/* Onglets */
.tabs-container {
  display: flex;
  gap: var(--spacing-sm);
  padding: var(--spacing-lg);
  background: var(--background-primary);
  border-bottom: 2px solid var(--border-color);
  position: sticky;
  top: 0;
  z-index: 10;
}

.tab-btn {
  flex: 1;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: var(--spacing-sm);
  padding: var(--spacing-md) var(--spacing-lg);
  background: transparent;
  border: none;
  border-radius: var(--radius-lg);
  color: var(--text-secondary);
  font-weight: 500;
  font-size: 1rem;
  cursor: pointer;
  transition: all var(--transition-base);
  position: relative;

  &:hover {
    background: var(--background-tertiary);
    color: var(--text-primary);
  }

  &.active {
    background: var(--color-primary);
    color: var(--text-primary);
    font-weight: 600;
  }
}

.tab-badge {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  min-width: 24px;
  height: 24px;
  padding: 0 var(--spacing-xs);
  background: rgba(0, 0, 0, 0.15);
  border-radius: var(--radius-full);
  font-size: 0.75rem;
  font-weight: 600;

  .tab-btn.active & {
    background: rgba(0, 0, 0, 0.2);
  }
}

/* Main */
.polls-main {
  padding: var(--spacing-lg);
}

.polls-list {
  max-width: 900px;
  margin: 0 auto;
  display: flex;
  flex-direction: column;
  gap: var(--spacing-md);
}

/* Carte de sondage - Layout horizontal */
.poll-card {
  display: flex;
  background: var(--background-secondary);
  border-radius: var(--radius-lg);
  border: 2px solid var(--border-color);
  overflow: hidden;
  cursor: pointer;
  transition: all var(--transition-base);
  box-shadow: var(--shadow-sm);
  min-height: 120px;

  &:hover {
    transform: translateY(-2px);
    box-shadow: var(--shadow-md);
    border-color: var(--color-primary);

    .poll-arrow {
      transform: translateX(4px);
    }
  }

  &:active {
    transform: translateY(0);
  }
}

.poll-image {
  position: relative;
  width: 100px;
  flex-shrink: 0;
  background-size: cover;
  background-position: center;
  background-color: var(--background-tertiary);

  @media (max-width: 768px) {
    width: 80px;
  }
}

.poll-image-overlay {
  position: absolute;
  inset: 0;
  background: linear-gradient(135deg, rgba(251, 187, 33, 0.1) 0%, rgba(240, 165, 0, 0.15) 100%);
}

.poll-content {
  flex: 1;
  padding: var(--spacing-md);
  display: flex;
  flex-direction: column;
  gap: var(--spacing-xs);
  min-width: 0; /* Pour permettre le text-overflow */
}

.poll-header {
  display: flex;
  align-items: flex-start;
  justify-content: space-between;
  gap: var(--spacing-sm);
}

.poll-title {
  font-size: 1.125rem;
  font-weight: 600;
  color: var(--text-primary);
  margin: 0;
  line-height: 1.3;
  flex: 1;
  min-width: 0;

  /* Truncate long titles */
  overflow: hidden;
  text-overflow: ellipsis;
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
}

.poll-badge {
  flex-shrink: 0;
  padding: 2px var(--spacing-sm);
  border-radius: var(--radius-sm);
  font-size: 0.7rem;
  font-weight: 600;
  white-space: nowrap;

  &.badge-current {
    background: var(--color-primary);
    color: var(--text-primary);
  }

  &.badge-completed {
    background: var(--color-success);
    color: white;
  }
}

.poll-description {
  font-size: 0.875rem;
  color: var(--text-secondary);
  margin: 0;
  line-height: 1.4;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.poll-meta {
  display: flex;
  flex-wrap: wrap;
  gap: var(--spacing-sm) var(--spacing-md);
  margin-top: auto;
}

.meta-item {
  display: flex;
  align-items: center;
  gap: 4px;
  font-size: 0.8rem;
  color: var(--text-secondary);
  font-weight: 500;

  i {
    color: var(--color-primary);
    font-size: 0.9rem;
  }

  &.meta-deadline {
    color: var(--color-danger);
    font-weight: 600;

    i {
      color: var(--color-danger);
    }
  }
}

.poll-progress {
  display: flex;
  align-items: center;
  gap: var(--spacing-sm);
  margin-top: var(--spacing-xs);
}

.progress-bar {
  flex: 1;
  height: 4px;
  background: var(--background-tertiary);
  border-radius: var(--radius-full);
  overflow: hidden;
}

.progress-fill {
  height: 100%;
  background: var(--color-primary);
  border-radius: var(--radius-full);
  transition: width 0.3s ease;
}

.progress-text {
  font-size: 0.75rem;
  color: var(--text-secondary);
  font-weight: 600;
  white-space: nowrap;
}

.waiting-badge {
  display: flex;
  align-items: center;
  gap: var(--spacing-xs);
  padding: var(--spacing-xs) var(--spacing-sm);
  background: rgba(251, 187, 33, 0.1);
  border-radius: var(--radius-sm);
  font-size: 0.75rem;
  color: var(--color-primary);
  font-weight: 600;
  margin-top: var(--spacing-xs);

  i {
    font-size: 0.85rem;
  }
}

.poll-arrow {
  display: flex;
  align-items: center;
  padding: 0 var(--spacing-md);
  color: var(--text-muted);
  transition: transform var(--transition-base);

  i {
    font-size: 1.25rem;
  }

  @media (max-width: 768px) {
    padding: 0 var(--spacing-sm);

    i {
      font-size: 1rem;
    }
  }
}

/* État vide */
.empty-state {
  text-align: center;
  padding: var(--spacing-3xl) var(--spacing-lg);
  color: var(--text-secondary);
  max-width: 400px;
  margin: 0 auto;

  i {
    font-size: 4rem;
    color: var(--text-muted);
    margin-bottom: var(--spacing-lg);
  }

  p {
    font-size: 1.125rem;
    margin: var(--spacing-sm) 0;
    font-weight: 500;
  }

  .empty-hint {
    font-size: 0.95rem;
    color: var(--text-muted);
    font-weight: 400;
  }
}

/* Bouton FAB */
.fab-button {
  position: fixed;
  bottom: calc(80px + var(--spacing-lg)); /* Au-dessus de la bottom nav */
  right: var(--spacing-lg);
  width: 56px;
  height: 56px;
  border-radius: var(--radius-full);
  background: var(--color-primary);
  color: var(--text-primary);
  border: none;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  box-shadow: var(--shadow-lg);
  transition: all var(--transition-base);
  z-index: 100;

  i {
    font-size: 1.5rem;
  }

  &:hover {
    transform: scale(1.1);
    box-shadow: var(--shadow-xl);
  }

  &:active {
    transform: scale(1.05);
  }
}
</style>
