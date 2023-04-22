/// <reference types="@rbxts/testez/globals" />

import { debounce } from "./debounce";

export = () => {
	it("should debounce a function", () => {
		let callCount = 0;

		const debounced = debounce((value: string) => {
			callCount += 1;
			return value;
		}, 0.03);

		const resultsA = [debounced("a"), debounced("b"), debounced("c")];

		expect(resultsA[0]).to.equal(undefined);
		expect(resultsA[1]).to.equal(undefined);
		expect(resultsA[2]).to.equal(undefined);
		expect(callCount).to.equal(0);

		task.wait(0.05);
		expect(callCount).to.equal(1);

		const resultsB = [debounced("d"), debounced("e"), debounced("f")];
		expect(resultsB[0]).to.equal("c");
		expect(resultsB[1]).to.equal("c");
		expect(resultsB[2]).to.equal("c");
		expect(callCount).to.equal(1);

		task.wait(0.05);
		expect(callCount).to.equal(2);
	});

	it("subsequent debounced calls return the last `func` result", () => {
		const debounced = debounce((x: number) => x, 0.03);
		debounced(1);

		task.wait(0.05);
		expect(debounced(2)).to.equal(1);

		task.wait(0.05);
		expect(debounced(3)).to.equal(2);
	});

	it("should not immediately call `func` when `wait` is `0`", () => {
		let callCount = 0;
		const debounced = debounce(() => callCount++, 0);

		debounced();
		debounced();
		debounced();
		expect(callCount).to.equal(0);

		task.wait();
		expect(callCount).to.equal(1);
	});

	it("should apply default options", () => {
		let callCount = 0;
		const debounced = debounce(() => callCount++, 0.03, {});

		debounced();
		expect(callCount).to.equal(0);

		task.wait(0.05);
		expect(callCount).to.equal(1);
	});

	it("should support a `leading` option", () => {
		const callCounts = [0, 0];

		const withLeading = debounce(() => callCounts[0]++, 0.03, { leading: true, trailing: false });
		const withLeadingAndTrailing = debounce(() => callCounts[1]++, 0.03, { leading: true });

		withLeading();
		expect(callCounts[0]).to.equal(1);

		withLeadingAndTrailing();
		withLeadingAndTrailing();
		expect(callCounts[1]).to.equal(1);

		task.wait(0.05);
		expect(callCounts[0]).to.equal(1);
		expect(callCounts[1]).to.equal(2);

		withLeading();
		expect(callCounts[0]).to.equal(2);
	});

	it("subsequent leading debounced calls return the last `func` result", () => {
		const debounced = debounce((x: number) => x, 0.03, { leading: true, trailing: false });
		const resultsA = [debounced(1), debounced(2)];

		expect(resultsA[0]).to.equal(1);
		expect(resultsA[1]).to.equal(1);

		task.wait(0.05);
		const resultsB = [debounced(3), debounced(4)];
		expect(resultsB[0]).to.equal(3);
		expect(resultsB[1]).to.equal(3);
	});

	it("should support a `trailing` option", () => {
		let withCount = 0;
		let withoutCount = 0;

		const withTrailing = debounce(() => withCount++, 0.03, { trailing: true });
		const withoutTrailing = debounce(() => withoutCount++, 0.03, { trailing: false });

		withTrailing();
		expect(withCount).to.equal(0);

		withoutTrailing();
		expect(withoutCount).to.equal(0);

		task.wait(0.05);
		expect(withCount).to.equal(1);
		expect(withoutCount).to.equal(0);
	});

	it("should support a `maxWait` option", () => {
		let callCount = 0;
		const debounced = debounce(() => callCount++, 0.03, { maxWait: 0.06 });

		debounced();
		debounced();
		expect(callCount).to.equal(0);

		task.wait(0.14);
		expect(callCount).to.equal(1);

		debounced();
		debounced();
		expect(callCount).to.equal(1);

		task.wait(0.14);
		expect(callCount).to.equal(2);
	});

	it("should support `maxWait` in a tight loop", () => {
		const limit = 0.2;
		let withCount = 0;
		let withoutCount = 0;

		const withMaxWait = debounce(() => withCount++, 0.03, { maxWait: 0.06 });
		const withoutMaxWait = debounce(() => withoutCount++, 0.03);

		const start = os.clock();
		while (os.clock() - start < limit) {
			withMaxWait();
			withoutMaxWait();
			task.wait();
		}

		expect(withoutCount).to.equal(0);
		expect(withCount > 1).to.equal(true);
	});

	it("should queue a trailing call for subsequent debounced calls after `maxWait`", () => {
		let callCount = 0;
		const debounced = debounce(() => callCount++, 0.03, { maxWait: 0.03 });

		debounced();

		task.wait(0.03 - 0.01); // 0.02 seconds
		debounced();
		task.wait(0.01); // 0.03 seconds
		debounced();
		task.wait(0.01); // 0.04 seconds
		debounced();

		task.wait(0.05);
		expect(callCount).to.equal(2);
	});

	it("should cancel `maxDelayed` when `delayed` is invoked", () => {
		let callCount = 0;
		const debounced = debounce(() => callCount++, 0.03, { maxWait: 0.06 });

		debounced();

		task.wait(0.13);
		debounced();
		expect(callCount).to.equal(1);

		task.wait(0.05);
		expect(callCount).to.equal(2);
	});
};
