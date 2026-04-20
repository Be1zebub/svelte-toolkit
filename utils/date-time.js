/* usage
<script>
	import DateTime from "$utils/date-time.js"
	const { date, time } = DateTime()
</script>

<p>{$date}</p>
<p>{$time}</p>
*/

import { onMount } from "svelte"
import { derived, writable } from "svelte/store"

const fmtTime = new Intl.DateTimeFormat("ru-RU", {
	hour: "2-digit",
	minute: "2-digit",
	hour12: false,
	timeZone: "UTC",
})

const fmtDate = new Intl.DateTimeFormat("ru-RU", {
	day: "2-digit",
	month: "2-digit",
	year: "numeric",
	timeZone: "UTC",
})

export default function () {
	let now = writable(new Date())

	onMount(() => {
		const t = setInterval(() => {
			now.set(new Date())
		}, 1000)

		return () => clearInterval(t)
	})

	return {
		time: derived(now, ($) => fmtTime.format($)),
		date: derived(now, ($) => fmtDate.format($)),
	}
}
