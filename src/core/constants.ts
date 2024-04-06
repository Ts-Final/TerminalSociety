/**
 * @module constants
 * This module contains those Type annotations, some shit constants.
 */

/* Resource related */
/*Resource Names list */
export const ResourceTypeList = [
  "energy",
  "iron",
  "copper",
  "air",
  "water",
  "coal",
] as const
export type ResourceTypes = typeof ResourceTypeList[number]
export const resourceBasePrice: { [key in ResourceTypes]: [number, number] } = {
  energy: [0.5, 0.7],
  iron: [12, 16],
  water: [2, 3],
  coal: [8, 11],
  copper: [15, 19],
  air: [0, 0],

}
/**
 * 对Resource影响的类型
 * 消耗/产出/最大值
 */
export type resourceEffectTypes = 'consume' | 'pro' | 'maxAdd' | 'maxMult'

/*Effect Related */
export type effectSource = 'research' | "employee" | "NMP"
export type id = number
/**
 * target的影响目标
 */
export type effectTarget = ResourceTypes | "research"

/*Market Related*/
/**
 * {
 *   0: company name
 *   1: resource
 *   2: amount
 *   3: bought
 *   4: price
 * }
 */
export type exchangeShort = [number, ResourceTypes, number, number, number]