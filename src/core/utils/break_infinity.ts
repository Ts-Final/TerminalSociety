import {Ref} from "vue";

/**
 * @param str 将要补充的string
 * @param maxLength 最大长度
 * @param fill 补充的字符，默认为空格
 *
 * */
function fillTo(str: string, maxLength: number, fill?: string): string {
  if (str == null || maxLength == null) throw new Error()

  let result = String(str)
  let targetLen = maxLength
  if (isNaN(targetLen) || !isFinite(targetLen)) return result

  const length = result.length

  if (length >= targetLen) return result

  let filled = fill ? ' ' : String(fill)
  let fillLength = targetLen - length

  while (filled.length < fillLength) filled += filled

  // Check if the filled string is too long
  let truncated = filled.length > fillLength ? filled.substring(0, fillLength) : filled

  return result + truncated
}

let ME = function ME(mantissa: number, exponent: number) {
  return new Decimal().fromMantissaExponent(mantissa, exponent);
};

const ME_NN = function ME_NN(mantissa: number, exponent: number) {
  return new Decimal().fromMantissaExponent_noNormalize(mantissa, exponent);
};

/*function affordGeometricSeries(resourcesAvailable: Decimal,
                               priceStart: Decimal,
                               priceRatio: Decimal,
                               currentOwned: Decimal) {
  var actualStart = priceStart.mul(priceRatio.pow(currentOwned));
  return Decimal.floor(resourcesAvailable.div(actualStart).mul(priceRatio.sub(1)).add(1).log10() / priceRatio.log10());
}

function sumGeometricSeries(numItems, priceStart, priceRatio, currentOwned) {
  return priceStart.mul(priceRatio.pow(currentOwned)).mul(Decimal.sub(1, priceRatio.pow(numItems))).div(Decimal.sub(1, priceRatio));
}

function affordArithmeticSeries(resourcesAvailable, priceStart, priceAdd, currentOwned) {
  // n = (-(a-d/2) + sqrt((a-d/2)^2+2dS))/d
  // where an is actualStart, d is priceAdd and S is resourcesAvailable
  // then floor it, and you're done!
  var actualStart = priceStart.add(currentOwned.mul(priceAdd));
  var b = actualStart.sub(priceAdd.div(2));
  var b2 = b.pow(2);
  return b.neg().add(b2.add(priceAdd.mul(resourcesAvailable).mul(2)).sqrt()).div(priceAdd).floor();
}

function sumArithmeticSeries(numItems, priceStart, priceAdd, currentOwned) {
  var actualStart = priceStart.add(currentOwned.mul(priceAdd)); // (n/2)*(2*a+(n-1)*d)

  return numItems.div(2).mul(actualStart.mul(2).plus(numItems.sub(1).mul(priceAdd)));
}

function efficiencyOfPurchase(cost, currentRpS, deltaRpS) {
  return cost.div(currentRpS).add(cost.div(deltaRpS));
}*/

const MAX_SIGNIFICANT_DIGITS = 15
const EXP_LIMIT = 9e15
const NUMBER_EXP_MAX = 308
const NUMBER_EXP_MIN = -324
const ROUND_TOLERANCE = 1e-10
const powerOf10 = (function () {
  let powers: number[] = []

  for (let i = NUMBER_EXP_MIN + 1; i <= MAX_SIGNIFICANT_DIGITS; i++) {
    powers.push(Number("1e" + i))
  }
  /*
  * 用于索引10power的index，因为前面有323个负的所以加上
  * 这样powers[0] = -323, powers[323] = 0
  * */
  const index = 323
  return function (power: number) {
    return powers[power + index]
  }
})()

const D = function (value: DecimalSource) {
  return value instanceof Decimal ? value : new Decimal(value);
}

export class Decimal {
  /**
   * A number (double) with absolute value between [1, 10) OR exactly 0.
   * If mantissa is ever 10 or greater, it should be normalized
   * (divide by 10 and add 1 to exponent until it is less than 10,
   * or multiply by 10 and subtract 1 from exponent until it is 1 or greater).
   * Infinity/-Infinity/NaN will cause bad things to happen.
   */
  mantissa: number
  /**
   * A number (integer) between -EXP_LIMIT and EXP_LIMIT.
   * Non-integral/out of bounds will cause bad things to happen.
   */
  exponent: number

  constructor(value?: DecimalSource) {
    this.mantissa = NaN;
    this.exponent = NaN;
    if (value === undefined) {
      this.m = 0;
      this.e = 0;
    } else if (value instanceof Decimal) {
      this.fromDecimal(value);
    } else if (typeof value === "number") {
      this.fromNumber(value);
    } else {
      this.fromString(value);
    }
  }

  static get MAX_VALUE(): Decimal {
    return ME_NN(1, EXP_LIMIT)
  }

  static get MIN_VALUE(): Decimal {
    return ME_NN(1, -EXP_LIMIT)
  }

  static get NUMBER_MAX_VALUE(): Decimal {
    return D(Number.MAX_VALUE)
  }

  static get NUMBER_MIN_VALUE(): Decimal {
    return D(Number.MIN_VALUE)
  }

  get m() {
    return this.mantissa
  }

  set m(value) {
    this.mantissa = value
  }

  get e() {
    return this.exponent
  }

  set e(value) {
    this.exponent = value
  }

  get s() {
    return this.sign()
  }

  set s(value: number) {
    if (value === 0) {
      this.e = 0
      this.m = 0
      return
    }
    if (this.sgn() !== value) {
      this.m = -this.m
    }
  }

  static fromMantissaExponent(mantissa: number, exponent: number): Decimal {
    return new Decimal().fromMantissaExponent(mantissa, exponent)
  }

  static fromMantissaExponent_noNormalize(mantissa: number, exponent: number): Decimal {
    return new Decimal().fromMantissaExponent_noNormalize(mantissa, exponent)
  }

