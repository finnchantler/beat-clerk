export interface BarAction {
  icon: string
  label: string
  onClick: () => void
  loading?: Ref<boolean>
}

export const useHorizontalBar = () => {
  const actions = useState<BarAction[]>('bar-actions', () => [])

  const setActions = (newActions: BarAction[]) => {
    actions.value = newActions
    onUnmounted(() => {
      actions.value = []
    })
  }

  return { actions, setActions }
}
