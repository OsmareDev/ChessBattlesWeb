let domCounter = 0

export default function useBadDomController() {

  const getNewDomPosition = () => {
    const newDomPos = domCounter
    domCounter++
    return newDomPos
  }

  const resetDomPositions = () => {
    domCounter = 0
  }

  return { domCounter, getNewDomPosition, resetDomPositions }
}