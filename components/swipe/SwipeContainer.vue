<template>
  <div class="swipe-container">
    <!-- Barre de progression - Masquée quand le sondage est terminé -->
    <div v-if="!pollStore.isCompleted" class="progress-bar">
      <div class="progress-text">
        {{ pollStore.currentIndex + 1 }} / {{ pollStore.totalProposals }}
      </div>
      <div class="progress-track">
        <div
          class="progress-fill"
          :style="{ width: `${pollStore.progressPercentage}%` }"
        ></div>
      </div>
    </div>

    <!-- Échelle de notation sur les bords de l'écran -->
    <transition name="fade-slide">
      <div
        v-if="showRating"
        ref="ratingScaleRef"
        class="rating-scale-screen"
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

    <!-- Pile de cartes -->
    <div class="cards-stack">
      <!-- Cartes en arrière-plan (3 maximum visibles) -->
      <div
        v-for="(proposal, index) in visibleProposals"
        :key="proposal.id"
        class="card-wrapper"
        :class="`card-depth-${index}`"
        :style="getCardStyle(index)"
      >
        <SwipeCard
          v-if="index === 0"
          ref="currentCardRef"
          :proposal="proposal"
          :rating-scale-element="ratingScaleRef"
          @swipe-left="handleSwipeLeft"
          @swipe-right="handleSwipeRight"
          @rating-state-change="handleRatingStateChange"
        />
        <!-- Cartes en arrière-plan (juste pour l'effet visuel) -->
        <div v-else class="card-preview">
          <div class="card-preview-image">
            <img
              v-if="proposal.image"
              :src="proposal.image"
              :alt="proposal.title"
            />
            <div v-else class="card-preview-placeholder">
              <i class="pi pi-image"></i>
            </div>
          </div>
          <div class="card-preview-title">{{ proposal.title }}</div>
        </div>
      </div>

    </div>

    <!-- Boutons d'action (mobile & desktop) - Masqués quand le sondage est terminé -->
    <div v-if="!pollStore.isCompleted" class="action-buttons">
      <button
        class="action-btn action-btn-dislike"
        :disabled="!pollStore.currentProposal"
        @click="triggerDislike"
      >
        <i class="pi pi-times"></i>
      </button>

      <button
        class="action-btn action-btn-undo"
        :disabled="pollStore.currentIndex === 0"
        @click="handleUndo"
      >
        <i class="pi pi-arrow-left"></i>
      </button>

      <button
        class="action-btn action-btn-like"
        :disabled="!pollStore.currentProposal"
        @click="triggerLike"
      >
        <i class="pi pi-heart"></i>
      </button>
    </div>

    <!-- Instructions (affichées uniquement au début) -->
    <transition name="fade">
      <div v-if="showInstructions" class="instructions-overlay" @click="hideInstructions">
        <div class="instructions-content">
          <h3 class="instructions-title">Comment ça marche ?</h3>
          <div class="instructions-list">
            <div class="instruction-item">
              <i class="pi pi-arrow-right"></i>
              <span>Swipez à droite ou cliquez sur ❤️ pour aimer</span>
            </div>
            <div class="instruction-item">
              <i class="pi pi-arrow-left"></i>
              <span>Swipez à gauche ou cliquez sur ✕ pour refuser</span>
            </div>
            <div class="instruction-item">
              <i class="pi pi-star"></i>
              <span>Swipez plus loin pour noter de 0 à 10</span>
            </div>
          </div>
          <p class="instructions-dismiss">Touchez pour continuer</p>
        </div>
      </div>
    </transition>
  </div>
</template>

<script setup>
import { ref, computed, onMounted, watch, nextTick } from 'vue'
import { usePollStore } from '~/stores/poll'
import { useRouter } from 'vue-router'
import { gsap } from 'gsap'
import SwipeCard from './SwipeCard.vue'

/**
 * Store Pinia et router
 */
const pollStore = usePollStore()
const router = useRouter()

/**
 * Référence à la carte actuelle
 */
const currentCardRef = ref(null)

/**
 * Référence à l'échelle de notation
 */
const ratingScaleRef = ref(null)

/**
 * État de l'échelle de notation (reçu depuis SwipeCard)
 */
const showRating = ref(false)
const currentRating = ref(null)
const ratingPosition = ref('right')

/**
 * Valeurs de notation possibles selon la position
 * Gauche (dislike) : 5 à 0
 * Droite (like) : 10 à 5
 */
const ratingValues = computed(() => {
  if (ratingPosition.value === 'left') {
    // Échelle gauche : 5, 4, 3, 2, 1, 0
    return Array.from({ length: 6 }, (_, i) => 5 - i)
  } else {
    // Échelle droite : 10, 9, 8, 7, 6, 5
    return Array.from({ length: 6 }, (_, i) => 10 - i)
  }
})

/**
 * Affichage des instructions
 */
const showInstructions = ref(true)

/**
 * Nombre de cartes visibles dans la pile (pour l'effet de profondeur)
 */
const MAX_VISIBLE_CARDS = 3

/**
 * Liste des propositions visibles (carte actuelle + 2 suivantes)
 */
const visibleProposals = computed(() => {
  return pollStore.remainingProposals.slice(0, MAX_VISIBLE_CARDS)
})

/**
 * Gère un swipe vers la gauche (dislike)
 */
const handleSwipeLeft = ({ proposalId, rating }) => {
  pollStore.recordVote(proposalId, 'left', rating)
  pollStore.nextProposal()
  animateNextCard()
}

/**
 * Gère un swipe vers la droite (like)
 */
const handleSwipeRight = ({ proposalId, rating }) => {
  pollStore.recordVote(proposalId, 'right', rating)
  pollStore.nextProposal()
  animateNextCard()
}

/**
 * Gère les changements d'état de la notation (depuis SwipeCard)
 */
const handleRatingStateChange = ({ show, rating, position }) => {
  showRating.value = show
  currentRating.value = rating
  ratingPosition.value = position
}

/**
 * Déclenche un dislike programmatique
 */
const triggerDislike = () => {
  if (currentCardRef.value?.[0]) {
    currentCardRef.value[0].triggerSwipe('left')
  }
}

/**
 * Déclenche un like programmatique
 */
const triggerLike = () => {
  if (currentCardRef.value?.[0]) {
    currentCardRef.value[0].triggerSwipe('right')
  }
}

/**
 * Annule le dernier vote et revient en arrière
 */
const handleUndo = () => {
  pollStore.previousProposal()
  // Animer le retour de la carte (optionnel)
  animatePreviousCard()
}

/**
 * Watcher pour rediriger vers la page de récapitulatif quand le sondage est terminé
 */
watch(() => pollStore.isCompleted, (isCompleted) => {
  if (isCompleted) {
    router.push('/poll/summary')
  }
})

/**
 * Cache les instructions
 */
const hideInstructions = () => {
  showInstructions.value = false
  // Sauvegarder dans localStorage pour ne plus les afficher
  if (process.client) {
    localStorage.setItem('choice_instructions_seen', 'true')
  }
}

/**
 * Calcule le style pour l'effet de profondeur des cartes
 */
const getCardStyle = (index) => {
  const scale = 1 - index * 0.05 // Chaque carte est 5% plus petite
  const translateY = index * 10 // Décalage vertical
  const opacity = 1 - index * 0.2 // Opacité réduite

  return {
    transform: `scale(${scale}) translateY(-${translateY}px)`,
    opacity: opacity,
    zIndex: MAX_VISIBLE_CARDS - index
  }
}

/**
 * Anime l'apparition de la prochaine carte
 */
const animateNextCard = () => {
  // Animation des cartes en arrière-plan qui remontent
  const cardWrappers = document.querySelectorAll('.card-wrapper')
  cardWrappers.forEach((card, index) => {
    if (index > 0) {
      gsap.fromTo(
        card,
        {
          scale: 1 - index * 0.05,
          y: -index * 10
        },
        {
          scale: 1 - (index - 1) * 0.05,
          y: -(index - 1) * 10,
          duration: 0.3,
          ease: 'power2.out'
        }
      )
    }
  })
}

/**
 * Anime le retour à la carte précédente
 */
const animatePreviousCard = () => {
  const cardWrappers = document.querySelectorAll('.card-wrapper')
  cardWrappers.forEach((card, index) => {
    gsap.fromTo(
      card,
      {
        scale: 1 - (index - 1) * 0.05,
        y: -(index - 1) * 10,
        opacity: 0
      },
      {
        scale: 1 - index * 0.05,
        y: -index * 10,
        opacity: 1 - index * 0.2,
        duration: 0.3,
        ease: 'power2.out'
      }
    )
  })
}

/**
 * Initialisation au montage
 */
onMounted(() => {
  // Vérifier si les instructions ont déjà été vues
  if (process.client) {
    const seen = localStorage.getItem('choice_instructions_seen')
    if (seen) {
      showInstructions.value = false
    }
  }
})
</script>

<style scoped lang="scss">
.swipe-container {
  position: relative;
  width: 100%;
  max-width: 500px;
  margin: 0 auto;
  padding: 2rem 1rem;
  min-height: 100vh;
  display: flex;
  flex-direction: column;
  gap: 2rem;
}

/* Barre de progression */
.progress-bar {
  display: flex;
  flex-direction: column;
  gap: var(--spacing-md);
}

.progress-text {
  text-align: center;
  color: var(--text-secondary);
  font-weight: 600;
  font-size: 1.1rem;
}

.progress-track {
  height: 10px;
  background: var(--background-tertiary);
  border-radius: var(--radius-full);
  overflow: hidden;
  box-shadow: inset 0 1px 3px rgba(0, 0, 0, 0.1);
}

.progress-fill {
  height: 100%;
  background: var(--color-primary);
  border-radius: var(--radius-full);
  transition: width var(--transition-slow) var(--transition-ease);
}

/* Pile de cartes */
.cards-stack {
  position: relative;
  flex: 1;
  display: flex;
  align-items: center;
  justify-content: center;
  min-height: 600px;

  @media (max-width: 768px) {
    min-height: 70vh;
  }
}

.card-wrapper {
  position: absolute;
  width: 100%;
  max-width: 400px;
  transition: transform 0.3s ease, opacity 0.3s ease;

  @media (max-width: 768px) {
    max-width: 90vw;
  }
}

/* Aperçu des cartes en arrière-plan */
.card-preview {
  background: white;
  border-radius: 1rem;
  box-shadow: 0 10px 40px rgba(0, 0, 0, 0.2);
  overflow: hidden;
  height: 600px;
  display: flex;
  flex-direction: column;
  pointer-events: none;

  @media (max-width: 768px) {
    height: 70vh;
  }
}

.card-preview-image {
  flex: 1;
  background: var(--background-tertiary);
  display: flex;
  align-items: center;
  justify-content: center;

  img {
    width: 100%;
    height: 100%;
    object-fit: cover;
  }

  i {
    font-size: 3rem;
    color: var(--text-muted);
  }
}

.card-preview-placeholder {
  width: 100%;
  height: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
}

.card-preview-title {
  padding: 1rem;
  background: white;
  font-weight: 600;
  text-align: center;
  color: #1f2937;
}

/* Message de fin */
.completion-message {
  text-align: center;
  color: var(--text-primary);
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: var(--spacing-xl);
  padding: var(--spacing-2xl);
}

.completion-icon {
  i {
    font-size: 5rem;
    color: var(--color-success);
  }
}

.completion-title {
  font-size: 2.5rem;
  font-weight: 800;
  margin: 0;
  color: var(--text-primary);
}

.completion-text {
  font-size: 1.25rem;
  color: var(--text-secondary);
  margin: 0;
}

.completion-button {
  display: flex;
  align-items: center;
  gap: var(--spacing-sm);
  font-size: 1.1rem;
  margin-top: var(--spacing-md);
}

/* Boutons d'action */
.action-buttons {
  display: flex;
  justify-content: center;
  align-items: center;
  gap: var(--spacing-xl);
  padding: var(--spacing-xl) 0;
}

.action-btn {
  width: 64px;
  height: 64px;
  border-radius: var(--radius-full);
  border: none;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 1.5rem;
  cursor: pointer;
  transition: all var(--transition-base) var(--transition-ease);
  box-shadow: var(--shadow-md);

  &:hover:not(:disabled) {
    transform: scale(1.1);
    box-shadow: var(--shadow-lg);
  }

  &:active:not(:disabled) {
    transform: scale(0.95);
    box-shadow: var(--shadow-sm);
  }

  &:disabled {
    opacity: var(--disabled-opacity);
    cursor: not-allowed;
  }

  &.action-btn-dislike {
    background: var(--color-danger);
    color: var(--text-inverse);
  }

  &.action-btn-like {
    background: var(--color-success);
    color: var(--text-inverse);
    width: 76px;
    height: 76px;
    font-size: 1.8rem;
    box-shadow: var(--shadow-lg);
  }

  &.action-btn-undo {
    background: var(--background-primary);
    color: var(--text-secondary);
    border: 2px solid var(--border-color-dark);
    width: 52px;
    height: 52px;
    font-size: 1.2rem;
  }
}

/* Instructions */
.instructions-overlay {
  position: fixed;
  inset: 0;
  background: var(--background-overlay);
  backdrop-filter: blur(10px);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1000;
  padding: var(--spacing-xl);
}

.instructions-content {
  max-width: 500px;
  background: var(--background-primary);
  color: var(--text-primary);
  text-align: center;
  padding: var(--spacing-2xl);
  border-radius: var(--radius-xl);
  box-shadow: var(--shadow-2xl);
}

.instructions-title {
  font-size: 2rem;
  font-weight: 800;
  margin-bottom: var(--spacing-2xl);
  color: var(--text-primary);
}

.instructions-list {
  display: flex;
  flex-direction: column;
  gap: var(--spacing-lg);
  margin-bottom: var(--spacing-2xl);
}

.instruction-item {
  display: flex;
  align-items: center;
  gap: var(--spacing-lg);
  text-align: left;
  padding: var(--spacing-lg);
  background: var(--background-secondary);
  border-radius: var(--radius-md);
  border: 2px solid var(--border-color);

  i {
    font-size: 1.5rem;
    color: var(--color-primary);
    flex-shrink: 0;
  }

  span {
    font-size: 1.1rem;
    color: var(--text-secondary);
  }
}

.instructions-dismiss {
  color: var(--text-tertiary);
  font-size: 0.95rem;
  margin-top: var(--spacing-lg);
}

/* Échelle de notation sur les bords de l'écran */
.rating-scale-screen {
  position: fixed;
  top: 0;
  bottom: 0;
  width: 80px;
  background: var(--rating-background);
  backdrop-filter: blur(10px);
  z-index: 100;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: var(--spacing-2xl) 0;

  &.rating-scale-left {
    left: 0;
    border-right: 4px solid var(--color-primary);
  }

  &.rating-scale-right {
    right: 0;
    border-left: 4px solid var(--color-primary);
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
  transition: all var(--transition-fast) var(--transition-ease);
  position: relative;

  &.active {
    background: var(--color-primary);

    .rating-number {
      font-size: 1.5rem;
      font-weight: 900;
      transform: scale(1.4);
      color: var(--text-primary);
    }

    &::before {
      content: '';
      position: absolute;
      left: -4px;
      top: 0;
      bottom: 0;
      width: 4px;
      background: var(--color-primary);
    }
  }
}

.rating-number {
  color: var(--rating-text);
  font-weight: 700;
  font-size: 1.1rem;
  transition: all var(--transition-fast) var(--transition-ease);
  pointer-events: none;
}

.rating-hint {
  position: absolute;
  top: 50%;
  transform: translateY(-50%);
  font-size: 5rem;
  font-weight: 900;
  color: var(--color-primary);
  opacity: 0.2;
  pointer-events: none;
  z-index: 1;
  left: 50%;
  margin-left: -2rem;

  span {
    display: block;
    text-align: center;
  }
}

/* Animations */
.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.3s ease;
}

.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}

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

.fade-scale-enter-active,
.fade-scale-leave-active {
  transition: all 0.4s ease;
}

.fade-scale-enter-from,
.fade-scale-leave-to {
  opacity: 0;
  transform: scale(0.8);
}
</style>
