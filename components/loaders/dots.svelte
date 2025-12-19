<script>
	import { onDestroy } from "svelte"

	export let count = 3
	export let minCount = 0
	export let duration = 1.5

	let dotWidth = 0
	let curCount = minCount

	$: fullWidth = count * dotWidth
	$: curWidth = curCount * dotWidth

	function getDotWidth(node) {
		dotWidth = node.offsetWidth

		const observer = new ResizeObserver(() => {
			dotWidth = node.offsetWidth
		})
		observer.observe(node)

		return {
			destroy() {
				observer.disconnect()
			},
		}
	}

	const timer = setInterval(
		() => {
			if (curCount >= count) {
				curCount = minCount
			} else {
				curCount++
			}
		},
		(duration * 1000) / count,
	)

	onDestroy(() => {
		clearInterval(timer)
	})
</script>

<span class="dots-loader" style:width="{fullWidth}px">
	<span class="dots" style:width="{curWidth}px">
		<span>{".".repeat(count)}</span>
	</span>
	<span class="dot-width" use:getDotWidth>.</span>
</span>

<style>
	.dots-loader {
		position: relative;
		display: inline-block;
		line-height: 1;
	}

	.dots {
		display: inline-block;
		overflow: hidden;
		vertical-align: bottom;
	}

	.dot-width {
		position: absolute;
		visibility: hidden;
		pointer-events: none;
	}
</style>
