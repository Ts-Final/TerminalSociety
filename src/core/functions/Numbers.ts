export const Numbers = {
  round(x: number, pl = 2) {
    return Number((Math.round(x * (10 ** pl)) / (10 ** pl)).toFixed(pl))
  },
  formatInt(v:number,percentage=false,fD:number=0) {
    if (v >= 1e7) {
      return v.toExponential(fD)
    } else if (percentage) {
      return (v * 100).toFixed(2) + "%"
    } else {
      return v.toFixed(fD).replace(/.0+/,'')
    }
  },
  cycle(min:number,max:number,v:number) {
    if (v < min) {
      return max
    } else if (v > max) {
      return min
    } else {
      return v
    }
  },
  integer(x:number) {
    return this.round(x,0)
  }
}