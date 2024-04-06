/**
 * 将source的数据复制到target
 * 应满足 source 为 target 的子集
 * @param source
 * @param target
 */
/*
export function deepSet(source: any, target: any) {
  for (let key of Object.keys(source as object)) {
    if (source[key] == null) {
      target[key as keyof typeof target] = null
    } else {
      if (target[key] == undefined) {
        Object.defineProperty(target, key, {value: source[key]})
      }
      if (typeof source[key] == 'object') {
        deepSet(source[key], target[key])
      } else {
        try {
          target[key] = source[key]
        } catch (e) {
          Object.defineProperty(target, key, {})

        }
      }
    }

  }
}
*/
export function deepSet(source:any, target:any) {
  if (!(typeof source == 'object')) {throw new Error()}
  for (const key in source) {
    if (key in target) {
      if (typeof source[key] == "object") {
        deepSet(source[key],target[key])
      } else {
        target[key] = source[key]
      }
    }
    else {Object.defineProperty(target,key,
      {value:source[key],configurable:true,writable:true})}
  }
}