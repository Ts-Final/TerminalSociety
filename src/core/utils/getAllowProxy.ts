/**
 * 返回一个可以虚空get的东西
 */
export function getAllowProxy<T extends object>(target: T): T {
  return new Proxy(
    target,
    {
      get(target, p) {
        if (p in target) {
          return target[p as keyof T]
        } else {
          Object.defineProperty(
            target, p,
            {value: [], configurable: true})
          return target[p as keyof T]
        }
      },
    }
  )
}