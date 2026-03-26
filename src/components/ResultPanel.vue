<script setup lang="ts">
import { useResult } from '../composables/useResult';

const { resultState } = useResult();
</script>

<template>
  <div id="resultContainer" 
    class="absolute top-0 left-0 w-full h-full transition-opacity duration-500 z-30"
    :class="resultState.isEnded ? 'opacity-100' : 'opacity-0 pointer-events-none'"
  >
    </div>
</template>