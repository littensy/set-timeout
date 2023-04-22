/// <reference types="@rbxts/testez/globals" />

import { setInterval } from "./set-interval";

export = () => {
	it("should call the callback every interval", () => {
		let count = 0;
		setInterval(() => {
			count += 1;
		}, 0.03);
		expect(count).to.equal(0);
		task.wait(0.03 * 3 + 0.01);
		expect(count).to.equal(3);
	});

	it("should not call the callback if the timer is stopped", () => {
		let count = 0;
		const stop = setInterval(() => {
			count += 1;
		}, 0.03);
		expect(count).to.equal(0);
		stop();
		task.wait(0.03 * 3 + 0.01);
		expect(count).to.equal(0);
	});
};
