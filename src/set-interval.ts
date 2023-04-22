import { RunService } from "@rbxts/services";

/**
 * Schedule a callback to be called every `interval` seconds. Returns a
 * function that can be called to stop the timer.
 * @param callback The callback to call every `interval` seconds.
 * @param interval The interval in seconds.
 * @returns A cleanup function.
 */
export function setInterval(callback: () => void, interval: number) {
	let timer = 0;

	const connection = RunService.Heartbeat.Connect((delta) => {
		timer += delta;

		if (timer >= interval) {
			timer = 0;
			callback();
		}
	});

	return () => connection.Disconnect();
}
