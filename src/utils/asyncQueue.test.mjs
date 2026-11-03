import assert from 'node:assert/strict'
import test from 'node:test'
import { createAsyncQueue } from './asyncQueue.js'

test('limits concurrent runners', async () => {
  const queue = createAsyncQueue(2)
  let running = 0
  let maxRunning = 0

  const job = () =>
    queue(async () => {
      running++
      maxRunning = Math.max(maxRunning, running)
      await new Promise((resolve) => setTimeout(resolve, 20))
      running--
      return true
    })

  await Promise.all([job(), job(), job(), job(), job()])
  assert.equal(maxRunning, 2)
})

test('preserves task result order independently', async () => {
  const queue = createAsyncQueue(2)
  const slow = queue(async () => {
    await new Promise((resolve) => setTimeout(resolve, 30))
    return 'slow'
  })
  const fast = queue(async () => 'fast')

  assert.equal(await fast, 'fast')
  assert.equal(await slow, 'slow')
})

test('rejects without blocking later tasks', async () => {
  const queue = createAsyncQueue(1)
  const failed = queue(async () => {
    throw new Error('boom')
  })
  const ok = queue(async () => 'ok')

  await assert.rejects(failed, /boom/)
  assert.equal(await ok, 'ok')
})
