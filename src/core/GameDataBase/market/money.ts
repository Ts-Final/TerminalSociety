import {ref} from "vue";
import {player} from "../../player.ts";

export const Money = {
  refs: {
    money: ref(player.money.current),
    totalEarned: ref(player.money.totalEarned),
    totalSpend: ref(player.money.totalSpend)
  },
  get amount() {
    return player.money.current
  },
  set amount(value: number) {
    player.money.current = value
    this.refs.money.value = value
  },
  spend(value: number) {
    this.amount -= value
    this.totalSpend += value
  },
  earn(value: number) {
    this.amount += value
    this.totalEarned += value
  },
  canSpend(value: number) {
    return this.amount >= value
  },
  get totalSpend() {
    return player.money.totalSpend
  },
  set totalSpend(value: number) {
    player.money.totalSpend = value
    this.refs.totalSpend.value = value
  },
  get totalEarned() {
    return player.money.totalEarned
  },
  set totalEarned(value: number) {
    player.money.totalEarned = value
    this.refs.totalEarned.value = value
  },

}