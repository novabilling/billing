/**
 * Mock BullMQ queue factory for unit tests.
 */

export function createMockQueue() {
  return {
    add: jest.fn().mockResolvedValue({ id: 'job_1' }),
    addBulk: jest.fn().mockResolvedValue([]),
    getJob: jest.fn(),
    getJobs: jest.fn().mockResolvedValue([]),
    obliterate: jest.fn(),
    close: jest.fn(),
    pause: jest.fn(),
    resume: jest.fn(),
  };
}

export type MockQueue = ReturnType<typeof createMockQueue>;

export function resetMockQueue(queue: MockQueue) {
  for (const fn of Object.values(queue)) {
    if (typeof fn === 'function' && 'mockClear' in fn) {
      (fn as jest.Mock).mockClear();
    }
  }
}
