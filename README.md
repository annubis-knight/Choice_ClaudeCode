# 🎯 Choice - Application de Sondages par Swipe

Une application web PWA moderne permettant à des groupes d'amis de créer et répondre à des sondages sous forme de propositions à swiper (comme Tinder), avec système de notation intégré.

## 🚀 Stack Technologique

- **Frontend** : Nuxt 3 (Vue 3, SSR, PWA)
- **Gestion d'état** : Pinia
- **UI/Design** : PrimeVue + Styles personnalisés
- **Animations** : GSAP
- **Backend (à venir)** : Node.js + Express
- **Base de données (à venir)** : SQLite ou PostgreSQL

## 📁 Structure du Projet

```
Choice_ClaudeCode/
├── assets/
│   ├── css/
│   │   └── main.css           # Styles globaux
│   └── scss/
│       └── _variables.scss    # Variables SCSS
├── components/
│   └── swipe/
│       ├── SwipeCard.vue      # Carte individuelle swipable
│       └── SwipeContainer.vue # Conteneur gérant la pile de cartes
├── composables/
│   └── useSwipe.js           # Logique de swipe et gestes tactiles
├── pages/
│   └── index.vue             # Page principale du sondage
├── plugins/
│   └── primevue.js           # Configuration PrimeVue
├── stores/
│   └── poll.js               # Store Pinia pour les sondages
├── app.vue                    # Point d'entrée de l'application
├── nuxt.config.ts            # Configuration Nuxt
└── package.json              # Dépendances du projet
```

## 🎨 Fonctionnalités Principales

### ✅ Interface de Swipe

- **Swipe gauche/droite** : Like ou dislike une proposition
- **Long swipe** : Active une échelle de notation de 0 à 10
- **Animations fluides** : Utilise GSAP pour des transitions naturelles
- **Support tactile et souris** : Fonctionne sur mobile et desktop

### ✅ Gestion des Votes

- **Store Pinia centralisé** : Stockage de l'état des votes
- **Persistance locale** : Sauvegarde dans localStorage
- **Navigation** : Possibilité de revenir en arrière (undo)
- **Progression** : Barre de progression visuelle

### ✅ Design Responsive

- Adapté mobile-first
- Interface intuitive
- Indicateurs visuels clairs
- Animations optimisées

## 🧩 Architecture Détaillée

### 1. Store Pinia (`stores/poll.js`)

Le store centralise toute la logique métier liée aux sondages :

```javascript
// État principal
{
  currentPoll: null,          // Sondage actuel
  proposals: [],              // Liste des propositions
  currentIndex: 0,            // Index de la proposition actuelle
  votes: new Map(),           // Votes de l'utilisateur
  isLoading: false,           // État de chargement
  error: null                 // Erreurs éventuelles
}

// Getters utiles
- currentProposal           // Proposition actuelle
- remainingProposals        // Propositions restantes
- isCompleted              // Toutes les propositions votées ?
- progressPercentage       // Pourcentage de progression

// Actions principales
- loadPoll()               // Charge un sondage
- recordVote()             // Enregistre un vote
- nextProposal()           // Passe à la suivante
- previousProposal()       // Retour en arrière
- submitVotes()            // Soumet les réponses
```

### 2. Composable useSwipe (`composables/useSwipe.js`)

Gère toute la logique de swipe et d'interaction tactile :

**États gérés :**
- Position du drag (X, Y)
- Direction du swipe
- Affichage de la notation
- Rotation de la carte

**Fonctionnalités :**
- Détection des événements touch/mouse
- Calcul de la rotation basée sur le déplacement
- Gestion du long swipe pour la notation
- Animations GSAP fluides

**Méthodes exposées :**
```javascript
{
  isDragging,              // Est-ce qu'on est en train de dragger ?
  showRating,              // Afficher l'échelle de notation ?
  currentRating,           // Note actuelle sélectionnée
  swipeDirection,          // Direction du swipe ('left' | 'right')
  triggerSwipe(),          // Déclencher un swipe programmatique
  updateRating(),          // Mettre à jour la notation
  resetCard()              // Réinitialiser la carte
}
```

### 3. Composant SwipeCard (`components/swipe/SwipeCard.vue`)

Carte individuelle affichant une proposition :

**Props :**
- `proposal` (Object) : Données de la proposition
  - id, title, description
  - image, tags
  - price, location, duration

