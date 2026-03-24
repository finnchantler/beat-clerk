interface Notification {
  id: string
  message: string
  read: boolean
  createdAt: string
}

export const useNotifications = () => {
  const notifications = useState<Notification[]>('notifications', () => [])
  const loading = ref(false)

  const unreadCount = computed(() => notifications.value.filter((n) => !n.read).length)

  const fetchNotifications = async () => {
    loading.value = true
    try {
      notifications.value = await $fetch<Notification[]>('/api/notifications')
    } finally {
      loading.value = false
    }
  }

  const markAsRead = async (id: string) => {
    await $fetch(`/api/notifications/${id}`, { method: 'PATCH' })
    const n = notifications.value.find((n) => n.id === id)
    if (n) n.read = true
  }

  const markAllAsRead = async () => {
    await $fetch('/api/notifications/read-all', { method: 'POST' })
    notifications.value.forEach((n) => (n.read = true))
  }

  return { notifications, loading, unreadCount, fetchNotifications, markAsRead, markAllAsRead }
}
