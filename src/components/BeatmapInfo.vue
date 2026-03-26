<script setup lang="ts">
import { computed } from 'vue';
import { useBeatmap } from '../composables/useBeatmap';
import { useGameState } from '../composables/useGameState';

const { beatmapState } = useBeatmap();
const { gameState } = useGameState();

// Formateo de duración del beatmap (mm:ss)
const formattedLength = computed(() => {
  const seconds = Math.round(beatmapState.length / 1000);
  const minutes = Math.floor(seconds / 60);
  return `${minutes.toString().padStart(2, "0")}:${(seconds % 60).toString().padStart(2, "0")}`;
});

const pickerInfo = computed(() => {
  const hasRed = beatmapState.redPickedMaps.has(beatmapState.currentMapId);
  const hasBlue = beatmapState.bluePickedMaps.has(beatmapState.currentMapId);
  
  if (hasRed || hasBlue) {
    return {
      show: true,
      bgColor: hasRed ? 'var(--color-red, #f87171)' : 'var(--color-blue, #60a5fa)'
    };
  }
  return { show: false, bgColor: '' };
});
</script>

<template>
  <div id="beatmap" class="w-[50%] h-full flex flex-col gap-5">
    
    <div id="metadata"
      class="relative grow h-[50%] bg-mantle flex flex-col justify-center p-5 bg-cover bg-center transition-transform rounded-xl overflow-hidden border border-surface-0"
      :style="{ 
        backgroundImage: `url('${beatmapState.backgroundUrl}')`,
        transform: gameState.scoreVisible ? 'translateX(-950px) translateY(120px)' : ''
      }"
    >
      <div class="absolute top-0 left-0 bg-crust/70 w-full h-full"></div>
      
      <div class="relative text-2xl line-clamp-1 font-medium z-10">
        <span>{{ beatmapState.artist || 'Waiting for' }}</span> - <span>{{ beatmapState.title || 'beatmap...' }}</span>
      </div>
      
      <div class="relative text-lg line-clamp-1 z-10">
        Difficulty: <span>{{ beatmapState.difficulty }}</span> - Mapper: <span>{{ beatmapState.mapper }}</span>
      </div>

      <div id="picker" class="absolute right-0 top-0 h-full text-lg font-semibold flex items-center justify-center text-center overflow-hidden transition-all duration-300 text-white z-20"
        :style="{ width: pickerInfo.show ? '28px' : '0px', backgroundColor: pickerInfo.bgColor }"
      >
        <span style="writing-mode: vertical-lr; text-orientation: upright; letter-spacing: 2px;">PICK</span>
      </div>
    </div>

    <div id="stats" class="w-full h-[50%] text-lg justify-center flex flex-col p-5">
      <div class="flex gap-2.5">
        <div>CS: <span class="font-medium">{{ typeof beatmapState.cs === 'number' ? beatmapState.cs.toFixed(1) : beatmapState.cs }}</span></div> /
        <div>AR: <span class="font-medium">{{ typeof beatmapState.ar === 'number' ? beatmapState.ar.toFixed(1) : beatmapState.ar }}</span></div> /
        <div>OD: <span class="font-medium">{{ typeof beatmapState.od === 'number' ? beatmapState.od.toFixed(1) : beatmapState.od }}</span></div> /
        <div>BPM: <span class="font-medium">{{ beatmapState.bpm }}</span></div>
      </div>
      <div class="flex gap-5 mt-2">
        <div>Star Rating: <span class="font-medium">{{ typeof beatmapState.sr === 'number' ? beatmapState.sr.toFixed(2) : beatmapState.sr }}</span>*</div>/
        <div>Length: <span class="font-medium">{{ formattedLength }}</span></div>
      </div>
    </div>

  </div>
</template>