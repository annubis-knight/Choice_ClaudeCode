/**
 * Store Pinia pour gérer l'état des sondages et des votes
 *
 * Ce store gère :
 * - Les informations du sondage actuel
 * - Les propositions (cartes à swiper)
 * - Les votes/réponses de l'utilisateur
 * - La progression dans le sondage
 */

import { defineStore } from 'pinia'

export const usePollStore = defineStore('poll', {
  state: () => ({
    // Informations du sondage actuel
    currentPoll: null,

    // Liste des propositions à swiper
    proposals: [],

    // Index de la proposition actuelle
    currentIndex: 0,

    // Votes de l'utilisateur (map avec l'id de la proposition comme clé)
    votes: new Map(),

    // État de chargement
    isLoading: false,

    // Erreurs éventuelles
    error: null,

    // Informations utilisateur
    user: {
      id: null,
      name: null
    }
  }),

  getters: {
    /**
     * Retourne la proposition actuelle à afficher
     */
    currentProposal: (state) => {
      if (state.currentIndex < state.proposals.length) {
        return state.proposals[state.currentIndex]
      }
      return null
    },

    /**
     * Retourne les propositions restantes
     */
    remainingProposals: (state) => {
      return state.proposals.slice(state.currentIndex)
    },

    /**
     * Vérifie si toutes les propositions ont été votées
     */
    isCompleted: (state) => {
      return state.currentIndex >= state.proposals.length
    },

    /**
     * Retourne le nombre total de propositions
     */
    totalProposals: (state) => {
      return state.proposals.length
    },

    /**
     * Retourne le pourcentage de progression
     */
    progressPercentage: (state) => {
      if (state.proposals.length === 0) return 0
      return Math.round((state.currentIndex / state.proposals.length) * 100)
    },

    /**
     * Retourne tous les votes sous forme d'objet
     */
    allVotes: (state) => {
      return Object.fromEntries(state.votes)
    }
  },

  actions: {
    /**
     * Charge un sondage avec ses propositions
     * @param {Object} pollData - Données du sondage
     */
    async loadPoll(pollData) {
      this.isLoading = true
      this.error = null

      try {
        // Simulation d'un appel API
        await new Promise(resolve => setTimeout(resolve, 500))

        this.currentPoll = pollData
        this.proposals = pollData.proposals || []
        this.currentIndex = 0
        this.votes.clear()
      } catch (err) {
        this.error = err.message
        console.error('Erreur lors du chargement du sondage:', err)
      } finally {
        this.isLoading = false
      }
    },

    /**
     * Enregistre un vote pour une proposition
     * @param {string} proposalId - ID de la proposition
     * @param {string} direction - 'left' (dislike) ou 'right' (like)
     * @param {number|null} rating - Note de 0 à 10 (optionnel)
     * @param {string|null} comment - Commentaire textuel (optionnel)
     */
    recordVote(proposalId, direction, rating = null, comment = null) {
      const vote = {
        proposalId,
        direction,
        rating,
        comment,
        timestamp: new Date().toISOString()
      }

      this.votes.set(proposalId, vote)

      // Sauvegarder dans le localStorage pour persistance
      if (process.client) {
        localStorage.setItem(`poll_${this.currentPoll?.id}_votes`, JSON.stringify(this.allVotes))
      }
    },

    /**
     * Met à jour un vote existant (rating et/ou commentaire)
     * @param {string} proposalId - ID de la proposition
     * @param {Object} updates - Objet contenant les champs à mettre à jour
     */
    updateVote(proposalId, updates) {
      const existingVote = this.votes.get(proposalId)
      if (!existingVote) return

      const updatedVote = {
        ...existingVote,
        ...updates,
        updatedAt: new Date().toISOString()
      }

      this.votes.set(proposalId, updatedVote)

      // Sauvegarder dans le localStorage
      if (process.client) {
        localStorage.setItem(`poll_${this.currentPoll?.id}_votes`, JSON.stringify(this.allVotes))
      }
    },

    /**
     * Passe à la proposition suivante
     */
    nextProposal() {
      if (this.currentIndex < this.proposals.length) {
        this.currentIndex++
      }
    },

    /**
     * Retourne à la proposition précédente
     */
    previousProposal() {
      if (this.currentIndex > 0) {
        this.currentIndex--

        // Supprimer le vote précédent si on revient en arrière
        const previousProposal = this.proposals[this.currentIndex]
        if (previousProposal) {
          this.votes.delete(previousProposal.id)
        }
      }
    },

    /**
     * Soumet toutes les réponses au backend
     */
    async submitVotes() {
      this.isLoading = true
      this.error = null

      try {
        // TODO: Remplacer par un vrai appel API
        console.log('Soumission des votes:', this.allVotes)

        await new Promise(resolve => setTimeout(resolve, 1000))

        // Nettoyer le localStorage après soumission réussie
        if (process.client) {
          localStorage.removeItem(`poll_${this.currentPoll?.id}_votes`)
        }

        return { success: true }
      } catch (err) {
        this.error = err.message
        console.error('Erreur lors de la soumission des votes:', err)
        return { success: false, error: err.message }
      } finally {
        this.isLoading = false
      }
    },

    /**
     * Réinitialise le store
     */
    reset() {
      this.currentPoll = null
      this.proposals = []
      this.currentIndex = 0
      this.votes.clear()
      this.isLoading = false
      this.error = null
    },

    /**
     * Restaure les votes depuis le localStorage
     */
    restoreVotes(pollId) {
      if (process.client) {
        const savedVotes = localStorage.getItem(`poll_${pollId}_votes`)
        if (savedVotes) {
          const votesObj = JSON.parse(savedVotes)
          this.votes = new Map(Object.entries(votesObj))
        }
      }
    }
  }
})
