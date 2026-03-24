<script setup lang="ts">
import { ref, watch, nextTick } from 'vue';
import { useChat } from '../composables/useChat';
import { useGameState } from '../composables/useGameState';

const { chatState } = useChat();
const { gameState } = useGameState();
const chatInnerRef = ref<HTMLElement | null>(null);

// auto-scroll al agregar un nuevo mensaje
watch(() => chatState.messages.length, async () => {
  await nextTick();
  if (chatInnerRef.value) {
    chatInnerRef.value.scrollTo({ top: chatInnerRef.value.scrollHeight, behavior: 'smooth' });
  }
});

const getTeamColor = (team: string) => {
  if (team === 'bot') return 'text-yellow-400';
  if (team === 'left') return 'text-red-500';
  if (team === 'right') return 'text-blue-500';
  return '';
};
</script>

<template>
  <div id="chat" class="p-5 bg-mantle rounded-xl border border-surface-0 w-[50%] h-full overflow-hidden transition-opacity" :class="gameState.scoreVisible ? 'opacity-0' : 'opacity-100'">
    <div id="chatInner" ref="chatInnerRef" class="flex flex-col w-full h-full overflow-auto scrollbar-hide">
      
      <div v-for="(msg, index) in chatState.messages" :key="index" class="w-full flex items-start gap-5 mb-1">
        <div class="w-[50px] text-right shrink-0">{{ msg.time }}</div>
        <div class="w-[120px] font-bold shrink-0" :class="getTeamColor(msg.team)">
          {{ msg.name }}
        </div>
        <div class="flex-1 break-words">
          {{ msg.messageBody }}
        </div>
      </div>

    </div>
  </div>
</template>