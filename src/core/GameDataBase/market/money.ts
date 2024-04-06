import {ref, Ref} from "vue";
import {player} from "../../player.ts";

class money {
  refs: {
    money: Ref<number>,
  }
  constructor() {
    this.refs = {
      money: ref(player.money.current)
    }
  }
  get amount() {
    return player.money.current
  }
  set amount(value: number) {
    player.money.current = value
    this.refs.money.value = value
  }
  spend(value:number) {
    this.amount -= value
    this.totalSpend += value
  }
  earn(value:number) {
    this.amount += value
    this.totalEarned += value
  }
  canSpend(value:number) {
    return this.amount >= value
  }
  get totalSpend() {
    return player.money.totalSpend
  }
  set totalSpend(value:number) {
    player.money.totalSpend = value
  }
  get totalEarned() {
    return player.money.totalEarned
  }
  set totalEarned(value:number) {
    player.money.totalEarned = value
  }

}

export const Money = new money()