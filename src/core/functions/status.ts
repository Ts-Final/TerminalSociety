export type status = -1 | 0 | 1
export const Status = {
  e: -1, // Error
  n: 0, // No -> false
  y: 1, // Yes -> true
  toBoolean(value: status) {
    switch (value) {
      case 1:
        return true
      case 0:
        return false
      case -1: {
        console.trace()
        debugger
        throw new Error("Status: Error")
      }
    }
  }

}