<template>
  <div class="results-page">
    <!-- Bouton retour -->
    <button class="back-button" @click="goBack">
      <i class="pi pi-arrow-left"></i>
    </button>

    <!-- Header -->
    <header class="results-header">
      <div class="header-icon">
        <i class="pi pi-trophy"></i>
      </div>
      <h1 class="results-title">{{ pollData?.title }}</h1>
      <p class="results-subtitle">{{ pollData?.groupName }}</p>
      <div class="results-meta">
        <span class="meta-badge">
          <i class="pi pi-users"></i>
          {{ pollData?.participantCount }} participants
        </span>
        <span class="meta-badge">
          <i class="pi pi-calendar"></i>
          Terminé le {{ formatDate(pollData?.completedAt) }}
        </span>
      </div>
    </header>

    <!-- Résultats -->
    <main class="results-main">
      <div v-if="results.length > 0" class="results-container">
        <div
          v-for="(result, index) in results"
          :key="result.id"
          class="result-card"
          :style="{ animationDelay: `${index * 0.1}s` }"
        >
          <!-- Rang -->
          <div class="result-rank" :class="`rank-${index + 1}`">
            <span v-if="index < 3" class="rank-icon">
              {{ ['🥇', '🥈', '🥉'][index] }}
            </span>
            <span v-else class="rank-number">{{ index + 1 }}</span>
          </div>

          <!-- Image -->
          <div class="result-image">
            <img v-if="result.image" :src="result.image" :alt="result.title" />
            <div v-else class="result-image-placeholder">
              <i class="pi pi-image"></i>
            </div>
          </div>

          <!-- Contenu -->
          <div class="result-content">
            <h3 class="result-title">{{ result.title }}</h3>
            <p class="result-description">{{ result.description }}</p>

            <!-- Statistiques -->
            <div class="result-stats">
              <div class="stat-bar">
                <div class="stat-bar-fill stat-bar-likes" :style="{ width: `${result.likesPercentage}%` }"></div>
                <div class="stat-bar-fill stat-bar-dislikes" :style="{ width: `${result.dislikesPercentage}%` }"></div>
              </div>
              <div class="stat-details">
                <span class="stat-like">
                  <i class="pi pi-heart"></i>
                  {{ result.likes }} ({{ result.likesPercentage }}%)
                </span>
                <span class="stat-dislike">
                  <i class="pi pi-times"></i>
                  {{ result.dislikes }} ({{ result.dislikesPercentage }}%)
                </span>
              </div>
            </div>

            <!-- Note moyenne si présente -->
            <div v-if="result.averageRating !== null" class="result-rating">
              <i class="pi pi-star-fill"></i>
              <span class="rating-value">{{ result.averageRating.toFixed(1) }}</span>
              <span class="rating-max">/10</span>
            </div>
          </div>
        </div>
      </div>

      <!-- État vide -->
      <div v-else class="empty-state">
        <i class="pi pi-exclamation-circle"></i>
        <p>Aucun résultat disponible</p>
      </div>
    </main>

    <!-- Bottom Navigation -->
    <BottomNav />
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import BottomNav from '~/components/layout/BottomNav.vue'

const route = useRoute()
const router = useRouter()

/**
 * Configuration de la page
 */
definePageMeta({
  title: 'Résultats du sondage',
  layout: 'default'
})

/**
 * Données du sondage
 */
const pollData = ref(null)

/**
 * Résultats triés par popularité
 */
const results = ref([])

/**
 * Données de démonstration
 * TODO: Remplacer par un vrai appel API
 */
