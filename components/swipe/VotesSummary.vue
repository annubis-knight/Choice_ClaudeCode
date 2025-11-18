<template>
  <div class="votes-summary">
    <!-- En-tête -->
    <div class="summary-header">
      <div class="summary-icon">
        <i class="pi pi-check-circle"></i>
      </div>
      <h2 class="summary-title">Récapitulatif de vos votes</h2>
      <p class="summary-subtitle">
        Vous avez voté sur {{ totalVotes }} proposition{{ totalVotes > 1 ? 's' : '' }}
      </p>
    </div>

    <!-- Liste des votes (scrollable) -->
    <div class="votes-list">
      <div
        v-for="vote in votesWithProposals"
        :key="vote.proposalId"
        class="vote-item"
      >
        <!-- Image de la proposition -->
        <div
          class="vote-image"
          :style="{ backgroundImage: vote.proposal.image ? `url(${vote.proposal.image})` : 'none' }"
        >
          <div v-if="!vote.proposal.image" class="vote-image-placeholder">
            <i class="pi pi-image"></i>
          </div>
        </div>

        <!-- Informations du vote -->
        <div class="vote-info">
          <h3 class="vote-title">{{ vote.proposal.title }}</h3>

          <!-- Indicateur Like/Dislike -->
          <div class="vote-status">
            <div
              class="vote-badge"
              :class="vote.direction === 'right' ? 'vote-badge-like' : 'vote-badge-dislike'"
            >
              <i :class="vote.direction === 'right' ? 'pi pi-heart-fill' : 'pi pi-times-circle'"></i>
              <span>{{ vote.direction === 'right' ? 'J\'aime' : 'Pas intéressé' }}</span>
            </div>

            <!-- Note si présente -->
            <div v-if="vote.rating !== null" class="vote-rating">
              <i class="pi pi-star-fill"></i>
              <span>{{ vote.rating }}/10</span>
            </div>
          </div>

          <!-- Tags -->
          <div v-if="vote.proposal.tags && vote.proposal.tags.length" class="vote-tags">
            <span
              v-for="tag in vote.proposal.tags.slice(0, 3)"
              :key="tag"
              class="vote-tag"
            >
              {{ tag }}
            </span>
          </div>
        </div>
      </div>
    </div>

    <!-- Actions -->
    <div class="summary-actions">
      <button class="btn btn-secondary" @click="$emit('edit')">
        <i class="pi pi-pencil"></i>
        Modifier mes votes
      </button>
      <button class="btn btn-primary" @click="$emit('submit')">
        <i class="pi pi-send"></i>
        Envoyer mes réponses
      </button>
    </div>
  </div>
</template>

<script setup>
import { computed } from 'vue'

/**
 * Props
 */
const props = defineProps({
  votes: {
    type: Object,
    required: true
  },
  proposals: {
    type: Array,
    required: true
  }
})

/**
 * Événements
 */
defineEmits(['submit', 'edit'])

/**
 * Nombre total de votes
 */
const totalVotes = computed(() => {
  return Object.keys(props.votes).length
})

/**
 * Votes avec les informations des propositions associées
 */
const votesWithProposals = computed(() => {
  return Object.entries(props.votes).map(([proposalId, vote]) => {
    const proposal = props.proposals.find(p => p.id === proposalId)
    return {
      ...vote,
      proposal: proposal || {}
    }
  })
})
</script>

<style scoped lang="scss">
.votes-summary {
  display: flex;
  flex-direction: column;
  height: 100%;
  max-height: 90vh;
  background: var(--background-primary);
  border-radius: var(--radius-xl);
  overflow: hidden;
  box-shadow: var(--shadow-2xl);
  max-width: 600px;
  margin: 0 auto;

  @media (max-width: 768px) {
    max-height: 85vh;
    margin: var(--spacing-md);
  }
}

/* En-tête */
.summary-header {
  padding: var(--spacing-2xl);
  text-align: center;
  background: var(--background-secondary);
  border-bottom: 2px solid var(--border-color);
}

.summary-icon {
  i {
    font-size: 3.5rem;
    color: var(--color-success);
  }
}

.summary-title {
  font-size: 1.75rem;
  font-weight: 800;
  color: var(--text-primary);
  margin: var(--spacing-lg) 0 var(--spacing-sm);
  letter-spacing: -0.02em;
}

