<template>
  <div class="profile-page">
    <!-- Header -->
    <header class="profile-header">
      <!-- Avatar -->
      <div class="profile-avatar">
        <img
          v-if="user.avatar"
          :src="user.avatar"
          :alt="user.name"
        />
        <div v-else class="profile-avatar-placeholder">
          {{ getInitials(user.name) }}
        </div>
        <button class="avatar-edit" @click="editAvatar">
          <i class="pi pi-camera"></i>
        </button>
      </div>

      <!-- Informations -->
      <h1 class="profile-name">{{ user.name }}</h1>
      <p class="profile-email">{{ user.email }}</p>

      <!-- Statistiques -->
      <div class="profile-stats">
        <div class="stat-card">
          <div class="stat-value">{{ user.stats.totalVotes }}</div>
          <div class="stat-label">Votes</div>
        </div>
        <div class="stat-card">
          <div class="stat-value">{{ user.stats.groupCount }}</div>
          <div class="stat-label">Groupes</div>
        </div>
        <div class="stat-card">
          <div class="stat-value">{{ user.stats.pollsCreated }}</div>
          <div class="stat-label">Sondages créés</div>
        </div>
      </div>
    </header>

    <!-- Paramètres -->
    <main class="profile-main">
      <div class="settings-container">
        <!-- Section Compte -->
        <section class="settings-section">
          <h2 class="section-title">Mon compte</h2>
          <div class="settings-list">
            <button class="setting-item" @click="editProfile">
              <div class="setting-icon">
                <i class="pi pi-user-edit"></i>
              </div>
              <div class="setting-content">
                <div class="setting-label">Modifier le profil</div>
                <div class="setting-hint">Nom, email, avatar</div>
              </div>
              <i class="pi pi-chevron-right"></i>
            </button>

            <button class="setting-item" @click="changePassword">
              <div class="setting-icon">
                <i class="pi pi-lock"></i>
              </div>
              <div class="setting-content">
                <div class="setting-label">Mot de passe</div>
                <div class="setting-hint">Modifier votre mot de passe</div>
              </div>
              <i class="pi pi-chevron-right"></i>
            </button>
          </div>
        </section>

        <!-- Section Notifications -->
        <section class="settings-section">
          <h2 class="section-title">Notifications</h2>
          <div class="settings-list">
            <div class="setting-item">
              <div class="setting-icon">
                <i class="pi pi-bell"></i>
              </div>
              <div class="setting-content">
                <div class="setting-label">Nouveaux sondages</div>
                <div class="setting-hint">Recevoir une notification</div>
              </div>
              <label class="toggle-switch">
                <input
                  v-model="settings.notifyNewPolls"
                  type="checkbox"
                />
                <span class="toggle-slider"></span>
              </label>
            </div>

            <div class="setting-item">
              <div class="setting-icon">
                <i class="pi pi-check-circle"></i>
              </div>
              <div class="setting-content">
                <div class="setting-label">Résultats disponibles</div>
                <div class="setting-hint">Quand un sondage est terminé</div>
              </div>
              <label class="toggle-switch">
                <input
                  v-model="settings.notifyResults"
                  type="checkbox"
                />
                <span class="toggle-slider"></span>
              </label>
            </div>

            <div class="setting-item">
              <div class="setting-icon">
                <i class="pi pi-users"></i>
              </div>
              <div class="setting-content">
                <div class="setting-label">Invitations aux groupes</div>
                <div class="setting-hint">Quand vous êtes invité</div>
              </div>
              <label class="toggle-switch">
                <input
                  v-model="settings.notifyInvites"
                  type="checkbox"
                />
                <span class="toggle-slider"></span>
              </label>
            </div>
          </div>
        </section>

        <!-- Section Apparence -->
        <section class="settings-section">
          <h2 class="section-title">Apparence</h2>
          <div class="settings-list">
            <div class="setting-item">
              <div class="setting-icon">
                <i class="pi pi-moon"></i>
              </div>
              <div class="setting-content">
                <div class="setting-label">Mode sombre</div>
                <div class="setting-hint">Bientôt disponible</div>
              </div>
              <label class="toggle-switch">
                <input
                  v-model="settings.darkMode"
                  type="checkbox"
                  disabled
                />
                <span class="toggle-slider"></span>
              </label>
            </div>
          </div>
        </section>

        <!-- Section À propos -->
        <section class="settings-section">
          <h2 class="section-title">À propos</h2>
          <div class="settings-list">
            <button class="setting-item" @click="showHelp">
              <div class="setting-icon">
                <i class="pi pi-question-circle"></i>
              </div>
              <div class="setting-content">
                <div class="setting-label">Aide & Support</div>
              </div>
              <i class="pi pi-chevron-right"></i>
            </button>

            <button class="setting-item" @click="showTerms">
              <div class="setting-icon">
                <i class="pi pi-file-edit"></i>
              </div>
              <div class="setting-content">
                <div class="setting-label">Conditions d'utilisation</div>
              </div>
              <i class="pi pi-chevron-right"></i>
            </button>

            <div class="setting-item">
              <div class="setting-icon">
                <i class="pi pi-info-circle"></i>
              </div>
              <div class="setting-content">
                <div class="setting-label">Version</div>
                <div class="setting-hint">1.0.0</div>
              </div>
            </div>
          </div>
        </section>

        <!-- Déconnexion -->
        <section class="settings-section">
          <button class="btn-logout" @click="logout">
            <i class="pi pi-sign-out"></i>
            Déconnexion
          </button>
        </section>
      </div>
    </main>

    <!-- Bottom Navigation -->
    <BottomNav />
  </div>
