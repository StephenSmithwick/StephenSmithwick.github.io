---
layout: post
title:  "LeetCode - Algorithms"
date:   2023-03-04
categories: LeetCode
---
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

## How to use
Install this Greasmonkey script to decorate the list: [blog.leetcode.user.js](https://github.com/StephenSmithwick/StephenSmithwick.github.io/raw/main/greasemonkey/blog.leetcode.user.js)

The Greasemonkey script will ask to access the following url to fetch leetcode data for the logged in user:
{:.information}
LeetCode Personal Dataaset: [https://leetcode.com/api/problems/algorithms/](https://leetcode.com/api/problems/algorithms/)

To build more lists of `problem` `slugs` you can use this javascript page query from your developer console:
```javascript
[...document.querySelectorAll('a')]
    .map(       li => li.href.match(/\/problems\/([^\/]+)\//))
    .filter(    match => match)
    .map(       match => match[1])
```