.summary-subtitle {
  font-size: 1.125rem;
  color: var(--text-secondary);
  font-weight: 500;
  margin: 0;
}

/* Liste des votes */
.votes-list {
  flex: 1;
  overflow-y: auto;
  padding: var(--spacing-lg);
  display: flex;
  flex-direction: column;
  gap: var(--spacing-lg);

  /* Scrollbar personnalisée */
  &::-webkit-scrollbar {
    width: 8px;
  }

  &::-webkit-scrollbar-track {
    background: var(--background-secondary);
    border-radius: var(--radius-full);
  }

  &::-webkit-scrollbar-thumb {
    background: var(--border-color-dark);
    border-radius: var(--radius-full);

    &:hover {
      background: var(--text-muted);
    }
  }
}

.vote-item {
  display: flex;
  gap: var(--spacing-lg);
  background: var(--background-primary);
  border: 2px solid var(--border-color);
  border-radius: var(--radius-lg);
  padding: var(--spacing-lg);
  transition: all var(--transition-base) var(--transition-ease);

  &:hover {
    border-color: var(--border-color-dark);
    box-shadow: var(--shadow-md);
    transform: translateY(-2px);
  }
}

.vote-image {
  width: 80px;
  height: 80px;
  border-radius: var(--radius-md);
  background-size: cover;
  background-position: center;
  background-repeat: no-repeat;
  flex-shrink: 0;
  overflow: hidden;
  border: 1px solid var(--border-color);
}

.vote-image-placeholder {
  width: 100%;
  height: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
  background: var(--background-tertiary);

  i {
    font-size: 2rem;
    color: var(--text-muted);
  }
}

.vote-info {
  flex: 1;
  display: flex;
  flex-direction: column;
  gap: var(--spacing-sm);
  min-width: 0;
}

.vote-title {
  font-size: 1.125rem;
  font-weight: 700;
  color: var(--text-primary);
  margin: 0;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.vote-status {
  display: flex;
  align-items: center;
  gap: var(--spacing-md);
  flex-wrap: wrap;
}

.vote-badge {
  display: inline-flex;
  align-items: center;
  gap: var(--spacing-sm);
  padding: var(--spacing-sm) var(--spacing-md);
  border-radius: var(--radius-full);
  font-size: 0.875rem;
  font-weight: 700;

  &.vote-badge-like {
    background: rgba(74, 222, 128, 0.15);
    color: var(--color-success);
    border: 2px solid var(--color-success);
  }

  &.vote-badge-dislike {
    background: rgba(248, 113, 113, 0.15);
    color: var(--color-danger);
    border: 2px solid var(--color-danger);
  }

  i {
    font-size: 1rem;
  }
}

.vote-rating {
  display: inline-flex;
  align-items: center;
  gap: var(--spacing-xs);
  padding: var(--spacing-sm) var(--spacing-md);
  background: var(--color-primary);
  color: var(--text-primary);
  border-radius: var(--radius-full);
  font-size: 0.875rem;
  font-weight: 800;
  border: 2px solid var(--text-primary);

  i {
    font-size: 0.875rem;
  }
}

.vote-tags {
  display: flex;
  flex-wrap: wrap;
  gap: var(--spacing-xs);
}

.vote-tag {
  padding: var(--spacing-xs) var(--spacing-sm);
  background: var(--background-secondary);
  color: var(--text-tertiary);
  border-radius: var(--radius-sm);
  font-size: 0.75rem;
  font-weight: 600;
  border: 1px solid var(--border-color);
}

/* Actions */
.summary-actions {
  padding: var(--spacing-xl);
  background: var(--background-secondary);
  border-top: 2px solid var(--border-color);
  display: flex;
  gap: var(--spacing-md);
  flex-wrap: wrap;

  @media (max-width: 768px) {
    flex-direction: column;
  }

  .btn {
    flex: 1;
    min-width: 200px;
    justify-content: center;

    @media (max-width: 768px) {
      min-width: 100%;
    }
  }
}

/* Animations */
.vote-item {
  animation: slideInUp 0.3s var(--transition-ease) backwards;
}

@for $i from 1 through 20 {
  .vote-item:nth-child(#{$i}) {
    animation-delay: #{$i * 0.05}s;
  }
}

@keyframes slideInUp {
  from {
    opacity: 0;
    transform: translateY(20px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}
</style>
