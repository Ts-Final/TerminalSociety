import {exchangeShort, ResourceTypes} from "../../constants.ts";
import {ref, Ref} from "vue";
import {player} from "../../player.ts";
import {Company} from "./company.ts";
import {Resource} from "../resource.ts";
import {Money} from "./money.ts";
import {noEmpty} from "../.././utils/noEmpty.ts";
import {ui} from "../../game-mechanics/ui.ts";
import {Decimal} from "../../utils/break_infinity.ts";

/*
export class ExchangeClass extends GameDataClass{
  static refs: { exchanges: Ref<ExchangeClass[]> } = {
    exchanges: ref([])
  }
  static all: ExchangeClass[]
  data: exchangeShort
  refs: {
    unlocked: Ref<boolean>,
    bought: Ref<number>,
    toBuy: Ref<number>,
    canSell: Ref<boolean>,
    canBuy: Ref<boolean>,
  }

  constructor(data: exchangeShort) {
    super({
      id: 0,
      name: "",
      unlock: () => true
    })
    this.data = data
    this.refs = {
      canSell: ref(false),
      canBuy: ref(false),
      bought: ref(0),
      toBuy: ref(0),
      unlocked: ref(false)
    }
  }

  static get exchanges() {
    return player.market.exchange
  }

  static set exchanges(value: exchangeShort[]) {
    this.refs.exchanges.value = value.map(x => new this(x))
    this.fromPlayer()
  }

  get canBuy() {
    return this.toBuy + this.bought > this.amount
  }

  get canSell() {
    return Resources(this.resource).amount >= (this.refs.toBuy.value||0)
  }

  get canAfford() {
    return this.toBuy * this.price < Money.refs.money.value
  }

  get price() {
    return this.data[4]
  }

  get company() {
    return this.data[0]
  }

  get amount(): number {
    return this.data[2]
  }

  get bought(): number {
    return this.data[3]
  }

  set bought(value: number) {
    this.data[3] = value
    this.refs.bought.value = value
  }

  get exchanges() {
    return player.market.exchange
  }

  get resourceName() {
    return Resources(this.resource).parsed
  }

  get resource() {
    return this.data[1]
  }

  get toSpendMoney() {
    return this.toBuy * this.price
  }

  get toBuy() {
    return this.refs.toBuy.value
  }


  static fromPlayer() {
    this.all = this.exchanges.map(x => new this(x))
    const accessor = (index: number) => noEmpty(this.all[index])
    accessor.all = this.all
    accessor.class = this
    return accessor
  }

  /!*
  * directly changes ```player.market.exchange```
  * *!/
  static generate() {
    let v: exchangeShort[] = []
    for (const c of Company.all) {
      v.push(...c.generateExchange())
    }
    this.exchanges = v
    player.market.exchange = v
  }

  buy() {
    if (!this.canBuy || !this.canAfford) {
      return
    }
    this.bought += this.toBuy
    this.refs.bought.value = this.bought
    Resources(this.resource).amount += this.toBuy
    Money.spend(this.toSpendMoney)
  }

  sell() {
    if (!this.canSell) {
      return
    }
    Resources(this.resource).amount -= this.toBuy
    Money.earn(this.toSpendMoney)
  }
}

export const Exchange = ExchangeClass.fromPlayer()

EventHub.logic.on(GameEvent.MARKET_UPDATE, function () {
  ExchangeClass.exchanges = player.market.exchange
}, ExchangeClass)
setTimeout(() => ExchangeClass.exchanges = player.market.exchange, 1000)

window.dev.exchange = Exchange*/
export interface ExchangeObject {
  index: number
  company: number
  resource: ResourceTypes
  amount: number
  price: Decimal
  toBuy: Ref<number>
  refs: {
    bought: Ref<number>,
  }

  get bought(): number

  set bought(value: number)

  canBuy(toBuy: number): boolean,

  canSell(toBuy: number): boolean,

  buy(toBuy: number): void,

  sell(toBuy: number): void,
}

export const ExchangeHandler = {
  get all() {
    return this._all
  },
  set all(value) {
    this._all = value
    this.allRef.value = value
  },
  _all: [] as exchangeShort[],
  allRef: ref([]) as Ref<exchangeShort[]>,
  getData(index: number): exchangeShort {
    return noEmpty(this.all[index])
  },
  allObjects() {
    const Handler = this;
    if (!ui.init.value) {
      const f = function () {
        Handler.fromPlayer()
        Handler.refresh()
      };
      ui.init.wait(f)
    }
    return this.all.map((_, index) => this.toObject(index))
  },
  onUpdate: ref(true),
  toObject(index: number): ExchangeObject {
    const [company, resource,
      amount, bought, price] = this.getData(index)

    return {
      index: index,
      company: company,
      resource: resource,
      amount: amount,
      price: price,
      toBuy: ref(0),
      refs: {
        bought: ref(bought),
      },
      get bought() {
        return player.market.exchange[this.index][3]
      },
      set bought(value: number) {
        player.market.exchange[this.index][3] = value
        this.refs.bought.value = value
      },
      canBuy(toBuy): boolean {
        return Money.amount.gte(this.price.mul(toBuy))
      },
      canSell(toBuy): boolean {
        return Resource(this.resource).amount.gte(toBuy)
      },
      buy(toBuy) {
        if (!this.canBuy(toBuy)) return

        this.bought += toBuy
        Resource(this.resource).amount.toAdd(toBuy)
        Money.spend(this.price.mul(toBuy))
      },
      sell(toBuy) {
        if (!this.canSell(toBuy)) return

        Resource(this.resource).amount.toSub(toBuy)
        Money.earn(this.price.mul(toBuy))
      }

    }
  },
  generate() {
    let v: exchangeShort[] = []
    for (const c of Company.all) {
      v.push(...c.generateExchange())
    }
    this.all = v
    player.market.exchange = v
    this.refresh()
  },
  refresh() {
    this.onUpdate.value = false
    setTimeout(() => this.onUpdate.value = true, 20)
  },
  fromPlayer() {
    this.all = player.market.exchange
    this.refresh()
  }
}
ui.init.wait(
  () => ExchangeHandler.fromPlayer()
)