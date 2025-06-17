<template>
  <q-tr :props="props">
    <q-td :style="{ paddingLeft: level * 32 + 'px' }">
      <q-btn
        v-if="row.children && row.children.length"
        size="sm"
        round
        flat
        :icon="row.expanded ? 'remove' : 'add'"
        @click="row.expanded = !row.expanded"
      />
    </q-td>
    <q-td>{{ row.groupFactoryCode }}</q-td>
    <q-td>{{ row.groupFactoryName }}</q-td>
    <q-td>1</q-td>
    <q-td>{{ row.isActive ? "Hoạt động" : "Không hoạt động" }}</q-td>
    <q-td>
      <q-btn flat icon="edit" size="sm" dense @click="$emit('edit', row)" />
      <q-btn flat icon="delete" size="sm" dense @click="$emit('delete', row)" />
    </q-td>
  </q-tr>
  <template v-if="row.expanded && row.children">
    <tree-row
      v-for="child in row.children"
      :key="child.id"
      :row="child"
      :props="props"
      :level="level + 1"
      @edit="$emit('edit', $event)"
      @delete="$emit('delete', $event)"
    />
  </template>
</template>

<script setup>
import { defineProps, defineEmits } from "vue";

const props = defineProps({
  row: {
    type: Object,
    required: true,
  },
  props: {
    type: Object,
    required: true,
  },
  level: {
    type: Number,
    default: 0,
  },
});

defineEmits(["edit", "delete"]);
</script>