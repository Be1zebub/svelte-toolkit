import Tooltip from "$components/tooltip.svelte"
import { mount, unmount } from "svelte"

export default function (node) {
	const config = {
		text: node.getAttribute("title"),
		style: node.getAttribute("tooltip-style"),
		scale: node.getAttribute("tooltip-scale"),
	}
	const component = mount(Tooltip, {
		target: node,
		props: {
			origin: node,
			text: config.text,
			style: config.style,
			scale: config.scale,
		},
	})

	const observer = new MutationObserver(() => {
		const text = node.getAttribute("title")
		const style = node.getAttribute("tooltip-style")
		const scale = node.getAttribute("tooltip-scale")

		if (config.text !== text) {
			config.text = text
			component.setText(text)
		}
		if (config.style !== style) {
			config.style = style
			component.setStyle(style)
		}
		if (config.scale !== scale) {
			config.scale = scale
			component.setScale(scale)
		}
	})

	observer.observe(node, {
		attributes: true,
		attributeFilter: ["title", "tooltip-style", "tooltip-scale"],
	})

	return {
		destroy() {
			observer.disconnect()
			unmount(component)
		},
	}
}
