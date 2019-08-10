import { Gpio } from 'onoff'
import { EventEmitter } from 'events'
import { performance } from 'perf_hooks'



class MotionSensor {
    constructor() {
      if (!Gpio.accessible) throw new Error("Motionsensor is not accessible. Is every wire connected?")
      this.sensor = new Gpio(18, 'in', 'both');
    }
  
    logValues() {
        this.sensor.watch((err, value) => {
        console.log('value', value, new Date());
        })
    }

    watch() {
        
    }
  }
  

export const motionSensor = new MotionSensor();