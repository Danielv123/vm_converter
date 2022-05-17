<template>
  <div>
    Step
    {{props.step}}
  </div>
</template>

<script setup>
const props = defineProps({
  step: Object,
  editing: Boolean,
});
</script>
