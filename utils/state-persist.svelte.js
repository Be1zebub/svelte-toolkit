const PREFIX = "svelte:state-persist:"

export function persistentState(key, initialValue) {
	let value = $state(getValue(key, initialValue))

	$effect(() => {
		setValue(key, value)
	})

	return {
		get value() {
			return value
		},
		set value(v) {
			value = v
		},
	}
}

export function getValue(key, initialValue) {
	const stored = localStorage.getItem(PREFIX + key)

	if (stored === null) return initialValue

	try {
		return JSON.parse(stored)
	} catch {
		return stored
	}
}

export function setValue(key, value) {
	localStorage.setItem(PREFIX + key, JSON.stringify(value))
}