</template>

<script setup>
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import BottomNav from '~/components/layout/BottomNav.vue'

const router = useRouter()

/**
 * Configuration de la page
 */
definePageMeta({
  title: 'Mon Profil',
  layout: 'default'
})

/**
 * Données utilisateur
 * TODO: Remplacer par de vraies données depuis l'API
 */
const user = ref({
  name: 'Alex Martin',
  email: 'alex.martin@example.com',
  avatar: null,
  stats: {
    totalVotes: 24,
    groupCount: 4,
    pollsCreated: 3
  }
})

/**
 * Paramètres
 */
const settings = ref({
  notifyNewPolls: true,
  notifyResults: true,
  notifyInvites: true,
  darkMode: false
})

/**
 * Obtenir les initiales
 */
const getInitials = (name) => {
  return name
    .split(' ')
    .map(word => word[0])
    .join('')
    .toUpperCase()
}

/**
 * Actions
 */
const editAvatar = () => {
  console.log('Éditer l\'avatar')
  // TODO: Implémenter l'upload d'avatar
}

const editProfile = () => {
  console.log('Éditer le profil')
  // TODO: Implémenter l'édition du profil
}

const changePassword = () => {
  console.log('Changer le mot de passe')
  // TODO: Implémenter le changement de mot de passe
}

const showHelp = () => {
  console.log('Afficher l\'aide')
  // TODO: Page d'aide
}

const showTerms = () => {
  console.log('Afficher les CGU')
  // TODO: Page CGU
}

const logout = () => {
  const confirmed = confirm('Voulez-vous vraiment vous déconnecter ?')
  if (confirmed) {
    // TODO: Implémenter la déconnexion
    router.push('/login')
  }
}
</script>

<style scoped lang="scss">
.profile-page {
  min-height: 100vh;
  background: var(--background-primary);
  padding-bottom: 80px; /* Espace pour la bottom nav */
}