  static fromDecimal(value: Decimal): Decimal {
    return new Decimal().fromDecimal(value)
  }

  static fromNumber(value: number): Decimal {

    return new Decimal().fromNumber(value)

  }

  static fromString(value: string): Decimal {
    return new Decimal().fromString(value)
  }

  static fromValue(value: DecimalSource): Decimal {
    return new Decimal().fromValue(value)
  }

  static fromValue_noAlloc(value: DecimalSource): Decimal {
    return value instanceof Decimal ? value : new Decimal(value)
  }

  static abs(value: DecimalSource): Decimal {
    return D(value).abs()
  }

  static neg(value: DecimalSource): Decimal {
    return D(value).neg()
  }

  static negate(value: DecimalSource): Decimal {
    return D(value).neg()
  }

  static negated(value: DecimalSource): Decimal {
    return D(value).neg()
  }

  static sign(value: DecimalSource): number {
    return D(value).sign()
  }

  static sgn(value: DecimalSource): number {
    return D(value).sign()
  }

  static round(value: DecimalSource): Decimal {
    return D(value).round()
  }

  static floor(value: DecimalSource): Decimal {
    return D(value).floor()
  }

  static ceil(value: DecimalSource): Decimal {
    return D(value).ceil()
  }

  static trunc(value: DecimalSource): Decimal {
    return D(value).trunc()
  }

  static add(value: DecimalSource, other: DecimalSource): Decimal {
    return D(value).add(other)
  }

  static plus(value: DecimalSource, other: DecimalSource): Decimal {
    return D(value).plus(other)
  }

  static sub(value: DecimalSource, other: DecimalSource): Decimal {
    return D(value).sub(other)
  }

  static subtract(value: DecimalSource, other: DecimalSource): Decimal {
    return D(value).subtract(other)
  }

  static minus(value: DecimalSource, other: DecimalSource): Decimal {
    return D(value).minus(other)
  }

  static mul(value: DecimalSource, other: DecimalSource): Decimal {
    return D(value).mul(other)
  }

  static multiply(value: DecimalSource, other: DecimalSource): Decimal {
    return D(value).multiply(other)
  }

  static times(value: DecimalSource, other: DecimalSource): Decimal {
    return D(value).times(other)
  }

  static div(value: DecimalSource, other: DecimalSource): Decimal {
    return D(value).div(other)
  }

  static divide(value: DecimalSource, other: DecimalSource): Decimal {
    return D(value).divide(other)
  }

  static recip(value: DecimalSource): Decimal {
    return D(value).recip()
  }

  static reciprocal(value: DecimalSource): Decimal {
    return D(value).reciprocal()
  }

  static reciprocate(value: DecimalSource): Decimal {
    return D(value).reciprocate()
  }

  static cmp(value: DecimalSource, other: DecimalSource): 0 | 1 | -1 {

    return D(value).cmp(other)
  }

  static eq(value: DecimalSource, other: DecimalSource): boolean {
    return D(value).eq(other)
  }

  static equals(value: DecimalSource, other: DecimalSource): boolean {
    return D(value).equals(other)
  }

  static neq(value: DecimalSource, other: DecimalSource): boolean {
    return D(value).neq(other)
  }

  static notEquals(value: DecimalSource, other: DecimalSource): boolean {
    return D(value).notEquals(other)
  }

  static lt(value: DecimalSource, other: DecimalSource): boolean {
    return D(value).lt(other)
  }

  static lte(value: DecimalSource, other: DecimalSource): boolean {
    return D(value).lte(other)
  }

  static gt(value: DecimalSource, other: DecimalSource): boolean {
    return D(value).gt(other)
  }

  static gte(value: DecimalSource, other: DecimalSource): boolean {
    return D(value).gte(other)
  }

  static max(value: DecimalSource, other: DecimalSource): Decimal {
    return D(value).max(other)
  }

  static min(value: DecimalSource, other: DecimalSource): Decimal {
    return D(value).min(other)
  }

  static clamp(value: DecimalSource, min: DecimalSource, max: DecimalSource): Decimal {
    return D(value).clamp(min, max)
  }

  static clampMin(value: DecimalSource, min: DecimalSource): Decimal {
    return D(value).clampMin(min)
  }

  static clampMax(value: DecimalSource, max: DecimalSource): Decimal {
    return D(value).clampMax(max)
  }

  static cmp_tolerance(value: DecimalSource, other: DecimalSource, tolerance: DecimalSource): 0 | 1 | -1 {
    return D(value).cmp_tolerance(other, tolerance)
  }

  static compare_tolerance(value: DecimalSource, other: DecimalSource, tolerance: DecimalSource): 0 | 1 | -1 {
    return D(value).compare_tolerance(other, tolerance)
  }

  static eq_tolerance(value: DecimalSource, other: DecimalSource, tolerance: DecimalSource): boolean {
    return D(value).eq_tolerance(other, tolerance)
  }

  static equals_tolerance(value: DecimalSource, other: DecimalSource, tolerance: DecimalSource): boolean {
    return D(value).equals_tolerance(other, tolerance)
  }

  static neq_tolerance(value: DecimalSource, other: DecimalSource, tolerance: DecimalSource): boolean {
    return D(value).neq_tolerance(other, tolerance)
  }

  static notEquals_tolerance(value: DecimalSource, other: DecimalSource, tolerance: DecimalSource): boolean {
    return D(value).notEquals_tolerance(other, tolerance)
  }

  static lt_tolerance(value: DecimalSource, other: DecimalSource, tolerance: DecimalSource): boolean {
    return D(value).lt_tolerance(other, tolerance)
  }

