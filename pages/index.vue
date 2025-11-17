<template>
  <div class="page-poll">
    <!-- En-tête -->
    <header class="poll-header">
      <div class="container">
        <h1 class="poll-title">{{ poll.title }}</h1>
        <p class="poll-subtitle">{{ poll.description }}</p>
      </div>
    </header>

    <!-- Conteneur de swipe -->
    <main class="poll-main">
      <SwipeContainer v-if="!pollStore.isLoading" />

      <!-- État de chargement -->
      <div v-else class="loading-state">
        <ProgressSpinner />
        <p>Chargement du sondage...</p>
      </div>

      <!-- État d'erreur -->
      <Message
        v-if="pollStore.error"
        severity="error"
        :closable="false"
      >
        {{ pollStore.error }}
      </Message>
    </main>
  </div>
</template>

<script setup>
import { onMounted } from 'vue'
import { usePollStore } from '~/stores/poll'
import SwipeContainer from '~/components/swipe/SwipeContainer.vue'

/**
 * Configuration de la page
 */
definePageMeta({
  title: 'Répondre au sondage',
  layout: 'default'
})

/**
 * Store Pinia
 */
const pollStore = usePollStore()

/**
 * Données de démonstration du sondage
 * TODO: Remplacer par un vrai appel API pour récupérer le sondage
 */
const poll = {
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
}

/**
 * Charger le sondage au montage du composant
 */
onMounted(async () => {
  await pollStore.loadPoll(poll)
})
</script>

<style scoped lang="scss">
.page-poll {
  min-height: 100vh;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
}

.poll-header {
  padding: 2rem 1rem 1rem;
  text-align: center;
  color: white;

  .container {
    max-width: 600px;
    margin: 0 auto;
  }
}

.poll-title {
  font-size: 2rem;
  font-weight: 700;
  margin-bottom: 0.5rem;

  @media (max-width: 768px) {
    font-size: 1.5rem;
  }
}

.poll-subtitle {
  font-size: 1.1rem;
  opacity: 0.9;

  @media (max-width: 768px) {
    font-size: 1rem;
  }
}

.poll-main {
  position: relative;
}

.loading-state {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  min-height: 60vh;
  color: white;
  gap: 1rem;

  p {
    font-size: 1.1rem;
  }
}
</style>
