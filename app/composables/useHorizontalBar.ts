export type ButtonAction = {
  type: 'button'
  icon: string
  label: string
  onClick: () => void
  loading?: Ref<boolean> | null
  active?: Ref<boolean> | null
}

export type SearchAction = {
  type: 'search'
  placeholder?: string
  getValue: () => string
  onUpdate: (val: string) => void
}

export type BarAction = ButtonAction | SearchAction

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
