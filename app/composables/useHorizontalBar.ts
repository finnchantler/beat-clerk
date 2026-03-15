export interface BarAction {
  icon: string
  label: string
  onClick: () => void
  loading?: Ref<boolean> | null
}

const actions = ref<BarAction[]>([])

export const useHorizontalBar = () => {
  const setActions = (newActions: BarAction[]) => {
    actions.value = newActions
    onUnmounted(() => {
      actions.value = []
    })
  }

  return { actions, setActions }
}
