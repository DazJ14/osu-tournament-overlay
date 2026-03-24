<script setup lang="ts">
import { onMounted } from 'vue';
import { useMappool, MapStatus, MapSide } from '../composables/useMappool';

const { showMappool, mappool, mapStates, initMappool, handleMapClick } = useMappool();

// Inicializamos el mappool al montar el componente
onMounted(() => {
  initMappool();
});

const getIndicatorStyle = (state: any) => {
  if (!state || state.status === MapStatus.NIL) return { width: '0px', backgroundColor: 'white', color: '' };
  if (state.status === MapStatus.PICKED) {
    return {
      width: '20px', color: 'white',
      backgroundColor: state.side === MapSide.LEFT ? 'var(--color-red, #f87171)' : 'var(--color-blue, #60a5fa)'
    };
  }
  if (state.status === MapStatus.BANNED) {
    return {
      width: '20px', backgroundColor: 'var(--color-base, #1e1e2e)',
      color: state.side === MapSide.LEFT ? 'var(--color-red, #f87171)' : 'var(--color-blue, #60a5fa)'
    };
  }
};

const getIndicatorText = (state: any) => {
  if (!state) return '';
  if (state.status === MapStatus.PICKED) return 'PICK';
  if (state.status === MapStatus.BANNED) return 'BAN';
  return '';
};
</script>

<template>
  <div id="mappoolContainer" 
    class="absolute top-0 left-0 w-full h-full p-5 flex flex-col items-center gap-8 bg-base transition-all duration-500 z-40 overflow-auto"
    :style="{ clipPath: showMappool ? 'polygon(0% 0%, 100% 0%, 100% 100%, 0% 100%)' : 'polygon(0% 0%, 0% 0%, 0% 100%, 0% 100%)' }"
  >
    <div v-for="modpool in mappool" :key="modpool.mod" class="w-full flex flex-wrap gap-5 justify-center">
      
      <div v-for="map in modpool.maps" :key="map.uniqueId" 
        class="w-[500px] h-[60px] flex rounded-xl overflow-hidden border border-surface-0 select-none cursor-pointer relative"
        @click="(e) => handleMapClick(map.uniqueId, e)"
        @contextmenu="(e) => handleMapClick(map.uniqueId, e)"
      >
        <div class="flex justify-center text-[10px] font-medium leading-none text-center align-center overflow-hidden transition-all duration-300 z-20"
             :style="getIndicatorStyle(mapStates[map.uniqueId])">
          <span v-if="getIndicatorText(mapStates[map.uniqueId])" class="flex items-center justify-center" style="writing-mode: vertical-lr; text-orientation: upright; letter-spacing: 2px;">
            {{ getIndicatorText(mapStates[map.uniqueId]) }}
          </span>
        </div>

        <div class="relative flex-1 h-full bg-white flex justify-between items-center gap-5 p-2.5 px-5 text-white overflow-hidden z-10">
          <img :src="map.beatmapset.covers.slimcover" class="absolute top-0 left-0 w-full h-full object-cover object-center"/>
          <div class="absolute top-0 left-0 w-full h-full bg-crust/70"></div>
          
          <div class="relative truncate shrink-0 flex-1">
            <div class="text-xs truncate">{{ map.beatmapset.artist }}</div>
            <div class="font-medium truncate text-md">{{ map.beatmapset.title }}</div>
          </div>
          
          <div class="relative truncate text-xs flex flex-col shrink-0 flex-1">
            <div class="w-full text-right overflow-hidden flex justify-end">[<span class="font-medium truncate">{{ map.version }}</span>]</div> 
            <div class="truncate w-full text-right">by <span class="font-medium">{{ map.owners.map((o: any) => o.username).join(', ') }}</span></div>
          </div>
          
          <img :src="modpool.icon" class="relative w-[40px] object-contain object-center" />
        </div>

        <div class="absolute top-0 left-0 w-full h-full bg-black/60 transition-opacity duration-300 pointer-events-none z-30"
             :class="mapStates[map.uniqueId]?.status === MapStatus.BANNED ? 'opacity-100' : 'opacity-0'">
        </div>
      </div>

    </div>
  </div>
</template>