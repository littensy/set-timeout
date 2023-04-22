/// <reference types="@rbxts/testez/globals" />

import { throttle } from "./throttle";

export = () => {
	it("should throttle a function", () => {
		let callCount = 0;
		const throttled = throttle(() => callCount++, 0.03);

		throttled();
		throttled();
		throttled();

		const lastCount = callCount;
		expect(callCount).to.equal(1);

		task.wait(0.04);
		expect(callCount > lastCount).to.equal(true);
	});

	it("subsequent calls should return the result of the first call", () => {
		const throttled = throttle((x: string) => x, 0.03);
		const results = [throttled("a"), throttled("b")];

		expect(results[0]).to.equal("a");
		expect(results[1]).to.equal("a");

		task.wait(0.04);
		const results2 = [throttled("c"), throttled("d")];

		expect(results2[0]).to.equal("c");
		expect(results2[1]).to.equal("c");
	});

	it("should not trigger a trailing call when invoked once", () => {
		let callCount = 0;
		const throttled = throttle(() => callCount++, 0.03);

		throttled();
		expect(callCount).to.equal(1);

		task.wait(0.04);
		expect(callCount).to.equal(1);
	});

	for (const index of $range(0, 1)) {
		it("should trigger a call when invoked repeatedly" + (index === 1 ? " and `leading` is `false`" : ""), () => {
			let callCount = 0;
			const limit = 0.1;
			const options = index === 1 ? { leading: false } : {};
			const throttled = throttle(() => callCount++, 0.03, options);

			const start = os.clock();
			while (os.clock() - start < limit) {
				throttled();
				task.wait();
			}

			expect(callCount > 1).to.equal(true);
		});
	}

	it("should trigger a second throttled call as soon as possible", () => {
		let callCount = 0;
		const throttled = throttle(() => callCount++, 0.05, { leading: false });

		throttled();

		task.wait(0.07);
		expect(callCount).to.equal(1);
		throttled();

		task.wait(0.03);
		expect(callCount).to.equal(1);

		task.wait(0.05);
		expect(callCount).to.equal(2);
	});

	it("should apply default options", () => {
		let callCount = 0;
		const throttled = throttle(() => callCount++, 0.03, {});

		throttled();
		throttled();
		expect(callCount).to.equal(1);

		task.wait(0.04);
		expect(callCount).to.equal(2);
	});

	it("should support a `leading` option", () => {
		const withLeading = throttle((x: string) => x, 0.03, { leading: true });
		expect(withLeading("a")).to.equal("a");

		const withoutLeading = throttle((x: string) => x, 0.03, { leading: false });
		expect(withoutLeading("a")).to.equal(undefined);
	});

	it("should support a `trailing` option", () => {
		let withCount = 0;
		let withoutCount = 0;

		const withTrailing = throttle(
			(value) => {
				withCount++;
				return value;
			},
			0.03,
			{ trailing: true },
		);

		const withoutTrailing = throttle(
			(value) => {
				withoutCount++;
				return value;
			},
			0.03,
			{ trailing: false },
		);

		expect(withTrailing("a")).to.equal("a");
		expect(withTrailing("b")).to.equal("a");

		expect(withoutTrailing("a")).to.equal("a");
		expect(withoutTrailing("b")).to.equal("a");

		task.wait(0.04);
		expect(withCount).to.equal(2);
		expect(withoutCount).to.equal(1);
	});

	it("should not update `lastCalled`, at the end of the timeout, when `trailing` is `false`", () => {
		let callCount = 0;
		const throttled = throttle(() => callCount++, 0.03, { trailing: false });

		throttled();
		throttled();

		task.wait(0.05);
		throttled();
		throttled();

		task.wait(0.1);
		expect(callCount > 1).to.equal(true);
	});
};
