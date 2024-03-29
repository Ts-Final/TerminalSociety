import {getNumArray} from "./generator.ts";
import {GameDataBase} from "../GameDataBase";

export const __player_options = {
  tabShown:getNumArray(GameDataBase.displayEnum.length,true),
  updateRate: 33,
  laugh: false,
  news: true,
}