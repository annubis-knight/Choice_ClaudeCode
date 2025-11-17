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

    <!-- Échelle de notation (visible lors du long swipe) -->
    <transition name="fade-slide">
      <div
        v-if="showRating"
        ref="ratingScaleRef"
        class="rating-scale"
        :class="`rating-scale-${ratingPosition}`"
      >
        <div class="rating-scale-track">
          <div
            v-for="rating in ratingValues"
            :key="rating"
            class="rating-item"
            :class="{ active: currentRating === rating }"
          >
            <span class="rating-number">{{ rating }}</span>
          </div>
        </div>

        <!-- Indication visuelle de la note survolée -->
        <div class="rating-hint">
          <span v-if="currentRating !== null">{{ currentRating }}</span>
        </div>
      </div>
    </transition>

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
  }
})

/**
 * Événements émis par le composant
 */
const emit = defineEmits([
  'swipe-left',  // Émis lors d'un swipe vers la gauche (dislike)
  'swipe-right', // Émis lors d'un swipe vers la droite (like)
])

// Référence à l'élément DOM de la carte
const cardRef = ref(null)

// Référence à l'élément de l'échelle de notation
const ratingScaleRef = ref(null)

// Valeurs de notation possibles (0 à 10)
const ratingValues = computed(() => Array.from({ length: 11 }, (_, i) => 10 - i))

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
 * Surveiller quand l'échelle de notation devient visible
 * pour passer sa référence au composable
 */
watch(showRating, async (isVisible) => {
  if (isVisible) {
    // Attendre le prochain tick pour que le DOM soit mis à jour
    await nextTick()
    if (ratingScaleRef.value) {
      setRatingScaleElement(ratingScaleRef.value)
    }
  }
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
  background: white;
  border-radius: 1rem;
  box-shadow: 0 10px 40px rgba(0, 0, 0, 0.2);
  overflow: hidden;
  cursor: grab;
  user-select: none;
  touch-action: none;

  &.is-dragging {
    cursor: grabbing;
  }

  @media (max-width: 768px) {
    max-width: 90vw;
    height: 70vh;
  }
}

/* Indicateurs de swipe */
.swipe-indicator {
  position: absolute;
  top: 2rem;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 0.5rem;
  padding: 1rem 1.5rem;
  border-radius: 0.5rem;
  font-weight: 700;
  font-size: 1.5rem;
  z-index: 10;
  pointer-events: none;
  transition: opacity 0.2s;

  i {
    font-size: 3rem;
  }

  &.swipe-indicator-left {
    left: 2rem;
    color: #f87171;
    background: rgba(248, 113, 113, 0.1);
    border: 3px solid #f87171;
  }

  &.swipe-indicator-right {
    right: 2rem;
    color: #4ade80;
    background: rgba(74, 222, 128, 0.1);
    border: 3px solid #4ade80;
  }
}

/* Échelle de notation */
.rating-scale {
  position: absolute;
  top: 0;
  bottom: 0;
  width: 80px;
  background: rgba(0, 0, 0, 0.9);
  backdrop-filter: blur(10px);
  z-index: 20;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 2rem 0;

  &.rating-scale-left {
    left: 0;
    border-right: 3px solid rgba(255, 255, 255, 0.3);
  }

  &.rating-scale-right {
    right: 0;
    border-left: 3px solid rgba(255, 255, 255, 0.3);
  }
}

.rating-scale-track {
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  width: 100%;
  height: 100%;
  flex: 1;
}

.rating-item {
  display: flex;
  align-items: center;
  justify-content: center;
  flex: 1;
  transition: all 0.15s;
  position: relative;

  &.active {
    background: linear-gradient(90deg, rgba(102, 126, 234, 0.9), rgba(118, 75, 162, 0.9));

    .rating-number {
      font-size: 1.4rem;
      font-weight: 800;
      transform: scale(1.3);
      text-shadow: 0 2px 8px rgba(0, 0, 0, 0.3);
    }

    &::before {
      content: '';
      position: absolute;
      left: -3px;
      top: 0;
      bottom: 0;
      width: 4px;
      background: white;
    }
  }
}

.rating-number {
  color: white;
  font-weight: 600;
  font-size: 1.1rem;
  transition: all 0.15s;
  pointer-events: none;
}

.rating-hint {
  position: absolute;
  top: 50%;
  transform: translateY(-50%);
  font-size: 3rem;
  font-weight: 900;
  color: rgba(255, 255, 255, 0.2);
  pointer-events: none;
  z-index: 1;

  span {
    display: block;
    text-align: center;
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
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);

  i {
    font-size: 4rem;
    color: rgba(255, 255, 255, 0.5);
  }
}

.card-info {
  padding: 1.5rem;
  background: white;
}

.card-title {
  font-size: 1.5rem;
  font-weight: 700;
  color: #1f2937;
  margin-bottom: 0.5rem;
}

.card-description {
  font-size: 0.95rem;
  color: #6b7280;
  margin-bottom: 1rem;
  line-height: 1.5;
}

.card-tags {
  display: flex;
  flex-wrap: wrap;
  gap: 0.5rem;
  margin-bottom: 1rem;
}

.card-tag {
  padding: 0.25rem 0.75rem;
  background: #e5e7eb;
  color: #4b5563;
  border-radius: 1rem;
  font-size: 0.85rem;
  font-weight: 500;
}

.card-meta {
  display: flex;
  gap: 1rem;
  flex-wrap: wrap;
}

.meta-item {
  display: flex;
  align-items: center;
  gap: 0.25rem;
  color: #6b7280;
  font-size: 0.9rem;

  i {
    font-size: 0.85rem;
  }
}

/* Badge de notation actuelle */
.current-rating-badge {
  position: absolute;
  bottom: 1.5rem;
  right: 1.5rem;
  background: rgba(102, 126, 234, 0.95);
  color: white;
  padding: 0.75rem 1.25rem;
  border-radius: 2rem;
  display: flex;
  align-items: center;
  gap: 0.5rem;
  font-weight: 700;
  font-size: 1.1rem;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.2);
  z-index: 15;

  i {
    font-size: 1rem;
  }
}

/* Animations */
.fade-slide-enter-active,
.fade-slide-leave-active {
  transition: all 0.3s ease;
}

.fade-slide-enter-from {
  opacity: 0;
  transform: translateX(-20px);
}

.fade-slide-leave-to {
  opacity: 0;
  transform: translateX(20px);
}
</style>
