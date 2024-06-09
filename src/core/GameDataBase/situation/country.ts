import {GameDataClass} from "../baseData.ts";
import {noEmpty} from "../.././utils/noEmpty.ts";

export const countryList = [
  "xi",
  "teLin",
  "agleta",
  "fatery",
  "tsFinal",
] as const
export type countryName = typeof countryList[number]

let countryIdCount = 0

function parseCountryName(name: countryName) {
  switch (name) {
    case "xi":
      return "锡"
    case "agleta":
      return "阿各塔"
    case "fatery":
      return "法谭"
    case "tsFinal":
      return "???"
    case "teLin":
      return "特林"
  }
}

export class CountryClass extends GameDataClass {
  static all: CountryClass[]

  private readonly _parsed: string

  constructor(name: countryName) {
    super({
      id: countryIdCount++,
      name: name,
      condition: () => true
    });
    this._parsed = parseCountryName(name)
  }

  get parsed() {
    return this._parsed
  }

  static fromData() {
    this.all = countryList.map(x => new this(x))
    const accessor = (name: countryName) =>
      noEmpty(this.all.find(x => x.name == name))
    accessor.all = this.all
    return accessor
  }

  get unlocked(): boolean {
    return true;
  }

  updateLogic(): void {
    // do nothing currently
  }


}

export const Country = CountryClass.fromData()