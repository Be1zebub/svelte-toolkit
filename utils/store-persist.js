import { writable } from "svelte/store"

export default function persistentStore(key, initialValue) {
	const store = writable(getValue(key, initialValue))

	let notInitialized = true
	let pending = false

	store.subscribe((value) => {
		if (notInitialized) {
			notInitialized = false
			return
		}

		if (pending) return
		pending = true

		queueMicrotask(() => {
			setValue(key, value)
			pending = false
		})
	})

	return store
}

export function getValue(key, initialValue) {
	if (typeof window === "undefined") return initialValue

	let raw

	try {
		raw = localStorage.getItem(`svelte:store-persist:${key}`)
	} catch {
		return initialValue
	}

	if (raw === null) return initialValue

	try {
		return JSON.parse(raw)
	} catch {
		return initialValue
	}
}

export function setValue(key, value) {
	try {
		localStorage.setItem(`svelte:store-persist:${key}`, JSON.stringify(value))
	} catch {
		// private mode / blocked storage
	}
}
