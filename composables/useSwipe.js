/**
 * Composable pour gérer la logique de swipe des cartes
 *
 * Ce composable gère :
 * - Les événements tactiles et souris
 * - Le calcul des positions et rotations
 * - La détection de swipe (gauche/droite)
 * - La détection de long swipe pour afficher la notation
 * - Les animations GSAP
 *
 * @param {Object} cardElement - Référence à l'élément DOM de la carte
 * @param {Function} onSwipeLeft - Callback appelé lors d'un swipe gauche
 * @param {Function} onSwipeRight - Callback appelé lors d'un swipe droite
 */

import { ref, computed, onMounted, onUnmounted } from 'vue'
import { gsap } from 'gsap'

export const useSwipe = (cardElement, onSwipeLeft, onSwipeRight) => {
  // État du drag
  const isDragging = ref(false)
  const startX = ref(0)
  const startY = ref(0)
  const currentX = ref(0)
  const currentY = ref(0)
  const offsetX = ref(0)
  const offsetY = ref(0)

  // État de la notation
  const showRating = ref(false)
  const currentRating = ref(null)
  const ratingPosition = ref('right') // 'left' ou 'right'

  // Seuils pour les différentes actions
  const SWIPE_THRESHOLD = 100 // Distance minimale pour déclencher un swipe
  const LONG_SWIPE_THRESHOLD = 150 // Distance pour activer la notation

  // Référence à l'élément de l'échelle de notation (sera défini depuis le composant)
  const ratingScaleElement = ref(null)

  /**
   * Distance de déplacement actuelle
   */
  const dragDistance = computed(() => {
    return Math.sqrt(offsetX.value ** 2 + offsetY.value ** 2)
  })

  /**
   * Angle de rotation basé sur le déplacement horizontal
   */
  const rotation = computed(() => {
    // Rotation maximale de 15 degrés
    const maxRotation = 15
    const rotationFactor = offsetX.value / 200
    return Math.max(-maxRotation, Math.min(maxRotation, rotationFactor * maxRotation))
  })

  /**
   * Opacité de l'indicateur de swipe
   */
  const swipeIndicatorOpacity = computed(() => {
    const opacity = Math.abs(offsetX.value) / SWIPE_THRESHOLD
    return Math.min(1, opacity)
  })

  /**
   * Direction du swipe ('left', 'right', ou null)
   */
  const swipeDirection = computed(() => {
    if (Math.abs(offsetX.value) < 50) return null
    return offsetX.value > 0 ? 'right' : 'left'
  })

  /**
   * Début du drag (touch ou mouse)
   */
  const handleDragStart = (e) => {
    isDragging.value = true

    // Récupérer les coordonnées selon le type d'événement
    const touch = e.touches ? e.touches[0] : e
    startX.value = touch.clientX
    startY.value = touch.clientY
    currentX.value = touch.clientX
    currentY.value = touch.clientY

    // Réinitialiser les états
    showRating.value = false
    currentRating.value = null
  }

  /**
   * Déplacement du drag
   */
  const handleDragMove = (e) => {
    if (!isDragging.value) return

    const touch = e.touches ? e.touches[0] : e
    currentX.value = touch.clientX
    currentY.value = touch.clientY

    // Calculer le déplacement
    offsetX.value = currentX.value - startX.value
    offsetY.value = currentY.value - startY.value

    // Vérifier si on doit afficher la notation
    if (Math.abs(offsetX.value) > LONG_SWIPE_THRESHOLD && !showRating.value) {
      showRating.value = true
      ratingPosition.value = offsetX.value > 0 ? 'right' : 'left'
    } else if (Math.abs(offsetX.value) <= LONG_SWIPE_THRESHOLD && showRating.value) {
      showRating.value = false
      currentRating.value = null
    }

    // Si l'échelle de notation est visible, calculer la note en fonction de la position Y
    if (showRating.value && ratingScaleElement.value) {
      const rect = ratingScaleElement.value.getBoundingClientRect()
      const relativeY = currentY.value - rect.top
      const rating = calculateRatingFromPosition(relativeY, rect.height)
      currentRating.value = rating
    }

    // Mettre à jour la position de la carte via GSAP (plus fluide)
    if (cardElement.value) {
      gsap.to(cardElement.value, {
        x: offsetX.value,
        y: offsetY.value * 0.3, // Moins de déplacement vertical
        rotation: rotation.value,
        duration: 0.1,
        ease: 'power2.out'
      })
    }
  }

  /**
   * Fin du drag
   */
  const handleDragEnd = () => {
    if (!isDragging.value) return

    isDragging.value = false

    // Vérifier si le swipe est assez long
    if (Math.abs(offsetX.value) > SWIPE_THRESHOLD) {
      // Swipe validé !
      const direction = offsetX.value > 0 ? 'right' : 'left'
      // Si l'échelle était visible et qu'une note a été sélectionnée, l'utiliser
      const finalRating = showRating.value ? currentRating.value : null
      animateSwipeOut(direction, finalRating)
    } else {
      // Swipe annulé, retour à la position initiale
      animateReturn()
    }
  }

  /**
   * Animation de retour à la position initiale
   */
  const animateReturn = () => {
    if (!cardElement.value) return

    gsap.to(cardElement.value, {
      x: 0,
      y: 0,
      rotation: 0,
      duration: 0.3,
      ease: 'elastic.out(1, 0.8)'
    })

    // Réinitialiser les états
    offsetX.value = 0
    offsetY.value = 0
    showRating.value = false
    currentRating.value = null
  }

  /**
   * Animation de sortie de la carte
   */
  const animateSwipeOut = (direction, rating = null) => {
    if (!cardElement.value) return

    const targetX = direction === 'right' ? 1000 : -1000
    const targetRotation = direction === 'right' ? 30 : -30

    gsap.to(cardElement.value, {
      x: targetX,
      y: offsetY.value,
      rotation: targetRotation,
      opacity: 0,
      duration: 0.4,
      ease: 'power2.in',
      onComplete: () => {
        // Appeler le callback approprié
        if (direction === 'right') {
          onSwipeRight?.(rating)
        } else {
          onSwipeLeft?.(rating)
        }

        // Réinitialiser après un court délai
        setTimeout(() => {
          resetCard()
        }, 100)
      }
    })
  }

  /**
   * Réinitialise la carte à sa position initiale (sans animation)
   */
  const resetCard = () => {
    if (!cardElement.value) return

    gsap.set(cardElement.value, {
      x: 0,
      y: 0,
      rotation: 0,
      opacity: 1
    })

    offsetX.value = 0
    offsetY.value = 0
    showRating.value = false
    currentRating.value = null
  }

  /**
   * Déclenche un swipe programmatiquement
   */
  const triggerSwipe = (direction, rating = null) => {
    offsetX.value = direction === 'right' ? 200 : -200
    animateSwipeOut(direction, rating)
  }

  /**
   * Met à jour la notation actuelle
   */
  const updateRating = (rating) => {
    currentRating.value = rating
  }

  /**
   * Calcule la notation basée sur la position Y pendant un long swipe
   * @param {number} relativeY - Position Y relative à l'échelle (0 = haut de l'échelle)
   * @param {number} containerHeight - Hauteur totale de l'échelle
   * @returns {number} Note de 0 à 10
   */
  const calculateRatingFromPosition = (relativeY, containerHeight) => {
    // L'échelle va de 10 en haut à 0 en bas
    // Diviser la hauteur en 11 zones égales (0 à 10)
    const normalizedPosition = Math.max(0, Math.min(1, relativeY / containerHeight))
    const rating = Math.floor((1 - normalizedPosition) * 11)
    return Math.max(0, Math.min(10, rating))
  }

  /**
   * Définit l'élément de l'échelle de notation (appelé depuis le composant)
   */
  const setRatingScaleElement = (element) => {
    ratingScaleElement.value = element
  }

  // Monter les event listeners
  onMounted(() => {
    if (!cardElement.value) return

    // Touch events (mobile)
    cardElement.value.addEventListener('touchstart', handleDragStart, { passive: true })
    cardElement.value.addEventListener('touchmove', handleDragMove, { passive: true })
    cardElement.value.addEventListener('touchend', handleDragEnd)

    // Mouse events (desktop)
    cardElement.value.addEventListener('mousedown', handleDragStart)
    window.addEventListener('mousemove', handleDragMove)
    window.addEventListener('mouseup', handleDragEnd)
  })

  // Nettoyer les event listeners
  onUnmounted(() => {
    if (!cardElement.value) return

    cardElement.value.removeEventListener('touchstart', handleDragStart)
    cardElement.value.removeEventListener('touchmove', handleDragMove)
    cardElement.value.removeEventListener('touchend', handleDragEnd)

    cardElement.value.removeEventListener('mousedown', handleDragStart)
    window.removeEventListener('mousemove', handleDragMove)
    window.removeEventListener('mouseup', handleDragEnd)
  })

  return {
    // État
    isDragging,
    offsetX,
    offsetY,
    showRating,
    currentRating,
    ratingPosition,

    // Computed
    dragDistance,
    rotation,
    swipeIndicatorOpacity,
    swipeDirection,

    // Méthodes
    triggerSwipe,
    updateRating,
    resetCard,
    calculateRatingFromPosition,
    setRatingScaleElement
  }
}
