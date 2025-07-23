// composables/useGlobalDocumentForm.js
import { computed } from 'vue'

export async function useGlobalDocumentForm() {
  const { useDocumentFormStore } = await import('@/stores/useDocumentFormStore')
  const documentFormStore = useDocumentFormStore()

  const openDocumentForm = () => {
    documentFormStore.openDialog()
  }

  const closeDocumentForm = () => {
    documentFormStore.closeDialog()
  }

  const isFormVisible = computed(() => documentFormStore.isVisible)
  const isUploading = computed(() => documentFormStore.uploadStatus.uploading)

  return {
    openDocumentForm,
    closeDocumentForm,
    isFormVisible,
    isUploading,
    documentFormStore
  }
}

export function useGlobalDocumentFormSafe() {
  try {
    const { useDocumentFormStore } = require('@/stores/useDocumentFormStore')
    const documentFormStore = useDocumentFormStore()

    return {
      openDocumentForm: () => documentFormStore.openDialog(),
      closeDocumentForm: () => documentFormStore.closeDialog(),
      isFormVisible: computed(() => documentFormStore.isVisible),
      isUploading: computed(() => documentFormStore.uploadStatus.uploading),
      documentFormStore
    }
  } catch (error) {
    console.warn('Pinia store not available yet:', error)
    return {
      openDocumentForm: () => console.warn('Store not ready'),
      closeDocumentForm: () => console.warn('Store not ready'),
      isFormVisible: computed(() => false),
      isUploading: computed(() => false),
      documentFormStore: null
    }
  }
}