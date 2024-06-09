// Deepmerge library modified for Antimatter Dimensions usage (mainly Decimal integration)
// Source: https://github.com/TehShrike/deepmerge
import {Decimal} from "./break_infinity.ts";

interface Options {
  clone?: boolean;
  customMerge?: (key: string, options?: Options) => ((x: any, y: any) => any) | undefined;

  arrayMerge?(target: any[], source: any[], options?: ArrayMergeOptions): any[];

  isMergeableObject?(value: object): boolean;
}

interface ArrayMergeOptions {
  isMergeableObject(value: object): boolean;

  cloneUnlessOtherwiseSpecified(value: object, options?: Options): object;
}

interface LeastOption {
  clone?: boolean

  isMergeableObject(value: object): boolean
}

function emptyTarget(val: any): any {
  return Array.isArray(val) ? [] : {};
}

function cloneUnlessOtherwiseSpecified(
  value: any,
  options: LeastOption): any {
  if (value instanceof Decimal) {
    return new Decimal(value);
  }
  if (value instanceof Set) {
    return new Set(value);
  }
  return (options.clone !== false && options.isMergeableObject(value))
    ? deepmerge(emptyTarget(value), value, options)
    : value;
}

function defaultArrayMerge(target: any[], source: any[], options: LeastOption): any[] {
  return target.concat(source).map((element: any) => cloneUnlessOtherwiseSpecified(element, options));
}

function mergeObject(target: any, source: any, options: LeastOption): any {
  const destination: any = {};
  if (options.isMergeableObject(target)) {
    Object.keys(target).forEach((key: string) => {
      destination[key] = cloneUnlessOtherwiseSpecified(target[key], options);
    });
  }
  Object.keys(source).forEach((key: string) => {
    if (target[key] && target[key] instanceof Decimal) {
      destination[key] = new Decimal(source[key]);
    } else if (target[key] && target[key] instanceof Set) {
      destination[key] = new Set(source[key]);
    } else if (!options.isMergeableObject(source[key]) || !target[key]) {
      destination[key] = cloneUnlessOtherwiseSpecified(source[key], options);
    } else {
      destination[key] = deepmerge(target[key], source[key], options);
    }
  });
  return destination;
}


export function deepmergeAll(objects: object[], options?: Options): object
export function deepmergeAll<T>(objects: Partial<T>[], options?: Options): T
export function deepmergeAll(array: any[], options: any = {}): any {
  if (!Array.isArray(array)) {
    throw new Error("first argument should be an array");
  }

  if (!options) {
    const deepCloneMerge = (destinationArray: any[], sourceArray: any[], options: any) => sourceArray.map((element: any, index: number) => {
      if (destinationArray[index] && destinationArray[index] instanceof Decimal) {
        return new Decimal(element);
      }

      if (destinationArray[index] && destinationArray[index] instanceof Set) {
        return new Set(element);
      }

      if (!options.isMergeableObject(element) || !destinationArray[index]) {
        return cloneUnlessOtherwiseSpecified(element, options);
      }
      return deepmerge(destinationArray[index], element, options);

    });
    // eslint-disable-next-line no-param-reassign
    options = {
      arrayMerge: deepCloneMerge
    }
  }

  return array.reduce((prev, next) => deepmerge(prev, next, options), {});
}

function isMergeableObject(value: any): boolean {
  return isNonNullObject(value) && !isSpecial(value);
}

function isNonNullObject(value: any): boolean {
  return Boolean(value) && typeof value === "object";
}

function isSpecial(value: any): boolean {
  const stringValue = Object.prototype.toString.call(value);
  return stringValue === "[object RegExp]" || stringValue === "[object Date]";
}

export function deepmerge<T>(x: Partial<T>, y: Partial<T>, options?: Options): T;
export function deepmerge<T1, T2>(x: Partial<T1>, y: Partial<T2>, options?: Options): T1 & T2;
export function deepmerge(target: any, source: any, options: Options = {}): any {
  const newOption = {
    arrayMerge: options.arrayMerge ?? defaultArrayMerge,
    isMergeableObject: options.isMergeableObject ?? isMergeableObject,
    cloneUnlessOtherwiseSpecified: cloneUnlessOtherwiseSpecified,
  }

  if (target instanceof Decimal) {
    return new Decimal(source);
  }

  if (target instanceof Set) {
    return new Set(source);
  }

  const sourceIsArray = Array.isArray(source);
  const targetIsArray = Array.isArray(target);
  const sourceAndTargetTypesMatch = sourceIsArray === targetIsArray;

  if (!sourceAndTargetTypesMatch) {
    return cloneUnlessOtherwiseSpecified(source, newOption);
  }

  if (sourceIsArray) {
    return newOption.arrayMerge(target, source, newOption);
  }

  return mergeObject(target, source, newOption);
}

