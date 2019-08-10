export enum Slot {
    ochtend = "ochtend",
    middag = "middag",
    namiddag = "namiddag",
    nacht = "nacht",
}

export interface ScheduleSlot {
    start: string,
    end: string,
    slot: Slot,
}


export const schedule: ScheduleSlot[] = [
    {
        start: "2019-08-10T09:00:00+02:00",
        end: "2019-08-10T09:45:00+02:00",
        slot: Slot.ochtend,
    },
    {
        start: "2019-08-10T13:00:00+02:00",
        end: "2019-08-10T15:00:00+02:00",
        slot: Slot.middag,
    },
    {
        start: "2019-08-1016:30:00+02:00",
        end: "2019-08-10T17:15:00+02:00",
        slot: Slot.namiddag,
    },
    {
        start: "2019-08-10T19:30:00+02:00",
        end: "2019-08-10T06:00:00+02:00",
        slot: Slot.nacht,
    },
]
