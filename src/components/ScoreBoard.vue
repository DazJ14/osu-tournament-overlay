<script setup lang="ts">
import { ref, onMounted, watch, computed } from 'vue';
import { CountUp, type CountUpOptions } from 'countup.js';
import { useScore, ScoringCondition } from '../composables/useScore';
import { useGameState } from '../composables/useGameState';

const { scoreState } = useScore();
const { gameState } = useGameState();

// Referencias a los elementos del DOM
const scoreLeftRef = ref<HTMLElement | null>(null);
const scoreRightRef = ref<HTMLElement | null>(null);
const differenceRef = ref<HTMLElement | null>(null);
const barLeftContainerRef = ref<HTMLElement | null>(null);
const barRightContainerRef = ref<HTMLElement | null>(null);

let countUpLeft: CountUp | null = null;
let countUpRight: CountUp | null = null;
let countUpDiff: CountUp | null = null;

// Callback original para calcular el minWidth
const onComplete = () => {
  if (barLeftContainerRef.value && scoreLeftRef.value) {
    barLeftContainerRef.value.style.minWidth = `calc(${getComputedStyle(scoreLeftRef.value).width} / 2)`;
  }
  if (barRightContainerRef.value && scoreRightRef.value) {
    barRightContainerRef.value.style.minWidth = `calc(${getComputedStyle(scoreRightRef.value).width} / 2)`;
  }
};

const baseOptions: CountUpOptions = { duration: 0.5, useEasing: false, onCompleteCallback: onComplete };
const accOptions: CountUpOptions = { ...baseOptions, decimalPlaces: 2, suffix: '%' };
const xOptions: CountUpOptions = { ...baseOptions, suffix: 'x' };

const getOptions = () => {
  switch (scoreState.condition) {
    case ScoringCondition.ACCURACY: return accOptions;
    case ScoringCondition.MAX_COMBO:
    case ScoringCondition.MISS_COUNT: return xOptions;
    default: return baseOptions;
  }
};

const initCountUp = () => {
  const opts = getOptions();
  if (scoreLeftRef.value) countUpLeft = new CountUp(scoreLeftRef.value, scoreState.left, opts);
  if (scoreRightRef.value) countUpRight = new CountUp(scoreRightRef.value, scoreState.right, opts);
  if (differenceRef.value) countUpDiff = new CountUp(differenceRef.value, scoreState.difference, opts);
  
  countUpLeft?.start();
  countUpRight?.start();
  countUpDiff?.start();
};

onMounted(() => initCountUp());

// Re-inicializamos los contadores al cambiar la condicion de puntuación.
watch(() => scoreState.condition, () => initCountUp());

// Animamos los valores cuando el estado cambia reactivamente
watch(() => scoreState.left, (val) => countUpLeft?.update(val));
watch(() => scoreState.right, (val) => countUpRight?.update(val));
watch(() => scoreState.difference, (val) => countUpDiff?.update(val));

// ancho de las barras de diferencia
const leftBarWidth = computed(() => scoreState.isLeftLeading ? `calc(${Math.min(1, scoreState.lineDiffFactor)} * 960px)` : '0px');
const rightBarWidth = computed(() => scoreState.isRightLeading ? `calc(${Math.min(1, scoreState.lineDiffFactor)} * 960px)` : '0px');

// visibilidad según el estado del juego (y debug)
const isVisible = computed(() => gameState.scoreVisible);
</script>

<template>
  <div id="scoreContainer" class="absolute top-0 left-0 w-full h-full transition-opacity duration-300" :class="isVisible ? 'opacity-100' : 'opacity-0'">
    
    <div id="containerLeft" class="absolute top-0 left-0 w-[50%] h-3 flex justify-end">
      <div id="anchorLeft"></div>
      <div id="barLeftContainer" ref="barLeftContainerRef" class="h-3 flex justify-end">
        <div id="barLeft" class="h-full bg-red transition-all duration-[500ms]" :style="{ width: leftBarWidth }"></div>
      </div>
      <div id="scoreLeft" ref="scoreLeftRef" class="absolute text-4xl top-5 p-2.5">0</div>
    </div>

    <div 
      class="absolute top-0 text-sm px-2.5 py-1 transition-all duration-[500ms]" 
      id="difference" 
      ref="differenceRef"
      :class="scoreState.isLeftLeading ? 'left-[50%]' : 'right-[50%]'"
    >0</div>

    <div id="containerRight" class="absolute top-0 right-0 w-[50%] h-3 flex">
      <div id="barRightContainer" ref="barRightContainerRef" class="h-3 flex justify-start">
        <div id="barRight" class="h-full bg-blue transition-all duration-[500ms]" :style="{ width: rightBarWidth }"></div>
      </div>
      <div id="anchorRight"></div>
      <div id="scoreRight" ref="scoreRightRef" class="absolute text-4xl top-5 p-2.5">0</div>
    </div>

  </div>
</template>