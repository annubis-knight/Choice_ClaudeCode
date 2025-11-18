<template>
  <div
    ref="cardRef"
    class="swipe-card"
    :class="{ 'is-dragging': isDragging }"
  >
    <!-- Indicateurs de swipe (like/dislike) -->
    <div
      class="swipe-indicator swipe-indicator-left"
      :style="{ opacity: swipeDirection === 'left' ? swipeIndicatorOpacity : 0 }"
    >
      <i class="pi pi-times-circle"></i>
      <span>NOPE</span>
    </div>

    <div
      class="swipe-indicator swipe-indicator-right"
      :style="{ opacity: swipeDirection === 'right' ? swipeIndicatorOpacity : 0 }"
    >
      <i class="pi pi-check-circle"></i>
      <span>LIKE</span>
    </div>

    <!-- Contenu de la carte -->
    <div class="card-content">
      <!-- Image de la proposition -->
      <div
        class="card-image"
        :style="{ backgroundImage: proposal.image ? `url(${proposal.image})` : 'none' }"
      >
        <div v-if="!proposal.image" class="card-image-placeholder">
          <i class="pi pi-image"></i>
        </div>
      </div>

      <!-- Informations de la proposition -->
      <div class="card-info">
        <h3 class="card-title">{{ proposal.title }}</h3>
        <p v-if="proposal.description" class="card-description">
          {{ proposal.description }}
        </p>

        <!-- Tags/Catégories -->
        <div v-if="proposal.tags && proposal.tags.length" class="card-tags">
          <span
            v-for="tag in proposal.tags"
            :key="tag"
            class="card-tag"
          >
            {{ tag }}
          </span>
        </div>

        <!-- Informations supplémentaires (prix, distance, etc.) -->
        <div class="card-meta">
          <div v-if="proposal.price" class="meta-item">
            <i class="pi pi-euro"></i>
            <span>{{ proposal.price }}</span>
          </div>
          <div v-if="proposal.location" class="meta-item">
            <i class="pi pi-map-marker"></i>
            <span>{{ proposal.location }}</span>
          </div>
          <div v-if="proposal.duration" class="meta-item">
            <i class="pi pi-clock"></i>
            <span>{{ proposal.duration }}</span>
          </div>
        </div>
      </div>
    </div>

    <!-- Indication de notation active -->
    <div v-if="currentRating !== null" class="current-rating-badge">
      <i class="pi pi-star-fill"></i>
      <span>{{ currentRating }}/10</span>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, watch, nextTick } from 'vue'
import { useSwipe } from '~/composables/useSwipe'

/**
 * Props du composant SwipeCard
 */
const props = defineProps({
  proposal: {
    type: Object,
    required: true,
    validator: (value) => {
      return value && typeof value.id !== 'undefined' && typeof value.title === 'string'
    }
  },
  ratingScaleElement: {
    type: Object,
    default: null
  }
})

/**
 * Événements émis par le composant
 */
const emit = defineEmits([
  'swipe-left',  // Émis lors d'un swipe vers la gauche (dislike)
  'swipe-right', // Émis lors d'un swipe vers la droite (like)
  'rating-state-change' // Émis quand l'état de la notation change
])

// Référence à l'élément DOM de la carte
const cardRef = ref(null)

/**
 * Callback appelé lors d'un swipe gauche
 */
const handleSwipeLeft = (rating) => {
  emit('swipe-left', {
    proposalId: props.proposal.id,
    rating
  })
}

/**
 * Callback appelé lors d'un swipe droite
 */
const handleSwipeRight = (rating) => {
  emit('swipe-right', {
    proposalId: props.proposal.id,
    rating
  })
}

/**
 * Utilisation du composable useSwipe pour gérer le swipe
 */
const {
  isDragging,
  offsetX,
  showRating,
  currentRating,
  ratingPosition,
  swipeIndicatorOpacity,
  swipeDirection,
  triggerSwipe,
  setRatingScaleElement
} = useSwipe(cardRef, handleSwipeLeft, handleSwipeRight)

/**
 * Surveiller quand la prop ratingScaleElement change
 * pour la passer au composable
 */
watch(() => props.ratingScaleElement, (element) => {
  if (element) {
    setRatingScaleElement(element)
  }
}, { immediate: true })

