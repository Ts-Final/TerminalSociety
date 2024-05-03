import {ref} from "vue";
import {player} from "../../player.ts";
import {Decimal, DecimalSource} from "../../utils/break_infinity.ts";

export const Money = {
  refs: {
    money: ref(player.money.current),
    totalEarned: ref(player.money.totalEarned),
    totalSpend: ref(player.money.totalSpend)
  },
  get amount():Decimal {
    return player.money.current
  },
  set amount(value: DecimalSource) {
    player.money.current.fromValue(value)
    this.refs.money.value = Decimal.fromValue(value)
  },
  spend(value: DecimalSource) {
    this.amount = this.amount.sub(value)
    this.totalSpend = this.totalSpend.add(value)
  },
  earn(value: DecimalSource) {
    this.amount = this.amount.add(value)
    this.totalEarned = this.totalEarned.add(value)
  },
  get totalSpend():Decimal {
    return player.money.totalSpend
  },
  set totalSpend(value: DecimalSource) {
    player.money.totalSpend.fromValue(value)
    this.refs.totalSpend.value = player.money.totalSpend
  },
  get totalEarned():Decimal {
    return player.money.totalEarned
  },
  set totalEarned(value: DecimalSource) {
    player.money.totalEarned.fromValue(value)
    this.refs.totalEarned.value = player.money.totalEarned
  },

}