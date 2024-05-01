<script setup lang="ts">
import {Ref, ref} from "vue";
import {Numbers} from "../../core/./utils/Numbers.ts";

const {fn, max, min, step, choices, initial, showValue} = defineProps<{
  fn: (v: number) => void,
  initial: number,
  max?: number,
  min?: number,
  step?: number,
  choices?: number[],
  showValue?: boolean,
}>()
const rail: Ref<HTMLDivElement | undefined> = ref(undefined)
const value = ref(max || initial)
let dragFlag = false
const railWidth = ref(0)
const valueShown = showValue || true

function initWidth() {
  if (max && min && step) {
    railWidth.value = (initial - min) / (max - min) * 100
  } else if (choices) {
    railWidth.value = choices.indexOf(initial) / choices.length * 100
  }
}
initWidth()

/**
 * OffsetX/Y
 * @param x
 * @param y
 */
function changePos(x: number, y: number) {
  const width = rail.value?.offsetWidth
  if (!dragFlag) {
    return
  }
  if (!width) {
    setTimeout(() => changePos(x, y), 500)
    return
  }
  x = Math.min(Math.max(x, 1), width - 1)

  if (max && min && step) {
    /*
    * stepLength = (max - min) / step
    * n: int // it refers to steps
    *        x
    * |------+-----| length: width left-percent: x / width
    *        |
    * |------+-----| length: max-min left-length: min + n * stepLength
    * equation (about n) here: left-length
    * (x/width) * (max-min) = min + n * stepLength
    * => n = ((max - min) * (x / width) - min) / stepLength
    * #value = round(round(n) * stepLength) + min
    *
    * */
    const stepLength = (max - min) / step
    const n = ((max - min) * (x / width) - min) / stepLength
    value.value = Numbers.integer(Numbers.integer(n) * stepLength) + min
    fn(value.value)
    railWidth.value = Numbers.integer(n) / step * 100
  } else if (choices) {
    /*
    * n: int // steps
    *        x
    * |------+-----| length: width left-percent: x / width
    *        |
    * |------+-----| length: choices.length left-percent: n / choice.length
    * equation (about n) here: left-length
    *  x/width = n / choice.length
    * => n = x * choice.length / width
    * #value = choice[round(n)]
    *
    * */
    let n = Numbers.integer(x * choices.length / width)
    while (n >= choices.length) {
      n -= 1
    }
    value.value = choices[n]
    fn(value.value)
    railWidth.value = n / choices.length * 100
  }
}

function onMouseDown(e: MouseEvent) {
  if (!rail.value) {
    setTimeout(onMouseDown, 100)
    return
  }
  dragFlag = true
  changePos(e.offsetX, e.offsetY)
  e.preventDefault()
}

function onMouseUp() {
  if (!rail.value) {
    setTimeout(onMouseUp, 100)
    return
  }
  dragFlag = false
}

function onMouseMove(e: MouseEvent) {
  if (!dragFlag) {
    return
  }
  if (!rail.value) {
    setTimeout(onMouseMove, 100)
    return
  }
  changePos(e.offsetX, e.offsetY)

}

function onMouseLeave() {
  dragFlag = false
}
function onMouseEnter(e: MouseEvent) {
  if (e.button) {
    dragFlag = true
  }
}

</script>

<template>
  <div class="slider" @mouseleave="onMouseLeave" @mouseenter="onMouseEnter">
    <div class="slider-rail flex-row" ref="rail"
         @mousedown="onMouseDown" @mouseup="onMouseUp"
         @mousemove="onMouseMove">
      <div class="slider-rail-left" :style="{width:(railWidth)+'%'}"></div>
      <div class="slider-rail-button style-border" style="border-width: 1px">
        <span v-if="valueShown">{{ value }}</span>
      </div>
    </div>
  </div>

</template>

<style scoped>
.slider {
  width: 90%;
  height: 1rem;
}

.slider-rail {
  width: 100%;
  height: 5px;
  border: 2px solid #7cdcf4;
  cursor: pointer;
}

.slider-rail-left {
  height: 100%;
  background-color: #7cdcf4;
}

.slider-rail-button {
  height: 1.5em;
  background-image: var(--bgi);
  transform: translate(0,-30%);
  pointer-events: none;
  position: relative;
  font-size: 0.75rem;
}

</style>