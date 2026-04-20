import { onDestroy, onMount } from "svelte"
import { writable } from "svelte/store"
import { v4 as uuidv4 } from "uuid"

export default class {
	constructor() {
		this.store = writable([])
	}

	push(data, duration = 1000) {
		const startedAt = Date.now()
		const uid = uuidv4()
		const notify = { ...data, duration, startedAt, uid }

		this.store.update((t) => {
			return [...t, notify]
		})

		const remove = () => {
			this.store.update((t) => {
				return t.filter(
					(n) => n.uid !== uid && n.startedAt !== startedAt,
				)
			})
		}

		setTimeout(remove, duration)

		return {
			uid,
			data,
			remove,
		}
	}

	clear() {
		this.store.set([])
	}
}

export function NotifyUpdater() {
	const fraction = writable(0)

	let duration = 0
	let startedAt = 0
	let frameID = null

	function update() {
		if (!duration || !startedAt || duration <= 0) {
			fraction.set(0)
		} else {
			const now = Date.now()
			const elapsed = now - startedAt

			fraction.set(Math.min(elapsed / duration, 1))
		}

		frameID = requestAnimationFrame(update)
	}

	onMount(() => {
		frameID = requestAnimationFrame(update)
	})

	onDestroy(() => {
		if (frameID) cancelAnimationFrame(frameID)
	})

	return {
		fraction,
		updateTiming: (d, s) => {
			duration = d
			startedAt = s
		},
	}
}
