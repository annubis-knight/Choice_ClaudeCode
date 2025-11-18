<template>
  <div class="home-page">
    <!-- Header -->
    <header class="home-header">
      <h1 class="home-title">Choice</h1>
      <p class="home-subtitle">Vos sondages de groupe</p>
    </header>

    <!-- Liste des sondages -->
    <main class="home-main">
      <div class="polls-container">
        <h2 class="section-title">Sondages actifs</h2>

        <!-- Sondages disponibles -->
        <div class="polls-grid">
          <div
            v-for="poll in activePolls"
            :key="poll.id"
            class="poll-card"
            @click="goToPoll(poll.id)"
          >
            <!-- Badge statut -->
            <div class="poll-badge" :class="`poll-badge-${poll.status}`">
              {{ poll.statusLabel }}
            </div>

            <!-- Image de couverture -->
            <div class="poll-image">
              <img
                v-if="poll.coverImage"
                :src="poll.coverImage"
                :alt="poll.title"
              />
              <div v-else class="poll-image-placeholder">
                <i class="pi pi-question-circle"></i>
              </div>
            </div>

            <!-- Informations -->
            <div class="poll-content">
              <h3 class="poll-title">{{ poll.title }}</h3>
              <p class="poll-description">{{ poll.description }}</p>

              <!-- Métadonnées -->
              <div class="poll-meta">
                <span class="poll-meta-item">
                  <i class="pi pi-users"></i>
                  {{ poll.groupName }}
                </span>
                <span class="poll-meta-item">
                  <i class="pi pi-list"></i>
                  {{ poll.proposalCount }} options
                </span>
              </div>

              <!-- Progression si déjà commencé -->
              <div v-if="poll.progress > 0" class="poll-progress">
                <div class="progress-bar">
                  <div
                    class="progress-fill"
                    :style="{ width: `${poll.progress}%` }"
                  ></div>
                </div>
                <span class="progress-text">{{ poll.progress }}% complété</span>
              </div>

              <!-- Date limite -->
              <div v-if="poll.deadline" class="poll-deadline">
                <i class="pi pi-clock"></i>
                {{ formatDeadline(poll.deadline) }}
              </div>
            </div>
          </div>
        </div>

        <!-- Sondages terminés -->
        <template v-if="completedPolls.length > 0">
          <h2 class="section-title section-title-secondary">Terminés</h2>
          <div class="polls-grid">
            <div
              v-for="poll in completedPolls"
              :key="poll.id"
              class="poll-card poll-card-completed"
              @click="goToPollResults(poll.id)"
            >
              <div class="poll-badge poll-badge-completed">
                <i class="pi pi-check"></i> Terminé
              </div>

              <div class="poll-image poll-image-grayscale">
                <img
                  v-if="poll.coverImage"
                  :src="poll.coverImage"
                  :alt="poll.title"
                />
                <div v-else class="poll-image-placeholder">
                  <i class="pi pi-check-circle"></i>
                </div>
              </div>

              <div class="poll-content">
                <h3 class="poll-title">{{ poll.title }}</h3>
                <p class="poll-meta-item">
                  <i class="pi pi-users"></i>
                  {{ poll.groupName }}
                </p>
              </div>
            </div>
          </div>
        </template>

        <!-- État vide -->
        <div v-if="activePolls.length === 0 && completedPolls.length === 0" class="empty-state">
          <i class="pi pi-inbox"></i>
          <p>Aucun sondage disponible</p>
          <p class="empty-state-hint">Vous serez notifié quand un nouveau sondage sera créé</p>
        </div>
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
  title: 'Accueil',
  layout: 'default'
})

/**
 * Données de démonstration des sondages
 * TODO: Remplacer par un vrai appel API
 */
const polls = ref([
  {
    id: 'demo-1',
    title: '🍕 Où sortir ce weekend ?',
    description: 'Votez pour vos activités préférées !',
    groupName: 'Amis de la promo',
    proposalCount: 8,
    status: 'active',
    statusLabel: 'En cours',
    progress: 0,
    deadline: new Date(Date.now() + 2 * 24 * 60 * 60 * 1000), // Dans 2 jours
    coverImage: 'https://images.unsplash.com/photo-1511795409834-ef04bbd61622?w=800&h=400&fit=crop'
  },
  {
    id: 'demo-2',
    title: '🏖️ Vacances d\'été 2025',
    description: 'Choisissons notre destination de vacances ensemble',
    groupName: 'Famille Martin',
    proposalCount: 5,
    status: 'active',
    statusLabel: 'Nouveau',
    progress: 0,
    deadline: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000), // Dans 7 jours
    coverImage: 'https://images.unsplash.com/photo-1506929562872-bb421503ef21?w=800&h=400&fit=crop'
  },
  {
    id: 'demo-3',
    title: '🎮 Soirée jeux vidéo',
    description: 'Quel jeu pour la LAN party ?',
    groupName: 'Gamers United',
    proposalCount: 6,
    status: 'completed',
    statusLabel: 'Terminé',
    progress: 100,
    coverImage: 'https://images.unsplash.com/photo-1511512578047-dfb367046420?w=800&h=400&fit=crop'
  }
])

/**
 * Sondages actifs
 */
