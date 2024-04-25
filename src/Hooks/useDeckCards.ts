import { useRef } from "react"

export default function useDeckCards( initialDeck : DeckTest, initialAtributes : GameDeckAtributes, deckId : string ) {
  const deck = useRef<DeckTest>(initialDeck)
  const topCard = useRef<CardInHand | null>({
    card: initialDeck.cards[0],
    id: deckId + initialDeck.cards.length.toString(),
    isBeingDragged: false,
    posX: initialAtributes.offsetX,
    posY: initialAtributes.offsetY,
    realPos: 0,
    tilt: 0,
    zInd: 0,
    active: false,
    discarded: false
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
      realPos: 0,
      tilt: 0,
      zInd: 0,
      active: false,
      discarded: false
    }
  }

  return { topCard : topCard.current, loadNextCard }
}