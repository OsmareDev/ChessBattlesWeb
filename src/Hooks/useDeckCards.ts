import { useRef } from "react"
import { useDomController } from "./Stores/useDomController"

// THIS SHOULD BE IN A GLOBAL STATE BUT THEN IT BECOMES THE PROBLEM OF BEING AN INFINITE LOOP
let domPosition = 0

function getNewDomPosition() {
  const newDomPos = domPosition
  domPosition++
  return newDomPos
}

export default function useDeckCards( initialDeck : DeckTest, initialAtributes : GameDeckAtributes, deckId : string ) {
  // const { getNewDomPosition } = useDomController()
  
  const deck = useRef<DeckTest>(initialDeck)
  const topCard = useRef<CardInHand | null>({
    card: initialDeck.cards[0],
    id: deckId + initialDeck.cards.length.toString(),
    isBeingDragged: false,
    posX: initialAtributes.offsetX,
    posY: initialAtributes.offsetY,
    domPos: getNewDomPosition(),
    // domPos: 0,
    tilt: 0,
    zInd: 0,
    active: false
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
      zInd: 0,
      active: false
    }
  }

  return { topCard : topCard.current, loadNextCard }
}