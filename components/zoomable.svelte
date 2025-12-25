<script>
	export let minZoom = 0.65
	export let maxZoom = 1.25
	export let zoom = 1

	export let zoomSpeed = 1 / 750

	// optional binding to draggable for correct zoom to cursor
	export let dragX = undefined
	export let dragY = undefined

	let container

	function clamp(value, min, max) {
		return Math.min(Math.max(value, min), max)
	}

	function zoomBy(delta, mouseX = null, mouseY = null) {
		if (!container) return

		const rect = container.getBoundingClientRect()
		const containerWidth = rect.width
		const containerHeight = rect.height

		const cursorX =
			mouseX !== null ? mouseX - rect.left : containerWidth / 2
		const cursorY =
			mouseY !== null ? mouseY - rect.top : containerHeight / 2

		const relativeX = (cursorX - containerWidth / 2) / (containerWidth / 2)
		const relativeY =
			(cursorY - containerHeight / 2) / (containerHeight / 2)

		const oldZoom = zoom
		const newZoom = clamp(zoom + delta, minZoom, maxZoom)

		if (newZoom !== oldZoom) {
			if (dragX !== undefined && dragY !== undefined) {
				const zoomFactor = newZoom / oldZoom
				const dragCorrectionX =
					(relativeX * containerWidth * (1 - zoomFactor)) / 2
				const dragCorrectionY =
					(relativeY * containerHeight * (1 - zoomFactor)) / 2

				dragX += dragCorrectionX
				dragY += dragCorrectionY
			}

			zoom = newZoom
		}
	}

	function handleWheel(event) {
		event.preventDefault()
		zoomBy(-event.deltaY * zoomSpeed, event.clientX, event.clientY)
	}

	export function resetZoom() {
		zoom = 1
	}

	export function zoomIn() {
		zoomBy(0.1)
	}

	export function zoomOut() {
		zoomBy(-0.1)
	}
</script>

<div bind:this={container} on:wheel={handleWheel} class="zoomable-container">
	<div class="zoomable-content" style="--zoom: {zoom};">
		<slot />
	</div>
</div>

<style>
	.zoomable-container {
		touch-action: none;
		width: 100%;
		height: 100%;
	}

	.zoomable-content {
		transform: translateZ(0) scale(var(--zoom));
		transform-origin: center center;
		width: 100%;
		height: 100%;
	}
</style>
