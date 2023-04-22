/**
 * Calls a function every `interval` seconds until the countdown reaches 0.
 * Returns a promise that resolves when the countdown is over. Canceling the
 * promise will stop the countdown.
 * @param callback The callback to call every second.
 * @param countdown The countdown in seconds.
 * @param interval The interval in seconds.
 * @returns A promise that resolves when the countdown reaches 0.
 */
export function setCountdown(callback: (secondsLeft: number) => void, countdown: number, interval = 1) {
	// Note that 'index' here is 1-based
	return Promise.each(new Array(countdown, 0), (_, index) => {
		callback(countdown - (index - 1));
		return Promise.delay(interval);
	});
}
