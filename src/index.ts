const RunService = game.GetService("RunService");

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

/**
 * Calls a function every second until the countdown reaches 0. Returns a
 * promise that resolves when the countdown is over. Canceling the promise will
 * stop the countdown.
 * @param callback The callback to call every second.
 * @param countdown The countdown in seconds.
 * @returns A promise that resolves when the countdown reaches 0.
 */
export function setCountdown(callback: (secondsLeft: number) => void, countdown: number) {
	// Note that 'index' here is 1-based
	return Promise.each(new Array(countdown, 0), (_, index) => {
		callback(countdown - (index - 1));
		return Promise.delay(1);
	});
}
