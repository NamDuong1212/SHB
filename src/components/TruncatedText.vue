<template>
  <div class="truncated-text-container">
    <span 
      :class="textClass"
      v-html="displayText"
    ></span>
    <button 
      v-if="needsTruncation"
      @click="toggleExpanded"
      class="expand-button text-blue-500"
    >
      {{ isExpanded ? collapseText : expandText }}
    </button>
  </div>
</template>

<script setup>
import { computed, ref } from 'vue';

const props = defineProps({
  text: {
    type: String,
    default: ''
  },
  maxLength: {
    type: Number,
    default: 200,
  },
  maxLines: {
    type: Number,
    default: null
  },
  expandText: {
    type: String,
    default: 'Xem thêm'
  },
  collapseText: {
    type: String,
    default: 'Thu gọn'
  },
  textClass: {
    type: String,
    default: 'text-xs sm:text-sm'
  }
});

const isExpanded = ref(false);

const needsTruncation = computed(() => {
  return props.text && props.text.length > props.maxLength;
});

const displayText = computed(() => {
  if (!props.text) return '';
  
  if (isExpanded.value || !needsTruncation.value) {
    return props.text;
  }
  
  return props.text.substring(0, props.maxLength) + '...';
});

const toggleExpanded = () => {
  isExpanded.value = !isExpanded.value;
};
</script>

<style scoped>
.truncated-text-container {
  line-height: 1.4;
  word-break: break-word;
  white-space: normal;
}

.expand-button {
  background: transparent;
  border: none;
  font-size: 0.75rem;
  font-weight: 500;
  cursor: pointer;
  margin-left: 0.25rem;
  text-decoration: underline;
  padding: 0;
  transition: color 0.2s ease;
}

.expand-button:hover {
  color: var(--primary-700);
}

@media (max-width: 640px) {
  .expand-button {
    font-size: 0.7rem;
  }
}
</style>