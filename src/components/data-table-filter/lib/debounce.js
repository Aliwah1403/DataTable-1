export function debounce(func, wait, options = {}) {
  const { leading = false, trailing = true, maxWait } = options
  let timeout = null
  let lastArgs = null
  let lastThis
  let result
  let lastCallTime = null
  let lastInvokeTime = 0

  const maxWaitTime = maxWait !== undefined ? Math.max(wait, maxWait) : null

  function invokeFunc(time) {
    if (lastArgs === null) return undefined
    const args = lastArgs
    const thisArg = lastThis
    lastArgs = null
    lastThis = null
    lastInvokeTime = time
    result = func.apply(thisArg, args)
    return result
  }

  function shouldInvoke(time) {
    if (lastCallTime === null) return false
    const timeSinceLastCall = time - lastCallTime
    const timeSinceLastInvoke = time - lastInvokeTime
    return (
      lastCallTime === null ||
      timeSinceLastCall >= wait ||
      timeSinceLastCall < 0 ||
      (maxWaitTime !== null && timeSinceLastInvoke >= maxWaitTime)
    )
  }

  function startTimer(pendingFunc, waitTime) {
    return setTimeout(pendingFunc, waitTime);
  }

  function remainingWait(time) {
    if (lastCallTime === null) return wait
    const timeSinceLastCall = time - lastCallTime
    const timeSinceLastInvoke = time - lastInvokeTime
    const timeWaiting = wait - timeSinceLastCall
    return maxWaitTime !== null
      ? Math.min(timeWaiting, maxWaitTime - timeSinceLastInvoke)
      : timeWaiting;
  }

  function timerExpired() {
    const time = Date.now()
    if (shouldInvoke(time)) {
      return trailingEdge(time);
    }
    timeout = startTimer(timerExpired, remainingWait(time))
  }

  function leadingEdge(time) {
    lastInvokeTime = time
    timeout = startTimer(timerExpired, wait)
    return leading ? invokeFunc(time) : undefined;
  }

  function trailingEdge(time) {
    timeout = null
    if (trailing && lastArgs) {
      return invokeFunc(time);
    }
    lastArgs = null
    lastThis = null
    return result
  }

  function debounced(...args) {
    const time = Date.now()
    const isInvoking = shouldInvoke(time)

    lastArgs = args
    lastThis = this
    lastCallTime = time

    if (isInvoking) {
      if (timeout === null) {
        return leadingEdge(lastCallTime);
      }
      if (maxWaitTime !== null) {
        timeout = startTimer(timerExpired, wait)
        return invokeFunc(lastCallTime);
      }
    }
    if (timeout === null) {
      timeout = startTimer(timerExpired, wait)
    }
    return result
  }

  debounced.cancel = () => {
    if (timeout !== null) {
      clearTimeout(timeout)
    }
    lastInvokeTime = 0
    lastArgs = null
    lastThis = null
    lastCallTime = null
    timeout = null
  }

  debounced.flush = () => {
    return timeout === null ? result : trailingEdge(Date.now());
  }

  debounced.isPending = () => {
    return timeout !== null
  }

  return debounced
}
