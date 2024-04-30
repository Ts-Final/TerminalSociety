import {Component} from "vue";
import {EventHub, GameEvent} from "../eventHub.ts";
import {ui} from "../game-mechanics/ui.ts";
import VersionsModal from "../../components/Modals/VersionsModal.vue";

let nextModalID = 0
type modalConfig = {
  closeEvent?: number
}

export class Modal {
  _closeEvent?: number
  _modalConfig: modalConfig
  _uniqueID?: number

  static VersionModal = new Modal(VersionsModal)

  constructor(
    component: Component,
    priority = 0,
    closeEvent?: number,
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
    if (!ui.init.initialized) return;
    ui.view.modal.queue.shift();
    if (ui.view.modal.queue.length === 0) ui.view.modal.current = undefined;
    else ui.view.modal.current = ui.view.modal.queue[0];
  }

  static hideAll() {
    if (!ui.init.initialized) return;
    while (ui.view.modal.queue.length) {
      Modal.hide()
    }
    ui.view.modal.current = undefined;
  }

  applyCloseEventListeners(event: number) {
    EventHub.ui.on(event, () => this.removeFromQueue(), this)
  }

  removeFromQueue() {
    EventHub.ui.offAll(this)
    ui.view.modal.queue = ui.view.modal.queue.filter(m => m._uniqueID !== this._uniqueID)
    if (ui.view.modal.queue.length === 0) ui.view.modal.current = undefined
    else ui.view.modal.current = ui.view.modal.queue[0]
  }

  show(config?: modalConfig) {
    if (!ui.init.initialized) return;
    this._uniqueID = nextModalID++
    this._props = Object.assign({}, config || {})

    if (this._closeEvent) this.applyCloseEventListeners(this._closeEvent)
    if (config?.closeEvent) this.applyCloseEventListeners(config.closeEvent)

    EventHub.ui.on(GameEvent.CLOSE_MODAL, () => Modal.hide(),this)

    const queue = ui.view.modal.queue
    queue.unshift(this)

    Modal.sortModalQueue()

  }
}