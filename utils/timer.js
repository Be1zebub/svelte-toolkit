export default class Timer {
	constructor(delay, repetitions, callback) {
		this.delay = delay
		this.repetitions = repetitions
		this.callback = callback

		this._count = 0
		this._remaining = 0
		this._timeout = null
		this._paused = false

		this.start()
	}

	adjust(delay, repetitions, callback) {
		if (delay != null) this.delay = delay
		if (repetitions != null) this.repetitions = repetitions
		if (callback != null) this.callback = callback

		this.start()
	}

	start() {
		this.stop()

		this._count = 0
		this._paused = false

		const delay = this.getDelay()
		this._nextTick = Date.now() + delay
		this._timeout = setTimeout(() => this._tick(), delay)
	}

	stop() {
		if (this._timeout) {
			clearTimeout(this._timeout)
			this._timeout = null
		}
	}

	pause() {
		if (this._paused || !this._timeout) return

		clearTimeout(this._timeout)
		this._remaining = Math.max(0, this._nextTick - Date.now())
		this._paused = true
	}

	unpause() {
		if (!this._paused) return

		this._paused = false
		this._nextTick = Date.now() + this._remaining
		this._timeout = setTimeout(() => this._tick(), this._remaining)
	}

	_tick() {
		if (this._paused) return

		this.callback()
		this._count++

		if (this.repetitions > 0 && this._count >= this.repetitions) {
			this.stop()
			return
		}

		const delay = this.getDelay()
		this._nextTick = Date.now() + delay
		this._timeout = setTimeout(() => this._tick(), delay)
	}

	isRunning() {
		return this._timeout !== null && !this._paused
	}

	isPaused() {
		return this._paused
	}

	getTimeLeft() {
		if (this._paused) return this._remaining
		if (!this._timeout) return 0

		return Math.max(0, this._nextTick - Date.now())
	}

	getDelay() {
		if (typeof this.delay === "function") return this.delay()
		if (typeof this.delay === "number") return this.delay
		if (
			typeof this.delay === "object" &&
			this.delay.constructor === Array
		) {
			const min = this.delay[0]
			const max = this.delay[1]

			return Math.floor(Math.random() * (max - min + 1)) + min
		}

		console.error("Invalid delay type", this.delay, typeof this.delay)
		return 0
	}
}
