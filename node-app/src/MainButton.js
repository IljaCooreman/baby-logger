import { Gpio } from 'onoff'
import { EventEmitter } from 'events'

export const ButtonEventTypes = {
  click: 'click',
  hold: 'hold',
  error: 'error'
}

export const ButtonState = {
  up: 1,
  down: 0,
}

class MainButton {
  constructor() {
    if (!Gpio.accessible) throw new Error("Main button is not accessible. Is every wire connected?")
    this.blinkingIntervalRefs = []

    this.led = new Gpio(17, 'out');
    this.button = new Gpio(4, 'in', 'both', { debounceTimeout: 50 });

  }

  watch() {
    const emitter = new EventEmitter();
    let buttonPressStart = null;
    this.button.watch((err, value) => {
      if (err) emitter.emit('error', err)
      switch (value) {
        case ButtonState.down:
          buttonPressStart = performance.now();
          break;
        case ButtonState.up:
          if (buttonPressStart) {
            const pressDuration = performance.now() - buttonPressStart
            pressDuration > 400 ?
              emitter.emit(ButtonEventTypes.hold, this) :
              emitter.emit(ButtonEventTypes.click, this);

            buttonPressStart = null;
          }
          break;
      }
    });
    return emitter;
  }

  changeLedState(state) {
    this.led.writeSync(state ? 1 : 0)
  }

  startBlinking(speed = 100) {
    const intervalRef = setInterval(() => {
      this.changeLedState(this.led.readSync() ^ 1)
    }, speed)
    this.blinkingIntervalRefs.push(intervalRef)
  }

  stopAllBlinking() {
    this.blinkingIntervalRefs.forEach(intervalRef => {
      clearInterval(intervalRef)
      // TODO: remove interval from array to free up memory
    })
  }

}
export const mainButton = new MainButton();