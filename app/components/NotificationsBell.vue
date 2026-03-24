<script setup lang="ts">
const { notifications, unreadCount, fetchNotifications, markAsRead, markAllAsRead } =
  useNotifications()

const open = ref(false)

const toggle = () => (open.value = !open.value)

const handleMarkAsRead = async (id: string) => {
  await markAsRead(id)
}

const handleMarkAllAsRead = async () => {
  await markAllAsRead()
}

const formatDate = (dateString: string) => {
  return new Date(dateString).toLocaleDateString('en-GB', {
    day: 'numeric',
    month: 'short',
    hour: '2-digit',
    minute: '2-digit',
  })
}

onMounted(fetchNotifications)
</script>

<template>
  <div class="notifications">
    <button
      class="btn-reset icon-btn notifications__bell"
      aria-label="Notifications"
      @click="toggle"
    >
      <VueFeather type="bell" size="18" />
      <span v-if="unreadCount > 0" class="notifications__badge">
        {{ unreadCount }}
      </span>
    </button>

    <div v-if="open" class="notifications__dropdown">
      <div class="notifications__header">
        <span>Notifications</span>
        <button v-if="unreadCount > 0" class="notifications__read-all" @click="handleMarkAllAsRead">
          Mark all as read
        </button>
      </div>

      <p v-if="notifications.length === 0" class="notifications__empty">No notifications yet.</p>

      <div
        v-for="notification in notifications"
        :key="notification.id"
        :class="['notifications__item', { 'notifications__item--unread': !notification.read }]"
        @click="handleMarkAsRead(notification.id)"
      >
        <p class="notifications__message">{{ notification.message }}</p>
        <span class="notifications__date">{{ formatDate(notification.createdAt) }}</span>
      </div>
    </div>

    <div v-if="open" class="notifications__backdrop" @click="open = false" />
  </div>
</template>
