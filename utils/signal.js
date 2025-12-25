// dispatch events/states to children, event bus based on context+store

import { getContext, onDestroy, setContext } from "svelte"
import { writable } from "svelte/store"

const KEY = "__svelte-signal-bus__"

function getBus(key) {
	if (!key) key = KEY
	let bus = getContext(key)

	if (!bus) {
		bus = writable({})
		setContext(key, bus)
	}

	return bus
}

export function emitSignal(name, data, key) { // emit event/state
	const bus = getBus(key)

	bus.update((events) => {
		return {
			...events,
			[name]: { data, lastUpdate: Date.now() },
		}
	})
}

export function listenSignal(name, callback, key) { // listen event/state
	const bus = getBus(key)
	let lastUpdate = 0

	const unsubscribe = bus.subscribe((signals) => {
		const signal = signals[name]
		if (!signal) return

		if (signal.lastUpdate !== lastUpdate) {
			lastUpdate = signal.lastUpdate
			callback(signal.data)
		}
	})

	onDestroy(unsubscribe)
	return unsubscribe
}

export function subscribeSignal(name, key) { // for state based signals, subscribe to state value
	const data = writable(null)

	listenSignal(name, (signalData) => {
		data.set(signalData)
	}, key)

	return data
}
