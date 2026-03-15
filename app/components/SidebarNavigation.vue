<script setup lang="ts">
const { user, logout } = useAuth()
const router = useRouter()
const route = useRoute()

const navItems = [
  { label: 'Collection', to: '/' },
  { label: 'Profile', to: '/profile' },
  { label: 'Settings', to: '/settings' },
]

const isActive = (path: string) => route.path === path

const handleLogout = async () => {
  await logout()
  router.push('/login')
}
</script>

<template>
  <aside class="sidebar">
    <nav class="sidebar__nav">
      <NuxtLink
        v-for="item in navItems"
        :key="item.to"
        :to="item.to"
        class="sidebar__item"
        :class="{ 'sidebar__item--active': isActive(item.to) }"
      >
        <span class="sidebar__label">{{ item.label }}</span>
      </NuxtLink>
    </nav>

    <div class="sidebar__footer">
      <div class="sidebar__user">
        <span class="sidebar__username">{{ user?.username }}</span>
      </div>
      <button class="btn-reset sidebar__logout" @click="handleLogout">Log out</button>
    </div>
  </aside>
</template>

<style scoped>
.sidebar {
  width: 220px;
  background: var(--colour-surface-dark);
  margin-left: 10px;
  margin-bottom: 10px;
  border-radius: var(--radius-md);
  display: flex;
  flex-direction: column;
  padding: 1.5rem 0;
  z-index: 100;
}

.sidebar__nav {
  display: flex;
  flex-direction: column;
  flex: 1;
  gap: 0.25rem;
  padding: 0 0.75rem;
}

.sidebar__item {
  display: flex;
  align-items: center;
  gap: 0.75rem;
  padding: 0.6rem 0.75rem;
  border-radius: 6px;
  text-decoration: none;
  color: var(--colour-text-primary);
  font-size: 0.9rem;
  font-weight: 500;
  transition:
    background 0.15s,
    color 0.15s;
}

.sidebar__item:hover {
  color: var(--colour-text-muted);
}

.sidebar__item--active {
}

.sidebar__label {
  flex: 1;
}

.sidebar__footer {
  padding: 1rem 1.5rem 0;
  border-top: 1px solid var(--colour-border);
  margin-top: auto;
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
}

.sidebar__user {
  display: flex;
  align-items: center;
}

.sidebar__username {
  font-size: 0.85rem;
  color: var(--colour-text-primary);
}

.sidebar__logout {
  border: 1px solid var(--colour-border);
  border-radius: 5px;
  color: var(--colour-text-muted);
  font-size: 0.8rem;
  padding: 0.4rem 0.75rem;
  text-align: left;
  transition:
    border-color 0.15s,
    color 0.15s;
  width: 100%;
}

.sidebar__logout:hover {
  color: var(--colour-text-muted);
}
</style>