**Événements émis :**
- `swipe-left` : Swipe vers la gauche avec rating optionnel
- `swipe-right` : Swipe vers la droite avec rating optionnel

**Éléments visuels :**
- Indicateurs LIKE/NOPE
- Échelle de notation (0-10)
- Image de la proposition
- Informations détaillées
- Badge de notation active

### 4. Composant SwipeContainer (`components/swipe/SwipeContainer.vue`)

Conteneur gérant la pile de cartes et la navigation :

**Fonctionnalités :**
- Affichage de la barre de progression
- Gestion de la pile de cartes (effet de profondeur)
- Boutons d'action (Like, Dislike, Undo)
- Message de complétion
- Instructions initiales

**Effet de pile :**
- 3 cartes visibles maximum
- Chaque carte est légèrement plus petite et décalée
- Animation de transition entre les cartes

## 🎯 Comment Utiliser

### Installation

```bash
# Cloner le projet
git clone <repository-url>
cd Choice_ClaudeCode

# Installer les dépendances
npm install

# Lancer le serveur de développement
npm run dev
```

### Développement

L'application sera accessible sur `http://localhost:3000`

### Personnaliser les Propositions

Modifier le fichier `pages/index.vue` et éditer l'objet `poll` :

```javascript
const poll = {
  id: 'votre-id',
  title: 'Titre du sondage',
  description: 'Description',
  proposals: [
    {
      id: 'p1',
      title: 'Titre de la proposition',
      description: 'Description détaillée',
      image: 'url-de-image',
      tags: ['tag1', 'tag2'],
      price: '€€',
      location: 'Lieu',
      duration: '2h'
    }
    // ... autres propositions
  ]
}
```

## 🔧 Configuration

### Variables SCSS

Personnalisez les couleurs et styles dans `assets/scss/_variables.scss` :

```scss
$primary: #667eea;
$secondary: #764ba2;
$success: #4ade80;
$danger: #f87171;
// ... autres variables
```

### Thresholds de Swipe

Dans `composables/useSwipe.js`, ajustez les seuils :

```javascript
const SWIPE_THRESHOLD = 100        // Distance minimale pour swipe
const LONG_SWIPE_THRESHOLD = 150   // Distance pour activer notation
const RATING_SHOW_DELAY = 300      // Délai avant affichage notation (ms)
```

## 📱 Responsive Design

L'application est optimisée pour :
- **Mobile** : Interface tactile native
- **Tablette** : Layout adaptatif
- **Desktop** : Support souris avec les mêmes interactions

## 🚧 Prochaines Étapes

- [ ] Intégration backend API
- [ ] Authentification utilisateur
- [ ] Création de sondages
- [ ] Résultats et statistiques
- [ ] Notifications push
- [ ] PWA complète (offline mode)
- [ ] Mode multijoueur temps réel

## 📚 Ressources et Documentation

- [Nuxt 3](https://nuxt.com/)
- [Vue 3](https://vuejs.org/)
- [Pinia](https://pinia.vuejs.org/)
- [GSAP](https://greensock.com/gsap/)
- [PrimeVue](https://primevue.org/)

## 🎓 Concepts Pédagogiques

### Composition API

Ce projet utilise la Composition API de Vue 3 pour une meilleure organisation du code :

```vue
<script setup>
import { ref, computed, onMounted } from 'vue'

// Les refs pour la réactivité
const count = ref(0)

// Les computed pour les valeurs dérivées
const doubled = computed(() => count.value * 2)

// Les lifecycle hooks
onMounted(() => {
  console.log('Composant monté')
})
</script>
```

### Composables

Les composables sont des fonctions réutilisables qui encapsulent la logique :

```javascript
// useSwipe.js - Composable personnalisé
export const useSwipe = (element, onSwipeLeft, onSwipeRight) => {
  const isDragging = ref(false)
  // ... logique de swipe

  return {
    isDragging,
    triggerSwipe,
    // ... autres exports
  }
}
```

### Store Pinia

Pinia gère l'état global de manière type-safe et modulaire :

```javascript
export const usePollStore = defineStore('poll', {
  state: () => ({ /* état */ }),
  getters: { /* getters */ },
  actions: { /* actions */ }
})
```

## 🤝 Contribution

Les contributions sont les bienvenues ! N'hésitez pas à ouvrir une issue ou une pull request.

## 📄 Licence

MIT

---

**Créé avec ❤️ pour apprendre Vue 3 et Nuxt 3**
