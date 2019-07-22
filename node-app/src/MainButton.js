import { Gpio } from 'onoff'
import { EventEmitter } from 'events'

export const ButtonEventTypes = {
  click: 'click',
  hold: 'hold',
  error: 'error'
}

class MainButton {
  constructor() {
    if (!Gpio.accessible) throw new Error("Main button is not accessible. Is every wire connected?")
    this.blinkingIntervalRefs = []
    // holdTimer 
    this.led = new Gpio(17, 'out');
    this.button = new Gpio(4, 'in', 'both', { debounceTimeout: 200 });

  }

  watch() {
    this.button.watch((err, value) => {
      const emitter = new EventEmitter();
      if (err) emitter.emit('error', err)
      if (value == 1) return;
      emitter.emit(ButtonEventTypes.click, this);
      return emitter;
    });
  }

  changeLedState(state) {
    this.led.writeSync(state ? 1 : 0)
  }

  startBlinking(speed = 200) {
    const intervalRef = setInterval(() => {
      this.changeLedState(this.led.readSync() ^ 1)
    }, speed)
    this.blinkingIntervalRefs.push(intervalRef)
  }

  stopAllBlinking() {
    this.blinkingIntervalRefs.forEach(intervalRef => {
      clearInterval(intervalRef)
    })
  }

}
export const mainButton = new MainButton();