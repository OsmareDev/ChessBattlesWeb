import { useEffect, useRef, useState } from "react"
import { repositionCards, repositionDiscardedCards, repositionPreparedCards, shiftValues } from "../Utils/HandCardUtils"
import useBadDomController from "./useBadDomController"

let lastDraggedIndex : (number) = 0

export default function useHandCards( initialAtributes : GameHandAtributes ) {
  const [cardList, setNewCardList] = useState<CardInHand[]>([])
  const [cardMoving, setCardMoving] = useState(false)

  const { resetDomPositions, getNewDomPosition } = useBadDomController()
  
  const cooldownScroll = useRef(false)
  const currentIndex = useRef(0)
  const discardedCards = useRef<CardInHand[]>([])
  const usingCard = useRef<boolean>(false)


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
      if (currentIndex.current + initialAtributes.maxCardsInHand > cardList.length) {
        currentIndex.current -= 1
        return
      }

      const newCardList = structuredClone(cardList)
      repositionCards(newCardList, initialAtributes, currentIndex.current )
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
    const renewedList = structuredClone(cardList)
    setNewCardList(renewedList)

    // Hide the shadow of the dragged element
    e.dataTransfer.setDragImage(e.target as Element, window.outerWidth * 2, window.outerHeight * 2);

    lastDraggedIndex = index

    setCardMoving(true)
  };

  const handleDragOver = (e : React.DragEvent<HTMLDivElement>, index : number) => {
    e.preventDefault();
    if (lastDraggedIndex === index) return
    
    const newList = structuredClone(cardList)
    shiftValues( newList, lastDraggedIndex, index )

    // maybe will be more efficient to just reposition the two cards that moved
    repositionCards( newList, initialAtributes, currentIndex.current )
    
    setNewCardList( newList )
    lastDraggedIndex = index

    // if (cardList[lastDraggedIndex].realPos === index) return
    
    // const renewedList = structuredClone(cardList)
    // shiftValues( renewedList, pickedCardIndex, index )
    // repositionCards( renewedList, initialAtributes, currentIndex.current )
    
    // setNewCardList( renewedList )
    // lastDraggedIndex = renewedList[index].realPos
    
  }
  
  const handleDrop = (e : React.DragEvent<HTMLDivElement>) => {
    e.preventDefault()
    setCardMoving(false)
  };

  const addNewCard = ( newCard : CardInHand ) => {
    const newCardList = structuredClone(cardList)
    newCard.rotation = 0
    newCardList.push(newCard)

    repositionCards( newCardList, initialAtributes, currentIndex.current )
    setNewCardList( newCardList )
  }

  const addNewCardLeft = ( newCard : CardInHand ) => {
    const newCardList = structuredClone(cardList)
    newCard.rotation = 0
    newCardList.unshift(newCard)

    repositionCards( newCardList, initialAtributes, currentIndex.current )
    setNewCardList( newCardList )
  }

  const discard = ( id : number ) => {
    const newCardList = structuredClone(cardList)

    const discardedCard = newCardList.splice(id, 1)
    discardedCard[0].active = false

    discardedCards.current.push(discardedCard[0])
    
    // Check if the index must be moved to have the maximum card count in the hand
    if (currentIndex.current + initialAtributes.maxCardsInHand > newCardList.length - (1 + discardedCards.current.length) && currentIndex.current > 0) currentIndex.current--
    repositionCards( newCardList, initialAtributes, currentIndex.current )
    repositionDiscardedCards( discardedCards.current, initialAtributes )
    
    setNewCardList( newCardList )
  }

  const recoverCard = ( id : number ) => {
    const recoveredCard = discardedCards.current.splice( id, 1 )
    repositionDiscardedCards( discardedCards.current, initialAtributes )
    addNewCard(recoveredCard[0])
  }

  const deleteCards = () => {
    discardedCards.current = []
    resetDomPositions()

    const newCardList = structuredClone(cardList)
    newCardList.forEach( card => {
      card.domPos = getNewDomPosition()
    })

    setNewCardList(newCardList)
  }

  const prepareCard = ( index : number ) => {
    const newCardList = structuredClone(cardList)
    newCardList[index].inUse = !newCardList[index].inUse
    console.log("entra")

    if (newCardList[index].inUse) {
      newCardList[index].scale = 1.5
      repositionPreparedCards(newCardList, initialAtributes)
      repositionPreparedCards(discardedCards.current, initialAtributes)
    } else {
      newCardList[index].scale = 1
      repositionCards( newCardList, initialAtributes, currentIndex.current )
      repositionDiscardedCards( discardedCards.current, initialAtributes )
    }
    
    usingCard.current = !usingCard.current

    setNewCardList(newCardList)
  }

  return {
    handleDragStart, 
    handleDragOver, 
    handleDrop, 
    addNewCard, 
    addNewCardLeft, 
    changeCardState, 
    discard, 
    recoverCard, 
    deleteCards,
    prepareCard,
    cardList, 
    cardMoving, 
    currentIndex : currentIndex.current, 
    discardedCards : discardedCards.current,
    usingCard : usingCard.current,
  }
}