  static lte_tolerance(value: DecimalSource, other: DecimalSource, tolerance: DecimalSource): boolean {
    return D(value).lte_tolerance(other, tolerance)
  }

  static gt_tolerance(value: DecimalSource, other: DecimalSource, tolerance: DecimalSource): boolean {
    return D(value).gt_tolerance(other, tolerance)
  }

  static gte_tolerance(value: DecimalSource, other: DecimalSource, tolerance: DecimalSource): boolean {
    return D(value).gte_tolerance(other, tolerance)
  }

  static log10(value: DecimalSource): number {

    return D(value).log10()
  }

  static absLog10(value: DecimalSource): number {

    return D(value).absLog10()
  }

  static pLog10(value: DecimalSource): number {
    return D(value).pLog10()
  }

  static log(value: DecimalSource, base: number): number {
    return D(value).log(base)
  }

  static log2(value: DecimalSource): number {
    return D(value).log2()
  }

  static ln(value: DecimalSource): number {
    return D(value).ln()
  }

  static logarithm(value: DecimalSource, base: number): number {
    return D(value).logarithm(base)
  }

  static pow10(value: number): Decimal {

    if (Number.isInteger(value)) {
      return ME_NN(1, value);
    }

    return ME(Math.pow(10, value % 1), Math.trunc(value));
  }

  static pow(value: DecimalSource, other: number | Decimal): Decimal {
    // Fast track: 10^integer
    if (typeof value === "number" && value === 10 && typeof other === "number" && Number.isInteger(other)) {
      return ME_NN(1, other);
    }

    return D(value).pow(other);
  };

  static exp(value: DecimalSource): Decimal {
    return D(value).exp()
  }

  static sqr(value: DecimalSource): Decimal {
    return D(value).sqr()
  }

  static sqrt(value: DecimalSource): Decimal {
    return D(value).sqrt()
  }

  /*
  然后这里先不写，用不着
  /!**
   * If you're willing to spend 'resourcesAvailable' and want to buy something
   * with exponentially increasing cost each purchase (start at priceStart,
   * multiply by priceRatio, already own currentOwned), how much of it can you buy?
   * Adapted from Trimps source code.
   *!/
  static affordGeometricSeries(resourcesAvailable  :  DecimalSource, priceStart  :  DecimalSource, priceRatio  :  DecimalSource, currentOwned  :  number | Decimal  ):  Decimal  {

    affordGeometricSeries()
  }

  /!**
   * How much resource would it cost to buy (numItems) items if you already have currentOwned,
   * the initial price is priceStart and it multiplies by priceRatio each purchase?
   *!/
  static sumGeometricSeries(numItems  :  number | Decimal, priceStart  :  DecimalSource, priceRatio  :  DecimalSource, currentOwned  :  number | Decimal  ):  Decimal  {
    return D(numItems
  :
    number | Decimal, priceStart
  :
    DecimalSource, priceRatio
  :
    DecimalSource, currentOwned
  :
    number | Decimal
  ).
    sumGeometricSeries()
  }

  /!**
   * If you're willing to spend 'resourcesAvailable' and want to buy something with additively
   * increasing cost each purchase (start at priceStart, add by priceAdd, already own currentOwned),
   * how much of it can you buy?
   *!/
  static affordArithmeticSeries(resourcesAvailable  :  DecimalSource, priceStart  :  DecimalSource, priceAdd  :  DecimalSource, currentOwned  :  DecimalSource  ):  Decimal  {
    return D(resourcesAvailable
  :
    DecimalSource, priceStart
  :
    DecimalSource, priceAdd
  :
    DecimalSource, currentOwned
  :
    DecimalSource
  ).
    affordArithmeticSeries()
  }

  /!**
   * How much resource would it cost to buy (numItems) items if you already have currentOwned,
   * the initial price is priceStart and it adds priceAdd each purchase?
   * Adapted from http://www.mathwords.com/a/arithmetic_series.htm
   *!/
  static sumArithmeticSeries(numItems
  :
  DecimalSource, priceStart
  :
  DecimalSource, priceAdd
  :
  DecimalSource, currentOwned
  :
  DecimalSource
  ):
  Decimal
  {
    return D(numItems
  :
    DecimalSource, priceStart
  :
    DecimalSource, priceAdd
  :
    DecimalSource, currentOwned
  :
    DecimalSource
  ).
    sumArithmeticSeries()
  }

  /!**
   * When comparing two purchases that cost (resource) and increase your resource/sec by (deltaRpS),
   * the lowest efficiency score is the better one to purchase.
   * From Frozen Cookies:
   * http://cookieclicker.wikia.com/wiki/Frozen_Cookies_(JavaScript_Add-on)#Efficiency.3F_What.27s_that.3F
   *!/
  static efficiencyOfPurchase(cost
  :
  DecimalSource, currentRpS
  :
  DecimalSource, deltaRpS
  :
  DecimalSource
  ):
  Decimal
  {
    return D(cost
  :
    DecimalSource, currentRpS
  :
    DecimalSource, deltaRpS
  :
    DecimalSource
  ).
    efficiencyOfPurchase()
  }
  */

  static cube(value: DecimalSource): Decimal {
    return D(value).cube()
  }

  static cbrt(value: DecimalSource): Decimal {
    return D(value).cbrt()
  }

  static dp(value: DecimalSource): number {
    return D(value).dp()
  }

  static decimalPlaces(value: DecimalSource): number {
    return D(value).decimalPlaces()
  }

