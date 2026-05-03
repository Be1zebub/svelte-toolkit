<!-- example:
<Dropdown align="right">
	{#snippet trigger(opened)}
		<div class="dropdown-trigger" class:opened>
			Sort by: {activeSortingMethod.name}
			<svg
				width="12"
				height="7"
				viewBox="0 0 12 7"
				fill="none"
				xmlns="http://www.w3.org/2000/svg"
			>
				<path
					d="M5.39485 6.7437C5.72955 7.08543 6.27312 7.08543 6.60783 6.7437L11.749 1.49473C12.0837 1.153 12.0837 0.598028 11.749 0.256298C11.4143 -0.0854325 10.8707 -0.0854325 10.536 0.256298L6 4.88742L1.46402 0.259031C1.12931 -0.0826989 0.585741 -0.0826989 0.251032 0.259031C-0.0836773 0.600761 -0.0836773 1.15573 0.251032 1.49746L5.39217 6.74644L5.39485 6.7437Z"
					fill="currentColor"
				/>
			</svg>
		</div>
	{/snippet}

	{#snippet content(opened, close)}
		<div class="dropdown-content" class:opened>
			{#each sortingMethods as method}
				<button
					onclick={() => {
						onSortingMethodChange(method.id)
						close()
					}}
				>
					{method.name}
				</button>
			{/each}
		</div>
	{/snippet}
</Dropdown>
-->

<script>
	let { trigger, content, align = "left" } = $props()

	let root
	let opened = $state(false)

	$effect(() => {
		if (opened == false) return

		function onClick(e) {
			if (root.contains(e.target) == false) {
				opened = false
			}
		}

		document.addEventListener("click", onClick)

		return () => {
			document.removeEventListener("click", onClick)
		}
	})
</script>

<details bind:this={root} class="dropdown align-{align}" bind:open={opened}>
	<summary class="dropdown-trigger">
		{@render trigger?.(opened)}
	</summary>

	<div class="dropdown-content">
		{@render content?.(opened, () => (opened = false))}
	</div>
</details>

<style>
	details {
		position: relative;
	}

	summary {
		list-style: none;
		cursor: pointer;
		user-select: none;
	}

	summary::-webkit-details-marker {
		display: none;
	}

	summary,
	.dropdown-content {
		width: 100%;
	}

	.dropdown-content {
		position: absolute;
		top: 100%;

		width: max-content;
		min-width: 100%;

		opacity: 0;
		transform: translateY(4px);
		pointer-events: none;

		transition: 0.15s ease;
		z-index: 1000;
	}

	.align-left .dropdown-content {
		left: 0;
	}

	.align-right .dropdown-content {
		right: 0;
	}

	details[open] .dropdown-content {
		opacity: 1;
		transform: translateY(0);
		pointer-events: auto;
	}
</style>
