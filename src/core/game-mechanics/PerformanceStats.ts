const blockNames = ['gameLoop']as const
type blockName = typeof blockNames[number]

export const PerformanceStats = {
  blocks: {} as Record<blockName, {last:number, records: number[]}>,
  start(blockName:blockName) {
    if (this.blocks[blockName] == undefined) {
      this.blocks[blockName] = {
        last: performance.now(),
        records: []
      }
    } else {
      this.blocks[blockName].last = performance.now()
    }
  },
  end(blockName:blockName) {
    if (!this.blocks[blockName]) return
    const block = this.blocks[blockName]
    if (!block.records) return;
    block.records.push(performance.now() - block.last)
  }
}
window.dev.performance = Performance