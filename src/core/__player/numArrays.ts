import {GameDataBase} from "../GameDataBase";
import {getNumArray} from "./generator.ts";
import {TaskData} from "../GameDataBase/task.ts";

/**
 * ```
 * {
 *   0:unlocked
 *   1:activated,
 * }
 * ```
 */
export const __player_task = getNumArray<
  [boolean, boolean]>(
  TaskData.length, [false, false])
/**
 * ```
 * {
 *   0:unlocked,
 *   1:activated,
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
    GameDataBase.Employees.work.length, [true, false,0,0,1]),
  voucher: {
    0: 0, // 100
    1: 0, // 200
    2: 0, // 500
    3: 0, // 1000
  }
}

export const  __player_tabUnlocks = getNumArray(GameDataBase.Tabs.length, false)