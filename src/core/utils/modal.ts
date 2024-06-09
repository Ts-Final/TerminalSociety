import {Component, Ref} from "vue";
import {EventHub, Events} from "../eventHub.ts";
import {ui} from "../game-mechanics/ui.ts";
import VersionsModal from "../../components/Modals/VersionsModal.vue";
import WhatsYourNameModal from "../../components/Modals/WhatsYourNameModal.vue";
import OfflineUpdate from "../../components/Modals/offlineUpdate.vue";
import {Decimal} from "./break_infinity.ts";
import OfflineProgressModal from "../../components/Modals/OfflineProgressModal.vue";
import BasicPlayModal from "../../components/Modals/BasicPlayModal.vue";
import {callable} from "../constants.ts";
import ChooseYNModal from "../../components/Modals/ChooseYNModal.vue";
import NormalContentModal from "../../components/Modals/NormalContentModal.vue";

let nextModalID = 0
interface modalConfig {
  closeEvent?: Events
}

export namespace props {
  // eslint-disable-next-line @typescript-eslint/no-empty-interface
  export interface empty {
    // of course this is empty
  }

  export interface offline extends empty {
    max_ticks: number,
    tickR: Ref<number>
    finished: Ref<boolean>
    tick: number
    time: number
  }

  export interface offlineChange {
    resource?: [string, Decimal][]
    research?: [string, number | boolean][]
  }
  export interface chooseYN {
    title?:number
    fulfill: callable
    reject: callable
    content: string
    onY?:string
    onN?:string
    // 1-将N的按钮变为红色 0-不动
    bad?:number
  }
  export interface content {
    content: string,
    callback?:callable
  }
}


export class Modal<T extends props.empty = object> {
  static VersionModal = new Modal<props.empty>(VersionsModal)
  static WhatsYourNameModal = new Modal<props.empty>(WhatsYourNameModal,1)
  static OfflineModal = new Modal<props.offline>(OfflineUpdate, 1)
  static OfflineProgressModal = new Modal<props.offlineChange>(OfflineProgressModal)
  static BasicPlayModal = new Modal<props.empty>(BasicPlayModal)
  static ChooseYNModal = new Modal<props.chooseYN>(ChooseYNModal)
  static NormalContentModal = new Modal<props.content>(NormalContentModal)

  _closeEvent?: Events
  _modalConfig: modalConfig
  _uniqueID?: number

  constructor(
    component: Component,
    priority = 0,
    closeEvent?: Events,
  ) {
    this._component = component
    this._priority = priority
    this._closeEvent = closeEvent
    this._modalConfig = {}

  }

  static get isOpen() {
    return ui.view.modal.current instanceof this
  }

  _component: Component

  get component() {
    return this._component
  }

  _priority: number

  get priority() {
    return this._priority
  }

  _props?: object

  get props() {
    return this._props
  }

  get isOpen() {
    return ui.view.modal.current === this
  }


  static sortModalQueue() {
    const queue = ui.view.modal.queue
    queue.sort((x, y) => y.priority - x.priority)

    const uniqueQueue = [...new Set(queue)]
    ui.view.modal.queue = uniqueQueue
    ui.view.modal.current = uniqueQueue[0]
  }

  static hide() {
    if (!ui.init.value) return;
    ui.view.modal.queue.shift();
    if (ui.view.modal.queue.length === 0) ui.view.modal.current = undefined;
    else ui.view.modal.current = ui.view.modal.queue[0];
  }

  static hideAll() {
    if (!ui.init.value) return;
    while (ui.view.modal.queue.length) {
      Modal.hide()
    }
    ui.view.modal.current = undefined;
  }

  applyCloseEventListeners(event: Events) {
    EventHub.on(event, () => this.removeFromQueue(), this)
  }

  removeFromQueue() {
    EventHub.offAll(this)
    ui.view.modal.queue = ui.view.modal.queue.filter(m => m._uniqueID !== this._uniqueID)
    if (ui.view.modal.queue.length === 0) ui.view.modal.current = undefined
    else ui.view.modal.current = ui.view.modal.queue[0]
  }

  show(props: T, config?: modalConfig) {
    if (!ui.init.value) return;
    this._uniqueID = nextModalID++
    this._props = Object.assign({}, props || {})

    if (this._closeEvent) this.applyCloseEventListeners(this._closeEvent)
    if (config?.closeEvent) this.applyCloseEventListeners(config.closeEvent)

    const queue = ui.view.modal.queue
    queue.unshift(this)

    Modal.sortModalQueue()

  }
}

window.dev.modal = Modal
export function closeModal() {
  EventHub.dispatch('closeModal')
}