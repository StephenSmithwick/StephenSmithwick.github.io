---
layout: post
title:  "LeetCode - Algorithms"
categories: leetcode
---
## How to use

<details markdown="block">
<summary>Instructions to decorated list using Greasemonkey</summary>

Install this Greasmonkey script to decorate the lists below: [**blog.leetcode.user.js**](https://github.com/StephenSmithwick/StephenSmithwick.github.io/raw/main/greasemonkey/blog.leetcode.user.js)

The Greasemonkey script will ask to access a leetcode url to fetch the logged in users' problems data. Please make sure you are logged in here: [LeetCode login](https://leetcode.com/accounts/login).
{:.information}
LeetCode Problem Dataset: [https://leetcode.com/api/problems/algorithms/](https://leetcode.com/api/problems/algorithms/)

To build more lists of `problem` `slugs`: use this javascript page query in the developer console anywhere you find links to leetcode problems:
```javascript
[...document.querySelectorAll('a')]
    .map(       li => li.href.match(/\/problems\/([^\/]+)\//))
    .filter(    match => match)
    .map(       match => match[1])
```
</details>

## Algorithms I

{:.leetcode}
- binary-search
- first-bad-version
- search-insert-position
- squares-of-a-sorted-array
- rotate-array
- move-zeroes
- two-sum-ii-input-array-is-sorted
- reverse-string
- reverse-words-in-a-string-iii
- middle-of-the-linked-list
- remove-nth-node-from-end-of-list
- longest-substring-without-repeating-characters
- permutation-in-string
- flood-fill
- max-area-of-island
- merge-two-binary-trees
- populating-next-right-pointers-in-each-node
- 01-matrix
- rotting-oranges
- merge-two-sorted-lists
- reverse-linked-list
- combinations
- permutations
- letter-case-permutation
- climbing-stairs
- house-robber
- triangle
- power-of-two
- number-of-1-bits
- reverse-bits
- single-number

## Algorithms II

{:.leetcode}
- find-first-and-last-position-of-element-in-sorted-array
- search-in-rotated-sorted-array
- search-a-2d-matrix
- find-minimum-in-rotated-sorted-array
- find-peak-element
- remove-duplicates-from-sorted-list-ii
- 3sum
- backspace-string-compare
- interval-list-intersections
- container-with-most-water
- find-all-anagrams-in-a-string
- subarray-product-less-than-k
- minimum-size-subarray-sum
- number-of-islands
- number-of-provinces
- populating-next-right-pointers-in-each-node-ii
- subtree-of-another-tree
- shortest-path-in-binary-matrix
- surrounded-regions
- all-paths-from-source-to-target
- subsets
- subsets-ii
- permutations-ii
- combination-sum
- combination-sum-ii
- letter-combinations-of-a-phone-number
- generate-parentheses
- word-search
- house-robber-ii
- jump-game
- jump-game-ii
- unique-paths
- longest-palindromic-substring
- arithmetic-slices
- decode-ways
- word-break
- longest-increasing-subsequence
- number-of-longest-increasing-subsequence
- longest-common-subsequence
- delete-operation-for-two-strings
- edit-distance
- coin-change
- integer-break
- bitwise-and-of-numbers-range
- shuffle-an-array
- happy-number
- max-points-on-a-line

## Top 100

{:.leetcode}
 - two-sum
 - add-two-numbers
 - longest-substring-without-repeating-characters
 - median-of-two-sorted-arrays
 - longest-palindromic-substring
 - container-with-most-water
 - roman-to-integer
 - longest-common-prefix
 - 3sum
 - letter-combinations-of-a-phone-number
 - remove-nth-node-from-end-of-list
 - valid-parentheses
 - merge-two-sorted-lists
 - generate-parentheses
 - merge-k-sorted-lists
 - swap-nodes-in-pairs
 - reverse-nodes-in-k-group
 - next-permutation
 - longest-valid-parentheses
 - search-in-rotated-sorted-array
 - find-first-and-last-position-of-element-in-sorted-array
 - search-insert-position
 - combination-sum
 - first-missing-positive
 - trapping-rain-water
 - jump-game-ii
 - permutations
 - rotate-image
 - group-anagrams
 - n-queens
 - maximum-subarray
 - spiral-matrix
 - jump-game
 - merge-intervals
 - unique-paths
 - minimum-path-sum
 - climbing-stairs
 - edit-distance
 - set-matrix-zeroes
 - search-a-2d-matrix
 - sort-colors
 - minimum-window-substring
 - subsets
 - word-search
 - largest-rectangle-in-histogram
 - binary-tree-inorder-traversal
 - validate-binary-search-tree
 - symmetric-tree
 - binary-tree-level-order-traversal
 - maximum-depth-of-binary-tree
 - construct-binary-tree-from-preorder-and-inorder-traversal
 - flatten-binary-tree-to-linked-list
 - pascals-triangle
 - best-time-to-buy-and-sell-stock
 - binary-tree-maximum-path-sum
 - longest-consecutive-sequence
 - palindrome-partitioning
 - single-number
 - copy-list-with-random-pointer
 - word-break
 - linked-list-cycle
 - linked-list-cycle-ii
 - lru-cache
 - sort-list
 - maximum-product-subarray
 - find-minimum-in-rotated-sorted-array
 - min-stack
 - intersection-of-two-linked-lists
 - majority-element
 - rotate-array
 - house-robber
 - binary-tree-right-side-view
 - number-of-islands
 - reverse-linked-list
 - course-schedule
 - implement-trie-prefix-tree
 - kth-largest-element-in-an-array
 - invert-binary-tree
 - kth-smallest-element-in-a-bst
 - palindrome-linked-list
 - lowest-common-ancestor-of-a-binary-tree
 - product-of-array-except-self
 - sliding-window-maximum
 - search-a-2d-matrix-ii
 - move-zeroes
 - find-the-duplicate-number
 - find-median-from-data-stream
 - longest-increasing-subsequence
 - coin-change
 - top-k-frequent-elements
 - decode-string
 - partition-equal-subset-sum
 - find-all-anagrams-in-a-string
 - diameter-of-binary-tree
 - subarray-sum-equals-k
 - permutation-in-string
 - binary-search
 - daily-temperatures
 - rotting-oranges
 - longest-common-subsequence


 {% include leetcode.preload.js.html %}