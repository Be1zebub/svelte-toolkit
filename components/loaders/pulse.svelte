<script>
	const durationUnitRegex = /[a-zA-Z]/
	const range = (size, startAt = 0) =>
		[...Array(size).keys()].map((i) => i + startAt)

	export let color = "#FF3E00"
	export let unit = "px"
	export let duration = "1.5s"
	export let size = "60"
	export let pause = false

	let durationUnit = duration.match(durationUnitRegex)?.[0] ?? "s"
	let durationNum = duration.replace(durationUnitRegex, "")
</script>

<div
	class="wrapper"
	style="--pulse-size: {size}{unit}; --pulse-color: {color}; --pulse-duration: {duration}"
>
	{#each range(3, 0) as version}
		<div
			class="cube"
			class:pause-animation={pause}
			style="animation-delay: {version *
				(+durationNum / 10)}{durationUnit}; left: {version *
				(+size / 3 + +size / 15) +
				unit};"
		></div>
	{/each}
</div>

<style>
	.wrapper {
		position: relative;
		display: flex;
		justify-content: center;
		align-items: center;
		width: var(--pulse-size);
		height: calc(var(--pulse-size) / 2.5);
	}
	.cube {
		position: absolute;
		top: 0px;
		width: calc(var(--pulse-size) / 5);
		height: calc(var(--pulse-size) / 2.5);
		background-color: var(--pulse-color);
		animation: motion var(--pulse-duration)
			cubic-bezier(0.895, 0.03, 0.685, 0.22) infinite;
	}
	.pause-animation {
		animation-play-state: paused;
	}
	@keyframes motion {
		0% {
			opacity: 1;
		}
		50% {
			opacity: 0;
		}
		100% {
			opacity: 1;
		}
	}
</style>
