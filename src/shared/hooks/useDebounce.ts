export const useDebounce = (callback: Function, time: number) => {
  let timerId: NodeJS.Timeout | null = null
  return (...args: any[]) => {
    if (timerId) clearTimeout(timerId)
    timerId = setTimeout(() => {
      callback(...args)
    }, time)
  }
}
