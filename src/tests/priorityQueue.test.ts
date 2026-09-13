import { describe, it, expect } from 'vitest';
import { MinPriorityQueue } from '../utils/priorityQueue';

describe('MinPriorityQueue Binary Heap Utility', () => {
  it('correctly dequeues elements in ascending order of priority', () => {
    const pq = new MinPriorityQueue<string>();
    pq.enqueue('Node C', 30);
    pq.enqueue('Node A', 10);
    pq.enqueue('Node B', 20);
    pq.enqueue('Node D', 5);

    expect(pq.size).toBe(4);
    expect(pq.dequeue()).toBe('Node D'); // Priority 5
    expect(pq.dequeue()).toBe('Node A'); // Priority 10
    expect(pq.dequeue()).toBe('Node B'); // Priority 20
    expect(pq.dequeue()).toBe('Node C'); // Priority 30
    expect(pq.isEmpty()).toBe(true);
    expect(pq.dequeue()).toBeUndefined();
  });

  it('handles duplicate priority items gracefully', () => {
    const pq = new MinPriorityQueue<number>();
    pq.enqueue(100, 10);
    pq.enqueue(200, 10);
    pq.enqueue(300, 5);

    expect(pq.dequeue()).toBe(300);
    expect(pq.size).toBe(2);
  });
});
