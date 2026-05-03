import { getValue, setValue } from "$utils/store-persist.js"

// Runes + localStorage; same behavior as `persistentStore` (store-persist).

export default function persisted(key, initialValue) {
	let state = $state(getValue(key, initialValue))
	let pending = false

	return {
		get value() {
			return state
		},
		set value(v) {
			if (v === state) return

			state = v

			if (pending) return
			pending = true

			queueMicrotask(() => {
				setValue(key, state)
				pending = false
			})
		},
	}
}
