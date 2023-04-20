## ⏱️ [set-timeout](https://npmjs.com/package/@rbxts/set-timeout)

![GitHub Workflow Status](https://img.shields.io/github/actions/workflow/status/littensy/set-timeout/ci.yml?branch=master&style=for-the-badge&logo=github)
[![npm version](https://img.shields.io/npm/v/@rbxts/set-timeout.svg?style=for-the-badge&logo=npm)](https://www.npmjs.com/package/@rbxts/set-timeout)
[![npm downloads](https://img.shields.io/npm/dt/@rbxts/set-timeout.svg?style=for-the-badge&logo=npm)](https://www.npmjs.com/package/@rbxts/set-timeout)
[![GitHub license](https://img.shields.io/github/license/littensy/set-timeout?style=for-the-badge)](LICENSE.md)

A simple implementation of `setTimeout` and `setInterval` for Roblox TypeScript.

&nbsp;

## 📦 Installation

This package is available for Roblox TypeScript on NPM:

```console
$ npm install @rbxts/set-timeout
```

```console
$ pnpm add @rbxts/set-timeout
```

&nbsp;

## 📚 Usage

```ts
const cleanup = setTimeout(() => {
	print("Hello, world!");
}, 1);

cleanup();
```

```ts
const cleanup = setInterval(() => {
	print("Hello, world!");
}, 1);

cleanup();
```

```ts
const promise = setCountdown((secondsLeft) => {
	print(secondsLeft);
}, 3);

promise.then(() => {
	print("Done!");
});

// 3, 2, 1, Done!
```

&nbsp;

## 📝 License

set-timeout is licensed under the [MIT License](LICENSE.md).
