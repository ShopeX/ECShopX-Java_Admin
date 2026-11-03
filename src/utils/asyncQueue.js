/**
 * Copyright © ShopeX （http://www.shopex.cn）. All rights reserved.
 * See LICENSE file for license details.
 */

/**
 * Create an async task queue with a fixed concurrency limit.
 * @param {number} [limit=3]
 * @returns {(task: () => Promise<any>) => Promise<any>}
 */
export function createAsyncQueue(limit = 3) {
  const max = Math.max(1, Number(limit) || 1)
  let active = 0
  const queue = []

  const pump = () => {
    while (active < max && queue.length > 0) {
      const { task, resolve, reject } = queue.shift()
      active++
      Promise.resolve()
        .then(task)
        .then(resolve, reject)
        .finally(() => {
          active--
          pump()
        })
    }
  }

  return (task) =>
    new Promise((resolve, reject) => {
      queue.push({ task, resolve, reject })
      pump()
    })
}
