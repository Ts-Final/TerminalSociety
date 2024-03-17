import {GameDataBase} from "../GameDataBase";
import {getNumArray} from "./generator.ts";

/**
 * ```
 * {
 *   0:activated,
 *   1:unlocked
 * }
 * ```
 */
export const __player_task = getNumArray<
  [boolean, boolean]>(
  GameDataBase.Tasks.length, [false, false])
/**
 * ```
 * {
 *   0:activated,
 *   1:unlocked,
 *   2:started,
 *   3:level
 * }
 * ```
 */
export const __player_research = getNumArray<
  [boolean, boolean, number, number]>(
  GameDataBase.Researches.length, [false, false, 0, 0])

export const __player_employee = {
  /**
   * {
   *   0: unlocked,
   *   1: equipped,
   *   2: unlocked time,
   *   3: letters,
   *   4: level,
   * }
   */
  work: getNumArray<
    [boolean, boolean,number,number,number]>(
    GameDataBase.Employees.work.length, [true, false,0,0,1])
}