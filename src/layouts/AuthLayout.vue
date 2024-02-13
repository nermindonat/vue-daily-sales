<template>
	<div class="flex flex-row w-full h-screen">
		<aside class="relative flex-col items-center justify-center w-full h-full bg-zinc-200 lg:flex md:hidden">
			<main name="aside">
				<Sidebar />
			</main>
		</aside>
		<main class="flex items-center justify-center w-full overflow-auto">
			<slot></slot>
		</main>
	</div>
</template>

<script lang="ts" setup>
import Sidebar from './AuthSidebar.vue'
</script>
