/* BitMask usage example:
const PERMISSIONS = {
	READ: 1,
	WRITE: 2,
	EXECUTE: 4,
	DELETE: 8,
	ADMIN: 16,
}

const permissions = new BitMask()
permissions
	.add(PERMISSIONS.READ)
	.add(PERMISSIONS.WRITE)
	.add(PERMISSIONS.EXECUTE)

console.log("Permissions value:", permissions.getValue())
console.log("Has READ:", permissions.has(PERMISSIONS.READ))
console.log("Has DELETE:", permissions.has(PERMISSIONS.DELETE))
console.log("Binary:", permissions.toBinary())
console.log("Active permissions:", permissions.toArray())

const features = BitMask.fromArray([1, 4, 16])
console.log("Features:", features.getValue())

const bigMask = new BitMask(0, true)
bigMask.add(2n ** 50n)
*/

export class BitMask {
	constructor(initialValue = 0, useBigInt = false) {
		this.useBigInt = useBigInt
		this.mask = useBigInt ? BigInt(initialValue) : initialValue
	}

	static fromArray(values, useBigInt = false) {
		const instance = new BitMask(0, useBigInt)
		values.forEach((value) => instance.add(value))
		return instance
	}

	static fromBinary(binaryString, useBigInt = false) {
		if (!/^[01]+$/.test(binaryString)) {
			throw new Error("Invalid binary string")
		}
		const value = useBigInt
			? BigInt(`0b${binaryString}`)
			: parseInt(binaryString, 2)
		return new BitMask(value, useBigInt)
	}

	add(bit) {
		this._validateBit(bit)
		const bitValue = this.useBigInt ? BigInt(bit) : bit
		this.mask = this.mask | bitValue
		return this
	}

	remove(bit) {
		this._validateBit(bit)
		const bitValue = this.useBigInt ? BigInt(bit) : bit
		this.mask = this.mask & ~bitValue
		return this
	}

	toggle(bit) {
		this._validateBit(bit)
		const bitValue = this.useBigInt ? BigInt(bit) : bit
		this.mask = this.mask ^ bitValue
		return this
	}

	has(bit) {
		this._validateBit(bit)
		const bitValue = this.useBigInt ? BigInt(bit) : bit
		return (this.mask & bitValue) !== (this.useBigInt ? 0n : 0)
	}

	hasAll(bits) {
		if (!Array.isArray(bits)) {
			throw new Error("bits must be an array")
		}
		return bits.every((bit) => this.has(bit))
	}

	hasAny(bits) {
		if (!Array.isArray(bits)) {
			throw new Error("bits must be an array")
		}
		return bits.some((bit) => this.has(bit))
	}

	clear() {
		this.mask = this.useBigInt ? 0n : 0
		return this
	}

	isEmpty() {
		return this.mask === (this.useBigInt ? 0n : 0)
	}

	union(other) {
		const otherMask = this._convertToMask(other)
		this.mask = this.mask | otherMask
		return this
	}

	intersection(other) {
		const otherMask = this._convertToMask(other)
		this.mask = this.mask & otherMask
		return this
	}

	xor(other) {
		const otherMask = this._convertToMask(other)
		this.mask = this.mask ^ otherMask
		return this
	}

	invert(maxBits = 32) {
		if (maxBits <= 0) {
			throw new Error("maxBits must be positive")
		}

		if (this.useBigInt) {
			const mask = (1n << BigInt(maxBits)) - 1n
			this.mask = this.mask ^ mask
		} else {
			const mask = (1 << maxBits) - 1
			this.mask = (this.mask ^ mask) >>> 0
		}
		return this
	}

	toArray() {
		const result = []
		let tempMask = this.mask
		let bit = this.useBigInt ? 1n : 1

		while (tempMask > (this.useBigInt ? 0n : 0)) {
			if ((tempMask & bit) !== (this.useBigInt ? 0n : 0)) {
				if (this.useBigInt && bit > Number.MAX_SAFE_INTEGER) {
					result.push(bit.toString())
				} else {
					result.push(Number(bit))
				}
			}
			tempMask = tempMask >> (this.useBigInt ? 1n : 1)
			bit = bit << (this.useBigInt ? 1n : 1)
		}

		return result
	}

	toIndexArray() {
		const result = []
		let tempMask = this.mask
		let index = 0

		while (tempMask > (this.useBigInt ? 0n : 0)) {
			if (
				(tempMask & (this.useBigInt ? 1n : 1)) !==
				(this.useBigInt ? 0n : 0)
			) {
				result.push(index)
			}
			tempMask = tempMask >> (this.useBigInt ? 1n : 1)
			index++
		}

		return result
	}

	count() {
		let count = 0
		let tempMask = this.mask

		while (tempMask > (this.useBigInt ? 0n : 0)) {
			tempMask = tempMask & (tempMask - (this.useBigInt ? 1n : 1))
			count++
		}

		return count
	}

	toBinary() {
		return this.mask.toString(2)
	}

	getValue() {
		return this.mask
	}

	setValue(value) {
		if (value < 0) {
			throw new Error("Value cannot be negative")
		}
		this.mask = this.useBigInt ? BigInt(value) : value
		return this
	}

	clone() {
		return new BitMask(this.mask, this.useBigInt)
	}

	equals(other) {
		const otherMask = this._convertToMask(other)
		return this.mask === otherMask
	}

	toString() {
		return `BitMask(${this.mask}, binary: ${this.toBinary()})`
	}

	toJSON() {
		return this.useBigInt ? this.mask.toString() : this.mask
	}

	_validateBit(bit) {
		if (typeof bit !== "number" || bit < 0 || !Number.isInteger(bit)) {
			throw new Error("Bit must be a non-negative integer")
		}
		if (!this.useBigInt && bit > Number.MAX_SAFE_INTEGER) {
			throw new Error(
				"Bit value too large for regular numbers, use BigInt mode",
			)
		}
	}

	_convertToMask(other) {
		if (other instanceof BitMask) {
			return other.mask
		}
		if (typeof other === "number" || typeof other === "bigint") {
			return this.useBigInt ? BigInt(other) : Number(other)
		}
		throw new Error("Invalid mask type")
	}
}

/* BitFlagStatic is designed for LOG_LEVEL, eg:
	const LOG_LEVEL = new BitFlagStatic({
		FETCH: true,
		LISTENER: true,
		FETCH_QUEUE: false
	})

	if (LOG_LEVEL.has("FETCH")) {
		console.log("FETCH is enabled")
	}
*/

export class BitFlagStatic extends BitMask {
	constructor(flags = {}) {
		const keys = Object.keys(flags)
		const useBigInt = keys.length > 53

		const bitEnum = Object.fromEntries(
			keys.map((key, i) => [key, useBigInt ? 1n << BigInt(i) : 1 << i]),
		)

		let maskValue = useBigInt ? 0n : 0
		for (const [key, value] of Object.entries(flags)) {
			if (value) {
				maskValue |= bitEnum[key]
			}
		}

		super(maskValue, useBigInt)
		this.bitEnum = bitEnum
	}

	has(flag) {
		const bit = this.bitEnum[flag]

		if (bit === undefined) {
			throw new Error(`Unknown flag: ${flag}`)
		}

		return super.has(bit)
	}
}
