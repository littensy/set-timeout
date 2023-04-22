/// <reference types="@rbxts/testez/globals" />

import { setTimeout } from "./set-timeout";

export = () => {
	it("should call the callback after the timeout", () => {
		let count = 0;
		setTimeout(() => {
			count += 1;
		}, 0.03);
		expect(count).to.equal(0);
		task.wait(0.04);
		expect(count).to.equal(1);
	});

	it("should not call the callback if the timer is stopped", () => {
		let count = 0;
		const stop = setTimeout(() => {
			count += 1;
		}, 0.03);
		expect(count).to.equal(0);
		stop();
		task.wait(0.09);
		expect(count).to.equal(0);
	});
};
