/**
 * 全部Tab的储存
 * 同步需要更改：
 * @borrows initListener as i
 *
 */
export const displayEnum = {
  baseLayouts :0,
  resourceGeneral:1,
  resourceDetail:2,
  task:3,
  research:4,
  storyMain:5,
  storySide:6,
  storyExtra:7,
  h2p:8,
  marketUpgrade:9,
  marketPrice:10,
  marketExchange:11,
  marketCompany:12,
  employWork:13,
  employFight:14,
  employRecruit:15,
  optionVisual: 16,

  get length() {
    return 16
  }
}