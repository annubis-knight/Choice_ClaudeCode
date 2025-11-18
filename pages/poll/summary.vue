<template>
  <div class="summary-page">
    <div class="summary-container">
      <!-- Header -->
      <div class="summary-header">
        <h1 class="summary-title">Récapitulatif de vos votes</h1>
        <p class="summary-subtitle">
          Vous avez voté sur {{ totalVotes }} proposition{{ totalVotes > 1 ? 's' : '' }}
        </p>
      </div>

      <!-- Liste des votes scrollable -->
      <div class="votes-list">
        <div
          v-for="(voteData, index) in votesWithProposals"
          :key="voteData.vote.proposalId"
          class="vote-item"
          :style="{ animationDelay: `${index * 0.05}s` }"
        >
          <!-- Image de la proposition -->
          <div class="vote-image">
            <img
              v-if="voteData.proposal.image"
              :src="voteData.proposal.image"
              :alt="voteData.proposal.title"
            />
            <div v-else class="vote-image-placeholder">
              <i class="pi pi-image"></i>
            </div>
          </div>

          <!-- Informations du vote -->
          <div class="vote-info">
            <h3 class="vote-title">{{ voteData.proposal.title }}</h3>

            <!-- Tags -->
            <div v-if="voteData.proposal.tags?.length" class="vote-tags">
              <span
                v-for="tag in voteData.proposal.tags"
                :key="tag"
                class="vote-tag"
              >
                {{ tag }}
              </span>
            </div>

            <!-- Badge Like/Dislike -->
            <div
              class="vote-badge"
              :class="voteData.vote.direction === 'right' ? 'vote-badge-like' : 'vote-badge-dislike'"
            >
              <i
                :class="voteData.vote.direction === 'right' ? 'pi pi-heart' : 'pi pi-times'"
              ></i>
              <span>{{ voteData.vote.direction === 'right' ? 'J\'aime' : 'Je n\'aime pas' }}</span>
            </div>

            <!-- Édition de la note -->
            <div class="vote-rating-edit">
              <label class="rating-label">Note :</label>
              <div class="rating-options">
                <button
                  v-for="rating in getRatingRange(voteData.vote.direction)"
                  :key="rating"
                  class="rating-btn"
                  :class="{ active: voteData.vote.rating === rating }"
                  @click="updateRating(voteData.vote.proposalId, rating)"
                >
                  {{ rating }}
                </button>
                <button
                  class="rating-btn rating-btn-clear"
                  :class="{ active: voteData.vote.rating === null }"
                  @click="updateRating(voteData.vote.proposalId, null)"
                  title="Supprimer la note"
                >
                  <i class="pi pi-times"></i>
                </button>
              </div>
            </div>

            <!-- Champ commentaire -->
            <div class="vote-comment">
              <label class="comment-label">Commentaire (optionnel) :</label>
              <textarea
                v-model="voteData.vote.comment"
                class="comment-input"
                placeholder="Ajoutez un commentaire..."
                rows="3"
                @blur="updateComment(voteData.vote.proposalId, voteData.vote.comment)"
              ></textarea>
            </div>
          </div>
        </div>
      </div>

      <!-- Actions -->
      <div class="summary-actions">
        <button class="btn btn-secondary" @click="handleEdit">
          <i class="pi pi-arrow-left"></i>
          Modifier mes votes
        </button>
        <button class="btn btn-primary" @click="handleSubmit">
          <i class="pi pi-send"></i>
          Envoyer mes réponses
        </button>
      </div>
    </div>
  </div>
</template>

<script setup>
import { computed, onMounted } from 'vue'
import { usePollStore } from '~/stores/poll'
import { useRouter } from 'vue-router'

const pollStore = usePollStore()
const router = useRouter()

/**
 * Rediriger si aucun vote n'a été enregistré
 */
onMounted(() => {
  if (pollStore.votes.size === 0) {
    router.push('/')
  }
})

/**
 * Nombre total de votes
 */
const totalVotes = computed(() => pollStore.votes.size)

