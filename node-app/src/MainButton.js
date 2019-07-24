import { Gpio } from 'onoff'
import { EventEmitter } from 'events'
import { performance } from 'perf_hooks'

export const ButtonEventTypes = {
  click: 'click',
  hold: 'hold',
  error: 'error'
}

export const ButtonState = {
  up: 1,
  down: 0,
}

export const Severity = {
  low: "LOW",
  medium: "MEDIUM",
  high: "HIGH"
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
    let holdTimeoutRef = null;
    this.button.watch((err, value) => {
      if (err) emitter.emit('error', err)
      switch (value) {

        case ButtonState.down:
          buttonPressStart = performance.now();
          holdTimeoutRef = setTimeout(() => {
            this.startBlinking(300)
          }, 1000)
          break;

        case ButtonState.up:
          if (buttonPressStart) {
            const pressDuration = performance.now() - buttonPressStart
            pressDuration > 400 ?
              emitter.emit(ButtonEventTypes.hold, this, this.calcSeverity(pressDuration)) :
              emitter.emit(ButtonEventTypes.click, this);
            emitter.emit()
            buttonPressStart = null;
            clearTimeout(holdTimeoutRef);
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
    })
  }

  calcSeverity(duration) {
    let severity = Severity.low
    if (duration > 2000) severity = Severity.medium
    if (duration > 4000) severity = Severity.high
    return severity;
  }

}
export const mainButton = new MainButton();