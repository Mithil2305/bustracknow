export function stopBroadcast() {
	if (globalThis.clearInterval && globalThis.intervalRef) {
		clearInterval(globalThis.intervalRef);
	}
}
