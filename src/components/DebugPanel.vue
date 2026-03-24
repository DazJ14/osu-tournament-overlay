<script setup lang="ts">
import { useDebug } from '../composables/useDebug';

// Extraemos el estado global
const { debugState } = useDebug();
</script>

<template>
  <div id="debug" class="absolute top-[1080px] p-5 bg-mantle w-[1920px] flex gap-5 text-text">
    
    <div class="flex flex-col gap-2">
      <label class="flex items-center gap-2 font-bold cursor-pointer">
        <input 
          type="checkbox" 
          v-model="debugState.testMode" 
          class="w-5 h-5" 
        />
        Habilitar Test Mode
      </label>
    </div>

    <div v-if="debugState.testMode" class="flex gap-5 border-l border-gray-500 pl-5">
      
      <div class="flex flex-col gap-1">
        <label class="text-sm">Score Izquierdo</label>
        <input 
          type="number" 
          v-model.number="debugState.scoreLeft" 
          class="bg-base border border-gray-600 px-2 py-1 rounded text-text" 
        />
      </div>

      <div class="flex flex-col gap-1">
        <label class="text-sm">Score Derecho</label>
        <input 
          type="number" 
          v-model.number="debugState.scoreRight" 
          class="bg-base border border-gray-600 px-2 py-1 rounded text-text" 
        />
      </div>

      <div class="flex flex-col justify-center gap-2 pl-4 border-l border-gray-500">
        <label class="flex items-center gap-2 text-sm cursor-pointer">
          <input 
            type="checkbox" 
            v-model="debugState.scoreVisible" 
            class="w-4 h-4" 
          />
          Score Visible
        </label>
        <label class="flex items-center gap-2 text-sm cursor-pointer">
          <input 
            type="checkbox" 
            v-model="debugState.starsVisible" 
            class="w-4 h-4" 
          />
          Estrellas Visibles
        </label>
      </div>

    </div>
  </div>
</template>