/**
 * Votes avec leurs propositions associées
 */
const votesWithProposals = computed(() => {
  const result = []

  pollStore.votes.forEach((vote, proposalId) => {
    const proposal = pollStore.proposals.find(p => p.id === proposalId)
    if (proposal) {
      result.push({
        vote,
        proposal
      })
    }
  })

  return result
})

/**
 * Retourne la plage de notes selon la direction du vote
 * Gauche (dislike) : 0 à 5
 * Droite (like) : 5 à 10
 */
const getRatingRange = (direction) => {
  if (direction === 'left') {
    return [0, 1, 2, 3, 4, 5]
  } else {
    return [5, 6, 7, 8, 9, 10]
  }
}

/**
 * Met à jour la note d'un vote
 */
const updateRating = (proposalId, rating) => {
  pollStore.updateVote(proposalId, { rating })
}

/**
 * Met à jour le commentaire d'un vote
 */
const updateComment = (proposalId, comment) => {
  pollStore.updateVote(proposalId, { comment })
}

/**
 * Retourne à la page de swipe pour modifier les votes
 */
const handleEdit = () => {
  router.push('/')
}

/**
 * Soumet toutes les réponses
 */
const handleSubmit = async () => {
  const result = await pollStore.submitVotes()

  if (result.success) {
    // Rediriger vers une page de succès ou afficher un message
    console.log('Votes soumis avec succès !')
    // TODO: Implémenter une page de confirmation
    alert('Merci ! Vos votes ont été enregistrés avec succès.')
    router.push('/')
  } else {
    console.error('Erreur lors de la soumission:', result.error)
    alert('Une erreur est survenue lors de l\'envoi de vos votes.')
  }
}
</script>

<style scoped lang="scss">
.summary-page {
  min-height: 100vh;
  background: var(--background-primary);
  padding: var(--spacing-2xl) var(--spacing-lg);

  @media (max-width: 768px) {
    padding: var(--spacing-lg) var(--spacing-md);
  }
}

.summary-container {
  max-width: 800px;
  margin: 0 auto;
  display: flex;
  flex-direction: column;
  gap: var(--spacing-2xl);
}

/* Header */
.summary-header {
  text-align: center;
  padding-bottom: var(--spacing-xl);
  border-bottom: 2px solid var(--border-color);
}

.summary-title {
  font-size: 2.5rem;
  font-weight: 800;
  color: var(--text-primary);
  margin: 0 0 var(--spacing-md) 0;

  @media (max-width: 768px) {
    font-size: 2rem;
  }
}

.summary-subtitle {
  font-size: 1.25rem;
  color: var(--text-secondary);
  margin: 0;
}

/* Liste des votes */
.votes-list {
  display: flex;
  flex-direction: column;
  gap: var(--spacing-2xl);
}