  static randomDecimalForTesting(absMaxExponent: number): Decimal {
    // NOTE: This doesn't follow any kind of sane random distribution, so use this for testing purposes only.
    // 5% of the time, have a mantissa of 0
    if (Math.random() * 20 < 1) {
      return ME_NN(0, 0);
    }

    let mantissa = Math.random() * 10; // 10% of the time, have a simple mantissa

    if (Math.random() * 10 < 1) {
      mantissa = Math.round(mantissa);
    }

    mantissa *= Math.sign(Math.random() * 2 - 1);
    const exponent = Math.floor(Math.random() * absMaxExponent * 2) - absMaxExponent;
    return ME(mantissa, exponent);
    /*
      Examples:
           randomly test pow:
           var a = Decimal.randomDecimalForTesting(1000);
      var pow = Math.random()*20-10;
      if (Math.random()*2 < 1) { pow = Math.round(pow); }
      var result = Decimal.pow(a, pow);
      ["(" + a.toString() + ")^" + pow.toString(), result.toString()]
           randomly test add:
           var a = Decimal.randomDecimalForTesting(1000);
      var b = Decimal.randomDecimalForTesting(17);
      var c = a.mul(b);
      var result = a.add(c);
      [a.toString() + "+" + c.toString(), result.toString()]
    */
  };

  /*
  * turn those number-like strings into Decimals as commonly
  * we save the numbers as number it self, and for decimals it's
  * parsed to string instead.
  * */
  static transfer(target: any) {
    if (!(typeof target == 'object')) {
      throw new Error()
    }
    for (const key in target) {
      if (typeof target[key] == "object") {
        if ("mantissa" in target[key] && "exponent" in target[key])
          target[key] =
            new Decimal(target[key]["mantissa"] + "e" + target[key]["exponent"])

        else Decimal.transfer(target[key])
      } else if (typeof target[key] == "string") {
        target[key] = Decimal.DecimalLikeString(target[key])
      }
    }
  }

  static DecimalLikeString(str: string) {
    /*if (str.matchAll(/^-?[0-9]+.?[0-9]*$/)) {
      return new Decimal(str)
    }*/
    try {
      return new Decimal(str)
    } catch (e) {
      return str
    }
  }

  static toResourceAmount(value: DecimalSource) {
    return D(value).toResourceAmount()
  }

  static toPercent(value: DecimalSource) {
    return D(value).toPercent()
  }

  /**
   * When mantissa is very denormalized, use this to normalize much faster.
   */
  normalize() {
    if (this.m >= 1 && this.m < 10) {
      return this;
    } // TODO: I'm worried about mantissa being negative 0 here which is why I set it again, but it may never matter


    if (this.m === 0) {
      this.m = 0;
      this.e = 0;
      return this;
    }

    const tempExponent = Math.floor(Math.log10(Math.abs(this.m)));
    this.m = tempExponent === NUMBER_EXP_MIN ? this.m * 10 / 1e-323 : this.m / powerOf10(tempExponent);
    this.e += tempExponent;
    return this;
  };

  fromMantissaExponent(mantissa: number, exponent: number) {
    /*
    * we can get rid of this check because in Typescript you dont need to check those
    * values is non-numbers or not
    * // SAFETY: don't let in non-numbers
    * if (!isFinite(mantissa) || !isFinite(exponent)) {
    *   mantissa = Number.NaN;
    *   exponent = Number.NaN;
    *   return this;
    }*/

    this.m = mantissa;
    this.e = exponent; // Non-normalized mantissas can easily get here, so this is mandatory.

    this.normalize();
    return this;
  };

  /**
   * Well, you know what you're doing!
   */
  fromMantissaExponent_noNormalize(mantissa: number, exponent: number) {
    this.m = mantissa;
    this.e = exponent;
    return this;
  };

  fromDecimal(value: Decimal) {
    this.m = value.m;
    this.e = value.e;
    return this;
  };

  fromNumber(value: number) {
    // SAFETY: Handle Infinity and NaN in a somewhat meaningful way.
    if (isNaN(value)) {
      this.m = Number.NaN;
      this.e = Number.NaN;
    } else if (value === Number.POSITIVE_INFINITY) {
      this.m = 1;
      this.e = EXP_LIMIT;
    } else if (value === Number.NEGATIVE_INFINITY) {
      this.m = -1;
      this.e = EXP_LIMIT;
    } else if (value === 0) {
      this.m = 0;
      this.e = 0;
    } else {
      this.e = Math.floor(Math.log10(Math.abs(value))); // SAFETY: handle 5e-324, -5e-324 separately

      this.m = this.e === NUMBER_EXP_MIN ? value * 10 / 1e-323 : value / powerOf10(this.e); // SAFETY: Prevent weirdness.

      this.normalize();
    }

    return this;
  };

  fromString(value: string) {
    if (value.indexOf("e") !== -1) {
      const parts = value.split("e");
      this.m = parseFloat(parts[0]);
      this.e = parseFloat(parts[1]); // Non-normalized mantissas can easily get here, so this is mandatory.

      this.normalize();
    } else if (value === "NaN") {
      this.m = Number.NaN;
      this.e = Number.NaN;
    } else {
      this.fromNumber(parseFloat(value));

      if (isNaN(this.m)) {
        throw Error("[DecimalError] Invalid argument: " + value);
      }
    }

    return this;
  };

  fromValue(value ?: DecimalSource) {
    if (value instanceof Decimal) {
      return this.fromDecimal(value);
    }

    if (typeof value === "number") {
      return this.fromNumber(value);
    }

    if (typeof value === "string") {
      return this.fromString(value);
    }

    this.m = 0;
    this.e = 0;
    return this;
  };