onMounted(() => {
  const pollId = route.params.id

  // Simulation de données
  pollData.value = {
    id: pollId,
    title: '🎮 Soirée jeux vidéo',
    groupName: 'Gamers United',
    participantCount: 8,
    completedAt: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000)
  }

  results.value = [
    {
      id: '1',
      title: 'The Legend of Zelda: Tears of the Kingdom',
      description: 'Aventure épique dans le monde d\'Hyrule',
      image: 'https://images.unsplash.com/photo-1550745165-9bc0b252726f?w=400&h=300&fit=crop',
      likes: 7,
      dislikes: 1,
      likesPercentage: 87.5,
      dislikesPercentage: 12.5,
      averageRating: 9.2
    },
    {
      id: '2',
      title: 'Mario Kart 8 Deluxe',
      description: 'Course frénétique en multijoueur',
      image: 'https://images.unsplash.com/photo-1511512578047-dfb367046420?w=400&h=300&fit=crop',
      likes: 6,
      dislikes: 2,
      likesPercentage: 75,
      dislikesPercentage: 25,
      averageRating: 8.5
    },
    {
      id: '3',
      title: 'Minecraft',
      description: 'Construction et survie en monde ouvert',
      image: 'https://images.unsplash.com/photo-1538481199705-c710c4e965fc?w=400&h=300&fit=crop',
      likes: 5,
      dislikes: 3,
      likesPercentage: 62.5,
      dislikesPercentage: 37.5,
      averageRating: 7.8
    },
    {
      id: '4',
      title: 'Among Us',
      description: 'Qui est l\'imposteur ?',
      image: 'https://images.unsplash.com/photo-1552820728-8b83bb6b773f?w=400&h=300&fit=crop',
      likes: 4,
      dislikes: 4,
      likesPercentage: 50,
      dislikesPercentage: 50,
      averageRating: 6.5
    }
  ]
})

/**
 * Retourner à la page d'accueil
 */
const goBack = () => {
  router.push('/home')
}

/**
 * Formater la date
 */
const formatDate = (date) => {
  if (!date) return ''
  return date.toLocaleDateString('fr-FR', {
    day: 'numeric',
    month: 'long',
    year: 'numeric'
  })
}
</script>

<style scoped lang="scss">
.results-page {
  min-height: 100vh;
  background: var(--background-primary);
  padding-bottom: 80px;
}

/* Bouton retour */
.back-button {
  position: fixed;
  top: var(--spacing-lg);
  left: var(--spacing-lg);
  width: 48px;
  height: 48px;
  border-radius: var(--radius-full);
  background: var(--background-primary);
  border: 2px solid var(--border-color-dark);
  color: var(--text-secondary);
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  transition: all var(--transition-base);
  box-shadow: var(--shadow-md);
  z-index: 500;

  i {
    font-size: 1.3rem;
  }

  &:hover {
    background: var(--color-primary);
    color: var(--text-primary);
    border-color: var(--color-primary);
    transform: scale(1.1);
  }

  @media (max-width: 768px) {
    top: var(--spacing-md);
    left: var(--spacing-md);
    width: 40px;
    height: 40px;

    i {
      font-size: 1.1rem;
    }
  }
}