.vote-item {
  display: flex;
  gap: var(--spacing-xl);
  padding: var(--spacing-xl);
  background: var(--background-secondary);
  border-radius: var(--radius-lg);
  border: 2px solid var(--border-color);
  box-shadow: var(--shadow-sm);
  animation: slideIn 0.4s ease forwards;
  opacity: 0;

  @media (max-width: 768px) {
    flex-direction: column;
    gap: var(--spacing-lg);
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

.vote-image {
  flex-shrink: 0;
  width: 120px;
  height: 120px;
  border-radius: var(--radius-md);
  overflow: hidden;
  background: var(--background-tertiary);

  @media (max-width: 768px) {
    width: 100%;
    height: 200px;
  }

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

.vote-info {
  flex: 1;
  display: flex;
  flex-direction: column;
  gap: var(--spacing-md);
}

.vote-title {
  font-size: 1.5rem;
  font-weight: 700;
  color: var(--text-primary);
  margin: 0;
}

.vote-tags {
  display: flex;
  flex-wrap: wrap;
  gap: var(--spacing-sm);
}

.vote-tag {
  padding: var(--spacing-xs) var(--spacing-md);
  background: var(--background-tertiary);
  color: var(--text-secondary);
  border-radius: var(--radius-full);
  font-size: 0.85rem;
  font-weight: 600;
}

.vote-badge {
  display: inline-flex;
  align-items: center;
  gap: var(--spacing-sm);
  padding: var(--spacing-sm) var(--spacing-lg);
  border-radius: var(--radius-full);
  font-weight: 700;
  font-size: 1rem;
  width: fit-content;

  i {
    font-size: 1.1rem;
  }

  &.vote-badge-like {
    background: var(--color-success);
    color: white;
  }

  &.vote-badge-dislike {
    background: var(--color-danger);
    color: white;
  }
}

/* Édition de la note */
.vote-rating-edit {
  display: flex;
  flex-direction: column;
  gap: var(--spacing-sm);
}

.rating-label {
  font-weight: 600;
  color: var(--text-secondary);
  font-size: 0.95rem;
}

.rating-options {
  display: flex;
  flex-wrap: wrap;
  gap: var(--spacing-sm);
}

.rating-btn {
  width: 48px;
  height: 48px;
  border-radius: var(--radius-md);
  border: 2px solid var(--border-color-dark);
  background: var(--background-primary);
  color: var(--text-secondary);
  font-weight: 700;
  font-size: 1.1rem;
  cursor: pointer;
  transition: all var(--transition-base) var(--transition-ease);

  &:hover {
    border-color: var(--color-primary);
    background: var(--background-tertiary);
  }

  &.active {
    background: var(--color-primary);
    border-color: var(--color-primary);
    color: var(--text-primary);
    transform: scale(1.1);
  }

  &.rating-btn-clear {
    background: var(--color-danger);
    color: white;
    border-color: var(--color-danger);

    &:hover {
      opacity: 0.8;
    }

    &.active {
      background: var(--background-tertiary);
      color: var(--text-secondary);
      border-color: var(--border-color-dark);
    }
  }
}

/* Commentaire */
.vote-comment {
  display: flex;
  flex-direction: column;
  gap: var(--spacing-sm);
}

.comment-label {
  font-weight: 600;
  color: var(--text-secondary);
  font-size: 0.95rem;
}

.comment-input {
  width: 100%;
  padding: var(--spacing-md);
  border: 2px solid var(--border-color);
  border-radius: var(--radius-md);
  background: var(--background-primary);
  color: var(--text-primary);
  font-family: inherit;
  font-size: 1rem;
  resize: vertical;
  transition: all var(--transition-base) var(--transition-ease);

  &:focus {
    outline: none;
    border-color: var(--color-primary);
    box-shadow: 0 0 0 3px rgba(251, 187, 33, 0.1);
  }

  &::placeholder {
    color: var(--text-muted);
  }
}

/* Actions */
.summary-actions {
  display: flex;
  gap: var(--spacing-lg);
  padding-top: var(--spacing-xl);
  border-top: 2px solid var(--border-color);

  @media (max-width: 768px) {
    flex-direction: column;
  }
}

.btn {
  flex: 1;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: var(--spacing-md);
  padding: var(--spacing-lg) var(--spacing-2xl);
  border: none;
  border-radius: var(--radius-lg);
  font-size: 1.1rem;
  font-weight: 700;
  cursor: pointer;
  transition: all var(--transition-base) var(--transition-ease);
  box-shadow: var(--shadow-md);

  &:hover {
    transform: translateY(-2px);
    box-shadow: var(--shadow-lg);
  }

  &:active {
    transform: translateY(0);
    box-shadow: var(--shadow-sm);
  }

  i {
    font-size: 1.2rem;
  }

  &.btn-primary {
    background: var(--color-primary);
    color: var(--text-primary);

    &:hover {
      background: var(--color-primary-dark, #e0a61f);
    }
  }

  &.btn-secondary {
    background: var(--background-primary);
    color: var(--text-secondary);
    border: 2px solid var(--border-color-dark);

    &:hover {
      background: var(--background-tertiary);
      border-color: var(--text-secondary);
    }
  }
}
</style>