  toNumber() {
    // Problem: new Decimal(116).toNumber() returns 115.99999999999999.
    // TODO: How to fix in general case? It's clear that if toNumber() is
    //  VERY close to an integer, we want exactly the integer.
    //  But it's not clear how to specifically write that.
    //  So I'll just settle with 'exponent >= 0 and difference between rounded
    //  and not rounded < 1e-9' as a quick fix.
    // UN-SAFETY: It still eventually fails.
    // Since there's no way to know for sure we started with an integer,
    // all we can do is decide what tradeoff we want between 'yeah I think
    // this used to be an integer' and 'pfft, who needs THAT many decimal
    // places tracked' by changing ROUND_TOLERANCE.
    // https://github.com/Patashu/break_infinity.js/issues/52
    // Currently starts failing at 800002. Workaround is to do .Round()
    // AFTER toNumber() if you are confident you started with an integer.
    // var result = this.m*Math.pow(10, this.e);
    if (!isFinite(this.e)) {
      return Number.NaN;
    }

    if (this.e > NUMBER_EXP_MAX) {
      return this.m > 0 ? Number.POSITIVE_INFINITY : Number.NEGATIVE_INFINITY;
    }

    if (this.e < NUMBER_EXP_MIN) {
      return 0;
    } // SAFETY: again, handle 5e-324, -5e-324 separately


    if (this.e === NUMBER_EXP_MIN) {
      return this.m > 0 ? 5e-324 : -5e-324;
    }

    const result = this.m * powerOf10(this.e);

    if (!isFinite(result) || this.e < 0) {
      return result;
    }

    const resultRounded = Math.round(result);

    if (Math.abs(resultRounded - result) < ROUND_TOLERANCE) {
      return resultRounded;
    }

    return result;
  };

  mantissaWithDecimalPlaces(places: number) {
    // https://stackoverflow.com/a/37425022
    if (isNaN(this.m) || isNaN(this.e)) {
      return Number.NaN;
    }

    if (this.m === 0) {
      return 0;
    }

    const len = places + 1;
    const numDigits = Math.ceil(Math.log10(Math.abs(this.m)));
    const rounded = Math.round(this.m * Math.pow(10, len - numDigits)) * Math.pow(10, numDigits - len);
    return parseFloat(rounded.toFixed(Math.max(len - numDigits, 0)));
  };

  toString() {
    if (isNaN(this.m) || isNaN(this.e)) {
      return "NaN";
    }

    if (this.e >= EXP_LIMIT) {
      return this.m > 0 ? "Infinity" : "-Infinity";
    }

    if (this.e <= -EXP_LIMIT || this.m === 0) {
      return "0";
    }

    if (this.e < 21 && this.e > -7) {
      return this.toNumber().toString();
    }

    return this.m + "e" + (this.e >= 0 ? "+" : "") + this.e;
  };

  toExponential(places: number) {
    // https://stackoverflow.com/a/37425022
    // TODO: Some unfixed cases:
    //  new Decimal("1.2345e-999").toExponential()
    //  "1.23450000000000015e-999"
    //  new Decimal("1e-999").toExponential()
    //  "1.000000000000000000e-999"
    // TBH I'm tempted to just say it's a feature.
    // If you're doing pretty formatting then why don't you know how many decimal places you want...?
    if (isNaN(this.m) || isNaN(this.e)) {
      return "NaN";
    }

    if (this.e >= EXP_LIMIT) {
      return this.m > 0 ? "Infinity" : "-Infinity";
    }

    if (this.e <= -EXP_LIMIT || this.m === 0) {
      return "0" + (places > 0 ? fillTo(".", places + 1, "0") : "") + "e+0";
    } // two cases:
    // 1) exponent is < 308 and > -324: use basic toFixed
    // 2) everything else: we have to do it ourselves!


    if (this.e > NUMBER_EXP_MIN && this.e < NUMBER_EXP_MAX) {
      return this.toNumber().toExponential(places);
    }

    if (!isFinite(places)) {
      places = MAX_SIGNIFICANT_DIGITS;
    }

    const len = places + 1;
    const numDigits = Math.max(1, Math.ceil(Math.log10(Math.abs(this.m))));
    const rounded = Math.round(this.m * Math.pow(10, len - numDigits)) * Math.pow(10, numDigits - len);
    return rounded.toFixed(Math.max(len - numDigits, 0)) + "e" + (this.e >= 0 ? "+" : "") + this.e;
  };

  toFixed(places: number) {
    if (isNaN(this.m) || isNaN(this.e)) {
      return "NaN";
    }

    if (this.e >= EXP_LIMIT) {
      return this.m > 0 ? "Infinity" : "-Infinity";
    }

    if (this.e <= -EXP_LIMIT || this.m === 0) {
      return "0" + (places > 0 ? fillTo(".", places + 1, "0") : "");
    } // two cases:
    // 1) exponent is 17 or greater: just print out mantissa with the appropriate number of zeroes after it
    // 2) exponent is 16 or less: use basic toFixed


    if (this.e >= MAX_SIGNIFICANT_DIGITS) {
      return this.m.toString().replace(".", "").padEnd(this.e + 1, "0") + (places > 0 ? fillTo(".", places + 1, "0") : "");
    }

    return this.toNumber().toFixed(places);
  };

  toPrecision(places: number) {
    if (this.e <= -7) {
      return this.toExponential(places - 1);
    }

    if (places > this.e) {
      return this.toFixed(places - this.e - 1);
    }

    return this.toExponential(places - 1);
  };

  valueOf() {
    return this.toString();
  };

  toJSON() {
    return this.toString();
  };

  toStringWithDecimalPlaces(places: number) {
    return this.toExponential(places);
  };

  abs() {
    return ME_NN(Math.abs(this.m), this.e);
  };

  neg() {
    return ME_NN(-this.m, this.e);
  };

  negate() {
    return this.neg();
  };

  negated() {
    return this.neg();
  };

  sign() {
    return Math.sign(this.m);
  };

  sgn() {
    return this.sign();
  };

  round() {
    if (this.e < -1) {
      return new Decimal(0);
    }

    if (this.e < MAX_SIGNIFICANT_DIGITS) {
      return new Decimal(Math.round(this.toNumber()));
    }

    return this;
  };