/* Header */
.profile-header {
  padding: var(--spacing-2xl) var(--spacing-lg);
  text-align: center;
  background: linear-gradient(135deg, var(--color-primary) 0%, #f0a500 100%);
  color: var(--text-primary);
}

.profile-avatar {
  width: 120px;
  height: 120px;
  border-radius: var(--radius-full);
  margin: 0 auto var(--spacing-lg);
  position: relative;
  border: 4px solid rgba(255, 255, 255, 0.3);

  img {
    width: 100%;
    height: 100%;
    object-fit: cover;
    border-radius: var(--radius-full);
  }
}

.profile-avatar-placeholder {
  width: 100%;
  height: 100%;
  background: rgba(255, 255, 255, 0.2);
  backdrop-filter: blur(10px);
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 3rem;
  font-weight: 900;
  border-radius: var(--radius-full);
}

.avatar-edit {
  position: absolute;
  bottom: 0;
  right: 0;
  width: 40px;
  height: 40px;
  border-radius: var(--radius-full);
  background: var(--background-primary);
  color: var(--text-primary);
  border: 3px solid var(--color-primary);
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  transition: all var(--transition-base);

  &:hover {
    transform: scale(1.1);
  }

  i {
    font-size: 1.1rem;
  }
}

.profile-name {
  font-size: 2rem;
  font-weight: 800;
  margin: 0 0 var(--spacing-xs) 0;
}

.profile-email {
  font-size: 1.125rem;
  margin: 0 0 var(--spacing-xl) 0;
  opacity: 0.9;
}

.profile-stats {
  display: flex;
  justify-content: center;
  gap: var(--spacing-xl);
  margin-top: var(--spacing-2xl);

  @media (max-width: 768px) {
    gap: var(--spacing-lg);
  }
}

.stat-card {
  text-align: center;
}

.stat-value {
  font-size: 2rem;
  font-weight: 900;
  margin-bottom: var(--spacing-xs);
}

.stat-label {
  font-size: 0.9rem;
  opacity: 0.9;
}

/* Main */
.profile-main {
  padding: var(--spacing-2xl) var(--spacing-lg);
}

.settings-container {
  max-width: 600px;
  margin: 0 auto;
  display: flex;
  flex-direction: column;
  gap: var(--spacing-2xl);
}

.settings-section {
  .section-title {
    font-size: 1.25rem;
    font-weight: 700;
    color: var(--text-primary);
    margin: 0 0 var(--spacing-md) 0;
    padding: 0 var(--spacing-sm);
  }
}

.settings-list {
  background: var(--background-secondary);
  border-radius: var(--radius-lg);
  border: 2px solid var(--border-color);
  overflow: hidden;
}

.setting-item {
  display: flex;
  align-items: center;
  gap: var(--spacing-lg);
  padding: var(--spacing-lg);
  background: none;
  border: none;
  border-bottom: 1px solid var(--border-color);
  width: 100%;
  text-align: left;
  cursor: pointer;
  transition: background var(--transition-base);

  &:last-child {
    border-bottom: none;
  }

  &:hover {
    background: var(--background-tertiary);
  }

  &:disabled {
    opacity: 0.5;
    cursor: not-allowed;
  }
}

.setting-icon {
  width: 40px;
  height: 40px;
  border-radius: var(--radius-md);
  background: var(--background-tertiary);
  color: var(--color-primary);
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;

  i {
    font-size: 1.25rem;
  }
}

.setting-content {
  flex: 1;
}

.setting-label {
  font-size: 1rem;
  font-weight: 600;
  color: var(--text-primary);
  margin-bottom: 2px;
}

.setting-hint {
  font-size: 0.875rem;
  color: var(--text-secondary);
}

/* Toggle Switch */
.toggle-switch {
  position: relative;
  display: inline-block;
  width: 52px;
  height: 28px;
  flex-shrink: 0;

  input {
    opacity: 0;
    width: 0;
    height: 0;

    &:checked + .toggle-slider {
      background: var(--color-primary);

      &:before {
        transform: translateX(24px);
      }
    }

    &:disabled + .toggle-slider {
      opacity: 0.5;
      cursor: not-allowed;
    }
  }
}

.toggle-slider {
  position: absolute;
  cursor: pointer;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: var(--background-tertiary);
  border: 2px solid var(--border-color-dark);
  border-radius: var(--radius-full);
  transition: all var(--transition-base);

  &:before {
    content: '';
    position: absolute;
    height: 20px;
    width: 20px;
    left: 3px;
    bottom: 2px;
    background: white;
    border-radius: var(--radius-full);
    transition: transform var(--transition-base);
  }
}

/* Bouton déconnexion */
.btn-logout {
  width: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: var(--spacing-md);
  padding: var(--spacing-lg);
  background: var(--background-secondary);
  color: var(--color-danger);
  border: 2px solid var(--color-danger);
  border-radius: var(--radius-lg);
  font-weight: 700;
  font-size: 1rem;
  cursor: pointer;
  transition: all var(--transition-base);

  i {
    font-size: 1.2rem;
  }

  &:hover {
    background: var(--color-danger);
    color: white;
  }
}
</style>
