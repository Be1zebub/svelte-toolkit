<script>
	import { cubicOut } from "svelte/easing"
	import { fly, slide } from "svelte/transition"

	const {
		store,
		component = null,
		getComponent = null,
		flyAnimation = { x: -200, opacity: 0 },
		flyOutAnimation = { duration: 600, easing: cubicOut },
		slideAnimation = {
			axis: "y",
			duration: 200,
			delay: 500,
			easing: cubicOut,
		},
	} = $props()

	let notifications = $state([])

	$effect(() => {
		if (!store) return

		return store.subscribe(v => notifications = v)
	})
</script>

{#if notifications && (component || getComponent)}
	{#each notifications as notification (notification.uid)}
		<div out:slide={slideAnimation}>
			<div
				in:fly={flyAnimation}
				out:fly={{
					...flyAnimation,
					...flyOutAnimation,
				}}
			>
				{#if getComponent}
					{@const Comp = getComponent(notification)}
					<Comp {...notification} />
				{:else}
					{@const Comp = component}
					<Comp {...notification} />
				{/if}
			</div>
		</div>
	{/each}
{/if}
