<template>
  <div class="page-poll">
    <!-- Bouton de sortie (X) -->
    <button class="exit-button" @click="handleExit" title="Quitter le sondage">
      <i class="pi pi-times"></i>
    </button>

    <!-- En-tête -->
    <header class="poll-header">
      <div class="container">
        <h1 class="poll-title">{{ pollData?.title }}</h1>
        <p class="poll-subtitle">{{ pollData?.description }}</p>
      </div>
    </header>

    <!-- Conteneur de swipe -->
    <main class="poll-main">
      <SwipeContainer v-if="!pollStore.isLoading && pollData" />

      <!-- État de chargement -->
      <div v-else-if="pollStore.isLoading" class="loading-state">
        <i class="pi pi-spin pi-spinner" style="font-size: 3rem"></i>
        <p>Chargement du sondage...</p>
      </div>

      <!-- État d'erreur -->
      <div v-else-if="pollStore.error" class="error-state">
        <i class="pi pi-exclamation-triangle"></i>
        <p>{{ pollStore.error }}</p>
        <button class="btn-secondary" @click="goHome">
          Retour à l'accueil
        </button>
      </div>

      <!-- Sondage non trouvé -->
      <div v-else class="error-state">
        <i class="pi pi-question-circle"></i>
        <p>Sondage non trouvé</p>
        <button class="btn-secondary" @click="goHome">
          Retour à l'accueil
        </button>
      </div>
    </main>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { usePollStore } from '~/stores/poll'
import SwipeContainer from '~/components/swipe/SwipeContainer.vue'

const route = useRoute()
const router = useRouter()
const pollStore = usePollStore()

/**
 * Configuration de la page
 */
definePageMeta({
  title: 'Répondre au sondage',
  layout: 'default'
})

/**
 * Données du sondage actuel
 */
const pollData = ref(null)

/**
 * Données de démonstration
 * TODO: Remplacer par un vrai appel API basé sur route.params.id
 */
const mockPolls = {
  'demo-1': {
    id: 'demo-1',
    title: '🍕 Où sortir ce weekend ?',
    description: 'Votez pour vos activités préférées !',
    proposals: [
      {
        id: 'p1',
        title: 'Restaurant Italien Da Mario',
        description: 'Pizza napolitaine authentique et pâtes fraîches maison. Ambiance chaleureuse et conviviale.',
        image: 'https://images.unsplash.com/photo-1579751626657-72bc17010498?w=800&h=600&fit=crop',
        tags: ['Restaurant', 'Italien', 'Pizza'],
        price: '€€',
        location: 'Centre-ville, 2 km',
        duration: '2h'
      },
      {
        id: 'p2',
        title: 'Cinéma Pathé - Nouveau Film',
        description: 'Dernière sortie cinéma en salle IMAX. Séance à 20h avec popcorn illimité !',
        image: 'https://images.unsplash.com/photo-1536440136628-849c177e76a1?w=800&h=600&fit=crop',
        tags: ['Cinéma', 'Divertissement', 'IMAX'],
        price: '€',
        location: 'Centre commercial, 5 km',
        duration: '3h'
      },
      {
        id: 'p3',
        title: 'Balade au Parc Municipal',
        description: 'Profiter du beau temps avec une balade relaxante dans le parc. Possibilité de pique-nique.',
        image: 'https://images.unsplash.com/photo-1559827260-dc66d52bef19?w=800&h=600&fit=crop',
        tags: ['Nature', 'Gratuit', 'Détente'],
        price: 'Gratuit',
        location: 'Parc Nord, 3 km',
        duration: '2-3h'
      },
      {
        id: 'p4',
        title: 'Escape Game - Le Manoir Hanté',
        description: 'Résolvez les énigmes et échappez-vous en 60 minutes. Frissons garantis !',
        image: 'https://images.unsplash.com/photo-1595923082992-2219e6b8f3e2?w=800&h=600&fit=crop',
        tags: ['Jeu', 'Énigmes', 'Équipe'],
        price: '€€€',
        location: 'Zone industrielle, 8 km',
        duration: '1h30'
      },
      {
        id: 'p5',
        title: 'Bar à Cocktails Le Tropical',
        description: 'Cocktails exotiques et ambiance lounge. DJ tous les samedis soir.',
        image: 'https://images.unsplash.com/photo-1514362545857-3bc16c4c7d1b?w=800&h=600&fit=crop',
        tags: ['Bar', 'Cocktails', 'Musique'],
        price: '€€',
        location: 'Quartier animé, 4 km',
        duration: '3-4h'
      },
      {
        id: 'p6',
        title: 'Bowling Strike',
        description: 'Soirée bowling avec pistes fluo et musique. Ambiance fun garantie !',
        image: 'https://images.unsplash.com/photo-1545486332-9e0999c535b2?w=800&h=600&fit=crop',
        tags: ['Jeu', 'Sport', 'Fun'],
        price: '€',
        location: 'Zone de loisirs, 6 km',
        duration: '2h'
      },
      {
        id: 'p7',
        title: 'Concert Live au Zénith',
        description: 'Concert de votre groupe préféré. Places debout disponibles.',
        image: 'https://images.unsplash.com/photo-1501612780327-45045538702b?w=800&h=600&fit=crop',
        tags: ['Concert', 'Musique', 'Live'],
        price: '€€€',
        location: 'Zénith, 12 km',
        duration: '3h'
      },
      {
        id: 'p8',
        title: 'Cours de Cuisine Asiatique',
        description: 'Apprenez à préparer des sushis et des plats wok avec un chef professionnel.',
        image: 'https://images.unsplash.com/photo-1556910103-1c02745aae4d?w=800&h=600&fit=crop',
        tags: ['Cuisine', 'Apprentissage', 'Asiatique'],
        price: '€€',
        location: 'École de cuisine, 7 km',
        duration: '3h'
      }
    ]
  },
  'demo-2': {
    id: 'demo-2',
    title: '🏖️ Vacances d\'été 2025',
    description: 'Choisissons notre destination de vacances ensemble',
    proposals: [
      {
        id: 'v1',
        title: 'Bali, Indonésie',
        description: 'Plages paradisiaques, temples et rizières en terrasse',
        image: 'https://images.unsplash.com/photo-1537996194471-e657df975ab4?w=800&h=600&fit=crop',
        tags: ['Plage', 'Exotique', 'Culture']
      },
      {
        id: 'v2',
        title: 'Islande',
        description: 'Aurores boréales, geysers et paysages volcaniques',
        image: 'https://images.unsplash.com/photo-1504829857797-ddff29c27927?w=800&h=600&fit=crop',
        tags: ['Nature', 'Aventure', 'Unique']
      },
      {
        id: 'v3',
        title: 'Grèce - Santorin',
        description: 'Maisons blanches, couchers de soleil et cuisine méditerranéenne',
        image: 'https://images.unsplash.com/photo-1613395877344-13d4a8e0d49e?w=800&h=600&fit=crop',
        tags: ['Plage', 'Culture', 'Romance']
      },
      {
        id: 'v4',
        title: 'Costa Rica',
        description: 'Forêts tropicales, volcans et biodiversité incroyable',
        image: 'https://images.unsplash.com/photo-1605722243979-fe0be8158232?w=800&h=600&fit=crop',
        tags: ['Nature', 'Aventure', 'Écologie']
      },
      {
        id: 'v5',
        title: 'Japon - Tokyo et Kyoto',
        description: 'Mélange de tradition et modernité, temples et technologie',
        image: 'https://images.unsplash.com/photo-1493976040374-85c8e12f0c0e?w=800&h=600&fit=crop',
        tags: ['Culture', 'Gastronomie', 'Ville']
      }
    ]
  }
}

