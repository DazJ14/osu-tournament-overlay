<script setup lang="ts">
import { computed } from 'vue';
import { useTeam } from '../composables/useTeam';
import { useGameState } from '../composables/useGameState';

const { teamState } = useTeam();
const { gameState } = useGameState();

// Calculo de estrellas/puntos máximos
const maxStars = computed(() => Math.floor((teamState.bestOf + 1) / 2));

const showStars = computed(() => gameState.starsVisible);
</script>

<template>
  <div id="topBar" class="absolute top-0 left-0 w-full h-[100px] bg-base px-10 flex items-center justify-between text-text">
    
    <div class="flex flex-col items-start gap-2.5">
      <div id="nameLeft" class="text-xl">{{ teamState.nameLeft }}</div>
      
      <div id="starLeft" class="flex gap-1" v-show="showStars">
        <div 
          v-for="n in maxStars" 
          :key="'left-' + n"
          class="w-[40px] h-[15px] rounded-full border border-surface-0 transition-colors duration-300"
          :class="n <= teamState.starsLeft ? 'bg-text' : 'bg-mantle'"
        ></div>
      </div>
    </div>

    <div class="flex flex-col items-end gap-2.5">
      <div id="nameRight" class="text-xl">{{ teamState.nameRight }}</div>
      
      <div id="starRight" class="flex gap-1 flex-row-reverse" v-show="showStars">
        <div 
          v-for="n in maxStars" 
          :key="'right-' + n"
          class="w-[40px] h-[15px] rounded-full border border-surface-0 transition-colors duration-300"
          :class="n <= teamState.starsRight ? 'bg-text' : 'bg-mantle'"
        ></div>
      </div>
    </div>

  </div>
</template>