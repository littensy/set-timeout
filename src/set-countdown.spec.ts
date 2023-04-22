/// <reference types="@rbxts/testez/globals" />

import { setCountdown } from "./set-countdown";

export = () => {
	it("should call the callback every second", () => {
		let count = 3;
		const promise = setCountdown(
			(countdown) => {
				count -= 1;
				expect(countdown).to.equal(count);
			},
			2,
			0.1,
		);
		promise.expect();
		expect(promise.getStatus()).to.equal(Promise.Status.Resolved);
		expect(count).to.equal(1);
	});

	it("should stop the countdown when the promise is cancelled", () => {
		let count = -1;
		const promise = setCountdown((countdown) => (count = countdown), 2, 0.1);
		task.wait(0.15);
		promise.cancel();
		expect(promise.getStatus()).to.equal(Promise.Status.Cancelled);
		task.wait(0.15);
		expect(count).to.equal(1);
	});
};
