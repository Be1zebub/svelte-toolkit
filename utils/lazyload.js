// lazyload polyfill

let observer = null

function ensureObserver() {
	if (observer) return observer

	observer = new IntersectionObserver((entries) => {
		entries.forEach((entry) => {
			if (!entry.isIntersecting) return

			const node = entry.target
			const nextSrc = node.dataset.src
			if (typeof nextSrc === "string" && nextSrc.length > 0 && node.src !== nextSrc) {
				node.src = nextSrc
			}
			node.dataset.lazyLoaded = "true"
			observer.unobserve(node)
		})
	}, {
		rootMargin: "100px",
	})

	return observer
}

export function lazyLoad(node, src) {
	const io = ensureObserver()

	function apply(nextSrc) {
		if (typeof nextSrc !== "string" || nextSrc.length === 0) return
		node.dataset.src = nextSrc
		delete node.dataset.lazyLoaded
		io.unobserve(node)
		io.observe(node)
	}

	apply(src || node.dataset.src)

	return {
		update(nextSrc) {
			apply(nextSrc)
		},
		destroy() {
			io.unobserve(node)
		},
	}
}
