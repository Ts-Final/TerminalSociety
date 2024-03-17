import {__player_resource} from "./resource.ts";
import {__player_task, __player_employee, __player_research, } from "./numArrays.ts";
import {__player_market} from "./market.ts";
import {GameDataBase} from "../GameDataBase";
import {__player_country} from "./country.ts";


export const player = {
  resource: __player_resource,
  task:__player_task,
  research:__player_research,
  market: __player_market,
  version: GameDataBase.version,
  employee: __player_employee,
  country: __player_country,
  display: 1,
  how2play: 1,
  money: 0,
  saveTime: 0,
  dailyFreshTime: 0,
  dev: false,

}

declare global {
  interface Window {
    player: any,
    dev: any,
  }
}

window["player"] = player