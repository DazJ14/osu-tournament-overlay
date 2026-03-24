<script setup lang="ts">
import { useEngine } from './core/engine';
import DebugPanel from './components/DebugPanel.vue';
import TopBar from './components/TopBar.vue';
import ScoreBoard from './components/ScoreBoard.vue';
import ChatPanel from './components/ChatPanel.vue';
import BeatmapInfo from './components/BeatmapInfo.vue';
import MappoolPanel from './components/MappoolPanel.vue';
import ResultPanel from './components/ResultPanel.vue';

const engine = useEngine();
</script>

<template>
	<div id="app" class="absolute top-0 left-0 w-[1920px] h-[1080px]">
        <TopBar />
		<div id="main" class="absolute top-[100px] w-full h-[720px]">
			<div class="absolute top-0 left-0 w-full h-full" id="resultContainer"></div>
			<div class="absolute top-0 left-0 w-full h-full p-5 flex flex-col items-center gap-8 bg-base transition-all"
				style="clip-path: polygon(0% 0%, 0% 0%, 0% 100%, 0% 100%)" id="mappoolContainer"></div>
			<ResultPanel />
			<MappoolPanel />
		</div>
		<div id="bottomBar" class="absolute bottom-0 left-0 w-full h-[260px] bg-base text-text">
            <ScoreBoard />
			<div id="info" class="absolute top-0 left-0 w-full h-full p-5 flex gap-5 text-text">
                <ChatPanel />
                <BeatmapInfo />
			</div>
		</div>
	</div>
    <DebugPanel />
</template>

<style>
</style>