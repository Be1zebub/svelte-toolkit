import { writable } from "svelte/store"

export default function persistentStore(key, initialValue) {
	const store = writable(getValue(key, initialValue))

	store.subscribe((value) => {
		setValue(key, value)
	})

	return store
}

export function getValue(key, initialValue) {
	const storedValue = localStorage.getItem(key)
	if (storedValue === null) return initialValue
	try {
		return JSON.parse(storedValue)
	} catch {
		return storedValue
	}
}

export function setValue(key, value) {
	localStorage.setItem(key, JSON.stringify(value))
}
