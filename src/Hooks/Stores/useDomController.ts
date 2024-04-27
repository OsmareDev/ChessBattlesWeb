import { create } from "zustand";

interface DomControllerState {
  domCounter : number;
  getNewDomPosition : () => number
  resetDomPositions : () => void
}

export const useDomController = create<DomControllerState>((set, get) => ({
  domCounter : 0,

  getNewDomPosition : () => {
    console.log("entra")
    const { domCounter } = get()
    const newDomPosition = domCounter
    set({ domCounter : domCounter + 1 }, false)
    return newDomPosition
  },

  resetDomPositions : () => {
    set({ domCounter : 0 }, false)
  }
}))