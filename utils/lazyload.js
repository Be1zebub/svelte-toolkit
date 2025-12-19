// lazyload polyfill

let observer = null

export function lazyLoad(node) {
	if (typeof node.dataset.src !== "string" || node.dataset.lazyLoaded) return

	if (!observer) {
		observer = new IntersectionObserver((entries) => {
			entries.forEach((entry) => {
				if (entry.isIntersecting) {
					entry.target.src = entry.target.dataset.src
					entry.target.dataset.lazyLoaded = true
					observer.unobserve(entry.target)
				}
			})
		})
	}

	observer.observe(node)

	return {
		destroy() {
			observer.unobserve(node)
		},
	}
}
