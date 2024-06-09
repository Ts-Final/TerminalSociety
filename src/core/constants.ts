/**
 * @module constants
 * This module contains those Type annotations, some shit constants.
 */

/* Resource related */
/*Resource Names list */
import {Decimal} from "./utils/break_infinity.ts";

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

/* Market Related */
/**
 * {
 *   0: company name
 *   1: resource
 *   2: amount
 *   3: bought
 *   4: price
 * }
 */
export interface exchangeShort {
  company: number,
  resource: ResourceTypes,
  stock: number,
  bought: number,
  price: Decimal
}

export type Optional<T> = T | undefined

export interface Accessor<T> {
  all: T[]

  (id: number): T,
}

export type callable = () => any