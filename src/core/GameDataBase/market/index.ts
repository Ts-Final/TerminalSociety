import {Upgrades} from "./upgrade.ts";
import {Company} from "./company.ts";
import {Resource} from "../resource.ts";
import {notify} from "../.././utils/notify.ts";
import {Money} from "./money.ts";
import {ExchangeHandler} from "./exchange.ts";

export const Market = {
  Upgrades,
  Company,
  Money,
  ExchangeHandler,
  generate() {
    this.ExchangeHandler.generate()
    Resource.class.generateBasePrice()
    notify.normal("市场交易已刷新！", 1000)
  }
}