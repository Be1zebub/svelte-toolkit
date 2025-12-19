// dispatch events/states to children, event bus based on context+store

import { getContext, onDestroy, setContext } from "svelte"
import { writable } from "svelte/store"

const KEY = "__svelte-signal-bus__"

function getBus() {
	let bus = getContext(KEY)

	if (!bus) {
		bus = writable({})
		setContext(KEY, bus)
	}

	return bus
}

export function emitSignal(name, data) { // emit event/state
	const bus = getBus()

	bus.update((events) => {
		return {
			...events,
			[name]: { data, lastUpdate: Date.now() },
		}
	})
}

export function listenSignal(name, callback) { // listen event/state
	const bus = getBus()
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

export function subscribeSignal(name) { // for state based signals, subscribe to state value
	const data = writable(null)

	listenSignal(name, (signalData) => {
		data.set(signalData)
	})

	return data
}
