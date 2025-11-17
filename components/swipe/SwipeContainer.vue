<template>
  <div class="swipe-container">
    <!-- Barre de progression -->
    <div class="progress-bar">
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
          @swipe-left="handleSwipeLeft"
          @swipe-right="handleSwipeRight"
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

      <!-- Message de fin -->
      <transition name="fade-scale">
        <div v-if="pollStore.isCompleted" class="completion-message">
          <div class="completion-icon">
            <i class="pi pi-check-circle"></i>
          </div>
          <h2 class="completion-title">Bravo !</h2>
          <p class="completion-text">
            Vous avez voté sur toutes les propositions
          </p>
          <button class="btn btn-primary completion-button" @click="handleSubmit">
            <i class="pi pi-send"></i>
            Envoyer mes réponses
          </button>
        </div>
      </transition>
    </div>

    <!-- Boutons d'action (mobile & desktop) -->
    <div class="action-buttons">
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
import { ref, computed, onMounted } from 'vue'
import { usePollStore } from '~/stores/poll'
import { gsap } from 'gsap'
import SwipeCard from './SwipeCard.vue'

/**
 * Store Pinia
 */
const pollStore = usePollStore()

/**
 * Référence à la carte actuelle
 */
const currentCardRef = ref(null)

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
 * Soumet toutes les réponses
 */
const handleSubmit = async () => {
  const result = await pollStore.submitVotes()

  if (result.success) {
    // Rediriger vers une page de confirmation ou afficher un message
    console.log('Votes soumis avec succès !')
    // navigateTo('/poll/success') // À implémenter
  } else {
    console.error('Erreur lors de la soumission:', result.error)
  }
}

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
  gap: 0.5rem;
}

.progress-text {
  text-align: center;
  color: white;
  font-weight: 600;
  font-size: 1.1rem;
}

.progress-track {
  height: 8px;
  background: rgba(255, 255, 255, 0.2);
  border-radius: 1rem;
  overflow: hidden;
}

.progress-fill {
  height: 100%;
  background: linear-gradient(90deg, #4ade80, #22c55e);
  border-radius: 1rem;
  transition: width 0.3s ease;
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
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
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
    color: rgba(255, 255, 255, 0.3);
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
  color: white;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 1.5rem;
  padding: 2rem;
}

.completion-icon {
  i {
    font-size: 5rem;
    color: #4ade80;
  }
}

.completion-title {
  font-size: 2.5rem;
  font-weight: 700;
  margin: 0;
}

.completion-text {
  font-size: 1.2rem;
  opacity: 0.9;
  margin: 0;
}

.completion-button {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  font-size: 1.1rem;
  margin-top: 1rem;
}

/* Boutons d'action */
.action-buttons {
  display: flex;
  justify-content: center;
  align-items: center;
  gap: 1.5rem;
  padding: 1rem 0;
}

.action-btn {
  width: 60px;
  height: 60px;
  border-radius: 50%;
  border: none;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 1.5rem;
  cursor: pointer;
  transition: all 0.2s;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);

  &:hover:not(:disabled) {
    transform: scale(1.1);
    box-shadow: 0 6px 16px rgba(0, 0, 0, 0.2);
  }

  &:active:not(:disabled) {
    transform: scale(0.95);
  }

  &:disabled {
    opacity: 0.5;
    cursor: not-allowed;
  }

  &.action-btn-dislike {
    background: #f87171;
    color: white;
  }

  &.action-btn-like {
    background: #4ade80;
    color: white;
    width: 70px;
    height: 70px;
    font-size: 1.8rem;
  }

  &.action-btn-undo {
    background: white;
    color: #667eea;
    width: 50px;
    height: 50px;
    font-size: 1.2rem;
  }
}

/* Instructions */
.instructions-overlay {
  position: fixed;
  inset: 0;
  background: rgba(0, 0, 0, 0.9);
  backdrop-filter: blur(10px);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1000;
  padding: 2rem;
}

.instructions-content {
  max-width: 500px;
  color: white;
  text-align: center;
}

.instructions-title {
  font-size: 2rem;
  font-weight: 700;
  margin-bottom: 2rem;
}

.instructions-list {
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
  margin-bottom: 2rem;
}

.instruction-item {
  display: flex;
  align-items: center;
  gap: 1rem;
  text-align: left;
  padding: 1rem;
  background: rgba(255, 255, 255, 0.1);
  border-radius: 0.5rem;

  i {
    font-size: 1.5rem;
    color: #4ade80;
    flex-shrink: 0;
  }

  span {
    font-size: 1.1rem;
  }
}

.instructions-dismiss {
  opacity: 0.7;
  font-size: 0.9rem;
  margin-top: 2rem;
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
