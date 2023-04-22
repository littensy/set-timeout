import { setTimeout } from "./set-timeout";

export interface DebounceOptions {
	/**
	 * The leading edge of the timeout.
	 */
	leading?: boolean;
	/**
	 * The trailing edge of the timeout.
	 */
	trailing?: boolean;
	/**
	 * The maximum time `callback` is allowed to be delayed before it's invoked.
	 */
	maxWait?: number;
}

export type Debounced<T extends Callback> = T & {
	cancel: () => void;
	flush: () => ReturnType<T>;
	pending: () => boolean;
};

/**
 * Creates a debounced function that delays invoking `func` until after `wait`
 * seconds have elapsed since the last time the debounced function was invoked.
 * The debounced function comes with a `cancel` method to cancel delayed
 * `callback` invocations and a `flush` method to immediately invoke them.
 * Provide `options` to indicate whether `callback` should be invoked on the
 * leading and/or trailing edge of the `wait` timeout. The `func` is invoked
 * with the last arguments provided to the debounced function. Subsequent calls
 * to the debounced function return the result of the last `func` invocation.
 *
 * **Note:** If `leading` and `trailing` options are `true`, `callback` is
 * invoked on the trailing edge of the timeout only if the debounced function
 * is invoked more than once during the `wait` timeout.
 *
 * If `wait` is `0` and `leading` is `false`, `callback` invocation is deferred
 * until the next tick, similar to `setTimeout` with a timeout of `0`.
 *
 * See [David Corbacho's article](https://css-tricks.com/debouncing-throttling-explained-examples/)
 * for details over the differences between `debounce` and `throttle`.
 *
 * @param callback The function to debounce.
 * @param wait The number of seconds to delay. Defaults to `0`.
 * @param options The options object.
 * @returns The new debounced function.
 * @see https://github.com/lodash/lodash/blob/master/debounce.js/
 * @see https://css-tricks.com/debouncing-throttling-explained-examples/
 */
export function debounce<T extends Callback>(callback: T, wait = 0, options: DebounceOptions = {}): Debounced<T> {
	const { leading = false, trailing = true, maxWait } = options;

	const maxing = maxWait !== undefined;

	let lastCallTime = 0;
	let lastInvokeTime = 0;
	let lastArgs: Parameters<T> | undefined;
	let result: ReturnType<T>;
	let cancelTimeout: (() => void) | undefined;

	const invoke = (time: number) => {
		const args: unknown[] = lastArgs!;
		lastArgs = undefined;
		lastInvokeTime = time;
		result = callback(...args);
		return result;
	};

	const leadingEdge = (time: number) => {
		// Reset any `maxWait` timer.
		lastInvokeTime = time;
		// Start the timer for the trailing edge.
		cancelTimeout = setTimeout(timerExpired, wait);
		// Invoke the leading edge.
		return leading ? invoke(time) : result;
	};

	const remainingWait = (time: number) => {
		const timeSinceLastCall = time - lastCallTime;
		const timeSinceLastInvoke = time - lastInvokeTime;
		const timeWaiting = wait - timeSinceLastCall;

		return maxing ? math.min(timeWaiting, maxWait - timeSinceLastInvoke) : timeWaiting;
	};

	const shouldInvoke = (time: number) => {
		const timeSinceLastCall = time - lastCallTime;
		const timeSinceLastInvoke = time - lastInvokeTime;

		// Either this is the first call, activity has stopped and we're at the
		// trailing edge, the system time has gone backwards and we're treating
		// it as the trailing edge, or we've hit the `maxWait` limit.
		return (
			lastCallTime === undefined ||
			timeSinceLastCall >= wait ||
			timeSinceLastCall < 0 ||
			(maxing && timeSinceLastInvoke >= maxWait)
		);
	};

	const timerExpired = () => {
		const time = os.clock();

		if (shouldInvoke(time)) {
			return trailingEdge(time);
		}

		// Restart the timer.
		cancelTimeout = setTimeout(timerExpired, remainingWait(time));
	};

	const trailingEdge = (time: number) => {
		cancelTimeout = undefined;

		// Only invoke if we have `lastArgs` which means `invoke` was
		// debounced at least once.
		if (trailing && lastArgs) {
			return invoke(time);
		}
		lastArgs = undefined;
		return result;
	};

	const cancel = () => {
		cancelTimeout?.();
		cancelTimeout = undefined;
		lastInvokeTime = 0;
		lastArgs = undefined;
		lastCallTime = 0;
	};

	const flush = () => {
		return cancelTimeout === undefined ? result : trailingEdge(os.clock());
	};

	const pending = () => {
		return cancelTimeout !== undefined;
	};

	const debounced = (...args: Parameters<T>) => {
		const time = os.clock();
		const isInvoking = shouldInvoke(time);

		lastArgs = args;
		lastCallTime = time;

		if (isInvoking) {
			if (cancelTimeout === undefined) {
				return leadingEdge(lastCallTime);
			}
			if (maxing) {
				// Handle invocations in a tight loop.
				cancelTimeout = setTimeout(timerExpired, wait);
				return invoke(lastCallTime);
			}
		}
		if (cancelTimeout === undefined) {
			cancelTimeout = setTimeout(timerExpired, wait);
		}
		return result;
	};

	return setmetatable(
		{ cancel, flush, pending },
		{ __call: (_, ...args) => debounced(...(args as Parameters<T>)) },
	) as unknown as Debounced<T>;
}
