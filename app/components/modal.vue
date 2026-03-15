<script setup lang="ts">
defineProps<{
  open: boolean
  title?: string
}>()

const emit = defineEmits<{
  close: []
}>()

const handleBackdropClick = (e: MouseEvent) => {
  if (e.target === e.currentTarget) {
    emit('close')
  }
}
</script>

<template>
  <Teleport to="body">
    <Transition name="modal">
      <div v-if="open" class="modal__backdrop" @click="handleBackdropClick">
        <div class="modal">
          <div class="modal__header">
            <h2 v-if="title" class="modal__title">{{ title }}</h2>
            <button class="modal__close icon-btn" @click="emit('close')" aria-label="Close modal">
              <VueFeather type="x" size="22" />
            </button>
          </div>
          <div class="modal__body">
            <slot />
          </div>
        </div>
      </div>
    </Transition>
  </Teleport>
</template>

<style scoped>
.modal__backdrop {
  position: fixed;
  inset: 0;
  background: rgba(0, 0, 0, 0.7);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 200;
  padding: 1.5rem;
}

.modal {
  background: var(--colour-surface);
  border: 1px solid var(--colour-border);
  border-radius: var(--radius-md);
  width: 100%;
  max-width: 800px;
  max-height: 90vh;
  overflow-y: auto;
  display: flex;
  flex-direction: column;
}

.modal__header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 1.25rem 1.5rem;
  border-bottom: 1px solid var(--colour-border);
  position: sticky;
  top: 0;
  background: var(--colour-surface);
}

.modal__title {
  font-size: 1rem;
  font-weight: 600;
  color: var(--colour-text-primary);
  margin: 0;
}

.modal__close {
  background: none;
  border: none;
  padding: 0;
  cursor: pointer;
  color: #fff;
  display: flex;
  align-items: center;
}

.modal__body {
  padding: 1.5rem;
}

/* Transition */
.modal-enter-active,
.modal-leave-active {
  transition: opacity 0.2s ease;
}

.modal-enter-active .modal,
.modal-leave-active .modal {
  transition:
    transform 0.2s ease,
    opacity 0.2s ease;
}

.modal-enter-from,
.modal-leave-to {
  opacity: 0;
}

.modal-enter-from .modal,
.modal-leave-to .modal {
  transform: translateY(8px);
  opacity: 0;
}
</style>