  floor() {
    if (this.e < -1) {
      return Math.sign(this.m) >= 0 ? new Decimal(0) : new Decimal(-1);
    }

    if (this.e < MAX_SIGNIFICANT_DIGITS) {
      return new Decimal(Math.floor(this.toNumber()));
    }

    return this;
  };

  ceil() {
    if (this.e < -1) {
      return Math.sign(this.m) > 0 ? new Decimal(1) : new Decimal(0);
    }

    if (this.e < MAX_SIGNIFICANT_DIGITS) {
      return new Decimal(Math.ceil(this.toNumber()));
    }

    return this;
  };

  trunc() {
    if (this.e < 0) {
      return new Decimal(0);
    }

    if (this.e < MAX_SIGNIFICANT_DIGITS) {
      return new Decimal(Math.trunc(this.toNumber()));
    }

    return this;
  };

  add(value: DecimalSource) {
    // figure out which is bigger, shrink the mantissa of the smaller
    // by the difference in exponents, add mantissas, normalize and return
    // TODO: Optimizations and simplification may be possible, see https://github.com/Patashu/break_infinity.js/issues/8
    const decimal = D(value);

    if (this.m === 0) {
      return decimal;
    }

    if (decimal.m === 0) {
      return this;
    }

    let biggerDecimal;
    let smallerDecimal;

    if (this.e >= decimal.e) {
      biggerDecimal = this;
      smallerDecimal = decimal;
    } else {
      biggerDecimal = decimal;
      smallerDecimal = this;
    }

    if (biggerDecimal.e - smallerDecimal.e > MAX_SIGNIFICANT_DIGITS) {
      return biggerDecimal;
    } // Have to do this because adding numbers that were once integers but scaled down is imprecise.
    // Example: 299 + 18


    const mantissa = Math.round(1e14 * biggerDecimal.m + 1e14 * smallerDecimal.m * powerOf10(smallerDecimal.e - biggerDecimal.e));
    return ME(mantissa, biggerDecimal.e - 14);
  };

  plus(value: DecimalSource) {
    return this.add(value);
  };

  sub(value: DecimalSource) {
    return this.add(D(value).neg());
  };

  subtract(value: DecimalSource) {
    return this.sub(value);
  };

  minus(value: DecimalSource) {
    return this.sub(value);
  };

  mul(value: DecimalSource) {
    // This version avoids an extra conversion to Decimal, if possible. Since the
    // mantissa is -10...10, any number short of MAX/10 can be safely multiplied in
    if (typeof value === "number") {
      if (value < 1e307 && value > -1e307) {
        return ME(this.m * value, this.e);
      } // If the value is larger than 1e307, we can divide that out of mantissa (since it's
      // greater than 1, it won't underflow)


      return ME(this.m * 1e-307 * value, this.e + 307);
    }

    const decimal = typeof value === "string" ? new Decimal(value) : value;
    return ME(this.m * decimal.m, this.e + decimal.e);
  };

  multiply(value: DecimalSource) {
    return this.mul(value);
  };

  times(value: DecimalSource) {
    return this.mul(value);
  };

  div(value: DecimalSource) {
    return this.mul(D(value).recip());
  };

  divide(value: DecimalSource) {
    return this.div(value);
  };

  divideBy(value: DecimalSource) {
    return this.div(value);
  };

  dividedBy(value: DecimalSource) {
    return this.div(value);
  };

  recip() {
    return ME(1 / this.m, -this.e);
  };

  reciprocal() {
    return this.recip();
  };

  reciprocate() {
    return this.recip();
  };

  /**
   * -1 for less than value, 0 for equals value, 1 for greater than value
   */
  cmp(value: DecimalSource) {
    const decimal = D(value); // TODO: sign(a-b) might be better? https://github.com/Patashu/break_infinity.js/issues/12

    /*
    from smallest to largest:
         -3e100
    -1e100
    -3e99
    -1e99
    -3e0
    -1e0
    -3e-99
    -1e-99
    -3e-100
    -1e-100
    0
    1e-100
    3e-100
    1e-99
    3e-99
    1e0
    3e0
    1e99
    3e99
    1e100
    3e100
         */

    if (this.m === 0) {
      if (decimal.m === 0) {
        return 0;
      }

      if (decimal.m < 0) {
        return 1;
      }

      if (decimal.m > 0) {
        return -1;
      }
    }

    if (decimal.m === 0) {
      if (this.m < 0) {
        return -1;
      }

      if (this.m > 0) {
        return 1;
      }
    }

    if (this.m > 0) {
      if (decimal.m < 0) {
        return 1;
      }

      if (this.e > decimal.e) {
        return 1;
      }

      if (this.e < decimal.e) {
        return -1;
      }

      if (this.m > decimal.m) {
        return 1;
      }

      if (this.m < decimal.m) {
        return -1;
      }

      return 0;
    }

    if (this.m < 0) {
      if (decimal.m > 0) {
        return -1;
      }

      if (this.e > decimal.e) {
        return -1;
      }

      if (this.e < decimal.e) {
        return 1;
      }

      if (this.m > decimal.m) {
        return 1;
      }

      if (this.m < decimal.m) {
        return -1;
      }

      return 0;
    }

    throw Error("Unreachable code");
  };

  compare(value: DecimalSource) {
    return this.cmp(value);
  };

  eq(value: DecimalSource) {
    const decimal = D(value);
    return this.e === decimal.e && this.m === decimal.m;
  };

  equals(value: DecimalSource) {
    return this.eq(value);
  };

  neq(value: DecimalSource) {
    return !this.eq(value);
  };

  notEquals(value: DecimalSource) {
    return this.neq(value);
  };

