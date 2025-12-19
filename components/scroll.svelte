<!-- scrollbar primitive component, makes consistent gap between scrollbar & content. -->
<script>
	import { onDestroy, onMount } from "svelte"

	export let gap = 10

	let container = null
	let content = null
	let scrollbarVisible = false
	let observer = null

	onMount(() => {
		observer = new ResizeObserver(() => {
			const newState = container.scrollHeight > container.clientHeight

			if (newState !== scrollbarVisible) {
				scrollbarVisible = newState
			}
		})

		observer.observe(content)
	})

	onDestroy(() => {
		if (observer) {
			observer.disconnect()
		}
	})
</script>

<div
	bind:this={container}
	class="scroll-container"
	class:scrollbarVisible
	style="--gap: {gap}px"
>
	<div bind:this={content} class="scroll-content">
		<slot />
	</div>
</div>

<style>
	.scroll-container {
		flex: 1;
		overflow-y: auto;
	}

	.scroll-container.scrollbarVisible {
		padding-right: var(--gap);
	}
</style>
