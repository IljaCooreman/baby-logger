import { Gpio } from 'onoff'
import { EventEmitter } from 'events'
import { performance } from 'perf_hooks'



class MotionSensor {
  constructor() {
    if (!Gpio.accessible) throw new Error("Motionsensor is not accessible. Is every wire connected?")
    this.sensor = new Gpio(14, 'in');
  }

  logValues() {
    setInterval(() => console.log('logging', this.sensor), 1000);
  }
}

export const motionSensor = new MotionSensor();