  lt(value: DecimalSource) {
    const decimal = D(value);

    if (this.m === 0) {
      return decimal.m > 0;
    }

    if (decimal.m === 0) {
      return this.m <= 0;
    }

    if (this.e === decimal.e) {
      return this.m < decimal.m;
    }

    if (this.m > 0) {
      return decimal.m > 0 && this.e < decimal.e;
    }

    return decimal.m > 0 || this.e > decimal.e;
  };

  lte(value: DecimalSource) {
    return !this.gt(value);
  };

  gt(value: DecimalSource) {
    const decimal = D(value);

    if (this.m === 0) {
      return decimal.m < 0;
    }

    if (decimal.m === 0) {
      return this.m > 0;
    }

    if (this.e === decimal.e) {
      return this.m > decimal.m;
    }

    if (this.m > 0) {
      return decimal.m < 0 || this.e > decimal.e;
    }

    return decimal.m < 0 && this.e < decimal.e;
  };

  gte(value: DecimalSource) {
    return !this.lt(value);
  };

  max(value: DecimalSource) {
    const decimal = D(value);
    return this.lt(decimal) ? decimal : this;
  };

  min(value: DecimalSource) {
    const decimal = D(value);
    return this.gt(decimal) ? decimal : this;
  };

  clamp(min: DecimalSource, max: DecimalSource) {
    return this.max(min).min(max);
  };

  clampMin(min: DecimalSource) {
    return this.max(min);
  };

  clampMax(max: DecimalSource) {
    return this.min(max);
  };

  cmp_tolerance(value: DecimalSource, tolerance: DecimalSource) {
    const decimal = D(value);
    return this.eq_tolerance(decimal, tolerance) ? 0 : this.cmp(decimal);
  };

  compare_tolerance(value: DecimalSource, tolerance: DecimalSource) {
    return this.cmp_tolerance(value, tolerance);
  };

  /**
   * Tolerance is a relative tolerance, multiplied by the greater of the magnitudes of the two arguments.
   * For example, if you put in 1e-9, then any number closer to the
   * larger number than (larger number)*1e-9 will be considered equal.
   */


  eq_tolerance(value: DecimalSource, tolerance: DecimalSource) {
    const decimal = D(value); // https://stackoverflow.com/a/33024979
    // return abs(a-b) <= tolerance * max(abs(a), abs(b))

    return Decimal.lte(this.sub(decimal).abs(), Decimal.max(this.abs(), decimal.abs()).mul(tolerance));
  };

  equals_tolerance(value: DecimalSource, tolerance: DecimalSource) {
    return this.eq_tolerance(value, tolerance);
  };

  neq_tolerance(value: DecimalSource, tolerance: DecimalSource) {
    return !this.eq_tolerance(value, tolerance);
  };

  notEquals_tolerance(value: DecimalSource, tolerance: DecimalSource) {
    return this.neq_tolerance(value, tolerance);
  };

  lt_tolerance(value: DecimalSource, tolerance: DecimalSource) {
    const decimal = D(value);
    return !this.eq_tolerance(decimal, tolerance) && this.lt(decimal);
  };

  lte_tolerance(value: DecimalSource, tolerance: DecimalSource) {
    const decimal = D(value);
    return this.eq_tolerance(decimal, tolerance) || this.lt(decimal);
  };

  gt_tolerance(value: DecimalSource, tolerance: DecimalSource) {
    const decimal = D(value);
    return !this.eq_tolerance(decimal, tolerance) && this.gt(decimal);
  };

  gte_tolerance(value: DecimalSource, tolerance: DecimalSource) {
    const decimal = D(value);
    return this.eq_tolerance(decimal, tolerance) || this.gt(decimal);
  };

  log10() {
    return this.e + Math.log10(this.m);
  };

  absLog10() {
    return this.e + Math.log10(Math.abs(this.m));
  };

  pLog10() {
    return this.m <= 0 || this.e < 0 ? 0 : this.log10();
  };

  log(base: number) {
    // UN-SAFETY: Most incremental game cases are log (number: = 1 or greater, base: = 2 or greater).
    // We assume this to be true and thus only need to return a number, not a Decimal,
    // and don't do any other kind of error checking.
    return Math.LN10 / Math.log(base) * this.log10();
  };

  log2() {
    return 3.321928094887362 * this.log10();
  };

  ln() {
    return 2.302585092994045 * this.log10();
  };

  logarithm(base: number) {
    return this.log(base);
  };

  pow(value: number | Decimal) {
    // UN-SAFETY: Accuracy not guaranteed beyond ~9~11 decimal places.
    // TODO: Decimal.pow(new Decimal(0.5), 0); or Decimal.pow(new Decimal(1), -1);
    //  makes an exponent of -0! Is a negative zero ever a problem?
    const numberValue = value instanceof Decimal ? value.toNumber() : value; // TODO: Fast track seems about neutral for performance.
    //  It might become faster if an integer pow is implemented,
    //  or it might not be worth doing (see https://github.com/Patashu/break_infinity.js/issues/4 )
    // Fast track: If (this.e*value) is an integer and mantissa^value
    // fits in a Number, we can do a very fast method.

    const temp = this.e * numberValue;
    let newMantissa;

    if (Number.isSafeInteger(temp)) {
      newMantissa = Math.pow(this.m, numberValue);

      if (isFinite(newMantissa) && newMantissa !== 0) {
        return ME(newMantissa, temp);
      }
    } // Same speed and usually more accurate.


    const newExponent = Math.trunc(temp);
    const residue = temp - newExponent;
    newMantissa = Math.pow(10, numberValue * Math.log10(this.m) + residue);

    if (isFinite(newMantissa) && newMantissa !== 0) {
      return ME(newMantissa, newExponent);
    } // return Decimal.exp(value*this.ln());


    const result = Decimal.pow10(numberValue * this.absLog10()); // this is 2x faster and gives same values AFAIK

    if (this.sign() === -1) {
      if (Math.abs(numberValue % 2) === 1) {
        return result.neg();
      } else if (Math.abs(numberValue % 2) === 0) {
        return result;
      }

      return new Decimal(Number.NaN);
    }

    return result;
  };

