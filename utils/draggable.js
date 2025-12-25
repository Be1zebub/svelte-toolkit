// use: actions & classes for drag & drop ui
// designered as singleton, it means receivers & draggables are force connected (eg no way to create 2 separate d&d without connection)

let dragging = null
let receivers = []
let draggables = []

let allowedMouseButtons = {
	0: true,
	1: true,
	2: true,
}

document.addEventListener("mousemove", (e) => {
	if (dragging) {
		for (const draggable of draggables) {
			if (draggable === dragging.instance) {
				draggable.onMouseMove(e)
				break
			}
		}
	}
})

document.addEventListener("mouseup", (e) => {
	if (dragging && e.button === dragging.button) {
		for (const receiver of receivers) {
			if (
				receiver.checkHover(e.clientX, e.clientY) &&
				receiver.handleDrop(dragging)
			) {
				return
			}
		}

		for (const draggable of draggables) {
			if (draggable === dragging.instance) {
				draggable.onMouseUp(e)
				break
			}
		}
	}
})

class Draggable {
	constructor(node, params) {
		this.node = node
		this.onStartDragging = params.onStartDragging

		this.clone = null
		this.offsetX = 0
		this.offsetY = 0
		this.button = 0

		this.boundMouseDown = this.onMouseDown.bind(this)
		this.node.addEventListener("mousedown", this.boundMouseDown)

		draggables.push(this)
	}

	destroy() {
		this.node.removeEventListener("mousedown", this.boundMouseDown)

		const index = draggables.indexOf(this)
		if (index !== -1) {
			draggables.splice(index, 1)
		}
	}

	startDragging(e) {
		this.button = e.button
		dragging = { instance: this, button: e.button }

		const rect = this.node.getBoundingClientRect()
		this.offsetX = e.clientX - rect.left
		this.offsetY = e.clientY - rect.top

		this.clone = this.node.cloneNode(true)

		this.clone.classList.add("dragging")
		this.clone.style.width = `${rect.width}px`
		this.clone.style.height = `${rect.height}px`
		this.clone.style.left = `${e.clientX - this.offsetX}px`
		this.clone.style.top = `${e.clientY - this.offsetY}px`

		// this.node.style.display = "none"
		document.body.appendChild(this.clone)

		if (this.onStartDragging) {
			this.onStartDragging(this, e)
		}
	}

	onMouseDown(e) {
		if (dragging || !allowedMouseButtons[e.button]) return

		e.preventDefault()
		this.startDragging(e)
	}

	onMouseUp(e) {
		if (e.button !== this.button || dragging.instance !== this) return

		this.cancel()
	}

	onMouseMove(e) {
		if (dragging.instance !== this || !this.clone) return

		this.clone.style.left = `${e.clientX - this.offsetX}px`
		this.clone.style.top = `${e.clientY - this.offsetY}px`
	}

	cancel() {
		if (this.clone) {
			document.body.removeChild(this.clone)
			this.clone = null
		}

		// this.node.style.display = "block"
		dragging = null
	}
}

class Receiver {
	constructor(node, params) {
		this.node = node
		this.onDrop = params.onDrop
		this.canReceive = params.canReceive

		this.isHovered = false
		receivers.push(this)
	}

	destroy() {
		const index = receivers.indexOf(this)
		if (index !== -1) {
			receivers.splice(index, 1)
		}
	}

	checkHover(x, y) {
		return this.node.matches(":hover")
		/*
		const rect = this.node.getBoundingClientRect()
		return (
			x >= rect.left && x <= rect.right && y >= rect.top && y <= rect.bottom
		)
		*/
	}

	handleDrop(dragging) {
		const instance = dragging.instance
		const button = dragging.button

		instance.cancel()

		if (this.canReceive && !this.canReceive(instance, button)) {
			return false
		}

		this.onDrop(instance, button)

		return true
	}
}

function draggable(node, params) {
	const instance = new Draggable(node, params)
	node.draggableInstance = instance

	return {
		update(newParams) {
			instance.onStartDragging = newParams.onStartDragging
		},
		destroy() {
			instance.destroy()
		},
	}
}

function receiver(node, params) {
	const instance = new Receiver(node, params)
	node.receiverInstance = instance

	return {
		update(newParams) {
			instance.onDrop = newParams.onDrop
			instance.canReceive = newParams.canReceive
		},
		destroy() {
			instance.destroy()
		},
	}
}

function isDragging() {
	return dragging !== null
}

export { draggable, isDragging, receiver }
