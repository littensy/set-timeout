/// <reference types="@rbxts/testez/globals" />

import { setCountdown, setInterval, setTimeout } from "./";

export = () => {
	describe("setInterval", () => {
		it("should call the callback every interval", () => {
			let count = 0;
			setInterval(() => {
				count += 1;
			}, 0.1);
			expect(count).to.equal(0);
			task.wait(0.35);
			expect(count).to.equal(3);
		});
	});

	describe("setTimeout", () => {
		it("should call the callback after the timeout", () => {
			let count = 0;
			setTimeout(() => {
				count += 1;
			}, 0.1);
			expect(count).to.equal(0);
			task.wait(0.15);
			expect(count).to.equal(1);
		});
	});

	describe("setCountdown", () => {
		it("should call the callback every second", () => {
			let count = 3;
			const promise = setCountdown((countdown) => {
				count -= 1;
				expect(countdown).to.equal(count);
			}, 2);
			promise.expect();
			expect(promise.getStatus()).to.equal(Promise.Status.Resolved);
			expect(count).to.equal(1);
		});
	});
};
