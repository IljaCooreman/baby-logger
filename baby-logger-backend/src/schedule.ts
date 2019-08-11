export enum Slot {
    ochtend = "ochtend",
    middag = "middag",
    namiddag = "namiddag",
    nacht = "nacht",
}

export interface ScheduleSlot {
    start: string,
    end: string,
    center?: string,
    duration?: number,
    slot: Slot,
    baby?: string,
}


export const schedule: ScheduleSlot[] = [
    {
        start: "09:00:00",
        end: "09:45:00",
        slot: Slot.ochtend,
    },
    {
        start: "13:00:00",
        end: "15:00:00",
        slot: Slot.middag,
    },
    {
        start: "16:30:00",
        end: "17:15:00",
        slot: Slot.namiddag,
    },
    {
        start: "19:30:00",
        end: "06:00:00",
        slot: Slot.nacht,
    },
]
