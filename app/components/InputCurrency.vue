<template>
  <div class="input-currency-wrapper">
    <span class="currency-prefix">Rp</span>
    <input 
      type="text" 
      :value="displayValue" 
      @input="handleInput"
      class="form-input with-prefix" 
      :placeholder="placeholder"
    />
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue';

const props = defineProps<{
  modelValue: number | string | null | undefined;
  placeholder?: string;
}>();

const emit = defineEmits<{
  (e: 'update:modelValue', value: number): void;
}>();

const displayValue = computed(() => {
  if (props.modelValue === 0) return '0';
  if (!props.modelValue) return '';
  const num = typeof props.modelValue === 'string' ? parseFloat(props.modelValue) : props.modelValue;
  if (isNaN(num)) return '';
  return new Intl.NumberFormat('id-ID').format(num);
});

const handleInput = (event: Event) => {
  const target = event.target as HTMLInputElement;
  let rawValue = target.value.replace(/[^0-9]/g, ''); // only keep numbers
  const numericValue = parseInt(rawValue, 10) || 0;
  
  emit('update:modelValue', numericValue);
  
  // Format visual input
  if (rawValue === '') {
    target.value = '';
  } else {
    target.value = new Intl.NumberFormat('id-ID').format(numericValue);
  }
};
</script>

<style scoped>
.input-currency-wrapper {
  position: relative;
  display: flex;
  align-items: center;
  width: 100%;
}
.currency-prefix {
  position: absolute;
  left: 12px;
  color: var(--text-muted, #64748b);
  font-size: 14px;
  font-weight: 500;
  pointer-events: none;
}
.with-prefix {
  padding-left: 36px !important;
  width: 100%;
}
</style>
