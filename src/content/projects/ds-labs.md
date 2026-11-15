---
title: DS&A C++
tagline: Core data structures and algorithms, implemented from scratch
summary: C++ implementations of the data structures and algorithms from my DSA course, from linked lists and heaps to balanced trees, graphs and minimum spanning trees.
year: "2025"
role: Solo
context: Data Structures and Algorithms course, IBU
categories: [Systems]
stack: [C++17, Templates, STL, CLion]
order: 13
highlights:
  - Linked lists, stacks, queues and binary heaps
  - Binary search trees and left-leaning red-black trees
  - Directed graphs, traversal and minimum spanning trees
links:
  repo: https://github.com/FarisKarkelja/ds-labs
---

## Why I built it

Every structure here is written from scratch in modern C++, without relying on the STL containers it imitates. The goal was to understand what a container really does with memory, and why one algorithm beats another, not only how to call it.

## Data structures

- **Linked lists:** singly, doubly, circular and an XOR linked list that stores both neighbours in one pointer field
- **Stack, queue, circular queue and deque**, built on linked nodes
- **Binary heap** with a growable array, used for a priority queue and heap sort
- **Binary search tree** and a **left-leaning red-black tree** with insertion, lookup and deletion (min, max and any key), which keeps every operation at O(log n)
- **Graphs:** undirected, directed and edge-weighted, with depth-first and breadth-first search
- **Minimum spanning trees** with Prim's and Kruskal's algorithms, using my own union-find

## Algorithms

Elementary sorts (bubble, selection, insertion, shell and binary insertion), merge sort and TimSort, quicksort with shuffling and dual-pivot quicksort, counting and radix sort, plus linear and binary search. Each one is generic, so the same code sorts numbers, strings or custom types.

## Modern C++ in practice

- **Templates** for every container and algorithm, with the implementation in separate `.tpp` files
- **Rule of five:** copy and move constructors and assignment operators, and destructors that free every node
- **Manual memory management** with raw pointers, written so that copies, moves and deletes never leak or double free
- **Iterators** and `std::initializer_list` constructors, so the containers can be used like STL ones
- `noexcept` move operations and `const`-correct interfaces

## What I learned

Writing the red-black tree and the XOR list by hand taught me more about pointers, ownership and invariants than any library could. When I use `std::map` or `std::vector` today, I know what is happening underneath and what it costs.
