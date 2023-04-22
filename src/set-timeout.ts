import { RunService } from "@rbxts/services";

/**
 * Schedule a callback to be called once after `timeout` seconds. Returns a
 * function that can be called to stop the timer.
 * @param callback The callback to call after `timeout` seconds.
 * @param timeout The timeout in seconds.
 * @returns A cleanup function.
 */
export function setTimeout(callback: () => void, timeout: number) {
	let timer = 0;

	const connection = RunService.Heartbeat.Connect((delta) => {
		timer += delta;

		if (timer >= timeout) {
			connection.Disconnect();
			callback();
		}
	});

	return () => connection.Disconnect();
}
