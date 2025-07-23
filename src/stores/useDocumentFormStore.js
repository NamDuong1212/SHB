import { defineStore } from 'pinia'

export const useDocumentFormStore = defineStore('documentForm', {
  state: () => ({
    isVisible: false,
    isMinimized: false,
    formData: {
      doc_title: '',
      collection_name: '',
      description: '',
      file: null,
      imgPreview: null
    },
    errors: {},
    collections: [],
    collectionsLoading: false,
    uploadStatus: {
      show: false,
      uploading: false,
      progress: 0,
      message: '',
      severity: 'info'
    }
  }),

  actions: {
    openDialog() {
      this.isVisible = true
      this.isMinimized = false
      this.resetForm()
    },

    closeDialog() {
      this.isVisible = false
      this.isMinimized = false
      this.resetForm()
    },

    minimizeDialog() {
      this.isMinimized = !this.isMinimized
    },

    resetForm() {
      // Only reset if not uploading
      if (!this.uploadStatus.uploading) {
        this.formData = {
          doc_title: '',
          collection_name: this.collections.length > 0 ? this.collections[0].name : '',
          description: '',
          file: null,
          imgPreview: null
        }
        this.errors = {}
        this.uploadStatus.show = false
      }
    },

    setFormData(data) {
      this.formData = { ...this.formData, ...data }
    },

    setErrors(errors) {
      this.errors = errors
    },

    setCollections(collections) {
      this.collections = collections
    },

    setUploadStatus(status) {
      this.uploadStatus = { ...this.uploadStatus, ...status }
    }
  },

  getters: {
    isFormValid() {
      return this.formData.file && 
             this.formData.doc_title.trim() && 
             this.formData.collection_name &&
             Object.keys(this.errors).length === 0
    }
  }
})
