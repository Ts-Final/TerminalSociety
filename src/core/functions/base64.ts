export const Base64 = {
  encode(str:string) {
    return window.btoa(encodeURIComponent(str))
  },
  decode(str:string) {
    return decodeURIComponent(window.atob(str))
  }
}

