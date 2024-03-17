import {player} from "../../player";
import {ResourceTypes} from "../../GameDataBase/resource.ts";
import {Numbers} from "../../functions/Numbers.ts";
import {Effect} from "../../game-mechanics/effect.ts";

export function updateResource() {
  for (let key of Object.keys(player.resource)) {
    // These code seemed ugly, but Volar is a fuck that it will cause TYPE ERROR if i dont do that
    let key1 = key as ResourceTypes
    let key2 = key as keyof typeof player.resource
    player.resource[key2].affects.maxAdd = Effect.calcResource(key1, 'maxAdd').names
    player.resource[key2].affects.pro = Effect.calcResource(key1, "pro").names
    player.resource[key2].affects.consume = Effect.calcResource(key1, "consume").names
    player.resource[key2].affects.maxMult = Effect.calcResource(key1, 'maxMult').names
    player.resource[key2].maximum = Effect.calcResourceMax(key1)
    player.resource[key2].max_record =
      Math.max(player.resource[key2].max_record, player.resource[key2].amount)

    player.resource[key2].max_record = Numbers.round(player.resource[key2].max_record)
    player.resource[key2].amount = Numbers.round(player.resource[key2].amount)
  }
}