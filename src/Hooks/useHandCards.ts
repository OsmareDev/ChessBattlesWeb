import { useEffect, useRef, useState } from "react"
import { repositionCards, shiftAllCards, shiftCard, shiftValues } from "../Utils/HandCardUtils"

let lastDraggedIndex : (number) = 0
let pickedCardIndex : (number) = 0

export default function useHandCards( initialAtributes : GameHandAtributes ) {
  const [cardList, setNewCardList] = useState<CardInHand[]>([])
  const [cardMoving, setCardMoving] = useState(false)
  
  const cooldownScroll = useRef(false)
  const currentIndex = useRef(0)
  const numberOfDiscardedCards = useRef(0)

  useEffect(() => {
    const handleScroll = (event : WheelEvent) => {
      event.preventDefault
      if (cooldownScroll.current) return
      if (cardList.length <= initialAtributes.maxCardsInHand) return

      currentIndex.current = currentIndex.current + Math.sign(event.deltaY)
      if (currentIndex.current < 0) {
        currentIndex.current = 0
        return
      }
      if (currentIndex.current + initialAtributes.maxCardsInHand > cardList.length - numberOfDiscardedCards.current) {
        currentIndex.current -= 1
        return
      }

      const newCardList = structuredClone(cardList)
      repositionCards(newCardList, initialAtributes, currentIndex.current, numberOfDiscardedCards.current )
      setNewCardList(newCardList)
      
      cooldownScroll.current = true
      setTimeout(() => {
        cooldownScroll.current = false
      }, 100)
    }

    window.addEventListener('wheel', handleScroll)

    return () => {
      window.removeEventListener('wheel', handleScroll);
    };
  }, [cardList])

  const changeCardState = (id : number) => {
    const renewedList = structuredClone(cardList)
    renewedList[id].active = !renewedList[id].active

    setNewCardList(renewedList)
  }

  const handleDragStart = (e : React.DragEvent<HTMLDivElement>, index : number) => {
    if (cardList[index].discarded) return

    const renewedList = structuredClone(cardList)
    setNewCardList(renewedList)

    // Hide the shadow of the dragged element
    e.dataTransfer.setDragImage(e.target as Element, window.outerWidth * 2, window.outerHeight * 2);

    lastDraggedIndex = index
    pickedCardIndex = index

    setCardMoving(true)
  };

  const handleDragOver = (e : React.DragEvent<HTMLDivElement>, index : number) => {
    e.preventDefault();
    if (cardList[lastDraggedIndex].realPos === index) return
    
    const renewedList = structuredClone(cardList)
    shiftValues( renewedList, pickedCardIndex, index )
    repositionCards( renewedList, initialAtributes, currentIndex.current, numberOfDiscardedCards.current )
    
    setNewCardList( renewedList )
    lastDraggedIndex = renewedList[index].realPos
  }
  
  const handleDrop = (e : React.DragEvent<HTMLDivElement>) => {
    e.preventDefault()
    setCardMoving(false)
  };

  const addNewCard = ( newCard : CardInHand ) => {
    const newCardList = structuredClone(cardList)
    
    newCard.realPos = cardList.length

    newCardList.push(newCard)

    repositionCards( newCardList, initialAtributes, currentIndex.current, numberOfDiscardedCards.current )
    setNewCardList( newCardList )
  }

  const addNewCardLeft = ( newCard : CardInHand ) => {
    const newCardList = structuredClone(cardList)
    
    shiftAllCards(newCardList, 0, false)
    newCard.realPos = 0

    newCardList.push(newCard)

    repositionCards( newCardList, initialAtributes, currentIndex.current, numberOfDiscardedCards.current )
    setNewCardList( newCardList )
  }

  const discard = ( id : number ) => {
    const newCardList = structuredClone(cardList)

    newCardList[id].active = false
    newCardList[id].discarded = true
    numberOfDiscardedCards.current++
    
    shiftAllCards( newCardList, newCardList[id].realPos, true )
    newCardList[id].realPos = cardList.length - 1 
    // newCardList.splice(id, 1)
    
    // Check if the index must be moved to have the maximum card count in the hand
    if (currentIndex.current + initialAtributes.maxCardsInHand > newCardList.length - (1 + numberOfDiscardedCards.current) && currentIndex.current > 0) currentIndex.current--
    repositionCards( newCardList, initialAtributes, currentIndex.current, numberOfDiscardedCards.current )
    
    setNewCardList( newCardList )
  }

  const recoverCard = ( id : number ) => {
    const newCardList = structuredClone(cardList)

    newCardList[id].discarded = false
    numberOfDiscardedCards.current--

    if (newCardList[id].realPos != cardList.length - 1 - numberOfDiscardedCards.current) {
      shiftCard( newCardList, newCardList[id].realPos, cardList.length - 1 - numberOfDiscardedCards.current )
    }

    repositionCards( newCardList, initialAtributes, currentIndex.current, numberOfDiscardedCards.current )

    setNewCardList( newCardList )
  }

  return {handleDragStart, handleDragOver, handleDrop, addNewCard, addNewCardLeft, changeCardState, discard, recoverCard, cardList, cardMoving, currentIndex : currentIndex.current, discardedCards : numberOfDiscardedCards.current}
}