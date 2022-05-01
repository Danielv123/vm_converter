<template>
  <div v-if="props.editing">
    <a-input v-model:value="editValue" />
  </div>
  <span v-else>{{ props.value }}</span>
</template>

<script setup>
const props = defineProps({
  value: String,
  editing: Boolean,
});
const editValue = ref(props.value);
</script>
