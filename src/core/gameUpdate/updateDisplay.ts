import {getAllowProxy} from "../functions/getAllowProxy.ts";

/**
 * 在每一个component的setup中应该有一个update的method
 * 务必在onMounted/onUnMounted中加入、移除，减少性能开销
 */
export const gameUpdateDisplays =
  getAllowProxy<{[x:number]:Function[]}>({})