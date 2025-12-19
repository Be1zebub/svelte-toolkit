// svelte use: but for children nodes

export function NestedUse(parentNode, { selector, func }) {
	const destroyMap = new Map()

	function handleAdd(node) {
		if (destroyMap.has(node)) return

		const destroy = func(node)

		if (typeof destroy === "function") {
			destroyMap.set(node, destroy)
		}
	}

	function handleDestroy(node) {
		const destroy = destroyMap.get(node)

		if (destroy) {
			destroy()
			destroyMap.delete(node)
		}
	}

	document.querySelectorAll(selector).forEach(handleAdd)

	const observer = new MutationObserver((mutations) => {
		for (const mutation of mutations) {
			for (const node of mutation.addedNodes) {
				if (node.matches(selector)) {
					handleAdd(node)
				}

				node.querySelectorAll(selector).forEach(handleAdd)
			}
		}

		for (const node of mutation.removedNodes) {
			if (node.nodeType === 1) {
				if (node.matches(selector)) {
					handleDestroy(node)
				}

				node.querySelectorAll(selector).forEach(handleDestroy)
			}
		}
	})

	observer.observe(parentNode, {
		childList: true,
		subtree: true,
	})

	return {
		destroy() {
			observer.disconnect()

			for (const [node, destroy] of destroyMap) {
				destroy(node)
			}

			destroyMap.clear()
		},
	}
}
