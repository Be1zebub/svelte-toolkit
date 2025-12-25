<script>
	export let maxOffsetX = 0.1
	export let maxOffsetY = 0.3

	let container
	let content

	let containerWidth = 0
	let containerHeight = 0

	export let x = 0
	export let y = 0

	let dragging = false
	let lastPointerX = 0
	let lastPointerY = 0

	function onPointerDown(e) {
		if (dragging || e.button !== 0) return
		if (e.target !== container && e.target !== content) return

		dragging = true
		lastPointerX = e.clientX
		lastPointerY = e.clientY

		e.preventDefault()
		e.stopPropagation()

		content.querySelectorAll("*").forEach((node) => {
			node.blur()
		})
	}

	function onPointerMove(e) {
		if (!dragging) return

		const dx = e.clientX - lastPointerX
		const dy = e.clientY - lastPointerY
		lastPointerX = e.clientX
		lastPointerY = e.clientY

		const maxX = containerWidth * maxOffsetX
		const maxY = containerHeight * maxOffsetY

		x = Math.max(-maxX, Math.min(x + dx, maxX))
		y = Math.max(-maxY, Math.min(y + dy, maxY))

		e.preventDefault()
		e.stopPropagation()
	}

	function onPointerUp(e) {
		if (dragging === false || e.button !== 0) return

		dragging = false
		e.preventDefault()
		e.stopPropagation()
	}

	export function resetDrag() {
		x = 0
		y = 0
	}
</script>

<svelte:window on:mousemove={onPointerMove} on:mouseup={onPointerUp} />

<button
	bind:this={container}
	on:mousedown={onPointerDown}
	bind:clientWidth={containerWidth}
	bind:clientHeight={containerHeight}
	class="canvas-container"
	style="cursor: {dragging ? 'grabbing' : 'grab'};"
>
	<div
		bind:this={content}
		class="canvas-content"
		style="transform: translate({x}px, {y}px);"
	>
		<slot />
	</div>
</button>

<style>
	.canvas-container {
		width: 100%;
		height: 100%;
		position: relative;
		display: flex;
		justify-content: center;
		align-items: center;
	}

	.canvas-content {
		will-change: transform;
		pointer-events: none;
		user-select: none;
	}
</style>