/* Header */
.results-header {
  padding: var(--spacing-3xl) var(--spacing-lg) var(--spacing-2xl);
  text-align: center;
  background: linear-gradient(135deg, var(--color-success) 0%, #38a169 100%);
  color: white;
}

.header-icon {
  margin-bottom: var(--spacing-md);

  i {
    font-size: 4rem;
    filter: drop-shadow(0 4px 6px rgba(0, 0, 0, 0.2));
  }
}

.results-title {
  font-size: 2rem;
  font-weight: 700;
  margin: 0 0 var(--spacing-sm) 0;
  letter-spacing: -0.02em;

  @media (max-width: 768px) {
    font-size: 1.75rem;
  }
}

.results-subtitle {
  font-size: 1.125rem;
  margin: 0 0 var(--spacing-lg) 0;
  opacity: 0.9;
  font-weight: 500;
}

.results-meta {
  display: flex;
  justify-content: center;
  gap: var(--spacing-lg);
  flex-wrap: wrap;
}

.meta-badge {
  display: flex;
  align-items: center;
  gap: var(--spacing-xs);
  padding: var(--spacing-xs) var(--spacing-md);
  background: rgba(255, 255, 255, 0.2);
  border-radius: var(--radius-full);
  font-size: 0.9rem;
  font-weight: 500;

  i {
    font-size: 1rem;
  }
}

/* Main */
.results-main {
  padding: var(--spacing-2xl) var(--spacing-lg);
}

.results-container {
  max-width: 800px;
  margin: 0 auto;
  display: flex;
  flex-direction: column;
  gap: var(--spacing-lg);
}

/* Carte de résultat */
.result-card {
  display: flex;
  gap: var(--spacing-md);
  background: var(--background-secondary);
  border-radius: var(--radius-lg);
  border: 2px solid var(--border-color);
  padding: var(--spacing-lg);
  box-shadow: var(--shadow-sm);
  animation: slideIn 0.5s ease-out backwards;

  @media (max-width: 768px) {
    flex-direction: column;
  }
}

@keyframes slideIn {
  from {
    opacity: 0;
    transform: translateY(20px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

.result-rank {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 50px;
  height: 50px;
  border-radius: var(--radius-md);
  background: var(--background-tertiary);
  flex-shrink: 0;
  font-weight: 700;

  &.rank-1 {
    font-size: 2.5rem;
  }

  &.rank-2,
  &.rank-3 {
    font-size: 2rem;
  }

  .rank-number {
    font-size: 1.5rem;
    color: var(--text-secondary);
  }
}

.result-image {
  width: 120px;
  height: 90px;
  border-radius: var(--radius-md);
  overflow: hidden;
  background: var(--background-tertiary);
  flex-shrink: 0;

  @media (max-width: 768px) {
    width: 100%;
    height: 150px;
  }

  img {
    width: 100%;
    height: 100%;
    object-fit: cover;
  }
}

.result-image-placeholder {
  width: 100%;
  height: 100%;
  display: flex;
  align-items: center;
  justify-content: center;

  i {
    font-size: 2rem;
    color: var(--text-muted);
  }
}

.result-content {
  flex: 1;
  display: flex;
  flex-direction: column;
  gap: var(--spacing-sm);
}

.result-title {
  font-size: 1.125rem;
  font-weight: 600;
  color: var(--text-primary);
  margin: 0;
  line-height: 1.3;
}

.result-description {
  font-size: 0.875rem;
  color: var(--text-secondary);
  margin: 0;
  line-height: 1.4;
}

.result-stats {
  margin-top: auto;
}

.stat-bar {
  display: flex;
  height: 8px;
  border-radius: var(--radius-full);
  overflow: hidden;
  background: var(--background-tertiary);
  margin-bottom: var(--spacing-xs);
}

.stat-bar-fill {
  height: 100%;
  transition: width 0.5s ease;

  &.stat-bar-likes {
    background: var(--color-success);
  }

  &.stat-bar-dislikes {
    background: var(--color-danger);
  }
}

.stat-details {
  display: flex;
  justify-content: space-between;
  font-size: 0.85rem;
  font-weight: 600;
}

.stat-like {
  display: flex;
  align-items: center;
  gap: 4px;
  color: var(--color-success);
}

.stat-dislike {
  display: flex;
  align-items: center;
  gap: 4px;
  color: var(--color-danger);
}

.result-rating {
  display: flex;
  align-items: center;
  gap: var(--spacing-xs);
  margin-top: var(--spacing-xs);
  padding: var(--spacing-xs) var(--spacing-sm);
  background: rgba(251, 187, 33, 0.1);
  border-radius: var(--radius-sm);
  width: fit-content;

  i {
    color: var(--color-primary);
    font-size: 1rem;
  }

  .rating-value {
    font-size: 1.125rem;
    font-weight: 700;
    color: var(--text-primary);
  }

  .rating-max {
    font-size: 0.875rem;
    color: var(--text-secondary);
  }
}

/* État vide */
.empty-state {
  text-align: center;
  padding: var(--spacing-3xl);
  color: var(--text-secondary);

  i {
    font-size: 4rem;
    color: var(--text-muted);
    margin-bottom: var(--spacing-lg);
  }

  p {
    font-size: 1.125rem;
    margin: 0;
  }
}
</style>