const activePolls = computed(() =>
  polls.value.filter(poll => poll.status === 'active')
)

/**
 * Sondages terminés
 */
const completedPolls = computed(() =>
  polls.value.filter(poll => poll.status === 'completed')
)

/**
 * Naviguer vers un sondage
 */
const goToPoll = (pollId) => {
  router.push(`/poll/${pollId}`)
}

/**
 * Naviguer vers les résultats d'un sondage
 */
const goToPollResults = (pollId) => {
  // TODO: Créer une page de résultats
  router.push(`/poll/${pollId}/results`)
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
    return `Expire dans ${days} jour${days > 1 ? 's' : ''}`
  } else if (hours > 0) {
    return `Expire dans ${hours}h`
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
  padding: var(--spacing-2xl) var(--spacing-lg);
  text-align: center;
  background: linear-gradient(135deg, var(--color-primary) 0%, #f0a500 100%);
  color: var(--text-primary);
}

.home-title {
  font-size: 3rem;
  font-weight: 900;
  margin: 0 0 var(--spacing-sm) 0;
  letter-spacing: -0.03em;

  @media (max-width: 768px) {
    font-size: 2.5rem;
  }
}

.home-subtitle {
  font-size: 1.25rem;
  margin: 0;
  opacity: 0.9;
  font-weight: 600;
}

/* Main */
.home-main {
  padding: var(--spacing-2xl) var(--spacing-lg);
}

.polls-container {
  max-width: 1200px;
  margin: 0 auto;
}

.section-title {
  font-size: 1.75rem;
  font-weight: 800;
  color: var(--text-primary);
  margin: 0 0 var(--spacing-xl) 0;

  &.section-title-secondary {
    margin-top: var(--spacing-3xl);
    color: var(--text-secondary);
  }
}

/* Grille de sondages */
.polls-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(320px, 1fr));
  gap: var(--spacing-xl);

  @media (max-width: 768px) {
    grid-template-columns: 1fr;
    gap: var(--spacing-lg);
  }
}

/* Carte de sondage */
.poll-card {
  position: relative;
  background: var(--background-secondary);
  border-radius: var(--radius-lg);
  border: 2px solid var(--border-color);
  overflow: hidden;
  cursor: pointer;
  transition: all var(--transition-base) var(--transition-ease);
  box-shadow: var(--shadow-sm);

  &:hover {
    transform: translateY(-4px);
    box-shadow: var(--shadow-lg);
    border-color: var(--color-primary);
  }

  &.poll-card-completed {
    opacity: 0.8;

    &:hover {
      opacity: 1;
    }
  }
}

.poll-badge {
  position: absolute;
  top: var(--spacing-md);
  right: var(--spacing-md);
  padding: var(--spacing-xs) var(--spacing-md);
  border-radius: var(--radius-full);
  font-size: 0.85rem;
  font-weight: 700;
  z-index: 10;
  box-shadow: var(--shadow-md);

  &.poll-badge-active {
    background: var(--color-primary);
    color: var(--text-primary);
  }

  &.poll-badge-completed {
    background: var(--color-success);
    color: white;
  }
}

.poll-image {
  width: 100%;
  height: 180px;
  background: var(--background-tertiary);
  overflow: hidden;

  img {
    width: 100%;
    height: 100%;
    object-fit: cover;
    transition: transform 0.3s ease;
  }

  &.poll-image-grayscale img {
    filter: grayscale(80%);
  }
}

.poll-card:hover .poll-image img {
  transform: scale(1.05);
}

.poll-image-placeholder {
  width: 100%;
  height: 100%;
  display: flex;
  align-items: center;
  justify-content: center;

  i {
    font-size: 4rem;
    color: var(--text-muted);
  }
}

.poll-content {
  padding: var(--spacing-lg);
}

.poll-title {
  font-size: 1.5rem;
  font-weight: 700;
  color: var(--text-primary);
  margin: 0 0 var(--spacing-sm) 0;
  line-height: 1.3;
}

.poll-description {
  font-size: 1rem;
  color: var(--text-secondary);
  margin: 0 0 var(--spacing-md) 0;
  line-height: 1.5;
}

.poll-meta {
  display: flex;
  flex-wrap: wrap;
  gap: var(--spacing-md);
  margin-bottom: var(--spacing-md);
}

.poll-meta-item {
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

.poll-progress {
  margin-top: var(--spacing-md);
}

.progress-bar {
  height: 6px;
  background: var(--background-tertiary);
  border-radius: var(--radius-full);
  overflow: hidden;
  margin-bottom: var(--spacing-xs);
}

.progress-fill {
  height: 100%;
  background: var(--color-primary);
  border-radius: var(--radius-full);
  transition: width 0.3s ease;
}

.progress-text {
  font-size: 0.85rem;
  color: var(--text-secondary);
  font-weight: 600;
}

.poll-deadline {
  display: flex;
  align-items: center;
  gap: var(--spacing-xs);
  font-size: 0.9rem;
  color: var(--color-danger);
  font-weight: 600;
  margin-top: var(--spacing-md);
  padding: var(--spacing-sm);
  background: rgba(248, 113, 113, 0.1);
  border-radius: var(--radius-md);

  i {
    font-size: 1rem;
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