  pow_base(value: DecimalSource) {
    return D(value).pow(this);
  };

  factorial() {
    // Using Stirling's Approximation.
    // https://en.wikipedia.org/wiki/Stirling%27s_approximation#Versions_suitable_for_calculators
    const n = this.toNumber() + 1;
    return Decimal.pow(n / Math.E * Math.sqrt(n * Math.sinh(1 / n) + 1 / (810 * Math.pow(n, 6))), n).mul(Math.sqrt(2 * Math.PI / n));
  };

  exp() {
    const x = this.toNumber(); // Fast track: if -706 < this < 709, we can use regular exp.

    if (-706 < x && x < 709) {
      return Decimal.fromNumber(Math.exp(x));
    }

    return Decimal.pow(Math.E, x);
  };

  sqr() {
    return ME(Math.pow(this.m, 2), this.e * 2);
  };

  sqrt() {
    if (this.m < 0) {
      return new Decimal(Number.NaN);
    }

    if (this.e % 2 !== 0) {
      return ME(Math.sqrt(this.m) * 3.16227766016838, Math.floor(this.e / 2));
    } // Mod of a negative number is negative, so != means '1 or -1'


    return ME(Math.sqrt(this.m), Math.floor(this.e / 2));
  };

  cube() {
    return ME(Math.pow(this.m, 3), this.e * 3);
  };

  cbrt() {
    let sign = 1;
    let mantissa = this.m;

    if (mantissa < 0) {
      sign = -1;
      mantissa = -mantissa;
    }

    const newMantissa = sign * Math.pow(mantissa, 1 / 3);
    const mod = this.e % 3;

    if (mod === 1 || mod === -1) {
      return ME(newMantissa * 2.154434690031883, Math.floor(this.e / 3));
    }

    if (mod !== 0) {
      return ME(newMantissa * 4.641588833612778, Math.floor(this.e / 3));
    } // mod != 0 at this point means 'mod == 2 || mod == -2'


    return ME(newMantissa, Math.floor(this.e / 3));
  }; // Some hyperbolic trig functions that happen to be easy

  sinh() {
    return this.exp().sub(this.negate().exp()).div(2);
  };

  cosh() {
    return this.exp().add(this.negate().exp()).div(2);
  };

  tanh() {
    return this.sinh().div(this.cosh());
  };

  asinh() {
    return Decimal.ln(this.add(this.sqr().add(1).sqrt()));
  };

  acosh() {
    return Decimal.ln(this.add(this.sqr().sub(1).sqrt()));
  };

  atanh() {
    if (this.abs().gte(1)) {
      return Number.NaN;
    }

    return Decimal.ln(this.add(1).div(new Decimal(1).sub(this))) / 2;
  };

  /**
   * Joke function from Realm Grinder
   */


  ascensionPenalty(ascensions: number) {
    if (ascensions === 0) {
      return this;
    }

    return this.pow(Math.pow(10, -ascensions));
  };

  /**
   * Joke function from Cookie Clicker. It's 'egg'
   */


  egg() {
    return this.add(9);
  };

  lessThanOrEqualTo(other: DecimalSource) {
    return this.cmp(other) < 1;
  };

  lessThan(other: DecimalSource) {
    return this.cmp(other) < 0;
  };

  greaterThanOrEqualTo(other: DecimalSource) {
    return this.cmp(other) > -1;
  };

  greaterThan(other: DecimalSource) {
    return this.cmp(other) > 0;
  };

  decimalPlaces() {
    return this.dp();
  };


  /* Terminal Society
  * These are designed personally so might appear strange
  * */

  // Turn them into percentage

  dp() {
    if (!isFinite(this.mantissa)) {
      return NaN;
    }

    if (this.exponent >= MAX_SIGNIFICANT_DIGITS) {
      return 0;
    }

    const mantissa = this.mantissa;
    let places = -this.exponent;
    let e = 1;

    while (Math.abs(Math.round(mantissa * e) / e - mantissa) > ROUND_TOLERANCE) {
      e *= 10;
      places++;
    }

    return places > 0 ? places : 0;
  }

  // 11451400%
  toPercent() {
    return this.mul(100).toString() + "%"
  }

  toSecondChange(max: DecimalSource) {
    if (this.gt(max)) {
      return this.toResourceAmount() + " (MAX)"
    } else {
      return this.toResourceAmount() + "/s"
    }
  }

  /*
  * This function parse whether it is above 1e7*/
  toResourceAmount() {
    if (this.gt(1e7)) {
      return this.toExponential(2)
    } else {
      const l = this.s > 0 ? this.e + 3 : this.e + 4// 0.333 (e=0)
      return this.toJSON().substring(0, l + 1)
    }
  }

  toFullChange() {
    if (this.s > 0) return "+" + this.toResourceAmount()
    return this.toResourceAmount()
  }

  referToRef(r: Ref<Decimal>) {
    r.value = this
  }

  toMul(value: DecimalSource) {
    this.fromValue(this.mul(value))
    return this
  }

  toAdd(value: DecimalSource) {
    this.fromValue(this.add(value))
    return this
  }

  toSub(value: DecimalSource) {
    this.fromValue(this.sub(value))
    return this
  }

  toDiv(value: DecimalSource) {
    this.fromValue(this.div(value))
    return this
  }

  toPow(value: Decimal) {
    this.fromValue(this.pow(value))
    return this
  }

  toNeg() {
    this.fromValue(this.neg())
    return this
  }
}

export declare type DecimalSource = Decimal | number | string;
window.Decimal = Decimal