/**
 * Surveiller les changements d'état de la notation
 * et les émettre au parent
 */
watch([showRating, currentRating, ratingPosition], ([show, rating, position]) => {
  emit('rating-state-change', {
    show,
    rating,
    position
  })
})

/**
 * Expose des méthodes pour usage externe (par le parent)
 */
defineExpose({
  triggerSwipe
})
</script>

<style scoped lang="scss">
.swipe-card {
  position: relative;
  width: 100%;
  max-width: 400px;
  height: 600px;
  background: var(--background-primary);
  border-radius: var(--radius-xl);
  box-shadow: var(--shadow-xl);
  overflow: hidden;
  cursor: grab;
  user-select: none;
  touch-action: none;
  border: 1px solid var(--border-color);

  &.is-dragging {
    cursor: grabbing;
    box-shadow: var(--shadow-2xl);
  }

  @media (max-width: 768px) {
    max-width: 90vw;
    height: 70vh;
  }
}

/* Indicateurs de swipe */
.swipe-indicator {
  position: absolute;
  top: var(--spacing-xl);
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: var(--spacing-sm);
  padding: var(--spacing-lg) var(--spacing-xl);
  border-radius: var(--radius-lg);
  font-weight: 800;
  font-size: 1.5rem;
  z-index: 10;
  pointer-events: none;
  transition: opacity var(--transition-base) var(--transition-ease);

  i {
    font-size: 3rem;
  }

  &.swipe-indicator-left {
    left: var(--spacing-xl);
    color: var(--color-danger);
    background: rgba(248, 113, 113, 0.15);
    border: 4px solid var(--color-danger);
  }

  &.swipe-indicator-right {
    right: var(--spacing-xl);
    color: var(--color-success);
    background: rgba(74, 222, 128, 0.15);
    border: 4px solid var(--color-success);
  }
}

/* Contenu de la carte */
.card-content {
  height: 100%;
  display: flex;
  flex-direction: column;
}

.card-image {
  flex: 1;
  background-size: cover;
  background-position: center;
  background-repeat: no-repeat;
  position: relative;
}

.card-image-placeholder {
  width: 100%;
  height: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
  background: var(--background-tertiary);

  i {
    font-size: 4rem;
    color: var(--text-muted);
  }
}

.card-info {
  padding: var(--spacing-xl);
  background: var(--background-primary);
  border-top: 1px solid var(--border-color);
}

.card-title {
  font-size: 1.5rem;
  font-weight: 800;
  color: var(--text-primary);
  margin-bottom: var(--spacing-sm);
  letter-spacing: -0.02em;
}

.card-description {
  font-size: 1rem;
  color: var(--text-secondary);
  margin-bottom: var(--spacing-lg);
  line-height: 1.6;
}

.card-tags {
  display: flex;
  flex-wrap: wrap;
  gap: var(--spacing-sm);
  margin-bottom: var(--spacing-lg);
}

.card-tag {
  padding: var(--spacing-sm) var(--spacing-md);
  background: var(--background-secondary);
  color: var(--text-secondary);
  border-radius: var(--radius-full);
  font-size: 0.875rem;
  font-weight: 600;
  border: 1px solid var(--border-color);
}

.card-meta {
  display: flex;
  gap: var(--spacing-lg);
  flex-wrap: wrap;
}

.meta-item {
  display: flex;
  align-items: center;
  gap: var(--spacing-sm);
  color: var(--text-tertiary);
  font-size: 0.9rem;
  font-weight: 500;

  i {
    font-size: 0.9rem;
    color: var(--text-muted);
  }
}

/* Badge de notation actuelle */
.current-rating-badge {
  position: absolute;
  bottom: var(--spacing-xl);
  right: var(--spacing-xl);
  background: var(--color-primary);
  color: var(--text-primary);
  padding: var(--spacing-md) var(--spacing-xl);
  border-radius: var(--radius-full);
  display: flex;
  align-items: center;
  gap: var(--spacing-sm);
  font-weight: 900;
  font-size: 1.25rem;
  box-shadow: var(--shadow-lg);
  z-index: 15;
  border: 2px solid var(--text-primary);

  i {
    font-size: 1.1rem;
  }
}

</style>
