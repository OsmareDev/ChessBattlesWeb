import { useRef } from "react"
import useBadDomController from "./useBadDomController"

export default function useDeckCards( initialDeck : DeckTest, initialAtributes : GameDeckAtributes, deckId : string ) {
  // const { getNewDomPosition } = useDomController()
  const { getNewDomPosition } = useBadDomController()
  
  const deck = useRef<DeckTest>(initialDeck)
  const topCard = useRef<CardInHand | null>({
    card: initialDeck.cards[0],
    id: deckId + initialDeck.cards.length.toString(),
    isBeingDragged: false,
    posX: initialAtributes.offsetX,
    posY: initialAtributes.offsetY,
    domPos: getNewDomPosition(),
    tilt: 0,
    rotation: 180,
    scale: 1,
    zInd: 0,
    active: false,
    inUse: false
  })

  const loadNextCard = () => {
    deck.current.cards.shift()

    if (deck.current.cards.length == 0) {
      topCard.current = null
      return
    } 

    topCard.current = {
      card: initialDeck.cards[0],
      id: deckId + initialDeck.cards.length.toString(),
      isBeingDragged: false,
      posX: initialAtributes.offsetX,
      posY: initialAtributes.offsetY,
      domPos: getNewDomPosition(),
      tilt: 0,
      rotation: 180,
      scale: 1,
      zInd: 0,
      active: false,
      inUse: false
    }
  }

  const reloadTopCardDom = () => {
    if (topCard.current) topCard.current.domPos = getNewDomPosition()
  }

  return { topCard : topCard.current, loadNextCard, reloadTopCardDom }
}