/**
 * Charger le sondage au montage
 */
onMounted(async () => {
  const pollId = route.params.id

  // TODO: Remplacer par un vrai appel API
  pollData.value = mockPolls[pollId]

  if (pollData.value) {
    await pollStore.loadPoll(pollData.value)
  } else {
    pollStore.error = 'Sondage non trouvé'
  }
})

/**
 * Quitter le sondage et retourner à l'accueil
 */
const handleExit = () => {
  // Demander confirmation si des votes ont été enregistrés
  if (pollStore.votes.size > 0) {
    const confirmed = confirm(
      'Voulez-vous vraiment quitter ? Vos votes seront sauvegardés et vous pourrez reprendre plus tard.'
    )
    if (!confirmed) return
  }

  goHome()
}

/**
 * Naviguer vers l'accueil
 */
const goHome = () => {
  router.push('/home')
}
</script>

<style scoped lang="scss">
.page-poll {
  min-height: 100vh;
  background-color: var(--background-primary);
  padding: var(--spacing-2xl) 0;
  position: relative;
}

/* Bouton de sortie */
.exit-button {
  position: fixed;
  top: var(--spacing-lg);
  right: var(--spacing-lg);
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
  transition: all var(--transition-base) var(--transition-ease);
  box-shadow: var(--shadow-md);
  z-index: 500;

  i {
    font-size: 1.5rem;
  }

  &:hover {
    background: var(--color-danger);
    color: white;
    border-color: var(--color-danger);
    transform: scale(1.1);
  }

  &:active {
    transform: scale(0.95);
  }

  @media (max-width: 768px) {
    top: var(--spacing-md);
    right: var(--spacing-md);
    width: 40px;
    height: 40px;

    i {
      font-size: 1.3rem;
    }
  }
}

.poll-header {
  padding: 0 var(--spacing-lg) var(--spacing-2xl);
  text-align: center;

  .container {
    max-width: 600px;
    margin: 0 auto;
  }
}

.poll-title {
  font-size: 2.5rem;
  font-weight: 800;
  margin-bottom: var(--spacing-md);
  color: var(--text-primary);
  letter-spacing: -0.025em;

  @media (max-width: 768px) {
    font-size: 2rem;
  }
}

.poll-subtitle {
  font-size: 1.25rem;
  color: var(--text-secondary);
  font-weight: 500;

  @media (max-width: 768px) {
    font-size: 1.125rem;
  }
}

.poll-main {
  position: relative;
}

.loading-state,
.error-state {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  min-height: 60vh;
  color: var(--text-primary);
  gap: var(--spacing-lg);

  i {
    font-size: 4rem;
    color: var(--text-secondary);
  }

  p {
    font-size: 1.1rem;
    color: var(--text-secondary);
    text-align: center;
    max-width: 400px;
  }
}

.btn-secondary {
  padding: var(--spacing-md) var(--spacing-xl);
  background: var(--background-primary);
  color: var(--text-secondary);
  border: 2px solid var(--border-color-dark);
  border-radius: var(--radius-lg);
  font-weight: 700;
  font-size: 1rem;
  cursor: pointer;
  transition: all var(--transition-base) var(--transition-ease);

  &:hover {
    background: var(--color-primary);
    color: var(--text-primary);
    border-color: var(--color-primary);
  }
}
</style>
