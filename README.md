## ⏱️ [set-timeout](https://npmjs.com/package/@rbxts/set-timeout)

![GitHub Workflow Status](https://img.shields.io/github/actions/workflow/status/littensy/set-timeout/ci.yml?branch=master&style=for-the-badge&logo=github)
[![npm version](https://img.shields.io/npm/v/@rbxts/set-timeout.svg?style=for-the-badge&logo=npm)](https://www.npmjs.com/package/@rbxts/set-timeout)
[![npm downloads](https://img.shields.io/npm/dt/@rbxts/set-timeout.svg?style=for-the-badge&logo=npm)](https://www.npmjs.com/package/@rbxts/set-timeout)
[![GitHub license](https://img.shields.io/github/license/littensy/set-timeout?style=for-the-badge)](LICENSE.md)

A simple implementation of `setTimeout` and `setInterval` for Roblox TypeScript.

&nbsp;

### 📦 Installation

This package is available for Roblox TypeScript on NPM:

```console
$ npm install @rbxts/set-timeout
```

```console
$ pnpm add @rbxts/set-timeout
```

&nbsp;

### 📚 Usage

#### `setTimeout(callback, time)`

```ts
const cleanup = setTimeout(() => {
	print("Hello, world!");
}, 1);

cleanup();
```

#### `setInterval(callback, time)`

```ts
const cleanup = setInterval(() => {
	print("Hello, world!");
}, 1);

cleanup();
```

#### `setCountdown(callback, time, interval)`

```ts
const promise = setCountdown((secondsLeft) => {
	print(secondsLeft);
}, 3);

promise.then(() => {
	print("Done!");
});

// 3, 2, 1, Done!
```

#### `throttle(callback, time, options)`

Creates a throttled function that only invokes `callback` at most once per every `wait` seconds.

```ts
const throttled = throttle((value: number) => {
	print(`Throttled: ${value}`);
}, 1);

for (const index of $range(0, 10)) {
	throttled(index);
	task.wait(0.25);
}

// Throttled: 0
// Throttled: 4
// Throttled: 8
```

#### `debounce(callback, time, options)`

Creates a debounced function that delays invoking `callback` until after `wait` seconds have elapsed since the last time the debounced function was invoked.

```ts
const debounced = debounce((value: number) => {
	print(`Debounced: ${value}`);
}, 1);

for (const index of $range(0, 10)) {
	debounced(index);
	task.wait(0.25);
}

task.wait(2);
debounced(11);

// Debounced: 10
// Debounced: 11
```

&nbsp;

## 📝 License

set-timeout is licensed under the [MIT License](LICENSE.md).
