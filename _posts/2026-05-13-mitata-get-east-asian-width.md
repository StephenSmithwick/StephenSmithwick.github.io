---
layout: post
title: How Benchmarking Saved Me From My Own "Optimizations"
categories: performance
published: true
# last_edit:
---

[//]: # "npm"
[npm-string-width]: https://www.npmjs.com/package/string-width
[npm-get-east-asian-width]: https://www.npmjs.com/package/get-east-asian-width
[npm-mitata]: https://www.npmjs.com/package/mitata

I've been working on an React/Ink based application and need to adjust the content size reactively:

Wide
: ![Agentia Screenshot Wide Format](/post_images/Agentia-Wide.png){: width="508px" }

Normal 
: ![Agentia Screenshot Normal Format](/post_images/Agentia-Normal.png){: width="245px" }

Narrow
: ![Agentia Screenshot Narrow Format](/post_images/Agentia-Narrow.png){: width="221px" }

Ink uses [string-width][npm-string-width] to understand what the expected width of each character will be in order to estimate the width a string will take up.  The library uses another library: [get-east-asian-width][npm-get-east-asian-width] (`eastAsianWidth(codePoints[i])`) to determine the expected relative size of all unicode characters. It is calculated by generating the documented expected character size found in the : [EastAsianWidth.txt](https://www.unicode.org/Public/UCD/latest/ucd/EastAsianWidth.txt) file from the unicode spec. When I investigated the library I was surprised to see the library used a simple binary search, which is normally not the most effecient approach, over the generated lookup arrays.
  
`get-east-asian-width` `utilities.js`
{:.code-title}
```javascript
/**
Binary search on a sorted flat array of [start, end] pairs.

@param {number[]} ranges - Flat array of inclusive [start, end] range pairs, e.g. [0, 5, 10, 20].
@param {number} codePoint - The value to search for.
@returns {boolean} Whether the value falls within any of the ranges.
*/
export const isInRange = (ranges, codePoint) => {
  let low = 0;
  let high = Math.floor(ranges.length / 2) - 1;
  while (low <= high) {
    const mid = Math.floor((low + high) / 2);
    const i = mid * 2;
    if (codePoint < ranges[i]) {
      high = mid - 1;
    } else if (codePoint > ranges[i + 1]) {
      low = mid + 1;
    } else {
      return true;
    }
  }

  return false;
};
```

# Comparing Algorithms
I decided that it would be relatively simple to implement a more efficient lookup and got started comparing options:

## binarySearch
This is the current libraries implementation modified minimally to take an range array and return a function that will perform a codepoint lookup against the array.  The original function took the range array as well as the codepoint so this was an extremely simple change which makes it handy to swap between the other implementations.

```javascript
export function binarySearch(flatRanges) {
	return (codePoint) => {
		let low = 0;
		let high = Math.floor(flatRanges.length / 2) - 1;
		while (low <= high) {
			const mid = Math.floor((low + high) / 2);
			const i = mid * 2;
			if (codePoint < flatRanges[i]) {
				high = mid - 1;
			} else if (codePoint > flatRanges[i + 1]) {
				low = mid + 1;
			} else {
				return true;
			}
		}

		return false;
	};
}
```

## trieSearch
A trie is a special type of search tree with each branch representing the prefix of the search key.  This implementation uses a flat trie tree with any ranges that contain more than 1 prefix appearing under both branches.

```javascript
const key = (codePoint) => (codePoint >>> 8) & 0xff;
export function trieSearch(flatRanges) {
	const map = new Map();
	function addRange(key, range) {
		const ranges = map.get(key) ?? map.set(key, []).get(key);
		ranges.push(range);
	}

	const min = Math.min(...flatRanges);
	const max = Math.max(...flatRanges);

	for (let i = 0; i < flatRanges.length; i += 2) {
		const range = [flatRanges[i], flatRanges[i + 1]];
		const keyStart = key(range[0]);
		const keyEnd = key(range[1]);
		for (let k = keyStart; k <= keyEnd; k++) {
			addRange(k, range);
		}
	}

	return (codePoint) => {
		if (codePoint < min || codePoint > max) {
			return false;
		}

		return (
			map
				.get(key(codePoint))
				?.find(([low, high]) => codePoint >= low && codePoint <= high) !==
			undefined
		);
	};
}
```

This flat trie tree is not optimal for branches with a large number of nodes.  The histogram below is a visual representation of the number of ranges that fit into each branch of the trie tree for characters which are wide.

{% include posts/trie-tree.html %}

An easy optimization would be to increase the depth of branches where we have a heavy concentration of ranges and limit the node count to less than 7.  I have not chosen to pursue this further because of the performance metrics of the entire library suggest that the lookup is not the bottle-neck (see [benchmarking library entrypoints](#benchmarking-the-library-entrypoints)).

## setSearch
This is a simple solution that uses the native javascript set and adds all of the codePoints within the ranges to the set.  This allows us to use `set.has` to determine if the codepoint exists in the set.

```javascript
export function setSearch(flatRanges) {
	const set = new Set();
	for (let i = 0; i < flatRanges.length; i += 2) {
		const from = flatRanges[i];
		const to = flatRanges[i + 1];
		for (let j = from; j <= to; j++) {
			set.add(j);
		}
	}

	return (codePoint) => set.has(codePoint);
}
```

## bitflagSearch
This lookup represents the Set in a Uint32Array with each bit representing a value in the codepoint.  The array has a bit for all codepoints between 0 and the last and max value for the collection of codepoints in the range.

```javascript
export function bitflagSearch(flatRanges) {
	const max_range = flatRanges.at(-1);
	const flags = new Uint32Array((max_range >>> 5) + 1);

	for (let i = 0, length = flatRanges.length; i < length; i += 2) {
		const from = flatRanges[i];
		const to = flatRanges[i + 1];
		for (let j = from; j <= to; j++) {
			flags[j >>> 5] |= 1 << (j & 31);
		}
	}

	return (codePoint) =>
		((flags[codePoint >>> 5] >>> (codePoint & 31)) & 1) === 1;
}
```

## offsetBitflagSearch
An offset bitflag search uses a small memory optimization of the bitflagSearch which by eliminating empty Uint32 values from the start of the Array.

We achieve this by starting the Uint32Array at the smallest bucket (WORD) which contains a bit that corresponds to a an active codepoint and storing its offset from 0.

```javascript
const WORD = 0xff_ff_ff_ff;
export function offsetBitflagSearch(flatRanges) {
	const [min, max] = [flatRanges.at(0), flatRanges.at(-1)];
	const [firstWord, lastWord] = [min >>> 5, (max >>> 5) + 1];
	const flags = new Uint32Array(lastWord - firstWord);
	const offset = firstWord << 5;

	for (let i = 0, length = flatRanges.length; i < length; i += 2) {
		const from = flatRanges[i] - offset;
		const to = flatRanges[i + 1] - offset;
		const fromWord = from >>> 5;
		const toWord = to >>> 5;

		if (fromWord === toWord) {
			flags[fromWord] |= (WORD << (from & 31)) & (WORD >>> (31 - (to & 31)));
		} else {
			flags[fromWord] |= WORD << (from & 31);
			flags.fill(WORD, fromWord + 1, toWord);
			flags[toWord] |= WORD >>> (31 - (to & 31));
		}
	}

	return (codePoint) => {
		if (codePoint < min || codePoint > max) {
			return false;
		}

		return ((flags[(codePoint - offset) >>> 5] >>> (codePoint & 31)) & 1) !== 0;
	};
}
```
## Testing the Algorithms
In order to confirm the algorithms maintain behavior and do not introduce any regressions I ran the following test:

```javascript
import test from "ava";
import {
	bitflagSearch,
	biSearch,
	offsetBitflagSearch,
	setSearch,
	trieSearch,
} from "./lookup.js";
import {
	ambiguousRanges,
	fullwidthRanges,
	halfwidthRanges,
	narrowRanges,
	wideRanges,
} from "./lookup-data.js";

const ranges = Object.entries({
	ambiguousRanges,
	fullwidthRanges,
	halfwidthRanges,
	narrowRanges,
	wideRanges,
});
const lookups = Object.entries({
	bitflagSearch,
	offsetBitflagSearch,
	setSearch,
	trieSearch,
});

const max_range = Math.max(
	ambiguousRanges.at(-1),
	fullwidthRanges.at(-1),
	halfwidthRanges.at(-1),
	narrowRanges.at(-1),
	wideRanges.at(-1),
);
for (let [rangeName, range] of ranges) {
	const binarySearch = biSearch(range);
	for (let [lookupName, lookup] of lookups) {
		test(`${lookupName}(${rangeName}) matches binarySearch(${rangeName})`, (t) => {
			const lookupDiff = [];
			const search = lookup(range);

			for (let codePoint = 0; codePoint <= max_range + 1; codePoint++) {
				if (search(codePoint) !== binarySearch(codePoint)) {
					lookupDiff.push(
						`Expected ${lookupName}(${codePoint}) === ${binarySearch(codePoint)}`,
					);
				}
			}

			t.deepEqual(lookupDiff, [], "Expect no difference in lookup values");
		});
	}
}
```

## Memory Usage of the Algorithms
Array size of Uint32 used for each range: 

Range | offsetBitflagSearch | bitflagSearch
-|-|-
ambiguousRanges | 34811 | 34816
fullwidthRanges | 1664 | 2048
halfwidthRanges | 1787 | 2048
narrowRanges | 332 | 333
wideRanges | 8056 | 8192


## Benchmarking the Algorithms
In order to compare the performance of algorithms I set up a test benchmark with interchangable search algorithms:

`lookup-benchmark.js`
{:.code-title}
```javascript
import { run, bench, summary } from "mitata";
import {
	bitflagSearch,
	binarySearch,
	offsetBitflagSearch,
	setSearch,
	trieSearch,
} from "./lookup.js";
import { ambiguousRanges } from "./lookup-data.js";

const searches = Object.entries({
	binarySearch,
	bitflagSearch,
	offsetBitflagSearch,
	setSearch,
	trieSearch,
});

const max_range = ambiguousRanges.at(-1);

summary(() => {
	for (const [searchName, searchFunction] of searches) {
		bench(`${searchName}`, function* () {
			const lookup = searchFunction(ambiguousRanges);

			yield () => {
				let checksum = 0;
				for (let cp = 0; cp <= max_range; cp++) {
					checksum ^= lookup(cp);
				}
				return checksum;
			};
		});
	}
});

await run();
```

Notice the checksum above.  This is an important feature of the benchmark which I will discuss below in potential pitfalls.

The results are here:
```
% npm run lookup-benchmark

> get-east-asian-width@1.5.0 lookup-benchmark
> node --expose-gc lookup-benchmark.js

clk: ~4.39 GHz
cpu: Apple M4
runtime: node 25.7.0 (arm64-darwin)

benchmark                   avg (min … max) p75 / p99    (min … top 1%)
------------------------------------------- -------------------------------
binarySearch                  28.31 ms/iter  28.33 ms  █
                      (28.23 ms … 28.63 ms)  28.42 ms  ██ █   █ █    █
                    (632.00  b …  27.51 kb)   2.04 kb █████████▁█▁█▁▁█▁▁▁▁█

bitflagSearch                  3.66 ms/iter   3.69 ms    █
                        (3.48 ms … 4.34 ms)   4.23 ms    █▂
                    (736.00  b …   6.81 kb) 768.33  b ▂▂███▇▅▃▄▂▁▂▂▂▁▁▂▁▁▁▁

offsetBitflagSearch            3.65 ms/iter   3.65 ms      █
                        (3.49 ms … 4.25 ms)   4.11 ms      █
                    (448.00  b …   8.72 kb) 577.84  b ▂▁▁▄▇█▃▂▂▁▁▁▁▁▁▁▁▁▁▁▁

setSearch                     19.32 ms/iter  19.88 ms                    █▃
                      (18.58 ms … 19.96 ms)  19.94 ms    ▂▂▇▇▂   ▂       ██
                    (448.00  b …   6.53 kb) 616.65  b ▆▆▆█████▆▁▁█▆▆▆▆▁▆▁██

trieSearch                     9.64 ms/iter   9.72 ms            █
                       (9.27 ms … 10.08 ms)  10.08 ms      ▆▃    █    ▅
                    (448.00  b …   6.53 kb) 532.32  b ▄▃██▃████▃▆█▃▁▃██▁▃▃▃

summary
  offsetBitflagSearch
   1x faster than bitflagSearch
   2.64x faster than trieSearch
   5.29x faster than setSearch
   7.75x faster than binarySearch
```

# Benchmarking the library entrypoints

There are some clear winners when comparing the algorithms in this way but how much faster will the library in common use?  In order to answer that question I developed the following performance test:

**benchmark.js**
{:.code-title}
```javascript
import { run, bench, summary } from "mitata";
import { eastAsianWidth } from "./index.js";
import { load, binarySearch, bitflagSearch } from "./lookup.js";

const corpora = Object.entries({
	en: "Software engineering is the systematic application of engineering approaches to the development of software. It encompasses a wide range of disciplines, from requirement analysis and system design to implementation, testing, and maintenance. High-performance computing requires careful optimization of data structures, algorithms, and memory management to ensure efficient execution at scale. The quick brown fox jumps over the lazy dog repeatedly while developers analyze the underlying bytecode.",
	zh: "软件工程是将工程学的方法系统地应用于软件开发的过程。它涵盖了从需求分析、系统设计到代码实现、测试和维护的广泛领域。在高性能计算环境中，必须仔细优化数据结构、算法和内存管理，以确保在大规模运行时的执行效率。东亚字符的宽度处理在终端模拟器、文本编辑器和命令行界面中尤为关键，因为全角和半角字符在屏幕上占据的空间不同。你好，这是一个包含多种字符的测试文本。",
	es: "La ingeniería de software es la aplicación sistemática de enfoques de ingeniería para el desarrollo de software. Abarca una amplia gama de disciplinas, desde el análisis de requisitos y el diseño del sistema hasta la implementación, las pruebas y el mantenimiento. La informática de alto rendimiento requiere una cuidadosa optimización de las estructuras de datos, los algoritmos y la gestión de la memoria para garantizar una ejecución eficiente a gran escala. El pingüino vivió en el ártico; mañana será un gran día para programar.",
	emoji:
		"🚀🌟👩‍💻🏳️‍🌈🔥✨🎉🎈🍕🍔🍣🚗✈️🌍🌙☀️😎🤔😂😭❤️👍🙌🙏💪🏃‍♀️🚶‍♂️🐶🐱🐼🐒🌸🌺🌲🌵⚡️💧🌪️📱💻⌚️🕹️💡📚✂️📍👨‍👩‍👧‍👦🤦🏽‍♀️🇺🇳🥷🏿🧟‍♂️🧙‍♀️🧚‍♂️🧜‍♀️🧛‍♂️",
	mixed:
		"Agent v2.0 🚀: 欢迎使用 (Welcome to) the terminal framework. Loading configuration... [100%] ✅. 用户配置已加载。Warning: 内存使用率 (Memory usage) exceeds 80% ⚠️. Proceeding with optimization ártico.",
});
const algorithms = Object.entries({ binarySearch, bitflagSearch });

for (const [language, initialText] of corpora) {
	summary(() => {
		for (const [lookupName, lookup] of algorithms) {
			bench(`${lookupName}::${language}`, function* (state) {
				const size = state.get("size");
				const codePoints = [...text.repeat(size)].map((c) => c.codePointAt(0));
				load(lookup);

				yield () => {
					return codePoints.reduce((sum, cp) => sum + eastAsianWidth(cp));
				};
			}).range("size", 256, 1024);
		}
	});
}

await run();
```

We must ensure the results of library are returned in the yield block so that V8 wont optimize out unused work.

This benchmark shows that, in normal usage, the lookup algorithm is not a bottleneck and has a negligible effect on the performance of the library.

```
% npm run benchmark

> get-east-asian-width@1.5.0 benchmark
> node --expose-gc benchmark.js

clk: ~4.40 GHz
cpu: Apple M4
runtime: node 25.7.0 (arm64-darwin)

benchmark                   avg (min … max) p75 / p99    (min … top 1%)
------------------------------------------- -------------------------------
binarySearch::en             656.08 µs/iter 660.75 µs              █▃
                    (601.54 µs … 701.79 µs) 680.71 µs             ▄██▄
                    (504.00  b …   2.09 mb)   2.57 kb ▁▁▁▁▁▁▁▁▁▁▂▃█████▄▂▂▁

binarySearch::en               2.64 ms/iter   2.66 ms       ▇▃ ▅█
                        (2.55 ms … 2.80 ms)   2.75 ms      ▅██▂██▇▃
                    (504.00  b …   2.48 mb)   9.97 kb ▂▂▂▄▅█████████▄▄▅▄▁▂▂

bitflagSearch::en            654.03 µs/iter 657.96 µs             █
                    (604.92 µs … 702.04 µs) 681.67 µs             ██▆
                    (504.00  b …   2.31 mb)   2.68 kb ▁▁▁▁▁▁▁▂▁▂▃▇███▆▃▂▂▁▁

bitflagSearch::en              2.64 ms/iter   2.66 ms         ▃▇█
                        (2.56 ms … 2.83 ms)   2.71 ms         ███▄█ ▂
                    (504.00  b …   2.39 mb)   9.67 kb ▂▂▃▃▂▃▃▄███████▅▆█▄▃▂

summary
  binarySearch::en
   1…1x faster than bitflagSearch::en

------------------------------------------- -------------------------------
binarySearch::zh             451.21 µs/iter 456.67 µs            ▆▄█▂
                    (408.88 µs … 493.58 µs) 475.04 µs            ████▃
                    (504.00  b …   1.73 mb)   1.62 kb ▂▂▂▂▁▂▂▃▂▇▆██████▆▆▃▂

binarySearch::zh               1.80 ms/iter   1.82 ms               █
                        (1.69 ms … 1.87 ms)   1.86 ms             ▇▄██▄
                    (504.00  b …   1.56 mb)   4.54 kb ▂▂▂▂▂▃▂▃▅▄▇██████▇▄▄▂

bitflagSearch::zh            453.90 µs/iter 459.58 µs              █
                    (409.21 µs … 628.54 µs) 478.92 µs            ▆▆█▂
                    (504.00  b …   1.65 mb)   1.76 kb ▂▂▁▁▁▁▂▂▂▄▇█████▇▅▄▃▂

bitflagSearch::zh              1.81 ms/iter   1.83 ms             ███▂
                        (1.69 ms … 1.88 ms)   1.87 ms            ▇████▇
                    (504.00  b …   1.52 mb)   4.48 kb ▂▁▂▂▃▁▂▃▄▅▄████████▆▃

summary
  binarySearch::zh
   +1.01…+1.01x faster than bitflagSearch::zh

------------------------------------------- -------------------------------
binarySearch::es             729.43 µs/iter 736.25 µs          █
                    (684.96 µs … 797.29 µs) 765.67 µs         ▂█▇▆▅▃
                    (504.00  b …   2.13 mb)   2.74 kb ▁▁▁▁▁▁▂▄███████▅▄▃▂▂▁

binarySearch::es               2.91 ms/iter   2.93 ms             ▅▆█▆
                        (2.80 ms … 2.99 ms)   2.97 ms           ▅█████▇
                    (504.00  b …   1.96 mb)   8.75 kb ▃▁▂▂▄▁▃▂▄▄█████████▃▄

bitflagSearch::es            729.47 µs/iter 736.21 µs           ▆█
                    (680.67 µs … 833.13 µs) 760.75 µs           ███▄ ▃
                    (504.00  b …   2.27 mb)   3.27 kb ▁▁▁▁▁▁▂▃▄▅██████▇▄▃▂▂

bitflagSearch::es              2.91 ms/iter   2.93 ms          █▃
                        (2.82 ms … 3.07 ms)   2.99 ms         ▇██▆▂▇▂
                    (504.00  b …   1.76 mb)   7.91 kb ▂▂▂▂▂▄▅████████▃▂▅▂▂▂

summary
  bitflagSearch::es
   1…1x faster than binarySearch::es

------------------------------------------- -------------------------------
binarySearch::emoji          671.55 µs/iter 684.33 µs      ▅▄ ▇█▇▄
                    (632.33 µs … 804.17 µs) 721.96 µs  ▄ ▃████████▅▇▄
                    (120.00  b …   1.19 mb)   2.20 kb ▆██████████████▇▆▅▅▆▃

binarySearch::emoji            2.70 ms/iter   2.75 ms              ▃▃█▆
                        (2.55 ms … 2.82 ms)   2.80 ms         ▅▆█ ▄████▅
                    (120.00  b …   1.21 mb)   4.84 kb ▃▆▃▃█▄▄▄████████████▂

bitflagSearch::emoji         677.12 µs/iter 690.25 µs           ▄█▅
                    (632.71 µs … 826.08 µs) 722.71 µs       ▄▄█▆████▇
                    (120.00  b …   1.16 mb)   1.52 kb ▄█▆▆▇███████████▇▅▄▂▁

bitflagSearch::emoji           2.74 ms/iter   2.78 ms         ▃█▂
                        (2.56 ms … 2.97 ms)   2.94 ms       ▅▃███▅▅
                    (120.00  b …   1.15 mb)   4.67 kb ▃▂▃▄▆▆███████▇▇▄▂▃▃▁▃

summary
  binarySearch::emoji
   +1.01…+1.01x faster than bitflagSearch::emoji

------------------------------------------- -------------------------------
binarySearch::mixed          308.42 µs/iter 313.08 µs           █▃▂
                    (272.42 µs … 468.42 µs) 336.04 µs          ▅███▄
                    (120.00  b …   2.48 mb) 230.04 kb ▁▁▂▂▂▂▅▄▄██████▆▅▃▂▂▁

binarySearch::mixed            1.23 ms/iter   1.24 ms            █▇█
                        (1.15 ms … 1.30 ms)   1.28 ms         ▂▇▇████▆▇
                    (120.00  b …   1.65 mb)   3.06 kb ▂▁▂▂▁▃▃▆█████████▇▄▃▂

bitflagSearch::mixed         308.65 µs/iter 313.37 µs           ▂█
                    (275.29 µs … 412.12 µs) 334.42 µs          ▃███▃
                    (120.00  b …   2.48 mb) 229.96 kb ▁▁▂▁▂▄▄▅▆██████▇▅▃▂▂▁

bitflagSearch::mixed           1.24 ms/iter   1.25 ms          ▆▃█
                        (1.17 ms … 1.30 ms)   1.29 ms         ▅██████▃
                    (120.00  b …   1.78 mb)   3.31 kb ▂▂▂▂▄▄▆█████████▇▇▄▂▁

summary
  binarySearch::mixed
   +1.01…1x faster than bitflagSearch::mixed
```


## Conclusions

It pays to verify your assumptions when trying to optimize an algorithm. I initially assumed that replacing the binary search with a more effecient algorithm would result in better performance. But as the benchmarks showed, theoretical efficiency doesn't always beat practical simplicity. I’m glad I took the time to measure the actual impact before going ahead with a more complex solution.
